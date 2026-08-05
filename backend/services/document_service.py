from bson import ObjectId
from databases.mongodb import documents_collection


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