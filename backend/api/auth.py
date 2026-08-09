from datetime import datetime

from fastapi import APIRouter, HTTPException, status
from auth.dependencies import get_current_user
from fastapi import Depends

from api.schemas import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
)

from auth.jwt_handler import JWTManager
from auth.hashing import PasswordManager
from databases.mongodb import users_collection

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(request: RegisterRequest):
    """
    Register a new user.
    """

    # Check if email already exists
    existing_user = users_collection.find_one(
        {"email": request.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered."
        )

    # Hash the password
    hashed_password = PasswordManager.hash_password(
        request.password
    )

    # Create user document
    user = {
        "name": request.name,
        "email": request.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
    }

    # Insert into MongoDB
    users_collection.insert_one(user)

    return RegisterResponse(
        message="User registered successfully."
    )

@router.post(
    "/login",
    response_model=LoginResponse,
)
def login(request: LoginRequest):
    """
    Login an existing user.
    """

    # Find user by email
    user = users_collection.find_one(
        {"email": request.email}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Verify password
    if not PasswordManager.verify_password(
        request.password,
        user["password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Generate JWT Token
    access_token = JWTManager.create_access_token(
        {
            "sub": str(user["_id"]),
            "email": user["email"],
        }
    )

    return LoginResponse(
        access_token=access_token
    )

@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
    }