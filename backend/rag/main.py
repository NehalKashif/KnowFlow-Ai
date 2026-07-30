import os

from dotenv import load_dotenv

from rag.embeddings import EmbeddingManager
from rag.vector_store import VectorStore
from rag.retriever import Retriever
from rag.prompt_builder import PromptBuilder
from rag.chat_engine import ChatEngine


def main():

    # Load environment variables
    load_dotenv()

    # Initialize components
    embedding_manager = EmbeddingManager()

    vector_store = VectorStore()

    retriever = Retriever(
        embedding_manager=embedding_manager,
        vector_store=vector_store
    )

    prompt_builder = PromptBuilder()

    chat_engine = ChatEngine(
        retriever=retriever,
        prompt_builder=prompt_builder,
        api_key=os.getenv("GROQ_API_KEY")
    )

    print("=" * 60)
    print("KnowFlow AI Chat")
    print("Type 'exit' to quit.")
    print("=" * 60)

    while True:

        question = input("\nYou: ")

        if question.lower() == "exit":
            print("\nGoodbye!")
            break

        answer = chat_engine.chat(question)

        print("\nKnowFlow AI:")
        print(answer)
        print("-" * 60)


if __name__ == "__main__":
    main()