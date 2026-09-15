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
import rev
import wpilib
import wpilib.simulation
import wpimath
import wpimath.units
import wpinet
import wpiutil

# Runtime python
sys.path.append("../runtime_python")
import wpilib_blocks

# Local modules
import json_util
import python_util


FLAGS = flags.FLAGS

flags.DEFINE_string('output_directory', None, 'The directory where output should be written.')
flags.DEFINE_string('rev_library_directory', None,
    'The directory of the REV Robotics example library (examples/rev_robotics), where the rev '
    'components and python data should be written.')


def main(argv):
  del argv  # Unused.

  if not FLAGS.output_directory:
    logging.error(f'You must specify the --output_directory argument')
    return

  pathlib.Path(f'{FLAGS.output_directory}/generated/').mkdir(parents=True, exist_ok=True)

  # rev isn't built in. It is written to the REV Robotics example library below.
  robotpy_modules = [
    ntcore,
    wpilib,
    wpilib.simulation,
    python_util.getModule('wpilib.sysid'),
    wpimath,
    wpimath.units,
    wpinet,
    wpiutil,
  ]
  json_generator_robotpy = json_util.JsonGenerator(robotpy_modules)
  file_path = f'{FLAGS.output_directory}/generated/robotpy_data.json'
  json_generator_robotpy.writeJsonFile(file_path)

  runtime_python = [
    wpilib_blocks,
  ]
  json_generator_runtime_python = json_util.JsonGenerator(
      runtime_python, [json_generator_robotpy])
  file_path = f'{FLAGS.output_directory}/generated/runtime_python.json'
  json_generator_runtime_python.writeJsonFile(file_path)

  if FLAGS.rev_library_directory:
    rev_modules = [
      rev,
    ]
    json_generator_rev = json_util.JsonGenerator(rev_modules, [json_generator_robotpy])
    json_generator_rev.writeBlocksLibFiles(FLAGS.rev_library_directory)

if __name__ == '__main__':
  app.run(main)
