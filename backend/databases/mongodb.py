import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# Read environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Create MongoDB client
client = MongoClient(MONGODB_URI)

# Select database
db = client[DATABASE_NAME]

# Collections
users_collection = db["users"]
chat_sessions_collection = db["chat_sessions"]
messages_collection = db["messages"]
documents_collection = db["documents"]