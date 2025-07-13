# This is the class all mechanisms derive from

class Mechanism:
    def __init__(self):
        self.hardware = []
    def start(self) -> None:
        for hardware in self.hardware:
            hardware.start()
    def update(self) -> None:
        for hardware in self.hardware:
            hardware.update()
    def stop(self) -> None:
        for hardware in self.hardware:
            hardware.stop()
