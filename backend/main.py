from fastapi import FastAPI
from api.routes import router

myapp = FastAPI(
    title="KnowFlow AI",
    description="Personal RAG Assistant API",
    version="1.0.0"
)


myapp.include_router(router)


@myapp.get("/")
def root():
    return {
        "message": "KnowFlow AI Backend Running"
    }