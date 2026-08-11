"""
message_service.py

Handles all database operations related to chat messages.
"""

from datetime import datetime
from bson import ObjectId

from databases.mongodb import messages_collection
from typing import List

class MessageService:
    """
    Service class for managing chat messages.
    """

    @staticmethod
    def save_message(
        chat_id: str,
        role: str,
        content: str,
        sources: List[dict] | None = None
    ):
        """
        Save a new message to MongoDB.

        Args:
            chat_id: ID of the chat session.
            role: Either 'user' or 'assistant'.
            content: Message content.
            sources: List of source documents.
        Returns:
            Inserted message.
        """
        
        message = {
            "chat_id": chat_id,
            "role": role,
            "content": content,
            "sources": sources,
            "created_at": datetime.utcnow(),
        }
        

        result = messages_collection.insert_one(message)

        message["_id"] = str(result.inserted_id)

        return message

    @staticmethod
    def get_messages(chat_id: str):
        """
        Retrieve all messages belonging to a chat.

        Args:
            chat_id: Chat session ID.

        Returns:
            List of messages ordered by creation time.
        """

        messages = list(
            messages_collection.find(
                {"chat_id": chat_id}
            ).sort("created_at", 1)
        )
        result = []

        for message in messages:
            result.append(
                {
                    "id": str(message["_id"]),
                    "role": message["role"],
                    "content": message["content"],
                    "sources": message.get("sources"),
                    "created_at": message["created_at"],
                }
            )

        return result

    @staticmethod
    def get_message(message_id: str):
        """
        Retrieve a single message.

        Args:
            message_id: Message ID.

        Returns:
            Message document or None.
        """

        message = messages_collection.find_one(
            {"_id": ObjectId(message_id)}
        )

        if message:
            message["_id"] = str(message["_id"])

        return message

    @staticmethod
    def delete_messages(chat_id: str):
        """
        Delete all messages of a chat.

        Args:
            chat_id: Chat session ID.

        Returns:
            Number of deleted messages.
        """

        result = messages_collection.delete_many(
            {"chat_id": chat_id}
        )

        return result.deleted_count

    @staticmethod
    def delete_message(message_id: str):
        """
        Delete a single message.

        Args:
            message_id: Message ID.

        Returns:
            True if deleted successfully.
        """

        result = messages_collection.delete_one(
            {"_id": ObjectId(message_id)}
        )

        return result.deleted_count == 1

    @staticmethod
    def count_messages(chat_id: str):
        """
        Count total messages in a chat.

        Args:
            chat_id: Chat session ID.

        Returns:
            Number of messages.
        """

        return messages_collection.count_documents(
            {"chat_id": chat_id}
        )
    
    @staticmethod
    def get_chat_history(
        chat_id: str,
        limit: int = 20,
    ) -> List[dict]:
        """
        Retrieve the previous messages of a chat.

        Args:
            chat_id: Chat session ID.
            limit: Maximum number of messages.

        Returns:
            List of messages ordered by creation time.
        """

        messages = list(
            messages_collection.find(
                {"chat_id": chat_id}
            )
            .sort("created_at", 1)
            .limit(limit)
        )

        history = []

        for message in messages:
            history.append(
                {
                    "role": message["role"],
                    "content": message["content"],
                }
            )

        return history