# Components that are described by components/*.json.

import wpilib


class BeamBreak:
    """A beam break sensor plugged into a Smart IO port."""

    def __init__(self, channel: int):
        self._input = wpilib.DigitalInput(channel)

    def is_broken(self) -> bool:
        """Returns True if something is blocking the beam."""
        # The receiver output is high while it can see the beam.
        return not self._input.get()


class Bumper:
    """A bumper switch plugged into a Smart IO port."""

    def __init__(self, channel: int):
        self._input = wpilib.DigitalInput(channel)

    def is_pressed(self) -> bool:
        """Returns True if the bumper is pressed."""
        return not self._input.get()


class UltrasonicSensor:
    """An analog ultrasonic distance sensor plugged into a Smart IO port."""

    def __init__(self, channel: int, inches_per_volt: float = 40.0):
        self._input = wpilib.AnalogInput(channel)
        self._inches_per_volt = inches_per_volt

    def get_distance_inches(self) -> float:
        """Returns the distance to the nearest object, in inches."""
        return self._input.get_voltage() * self._inches_per_volt

    def is_closer_than(self, inches: float) -> bool:
        """Returns True if the nearest object is closer than the given distance."""
        return self.get_distance_inches() < inches
