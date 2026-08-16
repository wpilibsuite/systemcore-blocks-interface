import wpilib

JOYSTICK_PORTS = 6

# Figure out how to get Gamepad from https://github.com/wpilibsuite/allwpilib/blob/main/wpilibj/src/main/java/org/wpilib/driverstation/Gamepad.java

class DefaultUserControls:
    def __init__(self):
        self.m_gamepads = [wpilib.Gamepad(i) for i in range(JOYSTICK_PORTS)]
    def get_gamepad(self, port: int) -> wpilib.Gamepad:
        return self.m_gamepads[port]
