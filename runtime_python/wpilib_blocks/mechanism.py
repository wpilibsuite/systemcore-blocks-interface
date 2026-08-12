# This is the class all mechanisms derive from

from typing import Callable

class Mechanism:
    def __init__(self):
        # In self.eventHandlers, the keys are the event names, the values are a list of handlers.
        self.eventHandlers = {}

    def registerEventHandler(self, eventName: str, eventHandler: Callable) -> None:
        if eventName in self.eventHandlers:
            self.eventHandlers[eventName].append(eventHandler)
        else:
            self.eventHandlers[eventName] = [eventHandler]

    def unregisterEventHandler(self, eventName: str, eventHandler: Callable) -> None:
        if eventName in self.eventHandlers:
            if eventHandler in self.eventHandlers[eventName]:
                self.eventHandlers[eventName].remove(eventHandler)
                if not self.eventHandlers[eventName]:
                    del self.eventHandlers[eventName]

    def fireEvent(self, eventName: str, *args) -> None:
        if eventName in self.eventHandlers:
            for eventHandler in self.eventHandlers[eventName]:
                eventHandler(*args)

    def opmodeStart(self) -> None:
        pass

    def opmodePeriodic(self) -> None:
        pass

    def opmodeEnd(self) -> None:
        pass
