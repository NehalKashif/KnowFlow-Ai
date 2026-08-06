from auth.jwt_handler import JWTManager

import logging

logger = logging.getLogger(__name__)

token = JWTManager.create_access_token(
    {
        "sub": "123456",
        "email": "nehal@example.com",
    }
)

logger.info("Token:")
logger.info(token)

logger.info("\nDecoded Payload:")
logger.info(JWTManager.verify_token(token))