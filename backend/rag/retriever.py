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
        user_id: str | None = None,
        chat_id: str | None = None,
    ) -> List[Dict]:
        """
        Retrieve the top-k most relevant chunks.

        Args:
            query: User question.
            top_k: Number of chunks to retrieve.
            user_id: ID of the user.
            chat_id: ID of the chat.

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
            user_id=user_id,
            chat_id=chat_id,
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

    def retrieve_document(
        self,
        user_id: str,
        chat_id: str,
        max_chunks: int = 20,
    ):
        """
        Retrieve the first N chunks of a document for
        document-level tasks like summarization.
        """

        results = self.vector_store.get_chat_documents(
            user_id=user_id,
            chat_id=chat_id,
        )

        retrieved_chunks = []

        documents = results.get("documents", [])
        metadatas = results.get("metadatas", [])

        # Limit the number of chunks
        documents = documents[:max_chunks]
        metadatas = metadatas[:max_chunks]

        for doc, metadata in zip(documents, metadatas):

            retrieved_chunks.append(
                {
                    "content": doc,
                    "metadata": metadata,
                    "distance": 0,
                }
            )

        return retrieved_chunks