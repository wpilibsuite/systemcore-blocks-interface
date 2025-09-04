# Copyright 2025 Google LLC
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

__author__ = "lizlooney@google.com (Liz Looney)"

# Python Standard Library
import pathlib
import sys

# absl
from absl import app
from absl import flags
from absl import logging

# robotpy
import ntcore
import pyfrc
import wpilib
import wpilib.counter
import wpilib.drive
import wpilib.event
import wpilib.interfaces
import wpilib.simulation
import wpimath
import wpimath.controller
import wpimath.estimator
import wpimath.filter
import wpimath.geometry
import wpimath.interpolation
import wpimath.kinematics
import wpimath.optimization
import wpimath.path
import wpimath.spline
import wpimath.system
import wpimath.system.plant
import wpimath.trajectory
import wpimath.trajectory.constraint
import wpimath.units
import wpinet
import wpiutil

# Server python scripts
sys.path.append("../server_python_scripts")
import blocks_base_classes
import expansion_hub  # TODO(lizlooney): update this when it is built into robotpy.

# External samples
sys.path.append("../external_samples")
import color_range_sensor
import component
import expansion_hub_motor
import expansion_hub_servo
import port
import rev_touch_sensor
import servo
import smart_motor
import spark_mini
import sparkfun_led_stick

# Local modules
import json_util
import python_util


FLAGS = flags.FLAGS

flags.DEFINE_string('output_directory', None, 'The directory where output should be written.')


def main(argv):
  del argv  # Unused.

  if not FLAGS.output_directory:
    logging.error(f'You must specify the --output_directory argument')
    return

  pathlib.Path(f'{FLAGS.output_directory}/generated/').mkdir(parents=True, exist_ok=True)

  robotpy_modules = [
    expansion_hub,  # TODO(lizlooney): update this when it is built into robotpy.
    ntcore,
    wpilib,
    wpilib.counter,
    wpilib.drive,
    wpilib.event,
    wpilib.interfaces,
    wpilib.simulation,
    python_util.getModule('wpilib.sysid'),
    wpimath,
    wpimath.controller,
    wpimath.estimator,
    wpimath.filter,
    wpimath.geometry,
    wpimath.interpolation,
    wpimath.kinematics,
    wpimath.optimization,
    wpimath.path,
    wpimath.spline,
    wpimath.system,
    wpimath.system.plant,
    wpimath.trajectory,
    wpimath.trajectory.constraint,
    wpimath.units,
    wpinet,
    wpiutil,
  ]
  json_generator_robotpy = json_util.JsonGenerator(robotpy_modules)
  file_path = f'{FLAGS.output_directory}/generated/robotpy_data.json'
  json_generator_robotpy.writeJsonFile(file_path)

  external_samples_modules = [
    color_range_sensor,
    component,
    expansion_hub_motor,
    expansion_hub_servo,
    port,
    rev_touch_sensor,
    servo,
    smart_motor,
    spark_mini,
    sparkfun_led_stick,
  ]
  json_generator_external_samples = json_util.JsonGenerator(
      external_samples_modules, [json_generator_robotpy])
  file_path = f'{FLAGS.output_directory}/generated/external_samples_data.json'
  json_generator_external_samples.writeJsonFile(file_path)

  server_python_scripts = [
    blocks_base_classes,
  ]
  json_generator_server_python = json_util.JsonGenerator(
      server_python_scripts, [json_generator_robotpy])
  file_path = f'{FLAGS.output_directory}/generated/server_python_scripts.json'
  json_generator_server_python.writeJsonFile(file_path)

if __name__ == '__main__':
  app.run(main)
