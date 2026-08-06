from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from datetime import datetime, timedelta
from bson import ObjectId
from bson.errors import InvalidId
from app.database.connection import get_database
from app.schemas.schemas import MovieCreate, BookingCreate

router = APIRouter()

# Standard hall layout used to compute a seat map for any show on the fly.
# Not stored in the DB — only which seats are already booked (via the
# existing "bookings" collection) is real data; the layout itself is fixed.
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
    """Computed showtimes for the next 5 days. Show ids are deterministic
    (movie_id + date + time) so a seat map and a booking can both be looked
    up later without a separate 'shows' collection."""
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

    booked_cursor = db["bookings"].find({"show_id": show_id}, {"seats": 1})
    booked_seats = set()
    async for b in booked_cursor:
        booked_seats.update(b.get("seats", []))

    rows = []
    for row_info in SEAT_ROWS:
        seats = []
        for n in range(1, SEATS_PER_ROW + 1):
            seat_id = f"{row_info['row']}{n}"
            seats.append({
                "id": seat_id,
                "booked": seat_id in booked_seats,
            })
        rows.append({
            "row": row_info["row"],
            "category": row_info["category"],
            "price": row_info["price"],
            "seats": seats,
        })

    return {"show_id": show_id, "rows": rows}


@router.post("/bookings", status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate):
    db = get_database()

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
    return {"booking_id": str(res.inserted_id), "status": "Confirmed"}


@router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    """Read-only lookup used by the ticket confirmation page. Returns the
    real record created by POST /bookings — nothing here is fabricated."""
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