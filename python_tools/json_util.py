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
import inspect
import json
import sys
import types
import typing

# Local modules
import python_util


_LIST_MODULE_NAME_PREFIXES_TO_IGNORE = [
  'hal',
  'ntcore',
  'wpinet',
  'wpiutil',
]

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


def ignoreModule(module_name: str) -> bool:
  for prefix in _LIST_MODULE_NAME_PREFIXES_TO_IGNORE:
    if module_name.startswith(prefix):
      return True
  return False


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
      for exported_full_class_name, exported_class_name in self._exported_class_names.items():
        if o.find(exported_full_class_name + '.') != -1:
          o = o.replace(exported_full_class_name + '.', exported_class_name + '.')
        if o.find(exported_full_class_name + ']') != -1:
          o = o.replace(exported_full_class_name + ']', exported_class_name + ']')
        if o.find(exported_full_class_name + ',') != -1:
          o = o.replace(exported_full_class_name + ',', exported_class_name + ',')
      o = o.replace('typing.SupportsInt', 'int')
      o = o.replace('typing.SupportsFloat', 'float')
      return o
    raise Exception(f'Invalid argument {o}')

  def _getPublicModules(self) -> list[types.ModuleType]:
    public_modules = []
    for m in self._modules:
      if '._' in python_util.getFullModuleName(m):
        continue
      public_modules.append(m)
    public_modules.sort(key=lambda m: python_util.getFullModuleName(m))
    return public_modules

  def _createFunctionIsEnumValue(
      self, enum_cls: type) -> typing.Callable[[object], bool]:
    return lambda value: type(value) == enum_cls

  def _createArgData(self, arg_name: str, arg_type: str, default_value: str = ''):
    arg_data = {}
    arg_data[_KEY_ARGUMENT_NAME] = arg_name
    arg_data[_KEY_ARGUMENT_TYPE] = arg_type
    arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = default_value if default_value else ''
    return arg_data

  def _processModule(self, module) -> dict:
    module_data = {}
    module_name = self._getModuleName(module)
    module_data[_KEY_MODULE_NAME] = module_name

    # Module variables.
    module_variables = []
    for key, value in inspect.getmembers(module, python_util.isNothing):
      if not python_util.isModuleVariableReadable(module, key, value):
        continue
      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = self._getClassName(type(value))
      var_data[_KEY_VARIABLE_WRITABLE] = python_util.isModuleVariableWritable(module, key, value)
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
        args = []
        for i in range(len(arg_names)):
          args.append(self._createArgData(
              arg_names[i],
              self._getClassName(arg_types[i]),
              arg_default_values[i] if arg_default_values[i] is not None else ''))
        function_data = {}
        function_data[_KEY_FUNCTION_NAME] = function_name
        function_data[_KEY_FUNCTION_RETURN_TYPE] = self._getClassName(return_type)
        function_data[_KEY_FUNCTION_ARGS] = args
        if comments[iSignature] is not None:
          function_data[_KEY_TOOLTIP] = comments[iSignature]
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
      fnIsEnumValue = self._createFunctionIsEnumValue(value)
      enum_values = []
      enum_tooltip = ''
      for keyEnum, valueEnum in inspect.getmembers(value, fnIsEnumValue):
        enum_values.append(keyEnum)
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
      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = self._getClassName(type(value), class_name)
      var_data[_KEY_VARIABLE_WRITABLE] = python_util.isClassVariableWritable(cls, key, value)
      var_data[_KEY_TOOLTIP] = ''
      class_variables.append(var_data)
    class_data[_KEY_CLASS_VARIABLES] = sorted(class_variables, key=lambda var_data: var_data[_KEY_VARIABLE_NAME])

    # Instance variables
    instance_variables = []
    for key, value in inspect.getmembers(cls, inspect.isdatadescriptor):
      if not python_util.isInstanceVariableReadable(cls, key, value):
        continue
      var_type = python_util.getVarTypeFromGetter(value.fget)
      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = self._getClassName(var_type, class_name)
      var_data[_KEY_VARIABLE_WRITABLE] = python_util.isInstanceVariableWritable(cls, key, value)
      if value.__doc__ is not None:
        var_data[_KEY_TOOLTIP] = value.__doc__
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
        constructor_data = {}
        constructor_data[_KEY_FUNCTION_NAME] = function_name
        if comments[iSignature] is not None:
          constructor_data[_KEY_TOOLTIP] = comments[iSignature]
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
          args.append(self._createArgData(
              arg_name,
              self._getClassName(arg_type, class_name),
              arg_default_values[i] if arg_default_values[i] is not None else ''))
        constructor_data[_KEY_FUNCTION_ARGS] = args
        constructor_data[_KEY_FUNCTION_DECLARING_CLASS_NAME] = declaring_class_name
        constructor_data[_KEY_FUNCTION_RETURN_TYPE] = declaring_class_name
        self._processComponent(class_data, constructor_data, declaring_class_name, arg_names, arg_types, arg_default_values)
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
        args = []
        found_self_arg = False
        for i in range(len(arg_names)):
          arg_name = arg_names[i]
          arg_type = arg_types[i]
          if i == 0 and arg_name == 'self':
            found_self_arg = True
            if arg_type != full_class_name:
              declaring_class_name = self._getClassName(arg_type, class_name)
          args.append(self._createArgData(
              arg_name,
              self._getClassName(arg_type, class_name),
              arg_default_values[i] if arg_default_values[i] is not None else ''))
        function_data = {}
        function_data[_KEY_FUNCTION_NAME] = function_name
        function_data[_KEY_FUNCTION_RETURN_TYPE] = self._getClassName(return_type, class_name)
        function_data[_KEY_FUNCTION_ARGS] = args
        function_data[_KEY_FUNCTION_DECLARING_CLASS_NAME] = declaring_class_name
        if comments[iSignature] is not None:
          function_data[_KEY_TOOLTIP] = comments[iSignature]
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
      fnIsEnumValue = self._createFunctionIsEnumValue(value)
      enum_values = []
      enum_tooltip = ''
      for keyEnum, valueEnum in inspect.getmembers(value, fnIsEnumValue):
        enum_values.append(keyEnum)
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
    return class_data


  def _processComponent(self, class_data, constructor_data, declaring_class_name, arg_names, arg_types, arg_default_values):
    """Determine whether this is a component and, if so, update the class_data and
    constructor_data."""

    # TODO(lizlooney): Replace the following temporary fake code with code that
    # looks at doc string and/or parameter type aliases to tell whether this is
    # a component and what the args are.

    if declaring_class_name == 'wpilib_placeholders.ExpansionHubMotor':
      args = []
      args.append(self._createArgData('expansion_hub_motor', 'SYSTEMCORE_USB_PORT__EXPANSION_HUB_MOTOR_PORT'))
      constructor_data[_KEY_COMPONENT_ARGS] = args
      constructor_data[_KEY_IS_COMPONENT] = True
      class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name == 'wpilib_placeholders.ExpansionHubServo':
      args = []
      args.append(self._createArgData('expansion_hub_servo', 'SYSTEMCORE_USB_PORT__EXPANSION_HUB_SERVO_PORT'))
      constructor_data[_KEY_COMPONENT_ARGS] = args
      constructor_data[_KEY_IS_COMPONENT] = True
      class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name == 'wpilib.AddressableLED':
      args = []
      args.append(self._createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'))
      constructor_data[_KEY_COMPONENT_ARGS] = args
      constructor_data[_KEY_IS_COMPONENT] = True
      class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name == 'wpilib.AnalogEncoder':
      if (len(arg_names) == 4 and
          arg_names[0] == 'self' and
          arg_names[1] == 'channel' and
          arg_names[2] == 'fullRange' and
          arg_names[3] == 'expectedZero'):
        args = []
        args.append(self._createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'))
        args.append(self._createArgData('full_range', self._getClassName(arg_types[2]), '1.0'))
        args.append(self._createArgData('expected_zero', self._getClassName(arg_types[3]), '0.0'))
        constructor_data[_KEY_COMPONENT_ARGS] = args
        constructor_data[_KEY_COMPONENT_ARGS]
        constructor_data[_KEY_IS_COMPONENT] = True
        class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name == 'wpilib.AnalogPotentiometer':
      if (len(arg_names) == 4 and
          arg_names[0] == 'self' and
          arg_names[1] == 'channel' and
          arg_names[2] == 'fullRange' and
          arg_names[3] == 'offset'):
        args = []
        args.append(self._createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'))
        args.append(self._createArgData('full_range', self._getClassName(arg_types[2]), arg_default_values[2]))
        args.append(self._createArgData('offset', self._getClassName(arg_types[3]), arg_default_values[3]))
        constructor_data[_KEY_COMPONENT_ARGS] = args
        constructor_data[_KEY_IS_COMPONENT] = True
        class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name == 'wpilib.DigitalInput':
      args = []
      args.append(self._createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'))
      constructor_data[_KEY_COMPONENT_ARGS] = args
      constructor_data[_KEY_IS_COMPONENT] = True
      class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name == 'wpilib.DutyCycleEncoder':
      if (len(arg_names) == 4 and
          arg_names[0] == 'self' and
          arg_names[1] == 'channel' and
          arg_names[2] == 'fullRange' and
          arg_names[3] == 'expectedZero'):
        args = []
        args.append(self._createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'))
        args.append(self._createArgData('full_range', self._getClassName(arg_types[2]), '1'))
        args.append(self._createArgData('expected_zero', self._getClassName(arg_types[3]), '0'))
        constructor_data[_KEY_COMPONENT_ARGS] = args
        constructor_data[_KEY_IS_COMPONENT] = True
        class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name == 'wpilib.OnboardIMU':
      if (len(arg_names) == 2 and
          arg_names[0] == 'self' and
          arg_names[1] == 'mountOrientation'):
        args = []
        args.append(self._createArgData('mount_orientation', self._getClassName(arg_types[1]), arg_default_values[1]))
        constructor_data[_KEY_COMPONENT_ARGS] = args
        constructor_data[_KEY_IS_COMPONENT] = True
        class_data[_KEY_IS_COMPONENT] = True
      return

    if declaring_class_name ==  'wpilib.PWMSparkMax':
      args = []
      args.append(self._createArgData('smart_io_port', 'SYSTEMCORE_SMART_IO_PORT'))
      constructor_data[_KEY_COMPONENT_ARGS] = args
      constructor_data[_KEY_IS_COMPONENT] = True
      class_data[_KEY_IS_COMPONENT] = True

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
    json_data = self._getJsonData()
    json_file = open(file_path, 'w', encoding='utf-8')
    json.dump(json_data, json_file, sort_keys=True, indent=4)
    json_file.write('\n')
    json_file.close()
