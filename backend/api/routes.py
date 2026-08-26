from pathlib import Path
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from api.schemas import ChatRequest, ChatResponse, CreateChatRequest, ChatSessionResponse, UploadResponse, MessageResponse, DeleteResponse, RenameChatRequest, RenameChatResponse, DocumentResponse
from service import loader, splitter, embedding_manager, vector_store
from service import chat_engine
from fastapi import Depends
from auth.dependencies import get_current_user
from datetime import datetime
from databases.mongodb import documents_collection
from services.chat_service import ChatService
from services.message_service import MessageService
from services.document_service import DocumentService
from utils.file_hash import calculate_file_hash
from fastapi import status

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
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

@router.post(
    "/chat/session"
)
def create_chat(
    request: CreateChatRequest,
    current_user=Depends(get_current_user),
):

    chat = ChatService.create_chat(
        user_id=str(current_user["_id"]),
        title=request.title,
    )

    return chat

@router.post(
    "/chat/{chat_id}/upload",
    response_model=UploadResponse,
)
async def upload(
    chat_id: str,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    """
    Upload a document to a specific chat and process it
    through the RAG ingestion pipeline.
    """
    chat = ChatService.get_chat(
        user_id=str(current_user["_id"]),
        chat_id=chat_id,
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )
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

        file_hash = calculate_file_hash(save_path)
        existing_document = documents_collection.find_one(
            {
                "user_id": current_user["_id"],
                "chat_id": chat_id,
                "file_hash": file_hash,
            })

        if existing_document:
            save_path.unlink(missing_ok=True)

            raise HTTPException(
                status_code=400,
                detail="This document has already been uploaded."
            )

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
                "file_hash": file_hash,
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

    return UploadResponse(
        message="File uploaded successfully.",
        filename=file.filename,
        document_name=documents[0].metadata.get("source", "Unknown"),
        chunks_created=len(chunks),
        embeddings_generated=len(embeddings),
        vector_store_count=vector_store.count(),
    )
    

@router.post(
    "/chat/{chat_id}",
    response_model=ChatResponse,
)
def chat(
    chat_id: str,
    request: ChatRequest,
    current_user=Depends(get_current_user),
):

    try:
        result = chat_engine.chat(
                    question=request.question,
                    user_id=str(current_user["_id"]),
                    chat_id=chat_id,
                    top_k=request.top_k,
                )

        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get(
    "/chat/sessions",
    response_model=list[ChatSessionResponse],
)
def get_chat_sessions(
    current_user=Depends(get_current_user),
):
    return ChatService.get_user_chats(
        user_id=str(current_user["_id"])
    )

@router.get(
    "/chat/{chat_id}/messages",
    response_model=list[MessageResponse],
)
def get_messages(
    chat_id: str,
    current_user=Depends(get_current_user),
):
    return MessageService.get_messages(chat_id)

@router.delete(
    "/chat/{chat_id}",
    response_model=DeleteResponse,
)
def delete_chat(
    chat_id: str,
    current_user=Depends(get_current_user),
):
    deleted = ChatService.delete_chat(
        user_id=str(current_user["_id"]),
        chat_id=chat_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Chat not found.",
        )

    return DeleteResponse(
        message="Chat deleted successfully."
    )

@router.patch(
    "/chat/{chat_id}",
    response_model=RenameChatResponse,
)
def rename_chat(
    chat_id: str,
    request: RenameChatRequest,
    current_user=Depends(get_current_user),
):

    updated = ChatService.rename_chat(
        user_id=str(current_user["_id"]),
        chat_id=chat_id,
        title=request.title,
    )

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Chat not found.",
        )

    return RenameChatResponse(
        message="Chat renamed successfully."
    )

@router.get(
    "/chat/{chat_id}/documents",
    response_model=list[DocumentResponse],
)
def get_documents(
    chat_id: str,
    current_user=Depends(get_current_user),
):

    return DocumentService.get_documents(
        user_id=str(current_user["_id"]),
        chat_id=chat_id,
    )

@router.delete(
    "/documents/{document_id}",
    response_model=DeleteResponse,
)
def delete_document(
    document_id: str,
    current_user=Depends(get_current_user),
):

    deleted = DocumentService.delete_document(
        user_id=str(current_user["_id"]),
        document_id=document_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    return DeleteResponse(
        message="Document deleted successfully."
    )


@router.get(
    "/chat/{chat_id}",
    response_model=ChatSessionResponse,
)
def get_chat(
    chat_id: str,
    current_user=Depends(get_current_user),
):
    print("GETTING CHAT:", chat_id, "FOR USER:", str(current_user["_id"]))
    chat = ChatService.get_chat(
        user_id=str(current_user["_id"]),
        chat_id=chat_id,
    )

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found.",
        )

    return chat