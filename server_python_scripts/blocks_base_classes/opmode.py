# This is the base class that all OpModes derive from
class OpMode:
    def __init__(self, robot):
        self.robot = robot
    def start(self):
        self.robot.start()
    def loop(self):
        self.robot.update()
    def stop(self):
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