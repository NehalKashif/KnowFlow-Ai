"""
splitter.py

Responsible for splitting LangChain Documents into
smaller chunks for embedding.
"""

from typing import List

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


class DocumentSplitter:
    """
    Splits LangChain Documents into smaller chunks.
    """

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        """
        Initialize the text splitter.

        Args:
            chunk_size: Maximum number of characters per chunk.
            chunk_overlap: Number of overlapping characters.
        """

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def split_documents(self, documents: List[Document]) -> List[Document]:
        """
        Split LangChain Documents into chunks.

        Args:
            documents: List of LangChain Documents.

        Returns:
            List of chunked Documents.
        """

        if not documents:
            return []

        chunks = self.text_splitter.split_documents(documents)

        print(f"Original Documents : {len(documents)}")
        print(f"Generated Chunks   : {len(chunks)}")

        return chunks