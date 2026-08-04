from datetime import datetime

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