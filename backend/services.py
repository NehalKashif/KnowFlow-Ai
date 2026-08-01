from rag.loader import DocumentLoader
from rag.splitter import DocumentSplitter
from rag.embeddings import EmbeddingManager
from rag.vector_store import VectorStore
from rag.retriever import Retriever
from rag.prompt_builder import PromptBuilder
from rag.chat_engine import ChatEngine
import os
from dotenv import load_dotenv

load_dotenv()


loader = DocumentLoader()

splitter = DocumentSplitter()

embedding_manager = EmbeddingManager()

vector_store = VectorStore()

retriever = Retriever(embedding_manager, vector_store)

prompt_builder = PromptBuilder()

chat_engine = ChatEngine(
    retriever=retriever,
    prompt_builder=prompt_builder,
    api_key=os.getenv("GROQ_API_KEY")
)