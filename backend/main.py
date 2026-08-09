import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from api.auth import router as auth_router

logging.basicConfig(level=logging.INFO)

myapp = FastAPI(
    title="KnowFlow AI",
    description="Personal RAG Assistant API",
    version="1.0.0"
)

myapp.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.56.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chat & Upload Routes
myapp.include_router(router)

# Authentication Routes
myapp.include_router(auth_router)


@myapp.get("/")
def root():
    return {
        "message": "KnowFlow AI Backend Running"
    }