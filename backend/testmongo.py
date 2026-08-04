from services.message_service import MessageService



messages = MessageService.delete_messages("test_chat")

print(messages)
