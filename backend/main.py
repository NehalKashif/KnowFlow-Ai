from fastapi import FastAPI

from api.routes import router
from api.auth import router as auth_router

myapp = FastAPI(
    title="KnowFlow AI",
    description="Personal RAG Assistant API",
    version="1.0.0"
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