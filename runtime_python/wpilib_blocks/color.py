# This module provides functions related to color.

import colorsys
import wpiutil


# wpilib uses a 180 hue range.
_FULL_HUE_RANGE: int = 180

# Divide the full hue range into 6 sections, one for each of the major colors.
_A_SIXTH: int = _FULL_HUE_RANGE / 6

_PURE_RED_HUE: int = 0 * _A_SIXTH
_PURE_YELLOW_HUE: int = 1 * _A_SIXTH
_PURE_GREEN_HUE: int = 2 * _A_SIXTH
_PURE_CYAN_HUE: int = 3 * _A_SIXTH
_PURE_BLUE_HUE: int = 4 * _A_SIXTH
_PURE_MAGENTA_HUE: int = 5 * _A_SIXTH

# The tolerance used by functions is_red, is_yellow, is_green, is_cyan, is_blue,
# and is_magenta.
_tolerance: float = 0.5

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
    hue = round(hue * _FULL_HUE_RANGE)
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


def _is_colorful_enough_to_detect_color(saturation: int, value: int) -> bool:
    return saturation > 12 and value > 75


def set_tolerance(tolerance: float = 0.5) -> None:
    """
    Sets the tolerance used by functions is_red, is_yellow, is_green, is_cyan,
    is_blue, and is_magenta.

    :param tolerance: Clamped to [0, 1]. The default value is 0.5. A value of
                      less than 0.5 means there is no overlap in the six color
                      ranges.
                      With a value of greater than or equal to 0.5, there is
                      some overlap such that, for example, both is_yellow and
                      is_green will return true for the color
                      Chartreuse #7FFF00.
    """
    _tolerance = max(0.0, min(tolerance, 1.0))


def is_red(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to red."""
    hue, saturation, value = _get_hsv(color)
    if _is_colorful_enough_to_detect_color(saturation, value):
        # Without adjusting the hue, which is in a range from 0 to 180, the red
        # section is divided into separate parts from 0 to 15 and from 165 to 180.
        adjusted_hue = (hue + _A_SIXTH) % _FULL_HUE_RANGE - _A_SIXTH
        # adjusted_hue is in a range of -30 to 150, so the red section is from
        # -15 to 15.
        return abs(adjusted_hue - _PURE_RED_HUE) <= _A_SIXTH * _tolerance
    return False


def is_yellow(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to yellow."""
    hue, saturation, value = _get_hsv(color)
    if _is_colorful_enough_to_detect_color(saturation, value):
        return abs(hue - _PURE_YELLOW_HUE) <= _A_SIXTH * _tolerance
    return False


def is_green(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to green."""
    hue, saturation, value = _get_hsv(color)
    if _is_colorful_enough_to_detect_color(saturation, value):
        return abs(hue - _PURE_GREEN_HUE) <= _A_SIXTH * _tolerance
    return False


def is_cyan(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to cyan."""
    hue, saturation, value = _get_hsv(color)
    if _is_colorful_enough_to_detect_color(saturation, value):
        return abs(hue - _PURE_CYAN_HUE) <= _A_SIXTH * _tolerance
    return False


def is_blue(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to blue."""
    hue, saturation, value = _get_hsv(color)
    if _is_colorful_enough_to_detect_color(saturation, value):
        return abs(hue - _PURE_BLUE_HUE) <= _A_SIXTH * _tolerance
    return False


def is_magenta(color: wpiutil.Color) -> bool:
    """Returns True if the given color is close to magenta."""
    hue, saturation, value = _get_hsv(color)
    if _is_colorful_enough_to_detect_color(saturation, value):
        return abs(hue - _PURE_MAGENTA_HUE) <= _A_SIXTH * _tolerance
    return False


def get_ANSI(color: wpiutil.Color) -> str:
    """Returns the ANSI prefix to use for the given color."""
    return f'\x1b[38;2;{int(color.red*255)};{int(color.green*255)};{int(color.blue*255)}m'
