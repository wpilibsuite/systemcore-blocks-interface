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
  'telemetry.mock_backend',
  'wpinet',
]

_LIST_MODULE_NAMES_INTERNAL = [
  'wpilib_blocks.block_execution',
  'wpilib_blocks.decorators',
  'wpilib_blocks.user_controls',
]

_LIST_CLASS_NAMES_INTERNAL = [
  'telemetry.MockTelemetryBackend',
  'tunables.MockTunableBackend',
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

# The file in a library directory that lists the python modules and classes that get toolbox
# categories (shownCategories) and the ones that the library doesn't use (ignore).
_PYTHON_TOOLBOX_FILE = 'python_toolbox.json'
_KEY_SHOWN_CATEGORIES = 'shownCategories'
_KEY_IGNORE = 'ignore'


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

# The built-in components. Libraries that are generated from other modules, like the REV Robotics
# example in example_libraries/rev_robotics, give JsonGenerator their own components.
_DICT_COMPONENTS = {
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
  def __init__(self, root_modules: list[types.ModuleType], libs: list = [],
               components: dict[str, component.Component] = {}):
    """components maps class names to the components that are generated in addition to the
    built-in ones."""
    self._root_modules = root_modules
    self._components = {**_DICT_COMPONENTS, **components}
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

    if class_name in self._components:
      component = self._components[class_name]
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

  def writeBlocksLibFiles(self, library_directory: str, add_unused_to_ignore: bool = False):
    """Writes the modules and classes of the root modules as the files of a third party
    .blocks_lib library (see docs/blocks_lib_format.md).

    Only what the library uses is written: the component classes, the modules and classes listed
    in shownCategories in the library's python_toolbox.json, and the classes and enums that those
    refer to in their arguments, return types, and variables. A warning lists the other classes
    and enums, except the ones listed in ignore in python_toolbox.json. If add_unused_to_ignore is
    True, they are added to ignore in python_toolbox.json instead.

    Each component class is written to components/<class_name>.json. The rest of the modules and
    classes, and the type aliases and subclasses, are written to python_data/<module_name>.json.
    Existing json files in those directories are removed first, since they are all generated.
    """
    root_module_names = [module.__name__ for module in self._root_modules]
    def isInRootModules(name: str) -> bool:
      return any(name == root or name.startswith(root + '.') for root in root_module_names)

    python_toolbox = _readPythonToolbox(library_directory)
    shown_names = set(python_toolbox.get(_KEY_SHOWN_CATEGORIES, []))
    ignored_names = set(python_toolbox.get(_KEY_IGNORE, []))

    json_data = self._getJsonData()
    # Base classes from other modules are included in json_data, but they are already built in.
    all_classes = {class_data[_KEY_CLASS_NAME]: class_data for class_data in json_data[_KEY_CLASSES]
                   if isInRootModules(class_data[_KEY_CLASS_NAME])}
    all_modules = {module_data[_KEY_MODULE_NAME]: module_data for module_data in json_data[_KEY_MODULES]
                   if isInRootModules(module_data[_KEY_MODULE_NAME])}
    # Maps each enum to the class it is in, or to None for an enum that is directly in a module.
    enum_owners = {}
    for module_data in all_modules.values():
      for enum_data in module_data[_KEY_ENUMS]:
        enum_owners[enum_data[_KEY_ENUM_CLASS_NAME]] = None
    for class_name, class_data in all_classes.items():
      for enum_data in class_data[_KEY_ENUMS]:
        enum_owners[enum_data[_KEY_ENUM_CLASS_NAME]] = class_name

    for name in sorted((shown_names | ignored_names) - set(all_classes) - set(all_modules) - set(enum_owners)):
      print(f'WARNING: {name} in {_PYTHON_TOOLBOX_FILE} is not a module, class, or enum in '
            f'{", ".join(root_module_names)}',
            file=sys.stderr)

    # The classes that blocks can be made for: the components and the shown classes.
    used_class_names = {class_name for class_name, class_data in all_classes.items()
                        if class_data[_KEY_IS_COMPONENT] or class_name in shown_names}
    for class_name in sorted(used_class_names & ignored_names):
      print(f'ERROR: {class_name} is in ignore in {_PYTHON_TOOLBOX_FILE}, but it is a component or '
            'is in shownCategories, so it is generated anyway',
            file=sys.stderr)
    used_module_names = set(all_modules) & shown_names

    # Add the classes and enums that the used classes and modules refer to.
    referenced_names = set()
    for class_name in used_class_names:
      referenced_names.update(_getReferencedTypeNames(all_classes[class_name]))
    for module_name in used_module_names:
      referenced_names.update(_getReferencedTypeNames(all_modules[module_name]))
    class_names = set(used_class_names)
    module_enum_names = set()
    for name in referenced_names - ignored_names:
      if name in all_classes:
        class_names.add(name)
      elif name in enum_owners:
        owner = enum_owners[name]
        if owner is None:
          module_enum_names.add(name)
        elif owner not in ignored_names:
          class_names.add(owner)

    modules = []
    for module_name, module_data in all_modules.items():
      if module_name in used_module_names:
        modules.append(module_data)
      else:
        module_data = copy.deepcopy(module_data)
        module_data[_KEY_ENUMS] = [enum_data for enum_data in module_data[_KEY_ENUMS]
                                   if enum_data[_KEY_ENUM_CLASS_NAME] in module_enum_names]
        module_data[_KEY_FUNCTIONS] = []
        module_data[_KEY_MODULE_VARIABLES] = []
        modules.append(module_data)
    generated_enum_names = {enum_data[_KEY_ENUM_CLASS_NAME]
                            for module_data in modules for enum_data in module_data[_KEY_ENUMS]}

    not_generated_names = sorted(
        ({name for name in all_classes if name not in class_names} |
         {name for name, owner in enum_owners.items()
          if owner is None and name not in generated_enum_names}) - ignored_names)
    if not_generated_names and add_unused_to_ignore:
      python_toolbox[_KEY_IGNORE] = sorted(ignored_names | set(not_generated_names))
      _writeJson(python_toolbox, os.path.join(library_directory, _PYTHON_TOOLBOX_FILE))
      print(f'Added {len(not_generated_names)} classes and enums that were not generated to '
            f'ignore in {_PYTHON_TOOLBOX_FILE}')
    elif not_generated_names:
      print(f'WARNING: these classes and enums were not generated, because nothing in the library '
            f'uses them. Add them to shownCategories or ignore in {_PYTHON_TOOLBOX_FILE}, or generate '
            f'with add_unused_to_ignore:\n' + json.dumps(not_generated_names, indent=2),
            file=sys.stderr)

    classes = [all_classes[name] for name in sorted(class_names)]
    component_classes = [class_data for class_data in classes if class_data[_KEY_IS_COMPONENT]]
    python_data = {
      _KEY_MODULES: modules,
      _KEY_CLASSES: [class_data for class_data in classes if not class_data[_KEY_IS_COMPONENT]],
      _KEY_ALIASES: {name: alias for name, alias in json_data[_KEY_ALIASES].items()
                     if isInRootModules(name)},
      _KEY_SUBCLASSES: {},
    }
    for class_name, subclass_names in json_data[_KEY_SUBCLASSES].items():
      if isInRootModules(class_name) and class_name not in class_names:
        continue
      subclass_names = [name for name in subclass_names if name in class_names]
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


def _readPythonToolbox(library_directory: str):
  """Returns the contents of the library's python_toolbox.json, or an empty dict if it doesn't have
  one."""
  file_path = os.path.join(library_directory, _PYTHON_TOOLBOX_FILE)
  if not os.path.exists(file_path):
    return {}
  with open(file_path, 'r', encoding='utf-8') as json_file:
    return json.load(json_file)


def _getReferencedTypeNames(data) -> set[str]:
  """Returns the names in the argument types, return types, and variable types of the given class
  or module data. A type like list[rev.CIEColor] has more than one name."""
  types = []
  for key in [_KEY_CONSTRUCTORS, _KEY_INSTANCE_METHODS, _KEY_STATIC_METHODS, _KEY_FUNCTIONS]:
    for function_data in data.get(key, []):
      types.append(function_data[_KEY_FUNCTION_RETURN_TYPE])
      types.extend(arg_data[_KEY_ARGUMENT_TYPE] for arg_data in function_data[_KEY_FUNCTION_ARGS])
  for key in [_KEY_INSTANCE_VARIABLES, _KEY_CLASS_VARIABLES, _KEY_MODULE_VARIABLES]:
    types.extend(var_data[_KEY_VARIABLE_TYPE] for var_data in data.get(key, []))
  names = set()
  for type_string in types:
    names.update(re.findall(r'[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*', type_string or ''))
  return names


def _toSnakeCase(name: str) -> str:
  """Converts UpperCamelCase to lower_snake_case. For example, ColorSensorV3 becomes
  color_sensor_v3."""
  return re.sub(r'(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])', '_', name).lower()


def _writeJson(json_data, file_path: str, indent: int = 4, sort_keys: bool = True):
  print(f'INFO: writing file {file_path}',  file = sys.stderr)  
  with open(file_path, 'w', encoding='utf-8') as json_file:
    json.dump(json_data, json_file, sort_keys=sort_keys, indent=indent)
    json_file.write('\n')
