from auth.hashing import PasswordManager

password = "Nehal123"

hashed = PasswordManager.hash_password(password)

print("Hashed Password:")
print(hashed)

print()

print(
    PasswordManager.verify_password(
        "Nehal123",
        hashed,
    )
)

print(
    PasswordManager.verify_password(
        "WrongPassword",
        hashed,
    )
)