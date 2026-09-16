# Math helpers that are called by the blocks in toolboxes/math_helpers.json.


def clamp(value: float, low: float, high: float) -> float:
    """Limits value so that it is between low and high."""
    return max(low, min(high, value))


def scale(value: float, in_min: float, in_max: float, out_min: float, out_max: float) -> float:
    """Maps value from the range in_min..in_max to the range out_min..out_max."""
    if in_max == in_min:
        return out_min
    return out_min + (value - in_min) * (out_max - out_min) / (in_max - in_min)


def deadband(value: float, threshold: float) -> float:
    """Returns 0 if value is within threshold of 0, otherwise returns value."""
    if abs(value) < threshold:
        return 0.0
    return value


def is_near(value: float, target: float, tolerance: float) -> bool:
    """Returns True if value is within tolerance of target."""
    return abs(value - target) <= tolerance
