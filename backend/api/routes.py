from pathlib import Path
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from api.schemas import ChatRequest, ChatResponse

from rag.loader import DocumentLoader

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

    return ChatResponse(
        answer=f"You asked: {request.question}"
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

        loader = DocumentLoader()
        documents = loader.load_document(save_path)

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
        "Document Name": documents[0].metadata.get("source", "Unknown")

    }