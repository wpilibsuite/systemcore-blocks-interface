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

from component import Component
from port import Port, PortType
from wpilib_placeholders import expansion_hub
import wpimath

class ExpansionHubServo(Component):
    def __init__(self, port : Port):
        '''REV Robotics Expansion Hub Servo'''
        super().__init__(port, PortType.EXPANSION_HUB_SERVO)
        self.expansion_hub_servo = expansion_hub.ExpansionHubServo(self.port.port1.location, self.port.port2.location)

    def opmode_start(self) -> None:
        self.expansion_hub_servo.setEnabled(True)

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

    def setFramePeriod(self, framePeriod: wpimath.units.microseconds):
        self.expansion_hub_servo.setFramePeriod(framePeriod)

    def setPulseWidth(self, pulseWidth: int):
        self.expansion_hub_servo.setPulseWidth(pulseWidth)
