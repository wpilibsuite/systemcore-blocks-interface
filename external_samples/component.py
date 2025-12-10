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

from abc import ABC
from typing import Protocol
from port import Port, PortType

class EmptyCallable(Protocol):
    def __call__(self) -> None:
        pass


class InvalidPortException(Exception):
    pass


# This is an abstract class
class Component(ABC):
    def __init__(self, port : Port, expectedType : PortType):
        """This has the port it is attached to, and the expected type of the port"""
        if port.get_type() != expectedType:
            raise InvalidPortException

        self.port = port

    def opmode_start(self) -> None:
        pass

    def opmode_periodic(self) -> None:
        pass

    # Subclasses should override opmode_end to stop all movement (if any) for the component
    def opmode_end(self) -> None:
        pass

    # Returns the port this connects to of the PortType enumeration
    def get_connection_port_type(self) -> PortType | None:
        if self.port:
            return self.port.get_type()
        return None
