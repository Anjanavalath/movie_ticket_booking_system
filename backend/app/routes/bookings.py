from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.database.connection import get_database

router = APIRouter()

class LockSeatsRequest(BaseModel):
    show_id: str
    seats: List[str]
    user_id: str

class CreateBookingRequest(BaseModel):
    show_id: str
    seats: List[str]
    total_amount: float
    user_id: str


# LOCK SEATS ATOMICALLY

@router.post("/seats/lock")
async def lock_seats(req: LockSeatsRequest):
    db = get_database()
    now = datetime.utcnow()
    lock_expires_at = now + timedelta(minutes=10)

    for seat_id in req.seats:
        # ATOMIC UPDATE: Only updates if status is 'available' OR lock has expired
        result = await db["shows"].update_one(
            {
                "_id": req.show_id,
                "seats": {
                    "$elemMatch": {
                        "id": seat_id,
                        "$or": [
                            {"status": "available"},
                            {"status": {"$exists": False}},
                            # Allow locking if previous lock expired:
                            {"status": "locked", "locked_until": {"$lt": now}},
                            # Allow re-locking if it's already locked by the same user:
                            {"status": "locked", "locked_by": req.user_id}
                        ]
                    }
                }
            },
            {
                "$set": {
                    "seats.$.status": "locked",
                    "seats.$.locked_by": req.user_id,
                    "seats.$.locked_until": lock_expires_at
                }
            }
        )

        # If modified_count is 0, someone else booked or locked it first!
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Seat {seat_id} was just taken by another user!"
            )

    return {"message": "Seats locked successfully", "expires_at": lock_expires_at.isoformat()}

# CONFIRM BOOKING (PERMANENT)

@router.post("")
async def create_booking(req: CreateBookingRequest):
    db = get_database()

    for seat_id in req.seats:
        
        result = await db["shows"].update_one(
            {
                "_id": req.show_id,
                "seats": {
                    "$elemMatch": {
                        "id": seat_id,
                        "status": "locked",
                        "locked_by": req.user_id
                    }
                }
            },
            {
                "$set": {
                    "seats.$.status": "booked",
                    "seats.$.booked_by": req.user_id,
                    "seats.$.locked_by": None,
                    "seats.$.locked_until": None
                }
            }
        )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Booking failed for seat {seat_id}. Lock expired or already booked."
            )

    # Save to bookings collection
    new_booking = {
        "show_id": req.show_id,
        "seats": req.seats,
        "total_amount": req.total_amount,
        "user_id": req.user_id,
        "created_at": datetime.utcnow()
    }
    res = await db["bookings"].insert_one(new_booking)

    return {"message": "Booking successful", "booking_id": str(res.inserted_id)}