from rag.loader import DocumentLoader
from rag.splitter import DocumentSplitter
from rag.embeddings import EmbeddingManager
from rag.vector_store import VectorStore

import logging

logger = logging.getLogger(__name__)

loader = DocumentLoader()

documents = loader.load_document("data/AI_Research_paper.pdf")

logger.info(f"Loaded {len(documents)} pages\n")

spliter = DocumentSplitter(chunk_size=1000, chunk_overlap=200)
chunks = spliter.split_documents(documents)
logger.info(f"chunks length: {len(chunks)}")

generator = EmbeddingManager()
chunks_embeddings = generator.generate_embeddings(chunks)

logger.info(len(chunks_embeddings))

vectorstore = VectorStore()
vectorstore.add_documents(chunks, chunks_embeddings)