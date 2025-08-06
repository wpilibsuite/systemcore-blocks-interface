# Copyright 2025 Google LLC
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

"""This is the expansion_hub_servo module.

This component wraps the expansion_hub.ExpansionHubServo class, providing
support for a servo connected to a REV Expansion Hub.
"""

__author__ = "lizlooney@google.com (Liz Looney)"

from typing import Self
from component import Component, PortType, InvalidPortException
import expansion_hub

# TODO(lizlooney): Update port types.

class ExpansionHubServo(Component):
    def __init__(self, ports : list[tuple[PortType, int]]):
        port_type, hub_number = ports[0]
        if port_type != PortType.USB_PORT:
            raise InvalidPortException
        port_type, servo_number = ports[1]
        if port_type != PortType.USB_PORT:
            raise InvalidPortException
        self.expansion_hub_servo = expansion_hub.ExpansionHubServo(hub_number, servo_number)

    def get_manufacturer(self) -> str:
        return "REV Robotics"

    def get_name(self) -> str:
        return "Expansion Hub Servo"

    def get_part_number(self) -> str:
        return ""

    def get_url(self) -> str:
        return ""

    def get_version(self) -> tuple[int, int, int]:
        return (1, 0, 0)

    def start(self) -> None:
        self.expansion_hub_servo.setEnabled(True)
        pass

    def stop(self) -> None:
        # TODO: Send stop command to servo.
        pass

    def reset(self) -> None:
        pass

    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.USB_PORT, PortType.USB_PORT]

    def periodic(self) -> None:
        pass

    # Alternative constructor to create an instance from a hub number and a servo port.
    @classmethod
    def from_hub_number_and_servo_number(cls: type[Self], hub_number: int, servo_number: int) -> Self:
        return cls([(PortType.USB_PORT, hub_number), (PortType.USB_PORT, servo_number)])
    
    # Component specific methods

    # Methods from expansion_hub.ExpansionHubServo

    def set(self, value: float):
        self.expansion_hub_servo.set(value)

    def setAngle(self, degrees: float):
        self.expansion_hub_servo.setAngle(degrees)

    def setEnabled(self, enabled: bool):
        self.expansion_hub_servo.setEnabled(enabled)

    def isHubConnected(self) -> bool:
        return self.expansion_hub_servo.isHubConnected()

    def setFramePeriod(self, framePeriod: int):
        self.expansion_hub_servo.setFramePeriod(framePeriod)

    def setPulseWidth(self, pulseWidth: int):
        self.expansion_hub_servo.setPulseWidth(pulseWidth)
