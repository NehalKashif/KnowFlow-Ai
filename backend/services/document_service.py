from bson import ObjectId
from databases.mongodb import documents_collection
from service import vector_store
from pathlib import Path

class DocumentService:

    @staticmethod
    def get_documents(
        user_id: str,
        chat_id: str,
    ):

        documents = list(
            documents_collection.find(
                {
                    "user_id": ObjectId(user_id),
                    "chat_id": chat_id,
                }
            ).sort(
                "uploaded_at",
                -1,
            )
        )

        result = []

        for document in documents:

            result.append(
                {
                    "id": str(document["_id"]),
                    "filename": document["filename"],
                    "uploaded_at": document["uploaded_at"],
                }
            )

        return result


    @staticmethod
    def delete_document(
        user_id: str,
        document_id: str,
    ):

        document = documents_collection.find_one(
            {
                "_id": ObjectId(document_id),
                "user_id": ObjectId(user_id),
            }
        )

        if not document:
            return False

        file_path = document["document_path"]

        if Path(file_path).exists():
            Path(file_path).unlink()

        vector_store.delete_document_vectors(
            user_id=user_id,
            chat_id=document["chat_id"],
            filename=document["filename"],
        )

        documents_collection.delete_one(
            {
                "_id": ObjectId(document_id)
            }
        )

        return True