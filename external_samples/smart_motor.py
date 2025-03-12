from component import Component, PortType, InvalidPortException

class SmartMotor(Component):    
    # Required methods
    def __init__(self, ports : list[tuple[PortType, int]]):
        self.is_pressed = None
        portType, port = ports[0]
        if portType != PortType.SMART_MOTOR_PORT:
            raise InvalidPortException
        self.port = port
    def get_manufacturer(self) -> str:   
        return "REV Robotics" 
    def get_name(self) -> str:  
        return "DC Motor"
    def get_part_number(self) -> str:  
        return "REV-xx-xxxx"
    def get_url(self) -> str:  
        return "https://www.revrobotics.com/rev-xx-xxxx"
    def get_version(self) -> tuple[int, int, str]: 
        return (1, 0, "")
    def stop(self) -> None:
        # send stop command to motor
        pass
    def reset(self) -> None:
        pass
    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.SMART_MOTOR_PORT]
    def periodic(self) -> None:
        pass

    # Component specific methods
    def set_speed(self, speed: float) -> None:
        '''Set the motor to a speed between -1 and 1'''
        # sends to the hardware the speed of the motor

    def set_angle_degrees(self, angle: float) -> None:
        '''Set the motor to an angle between 0 and 270'''
        self.set_position(angle / 270.0)
    
    def get_num_relative_encoder_ticks(self) -> int:
        '''Get the number of relative motor ticks since reset of encoder'''
        pass
    
    def get_angle_degrees(self) -> float:
        '''Get the angle position of the motor'''
        pass
    
    def reset_relative_encoder(self) -> None:
        '''Reset the relative encoder value to 0'''
        pass
    