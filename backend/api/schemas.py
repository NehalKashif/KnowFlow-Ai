from pydantic import BaseModel, EmailStr


# =========================
# Chat Schemas
# =========================

class ChatRequest(BaseModel):
    question: str
    top_k: int = 5


class ChatResponse(BaseModel):
    answer: str


# =========================
# Upload Schemas
# =========================

class UploadResponse(BaseModel):
    message: str


# =========================
# Authentication Schemas
# =========================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class RegisterResponse(BaseModel):
    message: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"