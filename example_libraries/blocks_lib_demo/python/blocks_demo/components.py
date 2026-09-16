# Components that are described by components/*.json.

import wpilib


class LimitSwitch:
    """A limit switch plugged into a Smart IO port."""

    def __init__(self, channel: int, pressed_is_high: bool = True):
        self._input = wpilib.DigitalInput(channel)
        self._pressed_is_high = pressed_is_high

    def is_pressed(self) -> bool:
        """Returns True if the limit switch is pressed."""
        return self._input.get() == self._pressed_is_high


class Gripper:
    """A gripper that is opened and closed by a servo plugged into an Expansion Hub."""

    def __init__(self, usb_id: int, channel: int,
                 open_position: float = 0.0, closed_position: float = 1.0):
        self._servo = wpilib.ExpansionHubServo(usb_id, channel)
        self._servo.set_enabled(True)
        self._open_position = open_position
        self._closed_position = closed_position
        self._is_open = False

    def open(self) -> None:
        """Opens the gripper."""
        self._servo.set_position(self._open_position)
        self._is_open = True

    def close(self) -> None:
        """Closes the gripper."""
        self._servo.set_position(self._closed_position)
        self._is_open = False

    def is_open(self) -> bool:
        """Returns True if the gripper was last opened."""
        return self._is_open
