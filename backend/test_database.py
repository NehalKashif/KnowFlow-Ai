from pymongo import MongoClient
import os

uri = os.getenv("MONGODB_URI")

client = MongoClient(uri, serverSelectionTimeoutMS=10000)

print(client.admin.command("ping"))