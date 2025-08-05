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
from component import Component, PortType, InvalidPortException
import expansion_hub
import wpimath

# TODO(lizlooney): Update port types.

class ExpansionHubMotor(Component):
    def __init__(self, ports : list[tuple[PortType, int]]):
        port_type, hub_number = ports[0]
        if port_type != PortType.USB_PORT:
            raise InvalidPortException
        port_type, motor_number = ports[1]
        if port_type != PortType.USB_PORT:
            raise InvalidPortException
        self.expansion_hub_motor = expansion_hub.ExpansionHubMotor(hub_number, motor_number)

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

    def update(self) -> None:
        pass

    def stop(self) -> None:
        # TODO: Send stop command to motor.
        pass

    def reset(self) -> None:
        pass

    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.USB_PORT, PortType.USB_PORT]

    def periodic(self) -> None:
        pass

    # Alternative constructor to create an instance from a hub number and a motor port.
    @classmethod
    def from_hub_number_and_motor_number(cls: type[Self], hub_number: int, motor_number: int) -> Self:
        return cls([(PortType.USB_PORT, hub_number), (PortType.USB_PORT, motor_number)])

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
