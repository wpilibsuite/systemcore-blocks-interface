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
from abc import ABC, abstractmethod
from enum import Enum
from typing import Self

_base_compound = 256

class PortType(Enum):
    # Ports on the SystemCore.
    CAN_PORT = 1
    SMART_IO_PORT = 2
    I2C_PORT = 3
    USB_PORT = 4

    # Ports on other devices.
    SMART_MOTOR_PORT = 5  # A motor port on MotionCore.
    USB_HUB_PORT = 6  # A port on a usb hub.
    EXPANSION_HUB_MOTOR_PORT = 7  # A motor port on an expansion hub.
    EXPANSION_HUB_SERVO_PORT = 8  # A servo port on an expansion hub.

    # Compound ports
    USB_HUB = _base_compound + 1  # A compound port with USB_PORT and USB_HUB_PORT.
    EXPANSION_HUB_MOTOR = _base_compound + 2  # A compound port with USB_PORT and EXPANSION_HUB_MOTOR_PORT.
    EXPANSION_HUB_SERVO = _base_compound + 3  # A compound port with USB_PORT and EXPANSION_HUB_SERVO_PORT.

class Port(ABC):
    """Abstract base class for all port types."""
    
    def __init__(self, port_type: PortType):
        self.type = port_type
    
    @abstractmethod
    def get_all_ports(self) -> list[tuple[PortType, int]]:
        """Return a list of all simple ports contained in this port."""
        pass
    
    def get_type(self) -> PortType:
        """Returns the port type"""
        return self.type

class SimplePort(Port):
    def __init__(self, port_type: PortType, location: int):
        """
        Create a simple port with a type and location.

        Args:
            port_type: PortType for this port (must be a simple type)
            location: int location for this port
        """
        if port_type.value >= _base_compound:
            raise ValueError("Port must be of a simple type")
        super().__init__(port_type)
        self.location = location

    def get_all_ports(self) -> list[tuple[PortType, int]]:
        """Return a list containing this simple port."""
        return [(self.type, self.location)]

    def __str__(self) -> str:
        return f"SimplePort({self.type}, {self.location})"

class CompoundPort(Port):
    def __init__(self, port_type: PortType, port1: Port, port2: Port):
        """
        Create a compound port from two other ports.

        Args:
            port_type: PortType for this port (must be a compound type)
            port1: First Port for compound ports
            port2: Second Port for compound ports
        """
        if port_type.value < _base_compound:
            raise ValueError("Port must be of a compound type")
        super().__init__(port_type)
        self.port1 = port1
        self.port2 = port2

    def get_all_ports(self) -> list[tuple[PortType, int]]:
        """Return a list of all simple ports contained in this compound port."""
        return self.port1.get_all_ports() + self.port2.get_all_ports()

    def __str__(self) -> str:
        return f"CompoundPort({self.type}: {self.port1}, {self.port2})"
