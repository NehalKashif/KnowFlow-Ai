from datetime import datetime
from pathlib import Path
from bson import ObjectId
from service import vector_store
from databases.mongodb import (
    chat_sessions_collection,
    messages_collection,
    documents_collection,
)


class ChatService:

    @staticmethod
    def create_chat(user_id: str, title: str):

        chat = {
            "user_id": user_id,
            "title": title,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = chat_sessions_collection.insert_one(chat)

        chat["_id"] = str(result.inserted_id)

        return chat

    @staticmethod
    def get_user_chats(user_id: str):
        """
        Return all chat sessions of a user.
        """
        chats = list(
            chat_sessions_collection.find(
                {"user_id": user_id}
            ).sort("created_at", -1)
        )


        result = []

        for chat in chats:
            result.append(
                {
                    "id": str(chat["_id"]),
                    "title": chat["title"],
                    "created_at": chat["created_at"],
                }
            )

        return result

    @staticmethod
    def delete_chat(
        user_id: str,
        chat_id: str,
    ):
        """
        Delete an entire chat including:
        - Chat session
        - Messages
        - Document records
        - Uploaded files
        - ChromaDB vectors
        """

        # Verify chat belongs to user
        chat = chat_sessions_collection.find_one(
            {
                "_id": ObjectId(chat_id),
                "user_id": user_id,
            }
        )

        if not chat:
            return False

        # Get documents before deleting them
        documents = list(
            documents_collection.find(
                {
                    "user_id": ObjectId(user_id),
                    "chat_id": chat_id,
                }
            )
        )

        # Delete uploaded files
        for document in documents:

            file_path = document.get("document_path")

            if file_path and Path(file_path).exists():
                Path(file_path).unlink()

        # Delete vectors
        vector_store.delete_chat_vectors(
            user_id=user_id,
            chat_id=chat_id,
        )

        # Delete MongoDB records
        documents_collection.delete_many(
            {
                "user_id": ObjectId(user_id),
                "chat_id": chat_id,
            }
        )

        messages_collection.delete_many(
            {
                "chat_id": chat_id,
            }
        )

        chat_sessions_collection.delete_one(
            {
                "_id": ObjectId(chat_id),
                "user_id": user_id,
            }
        )

        return True
    

    @staticmethod
    def rename_chat(
        user_id: str,
        chat_id: str,
        title: str,
    ):
        """
        Rename a chat session.
        """

        result = chat_sessions_collection.update_one(
            {
                "_id": ObjectId(chat_id),
                "user_id": user_id,
            },
            {
                "$set": {
                    "title": title,
                }
            },
        )

        return result.modified_count > 0