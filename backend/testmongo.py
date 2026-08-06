from service import vector_store

import logging

logger = logging.getLogger(__name__)

logger.info(vector_store.count())

vector_store.delete_chat_vectors(
    user_id="6a70d2d54b523a96cf798453",
    chat_id="6a724e7a4d3862dbfdcdcca9",
)

logger.info(vector_store.count())