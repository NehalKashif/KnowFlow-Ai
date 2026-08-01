from pathlib import Path
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from api.schemas import ChatRequest, ChatResponse
from services import loader, splitter, embedding_manager, vector_store
from services import chat_engine

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

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:
        answer = chat_engine.chat(
            question=request.question
        )

        return ChatResponse(
            answer=answer
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
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
        vector_store.add_documents(chunks, embeddings)

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