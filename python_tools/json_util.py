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
import copy
import inspect
import json
import os
import re
import sys
import types
import typing

# Local modules
import python_util
import component


_LIST_MODULE_NAME_PREFIXES_TO_IGNORE = [
  'hal',
  'ntcore',
  'wpinet',
]

_LIST_MODULE_NAMES_INTERNAL = [
  'wpilib_blocks.block_execution',
  'wpilib_blocks.decorators',
  'wpilib_blocks.user_controls',
]

_LIST_CLASS_NAMES_INTERNAL = [
  'wpilib_blocks.BlockExecution',
  'wpilib_blocks.DefaultUserControls',
]

_DICT_MODULE_FUNCTION_NAMES_INTERNAL = {
  'wpilib_blocks': [
    'Auto',
    'Group',
    'Name',
    'Teleop',
    'Utility',
  ],
}

_COMMON_MARKER = '@Common'

_KEY_MODULES = 'modules'
_KEY_CLASSES = 'classes'
_KEY_MODULE_NAME = 'moduleName'
_KEY_MODULE_VARIABLES = 'moduleVariables'
_KEY_TOOLTIP = 'tooltip'
_KEY_CLASS_NAME = 'className'
_KEY_CLASS_VARIABLES = 'classVariables'
_KEY_INSTANCE_VARIABLES = 'instanceVariables'
_KEY_ENUMS = 'enums'
_KEY_ENUM_CLASS_NAME = 'enumClassName'
_KEY_ENUM_VALUES = 'enumValues'
_KEY_VARIABLE_NAME = 'name'
_KEY_VARIABLE_TYPE = 'type'
_KEY_VARIABLE_WRITABLE = 'writable'
_KEY_FUNCTIONS = 'functions'
_KEY_CONSTRUCTORS = 'constructors'
_KEY_INSTANCE_METHODS = 'instanceMethods'
_KEY_STATIC_METHODS = 'staticMethods'
_KEY_FUNCTION_NAME = 'functionName'
_KEY_FUNCTION_RETURN_TYPE = 'returnType'
_KEY_FUNCTION_ARGS = 'args'
_KEY_FUNCTION_DECLARING_CLASS_NAME = 'declaringClassName'
_KEY_ARGUMENT_NAME = 'name'
_KEY_ARGUMENT_TYPE = 'type'
_KEY_ARGUMENT_DEFAULT_VALUE = 'defaultValue'
_KEY_ALIASES = 'aliases'
_KEY_SUBCLASSES = 'subclasses'
_KEY_IS_COMPONENT = 'isComponent'
_KEY_COMPONENT_ARGS = 'componentArgs'
_KEY_IS_COMMON = 'isCommon'


def ignoreModule(module_name: str) -> bool:
  for prefix in _LIST_MODULE_NAME_PREFIXES_TO_IGNORE:
    if module_name.startswith(prefix):
      return True
  return False

def createArgData(arg_name: str, arg_type: str, default_value: str = ''):
  if any(char.isupper() for char in arg_name):
    print(f'WARNING: argument name {arg_name} contains an uppercase letter. '
        'Expected lower_snake_case.',
        file=sys.stderr)

  arg_data = {}
  arg_data[_KEY_ARGUMENT_NAME] = arg_name
  arg_data[_KEY_ARGUMENT_TYPE] = arg_type
  arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = default_value if default_value else ''
  return arg_data

