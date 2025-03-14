from component import Component, PortType, InvalidPortException
from enum import Enum
import wpilib

class SparkFunLEDStick(Component):    
    def __init__(self, ports : list[tuple[PortType, int]]):
        portType, port = ports[0]
        if portType != PortType.I2C_PORT:
            raise InvalidPortException
        self.port = port

    # Component methods

    def get_manufacturer(self) -> str:   
        return "SparkFun" 

    def get_name(self) -> str:  
        return "SparkFun Qwiic LED Strip"

    def get_part_number(self) -> str:  
        return "COM-18354"

    def get_url(self) -> str:  
        return "https://www.sparkfun.com/sparkfun-qwiic-led-stick-apa102c.html"

    def get_version(self) -> tuple[int, int, str]: 
        return (1, 0, "")

    def stop(self) -> None:
        self.turn_all_off()

    def reset(self) -> None:
        pass

    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.I2C_PORT]

    def periodic(self) -> None:
        pass

    # SparkFunLEDStick methods

    def set_color(self, position: int, color: wpilib.Color) -> None:
        '''Change the color of an individual LED.'''
        pass # TODO: implement

    def set_color(self, color: wpilib.Color) -> None:
        '''Change the color of all LEDs to a single color.'''
        pass # TODO: implement

    def set_colors(self, colors: list[int]) -> None:
        '''Change the color of all LEDs using a list.'''
        pass # TODO: implement

    def set_brightness(self, position: int, brightness: int) -> None:
        '''Set the brightness of an individual LED.'''
        pass # TODO: implement

    def set_brightness(self, brightness: int) -> None:
        '''Set the brightness of all LEDs.'''
        pass # TODO: implement

    def turn_all_off(self) -> None:
        '''Turn all LEDs off.'''
        pass # TODO: implement
