from .robot_base import RobotBase

# This is the base class that all OpModes derive from
class OpMode:
    def __init__(self, robot: RobotBase):
        self.robot = robot
    def start(self) -> None:
        self.robot.start()
    def loop(self) -> None:
        # Call steps method if it exists in the derived class
        if hasattr(self, 'steps') and callable(self.steps):
            self.steps()
        self.robot.update()
    def stop(self) -> None:
        self.robot.stop()

# For now this does nothing but it lets the decorator work
def Teleop(OpMode):
    return OpMode

def Auto(OpMode):
    return OpMode

def Test(OpMode):
    return OpMode

def Name(OpMode, str):
    return OpMode

def Group(OpMode, str):
    return OpMode
