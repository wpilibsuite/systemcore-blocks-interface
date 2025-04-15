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

# @fileoverview This is an abstract class for all components
# @author alan@porpoiseful.com (Alan Smith)

from abc import ABC, abstractmethod
from enum import Enum
from typing import Protocol

class EmptyCallable(Protocol):
    def __call__(self) -> None:
        pass
class PortType(Enum):
    CAN_PORT = 1
    SMART_IO_PORT = 2
    SMART_MOTOR_PORT = 3
    SERVO_PORT = 4
    I2C_PORT = 5
    USB_PORT = 6

class InvalidPortException(Exception):
    pass

# This is an abstract class
class Component(ABC):
    @abstractmethod
    def __init__(self, ports : list[tuple[PortType, int]]):
        pass
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
    # This is the version of the software (returned as a (major, minor, patch) tuple where 
    # major, minor and patch are all positive integers
    # This MUST follow semantic versioning as described here: https://semver.org/
    @abstractmethod
    def get_version(self) -> tuple[int, int, int]: 
        pass
    
    # This stops all movement (if any) for the component
    @abstractmethod
    def stop(self) -> None:
        pass

    # This performs any reset required (if any) at the beginning of each opmode
    # This might remove any registered callbacks
    @abstractmethod
    def reset(self) -> None:
        pass

    # This returns a list (can be empty, one, or multiple) of the ports this connects to
    # of the PortType enumeration
    @abstractmethod
    def get_connection_port_type(self) -> list[PortType]:
        pass

    # This is called periodically when an opmode is running.   The component might use this
    # to talk to hardware and then call callbacks
    @abstractmethod
    def periodic(self) -> None:
        pass
