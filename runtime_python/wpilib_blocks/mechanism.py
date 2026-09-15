# This is the class all mechanisms derive from

from typing import Callable

class Mechanism:
    def __init__(self):
        # In self.event_handlers, the keys are the event names, the values are a list of handlers.
        self.event_handlers = {}

    def register_event_handler(self, event_name: str, event_handler: Callable) -> None:
        if event_name in self.event_handlers:
            self.event_handlers[event_name].append(event_handler)
        else:
            self.event_handlers[event_name] = [event_handler]

    def unregister_event_handler(self, event_name: str, event_handler: Callable) -> None:
        if event_name in self.event_handlers:
            if event_handler in self.event_handlers[event_name]:
                self.event_handlers[event_name].remove(event_handler)
                if not self.event_handlers[event_name]:
                    del self.event_handlers[event_name]

    def fire_event(self, event_name: str, *args) -> None:
        if event_name in self.event_handlers:
            for event_handler in self.event_handlers[event_name]:
                event_handler(*args)

    def opmode_start(self) -> None:
        pass

    def opmode_periodic(self) -> None:
        pass

    def opmode_end(self) -> None:
        pass
