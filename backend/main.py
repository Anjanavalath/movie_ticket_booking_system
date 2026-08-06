from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

# Import route modules
from app.routes import auth, movies
# Import database client/instance (adjust based on your app/database.py structure)
from app.database.connection import db

# Lifespan context manager to handle startup/shutdown tasks
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC ---
    print("Connecting to MongoDB and initializing services...")
    
    # Auto-seed sample movies if the collection is empty
    try:
        count = await db["movies"].count_documents({})
        if count == 0:
            print("No movies found in MongoDB. Inserting initial sample data...")
            sample_movies = [
                {
                    "title": "Inception",
                    "genre": "Sci-Fi",
                    "language": "EN",
                    "duration_mins": 148,
                    "poster": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
                    "rating": 8.8,
                    "release_date": "2010-07-16",
                },
                {
                    "title": "The Dark Knight",
                    "genre": "Action",
                    "language": "EN",
                    "duration_mins": 152,
                    "poster": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
                    "rating": 9.0,
                    "release_date": "2008-07-18",
                },
                {
                    "title": "Interstellar",
                    "genre": "Drama",
                    "language": "EN",
                    "duration_mins": 169,
                    "poster": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
                    "rating": 8.7,
                    "release_date": "2014-11-07",
                }
            ]
            await db["movies"].insert_many(sample_movies)
            print("Successfully auto-seeded sample movies!")
    except Exception as e:
        print(f"Warning during auto-seeding: {e}")

    yield
    
    # --- SHUTDOWN LOGIC ---
    print("Shutting down application...")

# Initialize FastAPI App
app = FastAPI(
    title="CinePass API",
    description="Full-Stack FastAPI + MongoDB Movie Ticket Booking Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Vite React Frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with standard API prefixes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(movies.router, prefix="/api", tags=["Movies & Bookings"])

# Health Check Route
@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "Online",
        "system": "CinePass Ticket Booking API",
        "docs_url": "http://localhost:8000/docs"
    }