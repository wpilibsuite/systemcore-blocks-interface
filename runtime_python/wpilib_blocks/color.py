# This module provides functions related to color.

import colorsys
import wpiutil

_HUE_THRESHOLD = 15

def _get_hsv(color: wpiutil.Color) -> (int, int, int):
    """Returns the HSV values for the given color.
    The hue is [0-180].
    The saturation is [0-255].
    The value is [0-255]. """

    # Extract and normalize RGB values to 0.0-1.0
    color_code = color.hexString().lstrip("#")
    red = int(color_code[0:2], 16) / 255.0
    green = int(color_code[2:4], 16) / 255.0
    blue = int(color_code[4:6], 16) / 255.0

    # Convert to hsv values 0.0-1.0
    hue, saturation, value = colorsys.rgb_to_hsv(red, green, blue)

    # Convert hue to [0-180], saturation to [0-255], and value to [0-255].
    hue = round(hue * 180)
    saturation = round(saturation * 255)
    value = round(value * 255)
    return (hue, saturation, value)


def get_hue(color: wpiutil.Color) -> int:
    """Returns the hue [0-180] of the given color. """
    hue, saturation, value = _get_hsv(color)
    return hue

    
def get_saturation(color: wpiutil.Color) -> int:
    """Returns the saturation [0-180] of the given color. """
    hue, saturation, value = _get_hsv(color)
    return saturation

    
def get_value(color: wpiutil.Color) -> int:
    """Returns the value [0-255] of the given color. """
    hue, saturation, value = _get_hsv(color)
    return value

    
def is_red(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to red."""
    hue, saturation, value = _get_hsv(color)
    if saturation > 12 and value > 75:
        adjusted_hue = (hue + _HUE_THRESHOLD) % 180 - _HUE_THRESHOLD
        return abs(adjusted_hue) < _HUE_THRESHOLD
    return False

    
def is_yellow(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to yellow."""
    hue, saturation, value = _get_hsv(color)
    if saturation > 12 and value > 75:
        return abs(hue - 30) < _HUE_THRESHOLD
    return False

    
def is_green(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to green."""
    hue, saturation, value = _get_hsv(color)
    if saturation > 12 and value > 75:
        return abs(hue - 60) < _HUE_THRESHOLD
    return False

    
def is_cyan(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to cyan."""
    hue, saturation, value = _get_hsv(color)
    if saturation > 12 and value > 75:
        return abs(hue - 90) < _HUE_THRESHOLD
    return False

    
def is_blue(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to blue."""
    hue, saturation, value = _get_hsv(color)
    if saturation > 12 and value > 75:
        return abs(hue - 120) < _HUE_THRESHOLD
    return False

    
def is_magenta(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to magenta."""
    hue, saturation, value = _get_hsv(color)
    if saturation > 12 and value > 75:
        return abs(hue - 150) < _HUE_THRESHOLD
    return False

