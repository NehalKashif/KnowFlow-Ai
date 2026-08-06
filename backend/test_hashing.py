from auth.hashing import PasswordManager

import logging

logger = logging.getLogger(__name__)

password = "Nehal123"

hashed = PasswordManager.hash_password(password)

logger.info("Hashed Password:")
logger.info(hashed)

logger.info("")

logger.info(
    PasswordManager.verify_password(
        "Nehal123",
        hashed,
    )
)

logger.info(
    PasswordManager.verify_password(
        "WrongPassword",
        hashed,
    )
)