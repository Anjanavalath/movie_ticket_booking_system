# 🎬 Movie Ticket Booking System

A full-stack web application for discovering movies, checking showtimes, and reserving seats in real time. Built using **FastAPI**, **MongoDB**, **React**, and **Tailwind CSS**.

---

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** FastAPI (Python), Motor (Async MongoDB Driver), Pydantic
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens), Passlib (Bcrypt hashing)

---

## ✨ Features

- 🔒 **User Authentication:** Registration, Login, JWT-based security, password encryption.
- 🎬 **Movie Management:** Full CRUD operations for movies, search by title, and genre filtering.
- 🎟️ **Seat Booking System:** Interactive seat selection grid with double-booking prevention logic.
- 📊 **Responsive UI:** Modern layout built with Tailwind CSS.

---

## 🛠️ Project Structure

```text
movie_ticket/
├── backend/
│   ├── app/
│   │   ├── database/    # DB Connection (Motor)
│   │   ├── models/      # Data Models
│   │   ├── routes/      # API Routes (Auth, Movies, Bookings)
│   │   ├── schemas/     # Pydantic Schemas
│   │   └── utils/       # Security & JWT Helpers
│   ├── .env.example
│   ├── main.py          # FastAPI Entry Point
│   └── requirements.txt
└── frontend/            # React Application
```

---

## 🏁 How to Run Locally

### 1. Prerequisites
- Python 3.9+
- Node.js & npm
- MongoDB running locally on port `27017`

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
The API will be running at `http://127.0.0.1:8000` and Swagger docs at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License
This project is open-source and created for academic evaluation.