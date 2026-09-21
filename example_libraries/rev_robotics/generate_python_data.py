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

"""Generates components/ and python_data/ for the REV Robotics library from robotpy-rev.

See README.md for directions on running it.

Only the classes and enums that the library uses are written: the components below, the modules
and classes in shownCategories in python_toolbox.json, and the classes and enums that those refer
to. The rest are listed in a warning, unless they are in ignore in python_toolbox.json.
--add_unused_to_ignore adds them to ignore instead.
"""

# Python Standard Library
import argparse
import os
import sys

# robotpy
import rev

EXAMPLE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.join(EXAMPLE_DIR, '..', '..')
sys.path.append(os.path.join(REPO_DIR, 'python_tools'))

# python_tools modules
import component
import json_util
import robotpy_modules


COMPONENTS = {
  'rev.A301': component.Component('rev.A301',
    # As of September 2026, we only use the constructor that has just the can_port argument.
    # If A301 becomes legal for FRC (in the future), we'll need to support the constructor
    # that has both the can port and the device id.
    expected_constructor_arg_names=[
      'can_port',
    ],
    component_args=[
      json_util.createArgData('can_port', 'SYSTEMCORE_CAN_PORT')
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get_absolute_encoder_position',
      'get_encoder_velocity',
      'get_relative_encoder_position',
      'get_throttle',
      'set_absolute_position',
      'set_inverted',
      'set_relative_encoder_position',
      'set_relative_position',
      'set_throttle',
      'set_velocity',
    ],
  ),
  'rev.ColorSensorV3': component.Component('rev.ColorSensorV3',
    expected_constructor_arg_names=[
      'port',
    ],
    component_args=[
      json_util.createArgData('i2c_port', 'SYSTEMCORE_I2C_PORT')
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get_color',
      'get_proximity',
      'get_raw_color',
      'is_connected',
    ],
  ),
}


def main():
  parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
  parser.add_argument('--add_unused_to_ignore', action='store_true',
      help='Add the classes and enums that are not generated, because the library does not use '
      'them, to ignore in python_toolbox.json, instead of warning about them.')
  args = parser.parse_args()

  # The generator for the built-in modules gives the rev generator the names of their classes.
  json_generator_robotpy = json_util.JsonGenerator(robotpy_modules.getRobotPyModules())
  json_generator_rev = json_util.JsonGenerator([rev], [json_generator_robotpy], COMPONENTS)
  json_generator_rev.writeBlocksLibFiles(EXAMPLE_DIR, args.add_unused_to_ignore)


if __name__ == '__main__':
  main()
