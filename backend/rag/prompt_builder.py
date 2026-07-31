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
1. Use ONLY the provided context.
2. Do NOT make up information.
3. If the user asked any question and the answer is not present in the context, clearly say:
   "I couldn't find that information in the uploaded documents."
   And give the answer yourself without any context but if the user asked something irrelevant like greetings so reply accordingly
4. Be clear, concise, and accurate.
5. If appropriate, organize the answer using bullet points.
"""

    def build_prompt(
        self,
        query: str,
        retrieved_chunks: List[Dict],
    ) -> str:
        """
        Build the final prompt.

        Args:
            query: User question.
            retrieved_chunks: Chunks returned by the Retriever.

        Returns:
            Complete prompt string.
        """

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