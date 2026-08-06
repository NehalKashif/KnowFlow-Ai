from enum import Enum


class QueryIntent(str, Enum):
    CONTENT = "content"
    DOCUMENT = "document"


class IntentClassifier:
    """
    Determines whether the user is asking
    about document content or about the
    document as a whole.
    """

    DOCUMENT_COMMANDS = {
        "summary",
        "summarize",
        "overview",
        "abstract",
        "main idea",
        "key points",
        "explain this document",
        "describe this document",
        "what is this document about",
        "give me a summary",
        "summarise",
        "overview of the document",
        "abstract of the document",
    }

    def classify(self, question: str) -> QueryIntent:

        question = question.lower()

        for phrase in self.DOCUMENT_COMMANDS:

            if phrase in question:
                return QueryIntent.DOCUMENT

        return QueryIntent.CONTENT