from fastapi import APIRouter, HTTPException, status
from app.database.connection import get_database
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse
from app.utils.security import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister):
    db = get_database()
    
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="User with this email already exists"
        )
    
    hashed_pwd = hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pwd,
        "role": "user"
    }
    
    res = await db["users"].insert_one(new_user)
    return {"message": "User registered successfully", "id": str(res.inserted_id)}

@router.post("/login", response_model=TokenResponse)
async def login_user(user: UserLogin):
    db = get_database()
    
    db_user = await db["users"].find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    token = create_access_token(data={"sub": db_user["email"], "id": str(db_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}