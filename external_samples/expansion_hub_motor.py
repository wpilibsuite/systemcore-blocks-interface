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

"""This is the expansion_hub_motor module.

This component wraps the expansion_hub.ExpansionHubMotor class, providing
support for a motor connected to a REV Expansion Hub.
"""

__author__ = "lizlooney@google.com (Liz Looney)"

from typing import Self
from component import Component, InvalidPortException
from port import Port, PortType
import expansion_hub
import wpimath

class ExpansionHubMotor(Component):
    def __init__(self, port : Port):
        super.__init___(port, PortType.EXPANSION_HUB_MOTOR)
        self.expansion_hub_motor = expansion_hub.ExpansionHubMotor(self.port.port1.location, self.port.port2.location)

    def get_manufacturer(self) -> str:
        return "REV Robotics"

    def get_name(self) -> str:
        return "Expansion Hub Motor"

    def get_part_number(self) -> str:
        return ""

    def get_url(self) -> str:
        return ""

    def get_version(self) -> tuple[int, int, int]:
        return (1, 0, 0)

    def start(self) -> None:
        self.expansion_hub_motor.setEnabled(True)

    def stop(self) -> None:
        # TODO: Send stop command to motor.
        pass

    def reset(self) -> None:
        pass

    def periodic(self) -> None:
        pass

    # Component specific methods

    # Methods from expansion_hub.ExpansionHubMotor

    def setPercentagePower(self, power: float):
        self.expansion_hub_motor.setPercentagePower(power)

    def setVoltage(self, voltage: wpimath.units.volts):
        self.expansion_hub_motor.setVoltage(voltage)

    def setPositionSetpoint(self, setpoint: float):
        self.expansion_hub_motor.setPositionSetpoint(setpoint)

    def setVelocitySetpoint(self, setpoint: float):
        self.expansion_hub_motor.setVelocitySetpoint(setpoint)

    def setEnabled(self, enabled: bool):
        self.expansion_hub_motor.setEnabled(enabled)

    def setFloatOn0(self, floatOn0: bool):
        self.expansion_hub_motor.setFloatOn0(floatOn0)

    def getCurrent(self) -> float:
        return self.expansion_hub_motor.getCurrent()

    def setDistancePerCount(self, perCount: float):
        self.expansion_hub_motor.setDistancePerCount(perCount)

    def isHubConnected(self) -> bool:
        return self.expansion_hub_motor.isHubConnected()

    def getEncoder(self) -> float:
        return self.expansion_hub_motor.getEncoder()

    def getEncoderVelocity(self) -> float:
        return self.expansion_hub_motor.getEncoderVelocity()

    def setReversed(self, reversed: bool):
        self.expansion_hub_motor.setReversed(reversed)

    def resetEncoder(self):
        self.expansion_hub_motor.resetEncoder()

    def getVelocityPidConstants(self) -> expansion_hub.ExpansionHubPidConstants:
        return self.expansion_hub_motor.getVelocityPidConstants()

    def getPositionPidConstants(self) -> expansion_hub.ExpansionHubPidConstants:
        return self.expansion_hub_motor.getPositionPidConstants()
