from datetime import datetime
from pydantic import BaseModel, EmailStr

# =========================
# Chat Schemas
# =========================

class ChatRequest(BaseModel):
    question: str
    top_k: int = 5


class ChatResponse(BaseModel):
    answer: str


class CreateChatRequest(BaseModel):
    title: str


class ChatSessionResponse(BaseModel):
    id: str
    title: str
    created_at: datetime


# =========================
# Message Schemas
# =========================

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime


# =========================
# Document Schemas
# =========================

class UploadResponse(BaseModel):
    message: str
    filename: str
    document_name: str
    chunks_created: int
    embeddings_generated: int
    vector_store_count: int


class DocumentResponse(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime


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

class DeleteResponse(BaseModel):
    message: str

class RenameChatRequest(BaseModel):
    title: str


class RenameChatResponse(BaseModel):
    message: str

class DocumentResponse(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime