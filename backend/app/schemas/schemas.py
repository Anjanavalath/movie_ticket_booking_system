from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class MovieCreate(BaseModel):
    title: str
    genre: str
    duration_mins: int
    language: str
    description: Optional[str] = None
    # Optional so existing callers of POST /movies keep working unchanged.
    poster: Optional[str] = None
    rating: Optional[float] = None
    release_date: Optional[str] = None

class BookingCreate(BaseModel):
    show_id: str
    seats: List[str]
    total_amount: float