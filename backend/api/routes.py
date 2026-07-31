from fastapi import APIRouter
from api.schemas import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    return ChatResponse(
        answer=f"You asked: {request.question}"
    )


@router.post("/upload")
def upload():

    return {
        "message": "Upload endpoint working."
    }