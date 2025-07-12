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