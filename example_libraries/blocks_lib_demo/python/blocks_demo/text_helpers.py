# Text helpers that are called by the blocks in toolboxes/text_helpers.json.


def greeting(name: str) -> str:
    """Returns a friendly greeting for name."""
    return f"Hello, {name}!"


def log_message(message: str) -> None:
    """Prints message to the robot's console with a prefix."""
    print(f"[blocks_demo] {message}")