# The rev components aren't built in. They are written to the REV Robotics example library in
# examples/rev_robotics by generate_json.py.
_DICT_COMPONENTS = {
  'rev.A301': component.Component('rev.A301',
    # As of September 2026, we only use the constructor that has just the can_port argument.
    # If A301 becomes legal for FRC (in the future), we'll need to support the constructor
    # that has both the can port and the device id.
    expected_constructor_arg_names=[
      'can_port',
    ],
    component_args=[
      createArgData('can_port', 'SYSTEMCORE_CAN_PORT')
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
      createArgData('i2c_port', 'SYSTEMCORE_I2C_PORT')
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get_color',
      'get_proximity',
      'get_raw_color',
      'is_connected',
    ],
  ),
  'wpilib.AddressableLED': component.Component('wpilib.AddressableLED',
    expected_constructor_arg_names=[
      'channel',
    ],
    component_args=[
      createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'set_color_order',
      'set_length',
      'set_start',
    ],
  ),
  'wpilib.AnalogEncoder': component.Component('wpilib.AnalogEncoder',
    expected_constructor_arg_names=[
      'channel', 'full_range', 'expected_zero',
    ],
    component_args=[
      createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'),
      # Default values here are overridden if the actual arg has a default value.
      createArgData('full_range', '', '1.0'),
      createArgData('expected_zero', '', '0.0'),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get',
      'set_inverted',
    ],
  ),
  'wpilib.AnalogPotentiometer': component.Component('wpilib.AnalogPotentiometer',
    expected_constructor_arg_names=[
      'channel', 'full_range', 'offset',
    ],
    component_args=[
      createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'),
      createArgData('full_range', ''),
      createArgData('offset', ''),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get'
    ],
  ),
  'wpilib.DigitalInput': component.Component('wpilib.DigitalInput',
    expected_constructor_arg_names=[
      'channel',
    ],
    component_args=[
      createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get',
    ],
  ),
  'wpilib.DutyCycleEncoder': component.Component('wpilib.DutyCycleEncoder',
    expected_constructor_arg_names=[
      'channel', 'full_range', 'expected_zero'
    ],
    component_args=[
      createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'),
      # Default values here are overridden if the actual arg has a default value.
      createArgData('full_range', '', '1'),
      createArgData('expected_zero', '', '0'),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get',
      'is_connected',
      'set_inverted',
    ],
  ),
  'wpilib.ExpansionHubMotor': component.Component('wpilib.ExpansionHubMotor',
    expected_constructor_arg_names=[
      'usb_id', 'channel',
    ],
    component_args=[
      createArgData('expansion_hub_motor', 'SYSTEMCORE_USB_PORT__EXPANSION_HUB_MOTOR_PORT'),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get_encoder_position',
      'get_encoder_velocity',
      'is_hub_connected',
      'reset_encoder',
      'set_enabled',
      'set_position_setpoint',
      'set_reversed',
      'set_throttle',
      'set_velocity_setpoint',
    ],
  ),
  'wpilib.ExpansionHubServo': component.Component('wpilib.ExpansionHubServo',
    expected_constructor_arg_names=[
      'usb_id', 'channel',
    ],
    component_args=[
      createArgData('expansion_hub_servo', 'SYSTEMCORE_USB_PORT__EXPANSION_HUB_SERVO_PORT'),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'is_hub_connected',
      'set_angle',
      'set_angle_range',
      'set_enabled',
      'set_position',
      'set_reversed',
    ],
  ),
  'wpilib.OnboardIMU': component.Component('wpilib.OnboardIMU',
    expected_constructor_arg_names=[
      'mount_orientation',
    ],
    component_args=[
      createArgData('mount_orientation', ''),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get_accel_x',
      'get_accel_y',
      'get_accel_z',
      'get_angle_x',
      'get_angle_y',
      'get_angle_z',
      'get_gyro_rate_x',
      'get_gyro_rate_y',
      'get_gyro_rate_z',
      'get_yaw',
      'reset_yaw',
    ],
  ),
  'wpilib.PWMSparkMax': component.Component('wpilib.PWMSparkMax',
    expected_constructor_arg_names=[
      'channel',
    ],
    component_args=[
      createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'),
    ],
     # TODO: decide which methods are common.
    common_method_names=[
      'get_inverted',
      'get_throttle',
      'get_voltage',
      'set_inverted',
      'set_throttle',
      'set_voltage',
      'stop_motor',
    ],
  ),
}


