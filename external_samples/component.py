from abc import ABC, abstractmethod
from enum import Enum

class PortType(Enum):
    CAN_PORT = 1
    SMART_IO_PORT = 2
    SMART_MOTOR_PORT = 3
    SERVO_PORT = 4
    I2C_PORT = 5
    USB_PORT = 6

# This is an abstract class
class Component:
    # This is the manufacturer of the component
    @abstractmethod
    def get_manufacturer(self) -> str:   
        pass 
    # This is the name of the component
    @abstractmethod
    def get_name(self) -> str:  
        pass
    # This is the part number of the component
    @abstractmethod
    def get_part_number(self) -> str:  
        pass
    # This is the URL of the component
    @abstractmethod
    def get_url(self) -> str:  
        pass
    # This is the version of the software (returned as a (major, minor, revision) tuple where 
    # major and minor are positive integers
    # revision is an optional string
    @abstractmethod
    def get_version(self) -> tuple[int, int, str]: 
        pass
    
    # This stops all movement (if any) for the component
    @abstractmethod
    def stop(self) -> None:
        pass

    # any reset required (if any) at the beginning of each opmode
    # This might remove any registered callbacks
    @abstractmethod
    def reset(self) -> None:
        pass

    # This returns a list (can be empty, one, or multipe) of the ports this connects to
    # of the PortType enumeration
    @abstractmethod
    def get_connection_port_type(self) -> list[PortType]:
        pass

    # This is called periodically when an opmode is running
    @abstractmethod
    def periodic(self) -> None:
        pass