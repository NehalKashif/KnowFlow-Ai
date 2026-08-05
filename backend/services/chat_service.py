from datetime import datetime
from bson import ObjectId

from databases.mongodb import chat_sessions_collection


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