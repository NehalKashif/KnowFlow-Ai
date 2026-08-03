from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from api.schemas import (
    RegisterRequest,
    RegisterResponse,
)
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