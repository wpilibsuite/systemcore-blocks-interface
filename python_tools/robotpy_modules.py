# Copyright 2026 Porpoiseful LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""The RobotPy modules that are built in to Blocks.

Libraries that are generated from other modules, like the REV Robotics example in
examples/rev_robotics, give a JsonGenerator for these modules to their JsonGenerator, so that the
names of classes from these modules are the same as in robotpy_data.json.
"""

# robotpy
import ntcore
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
    wpilib,
    wpilib.simulation,
    python_util.getModule('wpilib.sysid'),
    wpimath,
    wpimath.units,
    wpinet,
    wpiutil,
  ]
