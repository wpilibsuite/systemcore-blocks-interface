# Copyright (c) FIRST and other WPILib contributors.

"""Gets first_ds_hids.json, which describes the controllers that wpilib has classes for.

The file is what robotpy uses to generate its controller classes (XboxController, etc), so it is
taken from the robotpy release that this repo uses, which is the version of robotpy in
packaging/cacheRequirements.txt. The frontend builds the buttons and axes of the gamepad blocks
from it (frontend/types/hid_devices/first_ds_hids.ts).
"""

# Python Standard Library
import json
import pathlib
import re
import urllib.request

# absl
from absl import app
from absl import flags
from absl import logging


FLAGS = flags.FLAGS

flags.DEFINE_string('output_directory', None, 'The directory where first_ds_hids.json should be written.')

_REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
_CACHE_REQUIREMENTS_PATH = _REPO_ROOT / 'packaging' / 'cacheRequirements.txt'

# The robotpy release is also a tag in the mostrobotpy repo.
_URL_FORMAT = ('https://raw.githubusercontent.com/robotpy/mostrobotpy/{version}/'
               'subprojects/robotpy-commands-v2/tools/hids/first_ds_hids.json')

_OUTPUT_FILE_NAME = 'first_ds_hids.json'


def getRobotPyVersion(requirements_path=_CACHE_REQUIREMENTS_PATH):
  """Returns the version of robotpy that is pinned in the given requirements file."""
  for line in pathlib.Path(requirements_path).read_text().splitlines():
    match = re.fullmatch(r'\s*robotpy\s*==\s*(\S+)\s*', line)
    if match:
      return match.group(1)
  raise ValueError(f'{requirements_path} does not pin a version of robotpy with ==')


def validate(hids):
  """Raises ValueError if hids doesn't have the structure that the frontend expects."""
  if not isinstance(hids, list) or not hids:
    raise ValueError('expected a non-empty list of controllers')
  for hid in hids:
    name = hid.get('ClassName') if isinstance(hid, dict) else None
    if not name:
      raise ValueError(f'a controller has no ClassName: {hid!r}')
    for key in ('axes', 'buttons'):
      indexes = hid.get(key)
      if not isinstance(indexes, dict) or not all(
          isinstance(i, int) for i in indexes.values()):
        raise ValueError(f'{name} has no {key} that map names to indexes')
    supports = hid.get('supports')
    if not isinstance(supports, dict) or not all(
        isinstance(supports.get(k), bool) for k in ('rumble', 'triggerRumble', 'monoLed', 'rgbLed')):
      raise ValueError(f'{name} has no supports with rumble, triggerRumble, monoLed, and rgbLed')


def main(argv):
  del argv  # Unused.

  if not FLAGS.output_directory:
    logging.error('You must specify the --output_directory argument')
    return

  version = getRobotPyVersion()
  url = _URL_FORMAT.format(version=version)
  logging.info(f'Getting {url}')
  with urllib.request.urlopen(url) as response:
    text = response.read().decode('utf-8')
  validate(json.loads(text))

  output_directory = pathlib.Path(FLAGS.output_directory)
  output_directory.mkdir(parents=True, exist_ok=True)
  file_path = output_directory / _OUTPUT_FILE_NAME
  # Write the file as it was published, so that it only changes when robotpy changes it.
  file_path.write_text(text)
  logging.info(f'Wrote {file_path} from robotpy {version}')


if __name__ == '__main__':
  app.run(main)
