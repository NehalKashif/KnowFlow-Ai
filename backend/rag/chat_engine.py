from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

from rag.retriever import Retriever
from rag.prompt_builder import PromptBuilder
from services.message_service import MessageService
from rag.intent_classifier import (
    IntentClassifier,
    QueryIntent,
)

class ChatEngine:
    """
    Orchestrates the complete RAG workflow.

    Workflow:
        User Question
              │
              ▼
        Save User Message
              │
              ▼
        Retriever
              │
              ▼
        Prompt Builder
              │
              ▼
           Groq LLM
              │
              ▼
        Save Assistant Message
              │
              ▼
         Final Response
    """

    def __init__(
        self,
        retriever: Retriever,
        prompt_builder: PromptBuilder,
        api_key: str,
        message_service: MessageService,
        model_name: str = "llama-3.3-70b-versatile",
        temperature: float = 0.2,
    ):
        """
        Initialize Chat Engine.

        Args:
            retriever: Retriever instance.
            prompt_builder: PromptBuilder instance.
            api_key: Groq API key.
            message_service: MessageService instance.
            model_name: Groq model.
            temperature: LLM temperature.
        """

        self.retriever = retriever
        self.prompt_builder = prompt_builder
        self.message_service = message_service
        self.intent_classifier = IntentClassifier()
        self.llm = ChatGroq(
            api_key=api_key,
            model=model_name,
            temperature=temperature,
        )

    def chat(
        self,
        question: str,
        user_id: str,
        chat_id: str | None = None,
        top_k: int = 5,
    ) -> str:
        """
        Complete RAG pipeline.

        Args:
            question: User question.
            user_id: Authenticated user's ID.
            chat_id: Chat session ID.
            top_k: Number of retrieved chunks.

        Returns:
            LLM response.
        """

        chat_history = self.message_service.get_chat_history(chat_id=chat_id)

        # -----------------------------
        # Retrieve relevant chunks
        # -----------------------------
        intent = self.intent_classifier.classify(question)

        if intent == QueryIntent.DOCUMENT:

            retrieved_chunks = self.retriever.retrieve_document(
                user_id=user_id,
                chat_id=chat_id,
            )

        else:

            retrieved_chunks = self.retriever.retrieve(
                query=question,
                user_id=user_id,
                chat_id=chat_id,
                top_k=top_k,
            )

        # -----------------------------
        # Save user's message
        # -----------------------------
        if chat_id:
            self.message_service.save_message(
                chat_id=chat_id,
                role="user",
                content=question,
            )

        # -----------------------------
        # Build prompt
        # -----------------------------
        prompt = self.prompt_builder.build_prompt(
            query=question,
            retrieved_chunks=retrieved_chunks,
            chat_history=chat_history,
        )

        # -----------------------------
        # Send prompt to Groq
        # -----------------------------
        response = self.llm.invoke(
            [HumanMessage(content=prompt)]
        )

        answer = response.content

        # -----------------------------
        # Save assistant's response
        # -----------------------------
        if chat_id:
            self.message_service.save_message(
                chat_id=chat_id,
                role="assistant",
                content=answer,
            )

        return answer