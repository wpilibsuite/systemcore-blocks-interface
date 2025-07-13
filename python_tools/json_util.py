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


_DICT_FULL_MODULE_NAME_TO_MODULE_NAME = {
  'hal._wpiHal': 'hal',
  'hal.simulation._simulation': 'hal.simulation',

  'ntcore._ntcore': 'ntcore',
  'ntcore._ntcore.meta': 'ntcore.meta',

  'wpilib._wpilib': 'wpilib',
  'wpilib._wpilib.sysid': 'wpilib.sysid',
  'wpilib.counter._counter': 'wpilib.counter',
  'wpilib.drive._drive': 'wpilib.drive',
  'wpilib.event._event': 'wpilib.event',
  'wpilib.interfaces._interfaces': 'wpilib.interfaces',
  'wpilib.shuffleboard._shuffleboard': 'wpilib.shuffleboard',
  'wpilib.simulation._simulation': 'wpilib.simulation',

  'wpimath._controls._controls.constraint': 'wpimath.trajectory.constraint',
  'wpimath._controls._controls.controller': 'wpimath.controller',
  'wpimath._controls._controls.estimator': 'wpimath.estimator',
  'wpimath._controls._controls.optimization': 'wpimath.optimization',
  'wpimath._controls._controls.path': 'wpimath.path',
  'wpimath._controls._controls.plant': 'wpimath.system.plant',
  'wpimath._controls._controls.system': 'wpimath.system',
  'wpimath._controls._controls.trajectory': 'wpimath.trajectory',
  'wpimath.filter._filter': 'wpimath.filter',
  'wpimath.geometry._geometry': 'wpimath.geometry',
  'wpimath.interpolation._interpolation': 'wpimath.interpolation',
  'wpimath.kinematics._kinematics': 'wpimath.kinematics',
  'wpimath.spline._spline': 'wpimath.spline',

  'wpinet._wpinet': 'wpinet',

  'wpiutil._wpiutil': 'wpiutil',
  'wpiutil._wpiutil.log': 'wpiutil.log',
  'wpiutil._wpiutil.sync': 'wpiutil.sync',
  'wpiutil._wpiutil.wpistruct': 'wpiutil.wpistruct',
 }


def getModuleName(m) -> str:
  if inspect.ismodule(m):
    module_name = m.__name__
  elif isinstance(m, str):
    module_name = m
  else:
    raise Exception(f'Argument m must be a module or a module name.')
  return _DICT_FULL_MODULE_NAME_TO_MODULE_NAME.get(module_name, module_name)


def getClassName(c, containing_class_name: str = None) -> str:
  if inspect.isclass(c):
    full_class_name = python_util.getFullClassName(c)
  elif isinstance(c, str):
    if c == 'typing.Self' and containing_class_name:
      full_class_name = containing_class_name
    else:
      full_class_name = c
  else:
    raise Exception(f'Argument c must be a class or a class name.')
  for full_module_name, module_name in _DICT_FULL_MODULE_NAME_TO_MODULE_NAME.items():
    full_class_name = full_class_name.replace(full_module_name + '.', module_name + '.')
  return full_class_name


