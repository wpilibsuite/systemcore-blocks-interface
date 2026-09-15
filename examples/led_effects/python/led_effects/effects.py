# LED effect helpers that are called by the blocks in toolboxes/led_effects.json.

import math

# wpilib uses a hue range of 0 to 180.
_HUE_RANGE = 180


def team_hue(is_red_alliance: bool) -> int:
    """Returns the hue for the alliance color."""
    return 0 if is_red_alliance else 120


def rainbow_hue(seconds: float, cycles_per_second: float) -> int:
    """Returns a hue that moves through the rainbow over time."""
    return int(seconds * cycles_per_second * _HUE_RANGE) % _HUE_RANGE


def pulse_brightness(seconds: float, period: float) -> float:
    """Returns a brightness between 0 and 1 that smoothly pulses once every period seconds."""
    if period <= 0:
        return 1.0
    return (1 - math.cos(2 * math.pi * seconds / period)) / 2


def blink(seconds: float, period: float) -> bool:
    """Returns True for the first half of every period and False for the second half."""
    if period <= 0:
        return True
    return (seconds % period) < period / 2
