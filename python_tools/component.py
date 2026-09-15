# Copyright 2026 Google LLC
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
import copy
import sys


_NAME = 'name'
_TYPE = 'type'
_DEFAULT = 'defaultValue'

class Component:
  def __init__(self, class_name: str, expected_constructor_arg_names: [str], component_args: [], common_method_names: [str]):
    self._class_name = class_name
    self._expected_constructor_arg_names = expected_constructor_arg_names
    self._component_args = component_args
    self._common_method_names = common_method_names

  def matches_constructor_args(self, actual_args: []) -> bool:
    if len(actual_args) != len(self._expected_constructor_arg_names):
      return False
    for index_a in range(len(actual_args)):
      if actual_args[index_a][_NAME] != self._expected_constructor_arg_names[index_a]:
        return False
    return True

  def get_expected_constructor_arg_names(self) -> [str]:
    return self._expected_constructor_arg_names

  def get_component_args(self, actual_args: []) -> []:
    # Make a copy of self._component_args and reconcile the component arg types
    # and default values with the actual constructor args.
    component_args = copy.deepcopy(self._component_args)
    index_a = len(actual_args) - 1
    index_c = len(component_args) - 1
    while index_a >= 0 and index_c >= 0:
      actual_arg = actual_args[index_a]
      component_arg = component_args[index_c]
      # Empty type is filled in from the actual arg.
      if component_arg[_NAME] != actual_arg[_NAME]:
        # Print a warning, unless it's something we expect.
        if component_arg[_NAME] == 'expansion_hub_motor' and actual_arg[_NAME] == 'channel':
          pass
        elif component_arg[_NAME] == 'expansion_hub_servo' and actual_arg[_NAME] == 'channel':
          pass
        elif component_arg[_NAME] == 'i2c_port' and actual_arg[_NAME] == 'port':
          pass
        elif component_arg[_NAME] == 'smart_io_port' and actual_arg[_NAME] == 'channel':
          pass
        else:
          print(f'WARNING: component {self._class_name} argument named "{component_arg[_NAME]}" '
              f'does not match actual argument named "{actual_arg[_NAME]}"',
              file=sys.stderr)
      if component_arg[_TYPE] == '':
        component_arg[_TYPE] = actual_arg[_TYPE]
      # The default value in a component arg is overridden by the actual arg's default
      # value, but we print a warning if the component argu's default value was non-empty.
      if actual_arg[_DEFAULT] != '':
        if component_arg[_DEFAULT] != '':
          print(f'WARNING: component {self._class_name}, for argument named '
              f'"{component_arg[_NAME]}", suggested default value {component_arg[_DEFAULT]} '
              f'is being overrridden by the actual argument\'s default value '
              f'{actual_arg[_DEFAULT]}.',
              file=sys.stderr)
        component_arg[_DEFAULT] = actual_arg[_DEFAULT]
      index_a = index_a - 1
      index_c = index_c - 1
    return component_args
    
  def get_common_method_names(self) -> [str]:
    return self._common_method_names
    
