"""
retriever.py

Responsible for retrieving the most relevant
document chunks from the vector database.
"""

from typing import List, Dict

from rag.embeddings import EmbeddingManager
from rag.vector_store import VectorStore


class Retriever:
    """
    Retrieves the most relevant document chunks
    from the vector database.
    """

    def __init__(
        self,
        embedding_manager: EmbeddingManager,
        vector_store: VectorStore,
    ):
        """
        Initialize the retriever.

        Args:
            embedding_manager: EmbeddingManager instance.
            vector_store: VectorStore instance.
        """

        self.embedding_manager = embedding_manager
        self.vector_store = vector_store

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
    ) -> List[Dict]:
        """
        Retrieve the top-k most relevant chunks.

        Args:
            query: User question.
            top_k: Number of chunks to retrieve.

        Returns:
            List of retrieved chunks.
        """

        if not query.strip():
            return []

        # Generate embedding for the user query
        query_embedding = self.embedding_manager.generate_query_embedding(
            query
        )

        # Search ChromaDB
        results = self.vector_store.similarity_search(
            query_embedding=query_embedding,
            top_k=top_k,
        )

        retrieved_chunks = []

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for doc, metadata, distance in zip(
            documents,
            metadatas,
            distances,
        ):

            retrieved_chunks.append(
                {
                    "content": doc,
                    "metadata": metadata,
                    "distance": distance,
                }
            )

        return retrieved_chunks