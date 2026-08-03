from auth.jwt_handler import JWTManager

token = JWTManager.create_access_token(
    {
        "sub": "123456",
        "email": "nehal@example.com",
    }
)

print("Token:")
print(token)

print("\nDecoded Payload:")
print(JWTManager.verify_token(token))