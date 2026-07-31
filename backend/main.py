from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, movies

app = FastAPI(
    title="Movie Ticket Booking API", 
    description="Full Stack FastAPI + MongoDB API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(movies.router, prefix="/api", tags=["Movies & Bookings"])

@app.get("/")
async def root():
    return {"status": "Online", "system": "Movie Booking API"}