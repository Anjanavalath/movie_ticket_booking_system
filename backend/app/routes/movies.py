from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from bson import ObjectId
from app.database.connection import get_database
from app.schemas.schemas import MovieCreate, BookingCreate

router = APIRouter()

@router.get("/movies")
async def get_movies(search: Optional[str] = Query(None), genre: Optional[str] = Query(None)):
    db = get_database()
    query = {}
    
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if genre:
        query["genre"] = genre
        
    movies = await db["movies"].find(query).to_list(length=100)
    
    formatted_movies = []
    for m in movies:
        formatted_movies.append({
            "id": str(m["_id"]),
            "title": m["title"],
            "genre": m["genre"],
            "duration_mins": m.get("duration_mins", 120),
            "language": m.get("language", "English"),
            "description": m.get("description", "")
        })
    return formatted_movies

@router.post("/movies", status_code=status.HTTP_201_CREATED)
async def create_movie(movie: MovieCreate):
    db = get_database()
    res = await db["movies"].insert_one(movie.dict())
    return {"id": str(res.inserted_id), "message": "Movie created successfully"}

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
        
    res = await db["bookings"].insert_one(booking.dict())
    return {"booking_id": str(res.inserted_id), "status": "Confirmed"}