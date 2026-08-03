from datetime import datetime, timedelta
import os

from dotenv import load_dotenv
from jose import JWTError, jwt

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
    def verify_token(token: str):
        """
        Verify a JWT token.
        Returns the payload if valid.
        """

        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM],
            )
            return payload

        except JWTError:
            return None