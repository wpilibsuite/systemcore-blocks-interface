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

# Runtime python
sys.path.append("../runtime_python")
import wpilib_blocks

# Local modules
import json_util
import robotpy_modules


FLAGS = flags.FLAGS

flags.DEFINE_string('output_directory', None, 'The directory where output should be written.')


def main(argv):
  del argv  # Unused.

  if not FLAGS.output_directory:
    logging.error(f'You must specify the --output_directory argument')
    return

  pathlib.Path(f'{FLAGS.output_directory}/generated/').mkdir(parents=True, exist_ok=True)

  json_generator_robotpy = json_util.JsonGenerator(robotpy_modules.getRobotPyModules())
  file_path = f'{FLAGS.output_directory}/generated/robotpy_data.json'
  json_generator_robotpy.writeJsonFile(file_path)

  runtime_python = [
    wpilib_blocks,
  ]
  json_generator_runtime_python = json_util.JsonGenerator(
      runtime_python, [json_generator_robotpy])
  file_path = f'{FLAGS.output_directory}/generated/runtime_python.json'
  json_generator_runtime_python.writeJsonFile(file_path)

if __name__ == '__main__':
  app.run(main)
