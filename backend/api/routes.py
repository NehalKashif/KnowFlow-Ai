from pathlib import Path
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from api.schemas import ChatRequest, ChatResponse, CreateChatRequest, ChatSessionResponse
from service import loader, splitter, embedding_manager, vector_store
from service import chat_engine
from fastapi import Depends
from auth.dependencies import get_current_user
from datetime import datetime
from databases.mongodb import documents_collection
from services.chat_service import ChatService
from services.message_service import MessageService

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".md",
}


@router.post("/chat/session")
def create_chat(
    request: CreateChatRequest,
    current_user=Depends(get_current_user),
):

    chat = ChatService.create_chat(
        user_id=str(current_user["_id"]),
        title=request.title,
    )

    return chat

@router.post("/chat/{chat_id}/upload")
async def upload(
    chat_id: str,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """
    Upload a PDF and save it to the uploads folder.
    """

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {extension}"
        )

    save_path = UPLOAD_DIR / file.filename

    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        documents = loader.load_document(save_path)
        chunks = splitter.split_documents(documents)
        embeddings = embedding_manager.generate_embeddings(chunks)
        vector_store.add_documents(
            chunks=chunks,
            embeddings=embeddings,
            user_id=str(current_user["_id"]),
            filename=file.filename,
            chat_id=chat_id
        )

        # Save document information to MongoDB
        document = {
                "user_id": current_user["_id"],
                "chat_id": chat_id,
                "filename": file.filename,
                "document_path": str(save_path),
                "chunks": len(chunks),
                "uploaded_at": datetime.utcnow(),
            }
    

        documents_collection.insert_one(document)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        file.file.close()

    return {
        "message": "File uploaded successfully.",
        "filename": file.filename,
        "Document Name": documents[0].metadata.get("source", "Unknown"),
        "Chunks Created": len(chunks),
        "Embeddings Generated": len(embeddings),
        "Vector Store Count": vector_store.count(),
    }


@router.post("/chat/{chat_id}")
def chat(
    chat_id: str,
    request: ChatRequest,
    current_user=Depends(get_current_user),
):

    try:
        answer = chat_engine.chat(
                    question=request.question,
                    user_id=str(current_user["_id"]),
                    chat_id=chat_id,
                    top_k=request.top_k,
                )

        return ChatResponse(
            answer=answer
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/chat/sessions")
def get_chat_sessions(
    current_user=Depends(get_current_user),
):
    return ChatService.get_user_chats(
        user_id=str(current_user["_id"])
    )

@router.get("/chat/{chat_id}/messages")
def get_messages(
    chat_id: str,
    current_user=Depends(get_current_user),
):
    return MessageService.get_messages(chat_id)