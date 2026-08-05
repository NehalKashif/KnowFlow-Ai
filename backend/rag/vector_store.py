"""
vector_store.py

Manages storing and retrieving document embeddings
using ChromaDB.
"""

from typing import List
import uuid
import chromadb
import numpy as np
from langchain_core.documents import Document


class VectorStore:
    """
    Handles all operations related to the ChromaDB vector database.
    """

    def __init__(
        self,
        collection_name: str = "knowflow_documents",
        persist_directory: str = "./chroma_db",
    ):
        """
        Initialize the ChromaDB vector store.

        Args:
            collection_name: Name of the ChromaDB collection.
            persist_directory: Directory where the database is stored.
        """

        self.collection_name = collection_name
        self.persist_directory = persist_directory

        # Create persistent client
        self.client = chromadb.PersistentClient(
            path=self.persist_directory
        )

        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={
                "description": "KnowFlow AI Vector Database"
            }
        )

        print("=" * 50)
        print("Vector Store Initialized")
        print(f"Collection Name : {self.collection_name}")
        print(f"Stored Chunks   : {self.collection.count()}")
        print("=" * 50)

    def add_documents(
            self,
            chunks: List[Document],
            embeddings: np.ndarray,
            user_id: str,
            filename: str,
            chat_id: str | None = None,
        ):
                
    
        """
        Store document chunks and their embeddings.

        Args:
            chunks: List of chunked LangChain Documents.
            embeddings: Corresponding embedding vectors.
        """

        if len(chunks) != len(embeddings):
            raise ValueError(
                "Number of chunks and embeddings must be equal."
            )

        ids = []
        documents = []
        metadatas = []
        vectors = []

        current_count = self.collection.count()

        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):

            ids.append(str(uuid.uuid4()))

            documents.append(chunk.page_content)

            metadata = dict(chunk.metadata)
            metadata["user_id"] = str(user_id)
            metadata["filename"] = str(filename)
            if chat_id is not None:
                metadata["chat_id"] = str(chat_id)
            
            metadatas.append(metadata)

            vectors.append(embedding.tolist())

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=vectors,
            metadatas=metadatas,
        )

        print(f"Successfully stored {len(chunks)} chunks.")
        print(f"Total Chunks : {self.collection.count()}")

    def similarity_search(
        self,
        query_embedding: np.ndarray,
        top_k: int = 5,
        user_id: str | None = None,
        chat_id: str | None = None,
    ):
        """
        Retrieve the most similar chunks.

        Args:
            query_embedding: Embedding of the user query.
            top_k: Number of chunks to retrieve.

        Returns:
            ChromaDB query results.
        """
        where = None

        if user_id and chat_id:
            where = {
                "$and": [
                    {"user_id": user_id},
                    {"chat_id": chat_id},
                ]
            }

        elif user_id:
            where = {
                "user_id": user_id
            }

        elif chat_id:
            where = {
                "chat_id": chat_id
            }

        query_args = {
            "query_embeddings": [query_embedding.tolist()],
            "n_results": top_k,
        }
        if where is not None:
            query_args["where"] = where

        results = self.collection.query(**query_args)

        return results

    def count(self) -> int:
        """
        Return the total number of stored chunks.
        """

        return self.collection.count()

    def get_all_documents(self):
        """
        Retrieve all stored documents.

        Returns:
            Dictionary containing all documents.
        """

        return self.collection.get()

    def delete_document(self, document_id: str):
        """
        Delete a document by its ID.

        Args:
            document_id: ChromaDB document ID.
        """

        self.collection.delete(ids=[document_id])

        print(f"Deleted document: {document_id}")

    def reset(self):
        """
        Delete the entire collection and recreate it.
        Useful during development/testing.
        """

        self.client.delete_collection(self.collection_name)

        self.collection = self.client.create_collection(
            name=self.collection_name,
            metadata={
                "description": "KnowFlow AI Vector Database"
            }
        )

        print("Collection has been reset successfully.")

    def delete_chat_vectors(
        self,
        user_id: str,
        chat_id: str,
    ):
        """
        Delete all vectors belonging to a specific chat.
        """

        self.collection.delete(
            where={
                "$and": [
                    {"user_id": user_id},
                    {"chat_id": chat_id},
                ]
            }
        )

        print(f"Deleted vectors of chat {chat_id}")