class JsonGenerator:
  def __init__(self, root_modules: list[types.ModuleType], libs: list = []):
    self._root_modules = root_modules
    (self._modules, self._classes) = python_util.collectModulesAndClasses(self._root_modules)
    module_exports = python_util.collectModuleExports(self._modules)
    self._type_aliases = python_util.collectTypeAliases(self._modules, self._classes)
    self._subclasses = python_util.collectSubclasses(self._classes)
    self._exported_class_names = {}
    self._exported_class_module_names = {}
    for o, module_export in module_exports.items():
      if inspect.isclass(o):
        full_class_name = python_util.getFullClassName(o)
        self._exported_class_names.update({full_class_name: module_export[0]})
        self._exported_class_module_names.update({full_class_name: module_export[1]})
    # Copy module_exports from libs.
    for lib in libs:
      self._exported_class_names.update(lib._exported_class_names)
      self._exported_class_module_names.update(lib._exported_class_module_names)

  def _getModuleName(self, o) -> str:
    if inspect.ismodule(o):
      return o.__name__
    if inspect.isclass(o):
      full_class_name = python_util.getFullClassName(o)
      if full_class_name in self._exported_class_module_names:
        return self._exported_class_module_names[full_class_name]
      for exported_full_class_name, exported_module_name in self._exported_class_module_names.items():
        if full_class_name.startswith(exported_full_class_name + '.'):
          return exported_module_name
    if hasattr(o, '__module__'):
      return o.__module__
    raise Exception(f'Invalid argument {o}')

  def _getClassName(self, o, containing_class_name: str = None) -> str:
    if inspect.isclass(o):
      full_class_name = python_util.getFullClassName(o)
      return self._getClassName(full_class_name)
    if isinstance(o, str):
      if o == 'typing.Self' and containing_class_name:
        return containing_class_name
      if o in self._exported_class_names:
        return self._exported_class_names[o]
      endings = [' | None', '.', ']', ',']
      for exported_full_class_name, exported_class_name in self._exported_class_names.items():
        for ending in endings:
          if o.find(exported_full_class_name + ending) != -1:
            o = o.replace(exported_full_class_name + ending, exported_class_name + ending)
      o = o.replace('typing.SupportsInt | typing.SupportsIndex', 'int')
      o = o.replace('typing.SupportsInt', 'int')
      o = o.replace('typing.SupportsFloat | typing.SupportsIndex', 'float')
      o = o.replace('typing.SupportsFloat', 'float')
      return o
    raise Exception(f'Invalid argument {o}')

  def _getPublicModules(self) -> list[types.ModuleType]:
    public_modules = []
    for m in self._modules:
      module_name = python_util.getFullModuleName(m)
      if '._' in module_name:
        continue
      if module_name in _LIST_MODULE_NAMES_INTERNAL:
        continue
      public_modules.append(m)
    public_modules.sort(key=lambda m: python_util.getFullModuleName(m))
    return public_modules

  def _createFunctionIsEnumValue(
      self, enum_cls: type) -> typing.Callable[[object], bool]:
    return lambda value: type(value) == enum_cls

  def _createArgData(self, arg_name: str, arg_type: str, default_value: str = ''):
    if default_value and default_value.startswith('<') and default_value.endswith('>'):
      default_value = '<' + self._getClassName(default_value[1:-1]) + '>'
    return createArgData(arg_name, arg_type, default_value)

  def _processModule(self, module) -> dict:
    module_data = {}
    module_name = self._getModuleName(module)
    module_data[_KEY_MODULE_NAME] = module_name

    if any(char.isupper() for char in module_name):
      print(f'WARNING: module name {module_name} contains an uppercase letter. '
          'Expected lower_snake_case.',
           file=sys.stderr)

    # Module variables.
    module_variables = []
    for key, value in inspect.getmembers(module, python_util.isNothing):
      if not python_util.isModuleVariableReadable(module, key, value):
        continue
      writable = python_util.isModuleVariableWritable(module, key, value)

      if writable:
        if any(char.isupper() for char in key):
          print(f'WARNING: writable module variable {module_name}.{key} contains an uppercase letter. '
              'Expected lower_snake_case.',
               file=sys.stderr)
      else:
        if any(char.islower() for char in key):
          print(f'WARNING: constant module variable {module_name}.{key} contains an lowercase letter. '
              'Expected UPPER_SNAKE_CASE.',
               file=sys.stderr)

      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = self._getClassName(type(value))
      var_data[_KEY_VARIABLE_WRITABLE] = writable
      var_data[_KEY_TOOLTIP] = ''
      module_variables.append(var_data)
    module_data[_KEY_MODULE_VARIABLES] = sorted(module_variables, key=lambda var_data: var_data[_KEY_VARIABLE_NAME])

    # Module functions.
    functions = []
    for key, value in inspect.getmembers(module, inspect.isroutine):
      if not python_util.isFunction(module, key, value):
        continue
      # Check whether value is a function imported from another module.
      if value.__module__:
        declaring_module = python_util.getModule(value.__module__)
        if python_util.isBuiltInModule(declaring_module):
          # Ignore the imported function from a built-in module.
          continue
        if self._getModuleName(declaring_module) != self._getModuleName(module):
          # Check whether the imported function is exported in __all__.
          if hasattr(module, '__all__') and not (key in module.__all__):
            # Ignore the imported function.
            continue

      if (module_name in _DICT_MODULE_FUNCTION_NAMES_INTERNAL
          and key in _DICT_MODULE_FUNCTION_NAMES_INTERNAL[module_name]):
        continue

      # Look at each function signature. For overloaded functions, there will be more than one.
      (signatures, comments) = python_util.processFunction(value)
      if len(signatures) == 0:
        print(f'ERROR: failed to determine function signature for {module_name}.{key}',
              file=sys.stderr)
        continue
      for iSignature in range(len(signatures)):
        signature = signatures[iSignature]
        if '**kwargs' in signature:
          continue
        # Determine the argument names and types.
        try:
          (function_name, arg_names, arg_types, arg_default_values, return_type) = python_util.processSignature(signature)
        except:
          print(f'ERROR: function signature for {module_name}.{key} is not parseable. "{signature}"',
                file=sys.stderr)
          continue
        if function_name != key:
          print(f'ERROR: signature has different function name. {module_name}.{key}',
                file=sys.stderr)
          continue
        if hasattr(module, return_type) and inspect.isclass(getattr(module, return_type)):
          # return_type is a type alias defined in this module.
          # Use the qualified name for the type.
          return_type = module_name + '.' + return_type
        args = []
        for i in range(len(arg_names)):
          arg_type = arg_types[i]
          if hasattr(module, arg_type) and inspect.isclass(getattr(module, arg_type)):
            # arg_type is a type alias defined in this module.
            # Use the qualified name for the type.
            arg_type = module_name + '.' + arg_type
          args.append(self._createArgData(
              arg_names[i],
              self._getClassName(arg_type),
              arg_default_values[i] if arg_default_values[i] is not None else ''))

        if any(char.isupper() for char in function_name):
          print(f'WARNING: module function {module_name}.{function_name} contains an uppercase letter. '
                'Expected lower_snake_case.',
                file=sys.stderr)

        function_data = {}
        function_data[_KEY_FUNCTION_NAME] = function_name
        function_data[_KEY_FUNCTION_RETURN_TYPE] = self._getClassName(return_type)
        function_data[_KEY_FUNCTION_ARGS] = args
        if comments[iSignature] is not None:
          function_data[_KEY_TOOLTIP] = comments[iSignature]
          if _COMMON_MARKER in comments[iSignature]:
            function_data[_KEY_IS_COMMON] = True
        else:
          function_data[_KEY_TOOLTIP] = ''
        functions.append(function_data)
    module_data[_KEY_FUNCTIONS] = sorted(functions, key=lambda function_data: function_data[_KEY_FUNCTION_NAME])

    # Enums
    enums = []
    for key, value in inspect.getmembers(module, python_util.isEnum):
      enum_class_name = self._getClassName(value)
      if self._getModuleName(value) != module_name:
        continue

      simple_class_name = enum_class_name.rsplit('.', 1)[-1]
      if '_' in simple_class_name:
        print(f'WARNING: enum class name {enum_class_name} contains an underscore. '
            'Expected UpperCamelCase.',
             file=sys.stderr)
      if not simple_class_name[0].isupper():
        print(f'WARNING: enum class name {enum_class_name} doesn\'t start with an uppercase letter'
            'Expected UpperCamelCase.',
             file=sys.stderr)

      fnIsEnumValue = self._createFunctionIsEnumValue(value)
      enum_values = []
      enum_tooltip = ''
      for keyEnum, valueEnum in inspect.getmembers(value, fnIsEnumValue):
        enum_values.append(keyEnum)

        if any(char.islower() for char in keyEnum):
          print(f'WARNING: enum {enum_class_name} has a value named {keyEnum} that '
              'contains an lowercase letter. Expected UPPER_SNAKE_CASE.',
              file=sys.stderr)

        if not enum_tooltip:
          enum_tooltip = value.__doc__
      enum_values.sort()
      enum_data = {}
      enum_data[_KEY_ENUM_CLASS_NAME] = enum_class_name
      enum_data[_KEY_MODULE_NAME] = self._getModuleName(value)
      enum_data[_KEY_ENUM_VALUES] = enum_values
      if enum_tooltip is not None:
        enum_data[_KEY_TOOLTIP] = enum_tooltip
      else:
        enum_data[_KEY_TOOLTIP] = ''
      enums.append(enum_data)
    module_data[_KEY_ENUMS] = sorted(enums, key=lambda enum_data: enum_data[_KEY_ENUM_CLASS_NAME])
    return module_data

  def _processModules(self):
    module_data_list = []
    set_of_modules = set()
    for module in self._getPublicModules():
      set_of_modules.add(module)
    for module in set_of_modules:
      module_name = self._getModuleName(module)
      if ignoreModule(module_name):
        continue
      module_data = self._processModule(module)
      module_data_list.append(module_data)
    return sorted(module_data_list, key=lambda module_data: module_data[_KEY_MODULE_NAME])

  def _getPublicClasses(self) -> list[type]:
    set_of_public_classes = set()
    for cls in self._classes:
      class_name = self._getClassName(cls)
      if '._' in class_name:
        continue
      if class_name in _LIST_CLASS_NAMES_INTERNAL:
        continue
      for base_class in inspect.getmro(cls):
        if python_util.isBuiltInClass(base_class):
          break
        base_class_name = self._getClassName(base_class)
        if '._' in base_class_name:
          continue
        set_of_public_classes.add(base_class)
    public_classes = []
    for cls in set_of_public_classes:
      public_classes.append(cls)
    public_classes.sort(key=lambda c: python_util.getFullClassName(c))
    return public_classes

  def _processClass(self, cls):
    class_name = self._getClassName(cls)

    simple_class_name = class_name.rsplit('.', 1)[-1]
    if not simple_class_name[0].isupper():
      print(f'WARNING: simple class name {simple_class_name} (from class name {class_name}) doesn\'t start with an uppercase letter'
         'Expected UpperCamelCase.',
         file=sys.stderr)

    class_data = {}
    class_data[_KEY_CLASS_NAME] = class_name
    class_data[_KEY_MODULE_NAME] = self._getModuleName(cls)
    class_data[_KEY_IS_COMPONENT] = False  # Set to True later if it is a component.

    full_class_name = python_util.getFullClassName(cls)

    # Class variables.
    class_variables = []
    for key, value in inspect.getmembers(cls, python_util.isNothing):
      if not python_util.isClassVariableReadable(cls, key, value):
        continue
      if (key == "WPIStruct" and type(value).__name__ == "PyCapsule"):
        continue
      writable = python_util.isClassVariableWritable(cls, key, value)

      if writable:
        if any(char.isupper() for char in key):
          print(f'WARNING: writable class variable {class_name}.{key} contains an uppercase letter. '
              'Expected lower_snake_case.',
               file=sys.stderr)
      else:
        if any(char.islower() for char in key):
          print(f'WARNING: constant class variable {class_name}.{key} contains an lowercase letter. '
              'Expected UPPER_SNAKE_CASE.',
               file=sys.stderr)

      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = self._getClassName(type(value), class_name)
      var_data[_KEY_VARIABLE_WRITABLE] = writable
      var_data[_KEY_TOOLTIP] = ''
      class_variables.append(var_data)
    class_data[_KEY_CLASS_VARIABLES] = sorted(class_variables, key=lambda var_data: var_data[_KEY_VARIABLE_NAME])

    # Instance variables
    instance_variables = []
    for key, value in inspect.getmembers(cls, inspect.isdatadescriptor):
      if not python_util.isInstanceVariableReadable(cls, key, value):
        continue

      if any(char.isupper() for char in key):
        print(f'WARNING: instance variable {class_name}.{key} contains an uppercase letter. '
            'Expected lower_snake_case.',
             file=sys.stderr)

      var_type = python_util.getVarTypeFromGetter(value.fget)
      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = self._getClassName(var_type, class_name)
      var_data[_KEY_VARIABLE_WRITABLE] = python_util.isInstanceVariableWritable(cls, key, value)
      if value.__doc__ is not None:
        var_data[_KEY_TOOLTIP] = value.__doc__
        if _COMMON_MARKER in value.__doc__:
          var_data[_KEY_IS_COMMON] = True
      else:
        var_data[_KEY_TOOLTIP] = ''
      instance_variables.append(var_data)
    class_data[_KEY_INSTANCE_VARIABLES] = sorted(instance_variables, key=lambda var_data: var_data[_KEY_VARIABLE_NAME])

    # Constructors
    constructors = []
    for key, value in inspect.getmembers(cls):#, python_util.mightBeConstructor):
      if not python_util.isConstructor(cls, key, value):
        continue
      # Look at each function signature. For overloaded functions, there will be more than one.
      (signatures, comments) = python_util.processFunction(value, cls)
      if len(signatures) == 0:
        print(f'ERROR: failed to determine function signature for {class_name}.{key}',
              file=sys.stderr)
        continue
      for iSignature in range(len(signatures)):
        signature = signatures[iSignature]
        # Determine the argument names and types.
        try:
          (function_name, arg_names, arg_types, arg_default_values, return_type) = python_util.processSignature(signature)
        except:
          print(f'ERROR: function signature for {class_name}.{key} is not parseable. "{signature}"',
                file=sys.stderr)
          continue
        if function_name != key:
          print(f'ERROR: signature has different function name. {class_name}.{key}',
                file=sys.stderr)
          continue
        declaring_class_name = class_name

        if function_name != '__init__':
          print(f'WARNING: constructor named {function_name} is weird. '
              'Expected __init__.',
              file=sys.stderr)

        constructor_data = {}
        constructor_data[_KEY_FUNCTION_NAME] = function_name
        if comments[iSignature] is not None:
          constructor_data[_KEY_TOOLTIP] = comments[iSignature]
          if _COMMON_MARKER in comments[iSignature]:
            constructor_data[_KEY_IS_COMMON] = True
        else:
          constructor_data[_KEY_TOOLTIP] = ''
        args = []
        for i in range(len(arg_names)):
          arg_name = arg_names[i]
          arg_type = arg_types[i]
          if i == 0 and arg_name == 'self':
            if arg_type != full_class_name:
              declaring_class_name = self._getClassName(arg_type, class_name)
            # Don't append the self argument to the args array.
            continue
          # TODO(lizlooney): The following might not work for type aliases declared in a super class.
          if hasattr(cls, arg_type) and inspect.isclass(getattr(cls, arg_type)):
            # arg_type is a type alias defined in this class.
            # Use the qualified name for the type.
            arg_type = class_name + '.' + arg_type
          args.append(self._createArgData(
              arg_name,
              self._getClassName(arg_type, class_name),
              arg_default_values[i] if arg_default_values[i] is not None else ''))
        constructor_data[_KEY_FUNCTION_ARGS] = args
        constructor_data[_KEY_FUNCTION_DECLARING_CLASS_NAME] = declaring_class_name
        constructor_data[_KEY_FUNCTION_RETURN_TYPE] = declaring_class_name
        constructors.append(constructor_data)
    class_data[_KEY_CONSTRUCTORS] = constructors

    # Functions
    instance_methods = []
    static_methods = []
    for key, value in inspect.getmembers(cls, inspect.isroutine):
      if not python_util.isFunction(cls, key, value):
        continue
      # Look at each function signature. For overloaded functions, there will be more than one.
      (signatures, comments) = python_util.processFunction(value, cls)
      if len(signatures) == 0:
        print(f'ERROR: failed to determine function signature for {class_name}.{key}',
              file=sys.stderr)
        continue
      for iSignature in range(len(signatures)):
        signature = signatures[iSignature]
        # Determine the argument names and types.
        try:
          (function_name, arg_names, arg_types, arg_default_values, return_type) = python_util.processSignature(signature)
        except:
          print(f'ERROR: function signature for {class_name}.{key} is not parseable. "{signature}"',
                file=sys.stderr)
          continue
        if function_name != key:
          print(f'ERROR: signature has different function name. {class_name}.{key}',
                file=sys.stderr)
          continue
        declaring_class_name = class_name
        # TODO(lizlooney): The following might not work for type aliases declared in a super class.
        if hasattr(cls, return_type) and inspect.isclass(getattr(cls, return_type)):
          # return_type is a type alias defined in this class.
          # Use the qualified name for the type.
          return_type = class_name + '.' + return_type
        args = []
        found_self_arg = False
        for i in range(len(arg_names)):
          arg_name = arg_names[i]
          arg_type = arg_types[i]
          if i == 0 and arg_name == 'self':
            found_self_arg = True
            if arg_type != full_class_name:
              declaring_class_name = self._getClassName(arg_type, class_name)
          # TODO(lizlooney): The following might not work for type aliases declared in a super class.
          if hasattr(cls, arg_type) and inspect.isclass(getattr(cls, arg_type)):
            # arg_type is a type alias defined in this class.
            # Use the qualified name for the type.
            arg_type = class_name + '.' + arg_type
          args.append(self._createArgData(
              arg_name,
              self._getClassName(arg_type, class_name),
              arg_default_values[i] if arg_default_values[i] is not None else ''))

        if any(char.isupper() for char in function_name):
          print(f'WARNING: function {declaring_class_name}.{function_name} contains an uppercase letter. '
              'Expected lower_snake_case.',
              file=sys.stderr)

        function_data = {}
        function_data[_KEY_FUNCTION_NAME] = function_name
        function_data[_KEY_FUNCTION_RETURN_TYPE] = self._getClassName(return_type, class_name)
        function_data[_KEY_FUNCTION_ARGS] = args
        function_data[_KEY_FUNCTION_DECLARING_CLASS_NAME] = declaring_class_name
        if comments[iSignature] is not None:
          function_data[_KEY_TOOLTIP] = comments[iSignature]
          if _COMMON_MARKER in comments[iSignature]:
            function_data[_KEY_IS_COMMON] = True
        else:
          function_data[_KEY_TOOLTIP] = ''
        if found_self_arg:
          instance_methods.append(function_data)
        else:
          static_methods.append(function_data)
    class_data[_KEY_INSTANCE_METHODS] = sorted(instance_methods, key=lambda function_data: function_data[_KEY_FUNCTION_NAME])
    class_data[_KEY_STATIC_METHODS] = sorted(static_methods, key=lambda function_data: function_data[_KEY_FUNCTION_NAME])

    # Enums
    enums = []
    for key, value in inspect.getmembers(cls, python_util.isEnum):
      if not self._getClassName(value).startswith(class_name):
        continue
      enum_class_name = self._getClassName(value)

      simple_class_name = enum_class_name.rsplit('.', 1)[-1]
      if '_' in simple_class_name:
        print(f'WARNING: enum class name {enum_class_name} contains an underscore. '
            'Expected UpperCamelCase.',
             file=sys.stderr)
      if not simple_class_name[0].isupper():
        print(f'WARNING: enum class name {enum_class_name} doesn\'t start with an uppercase letter'
            'Expected UpperCamelCase.',
             file=sys.stderr)

      fnIsEnumValue = self._createFunctionIsEnumValue(value)
      enum_values = []
      enum_tooltip = ''
      for keyEnum, valueEnum in inspect.getmembers(value, fnIsEnumValue):
        enum_values.append(keyEnum)

        if any(char.islower() for char in keyEnum):
          print(f'WARNING: enum {class_name}.{enum_class_name} has a value named {keyEnum} that '
              'contains an lowercase letter. Expected UPPER_SNAKE_CASE.',
              file=sys.stderr)

        if not enum_tooltip:
          enum_tooltip = value.__doc__
      enum_values.sort()
      enum_data = {}
      enum_data[_KEY_ENUM_CLASS_NAME] = enum_class_name
      enum_data[_KEY_MODULE_NAME] = self._getModuleName(value)
      enum_data[_KEY_ENUM_VALUES] = enum_values
      if enum_tooltip is not None:
        enum_data[_KEY_TOOLTIP] = enum_tooltip
      else:
        enum_data[_KEY_TOOLTIP] = ''
      enums.append(enum_data)
    class_data[_KEY_ENUMS] = sorted(enums, key=lambda enum_data: enum_data[_KEY_ENUM_CLASS_NAME])
    self._processComponent(class_data)
    return class_data

  def _processComponent(self, class_data):
    """Determine whether the given class_data represents a component and, if so,
    set the isComponent field and add componentArgs to the constructor that
    blocks will use."""
    # TODO(lizlooney): Replace _DICT_COMPONENTS and the following temporary fake
    # code with code that looks at doc string and/or parameter type aliases to
    # tell whether this is a component and what the args are.

    class_name = class_data[_KEY_CLASS_NAME]

    if class_name in _DICT_COMPONENTS:
      component = _DICT_COMPONENTS[class_name]
      class_data[_KEY_IS_COMPONENT] = True
      found_constructor = False
      for constructor_data in class_data[_KEY_CONSTRUCTORS]:
        args = constructor_data[_KEY_FUNCTION_ARGS]
        if component.matches_constructor_args(args):
          found_constructor = True
          constructor_data[_KEY_COMPONENT_ARGS] = component.get_component_args(args)
          constructor_data[_KEY_IS_COMPONENT] = True
      if not found_constructor:
        print('ERROR: failed to find expected constructor with args named '
              f'{component.get_expected_constructor_arg_names()} for {class_name}',
              file=sys.stderr)
      common_method_names = dict.fromkeys(component.get_common_method_names(), False)
      for function_data in class_data[_KEY_INSTANCE_METHODS]:
        method_name = function_data[_KEY_FUNCTION_NAME]
        if method_name in common_method_names:
          function_data[_KEY_IS_COMMON] = True
          # Mark this method as found so we can report ones that weren't found below.
          common_method_names[method_name] = True
      for method_name, found in common_method_names.items():
        if not common_method_names[method_name]:
          print(f'ERROR: failed to find expected method named {method_name} in {class_name}',
              file=sys.stderr)

  def _processClasses(self):
    class_data_list = []
    for cls in self._getPublicClasses():
      if python_util.isEnum(cls):
        continue
      module_name = self._getModuleName(cls)
      if ignoreModule(module_name):
        continue
      class_data = self._processClass(cls)
      if class_data:
        class_data_list.append(class_data)
    return sorted(class_data_list, key=lambda class_data: class_data[_KEY_CLASS_NAME])

  def _processAliases(self):
    aliases = {}
    for full_class_name, alias in self._type_aliases.items():
      aliases[self._getClassName(full_class_name)] = self._getClassName(alias)
    return aliases

  def _processSubclasses(self):
    subclasses = {}
    for full_class_name, full_subclass_names in self._subclasses.items():
      list = []
      for full_subclass_name in full_subclass_names:
        list.append(self._getClassName(full_subclass_name))
      subclasses[self._getClassName(full_class_name)] = list
    return subclasses

  def _getJsonData(self):
    json_data = {}
    json_data[_KEY_MODULES] = self._processModules()
    json_data[_KEY_CLASSES] = self._processClasses()
    json_data[_KEY_ALIASES] = self._processAliases()
    json_data[_KEY_SUBCLASSES] = self._processSubclasses()
    return json_data

  def writeJsonFile(self, file_path: str):
    _writeJson(self._getJsonData(), file_path)

  def writeBlocksLibFiles(self, library_directory: str):
    """Writes the modules and classes of the root modules as the files of a third party
    .blocks_lib library (see docs/blocks_lib_format.md).

    Each component class is written to components/<class_name>.json. The rest of the modules and
    classes, and the type aliases and subclasses, are written to python_data/<module_name>.json.
    Existing json files in those directories are removed first, since they are all generated.
    """
    root_module_names = [module.__name__ for module in self._root_modules]
    def isInRootModules(name: str) -> bool:
      return any(name == root or name.startswith(root + '.') for root in root_module_names)

    json_data = self._getJsonData()
    # Base classes from other modules are included in json_data, but they are already built in.
    classes = [class_data for class_data in json_data[_KEY_CLASSES]
               if isInRootModules(class_data[_KEY_CLASS_NAME])]
    component_classes = [class_data for class_data in classes if class_data[_KEY_IS_COMPONENT]]
    python_data = {
      _KEY_MODULES: [module_data for module_data in json_data[_KEY_MODULES]
                     if isInRootModules(module_data[_KEY_MODULE_NAME])],
      _KEY_CLASSES: [class_data for class_data in classes if not class_data[_KEY_IS_COMPONENT]],
      _KEY_ALIASES: {name: alias for name, alias in json_data[_KEY_ALIASES].items()
                     if isInRootModules(name)},
      _KEY_SUBCLASSES: {},
    }
    for class_name, subclass_names in json_data[_KEY_SUBCLASSES].items():
      subclass_names = [name for name in subclass_names if isInRootModules(name)]
      if subclass_names:
        python_data[_KEY_SUBCLASSES][class_name] = subclass_names

    components_directory = os.path.join(library_directory, 'components')
    python_data_directory = os.path.join(library_directory, 'python_data')
    for directory in [components_directory, python_data_directory]:
      os.makedirs(directory, exist_ok=True)
      for filename in os.listdir(directory):
        if filename.endswith('.json'):
          os.remove(os.path.join(directory, filename))
    for class_data in component_classes:
      simple_class_name = class_data[_KEY_CLASS_NAME].rsplit('.', 1)[-1]
      _writeJson(class_data, os.path.join(components_directory, f'{_toSnakeCase(simple_class_name)}.json'))
    _writeJson(python_data, os.path.join(python_data_directory, f'{"_".join(root_module_names)}.json'))


def _toSnakeCase(name: str) -> str:
  """Converts UpperCamelCase to lower_snake_case. For example, ColorSensorV3 becomes
  color_sensor_v3."""
  return re.sub(r'(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', '_', name).lower()


def _writeJson(json_data, file_path: str):
  with open(file_path, 'w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, sort_keys=True, indent=4)
    json_file.write('\n')
