# Copyright (c) FIRST and other WPILib contributors.

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
