# Copyright (c) FIRST and other WPILib contributors.

"""The RobotPy modules that are built in to Blocks.

Libraries that are generated from other modules, like the REV Robotics example in
example_libraries/rev_robotics, give a JsonGenerator for these modules to their JsonGenerator, so that the
names of classes from these modules are the same as in robotpy_data.json.
"""

# robotpy
import ntcore
import telemetry
import tunables
import wpilib
import wpilib.simulation
import wpimath
import wpimath.units
import wpinet
import wpiutil

# Local modules
import python_util


def getRobotPyModules() -> list:
  return [
    ntcore,
    telemetry,
    tunables,
    wpilib,
    wpilib.simulation,
    python_util.getModule('wpilib.sysid'),
    wpimath,
    wpimath.units,
    wpinet,
    wpiutil,
  ]
