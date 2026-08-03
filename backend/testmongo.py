from databases.mongodb import users_collection

users = list(users_collection.find())

for user in users:
    print(user)