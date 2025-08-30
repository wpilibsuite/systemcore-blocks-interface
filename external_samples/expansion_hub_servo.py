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
from port import Port, PortType
import expansion_hub

class ExpansionHubServo(Component):
    def __init__(self, port : Port):
        super.__init___(port, PortType.EXPANSION_HUB_SERVO)
        self.expansion_hub_servo = expansion_hub.ExpansionHubServo(self.port.port1.location, self.port.port2.location)

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
