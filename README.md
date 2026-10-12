# KnowFlow AI — Personal RAG Chatbot

**KnowFlow AI** is an AI-powered document question-answering application that enables users to upload documents and interact with their content through a conversational interface. It uses Retrieval-Augmented Generation (RAG) to retrieve relevant information from uploaded documents and provide context-aware responses using a Large Language Model (LLM).

The project focuses on making document-based information retrieval more accessible while reducing unsupported answers by grounding LLM responses in retrieved context.

## Key Features

- **Document-based Question Answering:** Ask questions about uploaded documents using natural language.
- **Retrieval-Augmented Generation (RAG):** Combines semantic retrieval with LLM-generated responses grounded in relevant document content.
- **Semantic Search:** Generates vector embeddings and retrieves relevant document chunks using ChromaDB.
- **Multi-format Document Processing:** Supports PDF, DOCX, TXT, and Markdown documents.
- **Source-aware Responses:** Returns source information associated with retrieved document content.
- **Conversational Chat Interface:** Create chats, send messages, view chat history, and rename conversations.
- **Document Management:** Upload and delete documents within the chat workflow.
- **Authentication:** JWT-based authentication for protected application functionality.
- **Persistent Storage:** Uses MongoDB Atlas to store application data, including chats and messages.

## Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| Backend Framework | FastAPI |
| LLM | Llama 3.3 70B Versatile via Groq API |
| Embedding Model | Sentence Transformers — `all-MiniLM-L6-v2` |
| Vector Database | ChromaDB |
| Application Database | MongoDB Atlas |
| Document Processing | LangChain utilities and text splitters |
| Authentication | JSON Web Tokens (JWT) |
| Frontend | Web-based dashboard and chat interface |

## How It Works

KnowFlow AI follows a Retrieval-Augmented Generation pipeline:

1. **Document Upload:** A user uploads a supported document through the chat interface.
2. **Text Extraction:** The backend extracts text from the document.
3. **Text Chunking:** The extracted content is divided into smaller, overlapping chunks using `RecursiveCharacterTextSplitter`, configured for 1,000-character chunks with a 200-character overlap.
4. **Embedding Generation:** The `all-MiniLM-L6-v2` model converts document chunks into vector embeddings.
5. **Vector Storage:** The embeddings and associated metadata are stored in ChromaDB.
6. **Semantic Retrieval:** When a user asks a question, the system retrieves relevant document chunks using vector similarity search.
7. **Context Construction:** The retrieved content is included in the LLM prompt as supporting context.
8. **Answer Generation:** Groq-hosted Llama 3.3 70B generates a response based on the retrieved information.
9. **Response and Sources:** The backend returns the generated answer and available source information to the frontend.

## Architecture Overview

```text
                 User
                   |
                   v
          Web Chat Interface
                   |
                   v
             FastAPI Backend
                   |
          +--------+---------+
          |                  |
          v                  v
    Document Upload     User Question
          |                  |
          v                  v
    Text Extraction     Query Embedding
          |                  |
          v                  v
     Text Chunking      ChromaDB Search
          |                  |
          v                  v
    Embedding Model     Relevant Chunks
          |                  |
          v                  |
       ChromaDB <------------+
                             |
                             v
                      Context Building
                             |
                             v
                    Groq Llama 3.3 70B
                             |
                             v
                  Answer + Source Metadata
                             |
                             v
                      Web Chat Interface
```

MongoDB Atlas separately manages persistent application data, including conversations and messages, while JWT-based authentication supports protected API access.

## Backend and API

The backend is implemented using FastAPI and exposes endpoints for application functionality such as:

- User authentication and authorization.
- Chat creation and conversation management.
- Sending messages and retrieving responses.
- Uploading documents to an existing chat.
- Managing uploaded documents.

The application associates chat operations with authenticated users to support user-specific data access.

## Engineering Challenges and Considerations

### Grounding LLM Responses

LLMs can generate plausible answers that are not supported by source documents. KnowFlow AI addresses this challenge by retrieving relevant document chunks and incorporating them into the generation prompt.

### Document Processing and Retrieval

Document extraction and chunking affect the quality of retrieval. The pipeline separates document processing, embedding generation, vector storage, retrieval, and response generation to make the workflow easier to maintain and debug.

### Source Metadata

Source metadata is important for helping users trace responses back to the uploaded content. The application returns source information with responses, with citation accuracy depending on the document's available metadata and processing logic.

### Handling Insufficient Context

A document may contain insufficient extractable text to create useful chunks. Such cases need to be handled gracefully so that document processing does not proceed as though valid retrieval content were available.

## Getting Started

### Prerequisites

Before running the application, ensure you have:

- Python installed.
- Access to a MongoDB Atlas database or compatible MongoDB deployment.
- A Groq API key.
- Git installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/NehalKashif/KnowFlow-Ai.git
cd KnowFlow-Ai
```

Create and activate a virtual environment:

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables using the names expected by the application.

Example configuration:

```env
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_secret
```

**Important:** These are illustrative variable names. Check the application's configuration files and use the exact variable names expected by your implementation. Never commit real API keys, database credentials, or JWT secrets.

### Run the Application

Start the FastAPI server using the entry point configured in the repository. For example, if the application instance is exposed as `app` in `myapp/main.py`:

```bash
uvicorn myapp.main:app --reload
```

Open the FastAPI interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

Run the frontend separately using its configured development command, if it is maintained as a separate application.

> The commands above assume the corresponding files and configuration exist in the repository. Adjust the paths and setup steps to match the actual project structure.

## My Contributions

My primary focus in this team project was backend development and the RAG pipeline.

- Implemented core RAG functionality involving document processing, text chunking, embedding generation, vector storage, and semantic retrieval.
- Integrated Groq-hosted Llama 3.3 70B to generate responses using retrieved document context.
- Developed FastAPI backend functionality and worked on integrating authentication, MongoDB-backed conversation persistence, and document management with the frontend.

## Future Improvements

Potential improvements include:

- Adding retrieval evaluation using a representative question-and-answer dataset.
- Introducing relevance thresholds and explicit insufficient-context responses.
- Improving citation accuracy and document-level source tracking.
- Adding automated tests for document processing, retrieval, authentication, and API behavior.
- Evaluating retrieval quality and response faithfulness using measurable benchmarks.

## Repository

**GitHub:** [KnowFlow AI](https://github.com/NehalKashif/KnowFlow-Ai)

---

*KnowFlow AI demonstrates practical application of Retrieval-Augmented Generation, semantic search, vector databases, LLM integration, and API development in a document-centric conversational AI system.*
