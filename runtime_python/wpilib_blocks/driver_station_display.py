# This is the class used for displaying data on the driver station.

import wpiutil


def _colorPrefixedLine(color: wpiutil.Color, line: str) -> str:
    if color is None:
        return line
    return (
        f'\x1b[38;2;{int(color.red*255)};{int(color.green*255)};{int(color.blue*255)}m'
        + line)


class DriverStationDisplay:
    @staticmethod
    def addLine(color: wpiutil.Color, line: str) -> None:
        print(_colorPrefixedLine(color, line))

    @staticmethod
    def addData(caption: str, color: wpiutil.Color, line: str) -> None:
        print(f'{caption} : {_colorPrefixedLine(color, line)}')
