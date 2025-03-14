from component import Component, PortType, InvalidPortException, EmptyCallable

class RevTouchSensor(Component):
    def __init__(self, ports : list[tuple[PortType, int]]):
        self.is_pressed = None
        portType, port = ports[0]
        if portType != PortType.SMART_IO_PORT:
            raise InvalidPortException
        self.port = port
    # Required methods
    def get_manufacturer(self) -> str:   
        return "REV Robotics" 
    def get_name(self) -> str:  
        return "Touch Sensor"
    def get_part_number(self) -> str:  
        return "REV-31-1425"
    def get_url(self) -> str:  
        return "https://www.revrobotics.com/rev-31-1425/"
    def get_version(self) -> tuple[int, int, str]: 
        return (1, 0, "")
    def stop(self) -> None:
        pass
    def reset(self) -> None:
        self.pressed_callback = None
        self.released_callback = None
        pass
    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.SMART_IO_PORT]
    def periodic(self) -> None:
        old = self.is_pressed
        self._read_hardware()
        if old != self.is_pressed:
            if self.is_pressed and self.pressed_callback:
                self.pressed_callback()
            elif old and self.released_callback:
                self.released_callback()
    def _read_hardware(self):
        # here read hardware to get the current value of the sensor and set self.is_pressed
        pass

    def is_pressed(self) -> bool:
        '''Returns if the touch sensor is pressed or not'''
        return self.is_pressed
    
    # Events
    def register_when_pressed(self, callback: EmptyCallable) -> None:
        '''Event when touch sensor is pressed (after being not pressed)'''
        self.pressed_callback = callback


    def register_when_released(self, callback: EmptyCallable) -> None:
        '''Event when touch sensor is released (after being pressed)'''
        self.released_callback = callback