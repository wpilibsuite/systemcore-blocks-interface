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

# @fileoverview This is a sample for a servo
# @author alan@porpoiseful.com (Alan Smith)

from component import Component, PortType, InvalidPortException

class Servo(Component):    
    def __init__(self, ports : list[tuple[PortType, int]]):
        portType, port = ports[0]
        if portType != PortType.SERVO_PORT:
            raise InvalidPortException
        self.port = port
    def get_manufacturer(self) -> str:   
        return "REV Robotics" 
    def get_name(self) -> str:  
        return "SRS Servo"
    def get_part_number(self) -> str:  
        return "REV-41-1097"
    def get_url(self) -> str:  
        return "https://www.revrobotics.com/rev-41-1097/"
    def get_version(self) -> tuple[int, int, int]: 
        return (1, 0, 0)
    def stop(self) -> None:
        # De-energize servo port
        pass
    def reset(self) -> None:
        pass
    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.SERVO_PORT]
    def periodic(self) -> None:
        pass

    # Component specific methods
    def set_position(self, pos: float) -> None:
        '''Set the servo to a position between 0 and 1'''
        # sends to the hardware the position of the servo
        pass
    def set_angle_degrees(self, angle: float) -> None:
        '''Set the servo to an angle between 0 and 270'''
        self.set_position(angle / 270.0)
    
    
    