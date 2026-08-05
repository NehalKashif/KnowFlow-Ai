from services.message_service import MessageService

history = MessageService.get_chat_history(
    chat_id="6a72494f465f995be16cecce"
)

print(history)