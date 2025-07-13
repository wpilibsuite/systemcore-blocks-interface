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

"""This is the spark_mini module.

This component wraps the RobotPy SparkMini, providing support for the REV
Robotics SPARKMini Motor Controller with PWM control.
"""

__author__ = "lizlooney@google.com (Liz Looney)"

from typing import Self
from component import Component, PortType, InvalidPortException
import wpilib
import wpimath
import wpiutil

class SparkMiniComponent(Component):
    def __init__(self, ports : list[tuple[PortType, int]]):
        portType, port = ports[0]
        if portType != PortType.SMART_MOTOR_PORT:
            raise InvalidPortException
        # TODO(lizlooney): When we upgrade to 2027 robotpy, change PWMSparkMax to SparkMini.
        self.spark_mini = wpilib.PWMSparkMax(port) # wpilib.SparkMini(port)

    def get_manufacturer(self) -> str:
        return "REV Robotics"

    def get_name(self) -> str:
        return "SPARKMini Motor Controller"

    def get_part_number(self) -> str:
        return "REV-31-1230"

    def get_url(self) -> str:
        return "https://www.revrobotics.com/rev-31-1230"

    def get_version(self) -> tuple[int, int, int]:
        return (1, 0, 0)

    def stop(self) -> None:
        # send stop command to motor
        pass

    def reset(self) -> None:
        pass

    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.SMART_MOTOR_PORT]

    def periodic(self) -> None:
        pass

    # Alternative constructor to create an instance from a smart motor port
    @classmethod
    def from_smart_motor_port(cls: type[Self], smart_motor_port: int) -> Self:
        return cls([(PortType.SMART_MOTOR_PORT, smart_motor_port)])
    
    # Component specific methods

    # Methods from wpilib.PWMMotorController

    def add_follower(self, follower: wpilib.PWMMotorController) -> None:
        '''Make the given PWM motor controller follow the output of this one.\n\n:param follower: The motor controller follower.'''
        self.spark_mini.addFollower(follower)

    def disable(self) -> None:
        self.spark_mini.disable()
    
    def enable_deadband_elimination(self, eliminateDeadband: bool) -> None:
        '''Optionally eliminate the deadband from a motor controller.\n\n:param eliminateDeadband: If true, set the motor curve on the motor\n                          controller to eliminate the deadband in the middle\n                          of the range. Otherwise, keep the full range\n                          without modifying any values.'''
        self.spark_mini.enableDeadbandElimination(eliminateDeadband)
    
    def get(self) -> float:
        '''Get the recently set value of the PWM. This value is affected by the\ninversion property. If you want the value that is sent directly to the\nMotorController, use PWM::GetSpeed() instead.\n\n:returns: The most recently set value for the PWM between -1.0 and 1.0.'''
        return self.spark_mini.get()

    def get_channel(self) -> int:
        return self.spark_mini.getChannel()
    
    def get_description(self) -> str:
        return self.spark_mini.getDescription()
    
    def get_inverted(self) -> bool:
        return self.spark_mini.getInverted()
    
    def get_voltage(self) -> wpimath.units.volts:
        '''Gets the voltage output of the motor controller, nominally between -12 V\nand 12 V.\n\n:returns: The voltage of the motor controller, nominally between -12 V and 12\n          V.'''
        return self.spark_mini.getVoltage()
    
    def set(self, value: float) -> None:
        '''Set the PWM value.\n\nThe PWM value is set using a range of -1.0 to 1.0, appropriately scaling\nthe value for the FPGA.\n\n:param value: The speed value between -1.0 and 1.0 to set.'''
        self.spark_mini.set(value)
    
    def set_inverted(self, isInverted: bool) -> None:
        self.spark_mini.setInverted(isInverted)
    
    def set_voltage(self, output: wpimath.units.volts) -> None:
        '''Sets the voltage output of the PWMMotorController. Compensates for\nthe current bus voltage to ensure that the desired voltage is output even\nif the battery voltage is below 12V - highly useful when the voltage\noutputs are "meaningful" (e.g. they come from a feedforward calculation).\n\nNOTE: This function *must* be called regularly in order for voltage\ncompensation to work properly - unlike the ordinary set function, it is not\n"set it and forget it."\n\n:param output: The voltage to output.'''
        self.spark_mini.setVoltage(output)
    
    def stop_motor(self) -> None:
        self.spark_mini.stopMotor()
    
    # Methods from wpilib.MotorSafety
    
    def check(self) -> None:
        '''Check if this motor has exceeded its timeout.\n\nThis method is called periodically to determine if this motor has exceeded\nits timeout value. If it has, the stop method is called, and the motor is\nshut down until its value is updated again.'''
        self.spark_mini.check(follower)

    # TODO(lizlooney): Decide whether we should expose checkMotors. It seems
    # like it isn't intended to be called by users.
    def check_motors() -> None:
        '''Check the motors to see if any have timed out.\n\nThis static method is called periodically to poll all the motors and stop\nany that have timed out.'''
        wpilib.SparkMini.checkMotors()

    def feed(self) -> None:
        '''Feed the motor safety object.\n\nResets the timer on this object that is used to do the timeouts.'''
        self.spark_mini.feed()
    
    def get_expiration(self) -> wpimath.units.seconds:
        '''Retrieve the timeout value for the corresponding motor safety object.\n\n:returns: the timeout value.'''
        return self.spark_mini.getExpiration()

    def is_alive(self) -> bool:
        '''Determine if the motor is still operating or has timed out.\n\n:returns: true if the motor is still operating normally and hasn't timed out.'''
        return self.spark_mini.isAlive()
    
    def is_safety_enabled(self) -> bool:
        '''Return the state of the motor safety enabled flag.\n\nReturn if the motor safety is currently enabled for this device.\n\n:returns: True if motor safety is enforced for this device.'''
        return self.spark_mini.isSafetyEnabled()
    
    def set_expiration(self, expirationTime: wpimath.units.seconds) -> None:
        '''Set the expiration time for the corresponding motor safety object.\n\n:param expirationTime: The timeout value.'''
        self.spark_mini.setExpiration(expirationTime)
    
    def set_safety_enabled(self, enabled: bool) -> None:
        '''Enable/disable motor safety for this device.\n\nTurn on and off the motor safety option for this PWM object.\n\n:param enabled: True if motor safety is enforced for this object.'''
        self.spark_mini.setSafetyEnabled(enabled)
    
    # Methods from wpiutil.Sendable
    
    def init_sendable(self, builder: wpiutil.SendableBuilder) -> None:
        '''Initializes this Sendable object.\n\n:param builder: sendable builder'''
        self.spark_mini.initSendable(builder)
