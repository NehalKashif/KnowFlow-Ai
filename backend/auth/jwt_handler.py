from datetime import datetime, timedelta
import os
import token

from dotenv import load_dotenv
from jose import JWTError, jwt
from jose import JWTError, ExpiredSignatureError

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
)


class JWTManager:
    """
    Handles JWT creation and verification.
    """

    @staticmethod
    def create_access_token(data: dict) -> str:
        """
        Create a JWT access token.
        """
        payload = data.copy()

        expire = datetime.utcnow() + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

        payload.update({"exp": expire})

        token = jwt.encode(
            payload,
            SECRET_KEY,
            algorithm=ALGORITHM,
        )

        return token

    @staticmethod
    def verify_token(token: str) -> dict:
        """
        Verify and decode a JWT token.
        Raises:
                ExpiredSignatureError
                JWTError
            """
        
        payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM],
            )
        
        return payload

    