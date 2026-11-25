# Copyright (c) FIRST and other WPILib contributors.

# This is the class all mechanisms derive from

class Mechanism:
    def __init__(self):
        pass

    def opmode_start(self) -> None:
        pass

    def opmode_periodic(self) -> None:
        pass

    def opmode_end(self) -> None:
        pass