class JsonGenerator:
  def __init__(self, root_modules: list[types.ModuleType]):
    self._root_modules = root_modules
    (self._packages, self._modules, self._classes, self._dict_full_class_name_to_alias) = python_util.collectModulesAndClasses(self._root_modules)
    self._dict_full_class_name_to_subclass_names = python_util.collectSubclasses(self._classes)

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


  def _processModule(self, module) -> dict:
    module_data = {}
    module_name = getModuleName(module)
    module_data[_KEY_MODULE_NAME] = module_name

    # Module variables.
    module_variables = []
    for key, value in inspect.getmembers(module, python_util.isNothing):
      if not python_util.isModuleVariableReadable(module, key, value):
        continue
      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = getClassName(type(value))
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
          continue;
        if getModuleName(declaring_module) != getModuleName(module):
          # Check whether the imported function is exported in __all__.
          if not (key in module.__all__):
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
          arg_data = {}
          arg_data[_KEY_ARGUMENT_NAME] = arg_names[i]
          arg_data[_KEY_ARGUMENT_TYPE] = getClassName(arg_types[i])
          if arg_default_values[i] is not None:
            arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = arg_default_values[i]
          else:
            arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = ''
          args.append(arg_data)
        function_data = {}
        function_data[_KEY_FUNCTION_NAME] = function_name
        function_data[_KEY_FUNCTION_RETURN_TYPE] = getClassName(return_type)
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
      enum_class_name = getClassName(value)
      if getModuleName(value.__module__) != module_name:
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
      enum_data[_KEY_MODULE_NAME] = getModuleName(value.__module__)
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
      module_name = getModuleName(module)
      if module_name.startswith('ntcore'):
        continue
      if module_name.startswith('wpinet'):
        continue
      if module_name.startswith('wpiutil'):
        continue
      #if not hasattr(module, '__all__'):
      #  print(f'Skipping module {getModuleName(module)}')
      #  continue
      module_data = self._processModule(module)
      module_data_list.append(module_data)
    return sorted(module_data_list, key=lambda module_data: module_data[_KEY_MODULE_NAME])


  def _getPublicClasses(self) -> list[type]:
    public_classes = []
    for c in self._classes:
      class_name = getClassName(c)
      if '._' in class_name:
        continue
      public_classes.append(c)
    public_classes.sort(key=lambda c: python_util.getFullClassName(c))
    return public_classes


  def _processClass(self, cls):
    class_data = {}
    class_name = getClassName(cls)
    full_class_name = python_util.getFullClassName(cls)
    class_data[_KEY_CLASS_NAME] = class_name
    class_data[_KEY_MODULE_NAME] = getModuleName(cls.__module__)

    # Class variables.
    class_variables = []
    for key, value in inspect.getmembers(cls, python_util.isNothing):
      if not python_util.isClassVariableReadable(cls, key, value):
        continue
      var_data = {}
      var_data[_KEY_VARIABLE_NAME] = key
      var_data[_KEY_VARIABLE_TYPE] = getClassName(type(value), class_name)
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
      var_data[_KEY_VARIABLE_TYPE] = getClassName(var_type, class_name)
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
              declaring_class_name = getClassName(arg_type, class_name)
            # Don't append the self argument to the args array.
            continue;
          arg_data = {}
          arg_data[_KEY_ARGUMENT_NAME] = arg_name
          arg_data[_KEY_ARGUMENT_TYPE] = getClassName(arg_type, class_name)
          if arg_default_values[i] is not None:
            arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = arg_default_values[i]
          else:
            arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = ''
          args.append(arg_data)
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
        args = []
        found_self_arg = False
        for i in range(len(arg_names)):
          arg_name = arg_names[i]
          arg_type = arg_types[i]
          if i == 0 and arg_name == 'self':
            found_self_arg = True
            if arg_type != full_class_name:
              declaring_class_name = getClassName(arg_type, class_name)
          arg_data = {}
          arg_data[_KEY_ARGUMENT_NAME] = arg_name
          arg_data[_KEY_ARGUMENT_TYPE] = getClassName(arg_type, class_name)
          if arg_default_values[i] is not None:
            arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = arg_default_values[i]
          else:
            arg_data[_KEY_ARGUMENT_DEFAULT_VALUE] = ''
          args.append(arg_data)
        function_data = {}
        function_data[_KEY_FUNCTION_NAME] = function_name
        function_data[_KEY_FUNCTION_RETURN_TYPE] = getClassName(return_type, class_name)
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
      if not getClassName(value).startswith(class_name):
        continue
      enum_class_name = getClassName(value)
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
      enum_data[_KEY_MODULE_NAME] = getModuleName(value.__module__)
      enum_data[_KEY_ENUM_VALUES] = enum_values
      if enum_tooltip is not None:
        enum_data[_KEY_TOOLTIP] = enum_tooltip
      else:
        enum_data[_KEY_TOOLTIP] = ''
      enums.append(enum_data)
    class_data[_KEY_ENUMS] = sorted(enums, key=lambda enum_data: enum_data[_KEY_ENUM_CLASS_NAME])
    return class_data


  def _processClasses(self):
    class_data_list = []
    set_of_classes = set()
    for cls in self._getPublicClasses():
      for c in inspect.getmro(cls):
        if python_util.isBuiltInClass(c):
          break
        set_of_classes.add(c)
    for cls in set_of_classes:
      if python_util.isEnum(cls):
        continue
      module_name = getModuleName(cls.__module__)
      if module_name.startswith('ntcore'):
        continue
      if module_name.startswith('wpinet'):
        continue
      if module_name.startswith('wpiutil'):
        continue
      #module = python_util.getModule(module_name)
      #if not hasattr(module, '__all__'):
      #  print(f'Skipping class {getClassName(cls)} because module {module_name} has no __all__')
      #  continue
      #elif cls.__name__ not in module.__all__:
      #  print(f'Skipping class {getClassName(cls)} because module {module_name}.__all__ does not include {cls.__name__}')
      #  continue
      class_data = self._processClass(cls)
      class_data_list.append(class_data)
    return sorted(class_data_list, key=lambda class_data: class_data[_KEY_CLASS_NAME])


  def _processAliases(self):
    aliases = {}
    for full_class_name, alias in self._dict_full_class_name_to_alias.items():
      aliases[getClassName(full_class_name)] = getClassName(alias)
    return aliases


  def _processSubclasses(self):
    subclasses = {}
    for full_class_name, full_subclass_names in self._dict_full_class_name_to_subclass_names.items():
      list = []
      for full_subclass_name in full_subclass_names:
        list.append(getClassName(full_subclass_name))
      subclasses[getClassName(full_class_name)] = list
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
    json_file.close()
