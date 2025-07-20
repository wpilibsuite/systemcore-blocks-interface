# This is the class all robots derive from

from typing import Callable

class RobotBase:
    def __init__(self):
        self.hardware = []
        self.events = {}
    def register_event(self, event_name: str, func: Callable) -> None:
        self.events[event_name] = func
    def unregister_event(self, event_name: str) -> None:
        del self.events[event_name]
    def start(self) -> None:
        for hardware in self.hardware:
            hardware.start()
    def update(self) -> None:
        for hardware in self.hardware:
            hardware.update()
    def stop(self) -> None:
        for hardware in self.hardware:
            hardware.stop()
