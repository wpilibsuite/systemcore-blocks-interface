# This is the class all OpModes derive from.

import wpilib


class Display:
    def addLine(self, line: str) -> None:
        print(line)

    def addData(self, caption: str, line: str) -> None:
        print(f'{caption} : {line}')


class OpMode(wpilib.PeriodicOpMode):
    def __init__(self):
        super().__init__()
        self.display = Display()
