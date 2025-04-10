# @license
# Copyright 2025 Porpoiseful LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# @fileoverview This is a sample for a smart motor
# @author alan@porpoiseful.com (Alan Smith)
from component import Component, PortType, InvalidPortException

class SmartMotor(Component):    
    def __init__(self, ports : list[tuple[PortType, int]]):
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
    def get_version(self) -> tuple[int, int, int]: 
        return (1, 0, 0)
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
        # TODO: send to the hardware the speed of the motor
        pass

    def set_angle_degrees(self, angle: float) -> None:
        '''Set the motor to an angle between 0 and 360'''
        pass
    
    def get_num_relative_encoder_ticks(self) -> int:
        '''Get the number of relative motor ticks since reset of encoder'''
        pass
    
    def get_angle_degrees(self) -> float:
        '''Get the angle position of the motor'''
        pass
    
    def reset_relative_encoder(self) -> None:
        '''Reset the relative encoder value to 0'''
        pass
    