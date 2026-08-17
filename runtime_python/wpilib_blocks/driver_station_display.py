# This is the class used for displaying data on the driver station.

class DriverStationDisplay:
    @staticmethod
    def addLine(line: str) -> None:
        print(line)

    @staticmethod
    def addData(caption: str, line: str) -> None:
        print(f'{caption} : {line}')
