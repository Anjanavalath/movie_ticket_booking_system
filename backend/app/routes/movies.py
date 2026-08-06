from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, List
from datetime import datetime, timedelta
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel
from app.database.connection import get_database
from app.schemas.schemas import MovieCreate, BookingCreate

router = APIRouter()

SEAT_ROWS = [
    {"row": "A", "category": "Premium", "price": 400},
    {"row": "B", "category": "Premium", "price": 400},
    {"row": "C", "category": "Executive", "price": 300},
    {"row": "D", "category": "Executive", "price": 300},
    {"row": "E", "category": "Executive", "price": 300},
    {"row": "F", "category": "Normal", "price": 200},
    {"row": "G", "category": "Normal", "price": 200},
    {"row": "H", "category": "Normal", "price": 200},
]
SEATS_PER_ROW = 12
SHOW_TIMES = ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"]

# Schema for incoming seat lock request
class SeatLockRequest(BaseModel):
    show_id: str
    seats: List[str]
    user_id: Optional[str] = "guest_user"


def format_movie(m: dict) -> dict:
    return {
        "id": str(m["_id"]),
        "title": m["title"],
        "genre": m["genre"],
        "duration_mins": m.get("duration_mins", 120),
        "language": m.get("language", "English"),
        "description": m.get("description", ""),
        "poster": m.get("poster"),
        "rating": m.get("rating"),
        "release_date": m.get("release_date"),
    }


@router.get("/movies")
async def get_movies(search: Optional[str] = Query(None), genre: Optional[str] = Query(None)):
    db = get_database()
    query = {}

    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if genre:
        query["genre"] = genre

    movies = await db["movies"].find(query).to_list(length=100)
    return [format_movie(m) for m in movies]


@router.post("/movies", status_code=status.HTTP_201_CREATED)
async def create_movie(movie: MovieCreate):
    db = get_database()
    res = await db["movies"].insert_one(movie.dict())
    return {"id": str(res.inserted_id), "message": "Movie created successfully"}


@router.get("/movies/{movie_id}")
async def get_movie(movie_id: str):
    db = get_database()
    try:
        oid = ObjectId(movie_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid movie id")

    movie = await db["movies"].find_one({"_id": oid})
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return format_movie(movie)


@router.get("/movies/{movie_id}/shows")
async def get_shows(movie_id: str):
    db = get_database()
    try:
        oid = ObjectId(movie_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid movie id")

    movie = await db["movies"].find_one({"_id": oid})
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    shows = []
    today = datetime.utcnow().date()
    for day_offset in range(5):
        show_date = today + timedelta(days=day_offset)
        for time_slot in SHOW_TIMES:
            time_slug = time_slot.replace(" ", "").replace(":", "").replace("AM", "am").replace("PM", "pm")
            show_id = f"{movie_id}_{show_date.isoformat()}_{time_slug}"
            shows.append({
                "show_id": show_id,
                "date": show_date.isoformat(),
                "time": time_slot,
                "screen": "Screen 1" if SHOW_TIMES.index(time_slot) % 2 == 0 else "Screen 2",
            })

    return {"movie_id": movie_id, "shows": shows}



@router.get("/shows/{show_id}/seats")
async def get_seat_map(show_id: str):
    db = get_database()
    now = datetime.utcnow()

    # Get all permanently booked seats
    booked_cursor = db["bookings"].find({"show_id": show_id}, {"seats": 1})
    unavailable_seats = set()
    async for b in booked_cursor:
        unavailable_seats.update(b.get("seats", []))

    # Get all actively locked seats (where locked_until > now)
    locks_cursor = db["seat_locks"].find(
        {"show_id": show_id, "expires_at": {"$gt": now}}, 
        {"seat_id": 1}
    )
    async for lock in locks_cursor:
        unavailable_seats.add(lock["seat_id"])

    rows = []
    for row_info in SEAT_ROWS:
        seats = []
        for n in range(1, SEATS_PER_ROW + 1):
            seat_id = f"{row_info['row']}{n}"
            seats.append({
                "id": seat_id,
                "booked": seat_id in unavailable_seats,  # Marked True if booked OR active lock exists
            })
        rows.append({
            "row": row_info["row"],
            "category": row_info["category"],
            "price": row_info["price"],
            "seats": seats,
        })

    return {"show_id": show_id, "rows": rows}


# LOCK SEATS BEFORE PAYMENT (EXPIRES IN 10 MINUTES)

@router.post("/bookings/seats/lock", status_code=status.HTTP_200_OK)
async def lock_seats(req: SeatLockRequest):
    db = get_database()
    now = datetime.utcnow()
    expires_at = now + timedelta(minutes=10)

    # 1. Check permanent bookings
    already_booked = await db["bookings"].find_one({
        "show_id": req.show_id,
        "seats": {"$in": req.seats}
    })
    if already_booked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more selected seats are already booked."
        )

    # 2. Check existing active locks by other users
    active_lock = await db["seat_locks"].find_one({
        "show_id": req.show_id,
        "seat_id": {"$in": req.seats},
        "expires_at": {"$gt": now},
        "user_id": {"$ne": req.user_id}
    })
    if active_lock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Seat {active_lock['seat_id']} is temporarily locked by another user."
        )


    for seat in req.seats:
        await db["seat_locks"].update_one(
            {"show_id": req.show_id, "seat_id": seat},
            {
                "$set": {
                    "show_id": req.show_id,
                    "seat_id": seat,
                    "user_id": req.user_id,
                    "expires_at": expires_at
                }
            },
            upsert=True
        )

    return {"message": "Seats locked successfully", "expires_at": expires_at.isoformat()}


@router.post("/bookings", status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate):
    db = get_database()

    # Check for duplicate permanent bookings
    conflict = await db["bookings"].find_one({
        "show_id": booking.show_id,
        "seats": {"$in": booking.seats}
    })
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected seat(s) are already booked for this show."
        )

    payload = booking.dict()
    payload["confirmed_at"] = datetime.utcnow().isoformat()
    res = await db["bookings"].insert_one(payload)

    
    await db["seat_locks"].delete_many({
        "show_id": booking.show_id,
        "seat_id": {"$in": booking.seats}
    })

    return {"booking_id": str(res.inserted_id), "status": "Confirmed"}


@router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    db = get_database()
    try:
        oid = ObjectId(booking_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid booking id")

    booking = await db["bookings"].find_one({"_id": oid})
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    return {
        "booking_id": str(booking["_id"]),
        "show_id": booking["show_id"],
        "seats": booking["seats"],
        "total_amount": booking["total_amount"],
        "status": "Confirmed",
        "confirmed_at": booking.get("confirmed_at"),
    }