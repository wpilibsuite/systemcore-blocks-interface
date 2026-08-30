# This is the class used for displaying data on the driver station.

import wpiutil
from . import color as color_utils


def _colorPrefixedLine(color: wpiutil.Color, line: str) -> str:
    if color is None:
        return line
    return color_utils.get_ANSI(color) + line


class DriverStationDisplay:
    @staticmethod
    def addLine(color: wpiutil.Color, line: str) -> None:
        print(_colorPrefixedLine(color, line))

    @staticmethod
    def addData(caption: str, color: wpiutil.Color, line: str) -> None:
        print(f'{caption} : {_colorPrefixedLine(color, line)}')
