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

# @fileoverview This is a class to handle port types
# @author alan@porpoiseful.com (Alan Smith)
from enum import Enum
from typing import Self

class PortType(Enum):
    CAN_PORT = 1
    SMART_IO_PORT = 2
    SMART_MOTOR_PORT = 3
    SERVO_PORT = 4
    I2C_PORT = 5
    USB_PORT = 6
    EXPANSION_HUB_MOTOR_PORT = 7
    EXPANSION_HUB_SERVO_PORT = 8

    BASE_COMPOUND = 256
    USB_HUB = BASE_COMPOUND + 1
    EXPANSION_HUB_MOTOR = BASE_COMPOUND + 2
    EXPANSION_HUB_SERVO = BASE_COMPOUND + 3
    
class Port:
    def __init__(self, port_type : PortType = None, location : int = None, port1 : type[Self] = None, port2 : type[Self] = None):
        """
        Create a port that can be either simple (type + location) or compound (two other ports).
        
        Args:
            port_type: PortType or CompoundPortType for this port
            location: int location for simple ports
            port1: First Port for compound ports
            port2: Second Port for compound ports
        """
        if port1 is not None and port2 is not None:
            # Compound port
            if port_type < PortType.BASE_COMPOUND:
                raise ValueError("Port must be of a compound type")
            self.is_compound = True
            self.type = port_type
            self.port1 = port1
            self.port2 = port2
            self.location = None
        elif port_type is not None and location is not None:
            # Simple port
            if port_type > PortType.BASE_COMPOUND:
                raise ValueError("Port must be of a simple type")            
            self.is_compound = False
            self.type = port_type
            self.location = location
            self.port1 = None
            self.port2 = None
        else:
            raise ValueError("Port must be either simple (type + location) or compound (port1 + port2)")
    
    def get_all_ports(self):
        """Return a list of all simple ports contained in this port."""
        if self.is_compound:
            return self.port1.get_all_ports() + self.port2.get_all_ports()
        else:
            return [(self.type, self.location)]
    

    def get_type(self):
        """This returns the type if it is simple or the type of the last one in the chain if compound"""
        if self.is_compound:
            return self.port2.get_type()
        else:
            return self.type           

    def __str__(self):
        if self.is_compound:
            return f"CompoundPort({self.type}: {self.port1}, {self.port2})"
        else:
            return f"Port({self.type}, {self.location})"