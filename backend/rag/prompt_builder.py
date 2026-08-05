"""
prompt_builder.py

Responsible for creating prompts for the LLM.
"""

from typing import List, Dict


class PromptBuilder:
    """
    Builds prompts for the LLM using the retrieved
    document chunks and the user's question.
    """

    def __init__(self):
        """
        Initialize the Prompt Builder.
        """

        self.system_prompt = """
You are KnowFlow AI, an intelligent document assistant.

Your job is to answer the user's question ONLY using the provided context.

Rules:
1. Use the previous conversation to maintain context. If the uploaded documents contain the answer (CONTEXT), use them first.
2. Do NOT make up information.
3. If the user asked any question and the answer is not present in the context, clearly say:
   "I couldn't find that information in the uploaded documents."
4. Be clear, concise, and accurate.
5. If appropriate, organize the answer using bullet points.
"""

    def build_prompt(
        self,
        query: str,
        retrieved_chunks: List[Dict],
        chat_history: list | None = None,
    ) -> str:
        """
        Build the final prompt.

        Args:
            query: User question.
            retrieved_chunks: Chunks returned by the Retriever.

        Returns:
            Complete prompt string.
        """
        history_text = ""

        if chat_history:
            history_text = "\n".join(
                f"{message['role'].capitalize()}: {message['content']}"
                for message in chat_history
            )
        else:
            history_text = "No previous conversation."

        if not retrieved_chunks:

            context = "No relevant context found."

        else:

            context = ""

            for i, chunk in enumerate(retrieved_chunks, start=1):

                context += (
                    f"Context {i}:\n"
                    f"{chunk['content']}\n\n"
                )

        prompt = f"""
{self.system_prompt}

==============================
Conversation History
==============================

{history_text}


=========================
CONTEXT
=========================

{context}

=========================
QUESTION
=========================

{query}

=========================
ANSWER
=========================
"""

        return prompt