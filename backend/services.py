from rag.loader import DocumentLoader
from rag.splitter import DocumentSplitter
from rag.embeddings import EmbeddingManager
from rag.vector_store import VectorStore

import os

loader = DocumentLoader()

splitter = DocumentSplitter()

embedding_manager = EmbeddingManager()

vector_store = VectorStore()

