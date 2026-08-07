import hashlib
from pathlib import Path


def calculate_file_hash(file_path: Path) -> str:
    """
    Calculate SHA-256 hash of a file.

    Args:
        file_path: Path to the file.

    Returns:
        SHA-256 hash string.
    """

    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:

        while chunk := file.read(8192):

            sha256.update(chunk)

    return sha256.hexdigest()