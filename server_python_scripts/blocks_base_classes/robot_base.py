# This is the class all robots derive from

class RobotBase:
    def __init__(self):
        self.hardware = []
    def start(self):
        for hardware in self.hardware:
            hardware.start()
    def update(self):
        for hardware in self.hardware:
            hardware.update()
    def stop(self):
        for hardware in self.hardware:
            hardware.stop()