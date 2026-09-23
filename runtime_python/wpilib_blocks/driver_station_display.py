# This is the class used for displaying data on the driver station.

import wpilib
import wpiutil
from . import color as color_utils


def _colorPrefixedLine(color: wpiutil.Color, line: str) -> str:
    if color is None:
        return line
    return color_utils.get_ansi(color) + line


class DriverStationDisplay:
    @staticmethod
    def add_line(color: wpiutil.Color, line: str) -> None:
        wpilib.DriverStationDisplay.add_line(_colorPrefixedLine(color, line))

    @staticmethod
    def add_data(caption: str, color: wpiutil.Color, line: str) -> None:
        wpilib.DriverStationDisplay.add_data(
            caption, _colorPrefixedLine(color, line))
