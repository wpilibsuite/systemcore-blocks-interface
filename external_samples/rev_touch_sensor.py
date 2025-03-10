from component import Component, PortType
from _collections_abc import Callable

class RevTouchSensor(Component):
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
        pass
    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.SMART_IO_PORT]
    def periodic(self) -> None:
        # This would poll the hardware and see if it needs to fire any events
        pass

    # Methods
    def is_pressed(self) -> bool:
        # Code to communicate using WPILib would go here
        return True
    
    # Events
    def register_when_pressed(callback: Callable[[], None]) -> None:
        # Code to register callback here
        pass

    def register_when_released(callback: Callable[[], None]) -> None:
        # Code to register callback here
        pass