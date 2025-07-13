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
from enum import Enum
import importlib
import inspect
import logging
import re
import sys
import types
import typing



def getModule(module_name: str) -> types.ModuleType:
  return importlib.import_module(module_name)


def getFullModuleName(module: types.ModuleType) -> str:
  return module.__name__


def getClass(full_class_name: str) -> type:
  parts = full_class_name.split(".")
  for i in range(len(parts)):
    if i == 0:
      object = getModule(parts[i])
    else:
      object = getattr(object, parts[i])
  if not inspect.isclass(object):
    raise Exception(f"Failed to find the class for {full_class_name}")
  return object


def getFullClassName(cls: type) -> str:
  match = re.fullmatch(r"\<class \'(.+)\'>", str(cls))
  if match:
    return match.group(1)
  # The following doesn't work for nested classes.
  return f"{cls.__module__}.{cls.__name__}"


def _isSignature(line: str) -> bool:
  match = re.fullmatch(r"(\w+)\((.*)\) \-\> (.+)", line)
  return True if match else False


def _findEndOfToken(text: str, i: int, delimiters: list[str]):
  stack = []
  while i < len(text):
    ch = text[i]
    if ch == "(":
      stack.append(")")
    elif ch == "[":
      stack.append("]")
    else:
      if len(stack) > 0:
        # We have some parentheses or brackets that we need to find.
        if ch == stack[-1]:
          stack.pop()
      else:
        if ch in delimiters:
          break
    i += 1
  return i


def processSignature(signature_line: str) -> tuple[str, list[str], list[str], list[str], str]:
  match = re.fullmatch(r"(\w+)\((.*)\) \-\> (.+)", signature_line)
  if not match:
    raise Exception(f"Failed to parse signature line {signature_line}")
  function_name = match.group(1)
  args = match.group(2)
  return_type = match.group(3)
  arg_names = []
  arg_types = []
  arg_default_values = []
  i = 0
  while i < len(args):
    # Get the argument name.
    iStartOfArgName = i
    # Look for ": ", which is right after the argument name.
    i = args.find(": ", iStartOfArgName)
    if i == -1:
      star_star_kwargs_ = "**kwargs"
      star_args = "*args"
      if args[iStartOfArgName:] == "*args, **kwargs":
        arg_names.append("args")
        arg_types.append("tuple")
        arg_default_values.append(None)
        arg_names.append("kwargs")
        arg_types.append("dict")
        arg_default_values.append(None)
        break
      elif args[iStartOfArgName:] == "*args":
        arg_names.append("args")
        arg_types.append("tuple")
        arg_default_values.append(None)
        break
      elif args[iStartOfArgName:] == "**kwargs":
        arg_names.append("kwargs")
        arg_types.append("dict")
        arg_default_values.append(None)
        break
      else:
        raise Exception(f"Failed to parse signature line {signature_line}")
    arg_name = args[iStartOfArgName:i]
    arg_names.append(arg_name)
    # Get the argument type.
    iStartOfArgType = i + 2 # Skip over ": "
    i = _findEndOfToken(args, iStartOfArgType, [",", " "])
    arg_type = args[iStartOfArgType:i]
    arg_types.append(arg_type)
    if i + 2 < len(args) and args[i:i + 3] == " = ":
      # Get the default value.
      iStartOfDefaultValue = i + 3 # Skip over the space
      i = _findEndOfToken(args, iStartOfDefaultValue, [","])
      arg_default_value = args[iStartOfDefaultValue:i]
      arg_default_values.append(arg_default_value)
    else:
      arg_default_values.append(None)
    if i + 1 < len(args) and args[i:i + 2] == ", ":
      i += 2 # Skip over ", "
  return (function_name, arg_names, arg_types, arg_default_values, return_type)


def ignoreMember(parent, key: str, member):
  """
  if inspect.ismodule(parent):
    if hasattr(parent, '__all__'):
      if key not in parent.__all__:
        return True
    else:
      return True
  """

  if inspect.ismodule(member):
    # Member is a module.
    if not inspect.ismodule(parent):
      return True
    if not member.__name__.startswith(parent.__name__):
      return True
    if (key == "_impl" or key == "deployinfo" or key == "version"):
      return True
    return False

  # Member is not a module.
  if key.startswith("_"):
    # In general we ignore members whose names start with _, but there are some exceptions.
    # __init__ is for constructors and we don't ignore them.
    # _ is used as a prefix for members whose name would normally begin with a number and we don't ignore them.
    if key != "__init__" and not startsWithUnderscoreDigit(key):
      return True
  return False


def startsWithUnderscoreDigit(s: str):
  return (
      s.startswith("_") and
      len(s) > 1 and s[1].isdigit())


def startsWithkUpper(s: str):
  return (
      s.startswith("k") and
      len(s) > 1 and s[1].isupper())


def isEnum(object):
  if not inspect.isclass(object):
    return False
  if issubclass(object, Enum):
    return True
  return (
      object.__doc__ and
      (object.__doc__.startswith("Members:\n\n") or object.__doc__.find("\n\nMembers:\n\n") != -1) and
      hasattr(object, "__init__") and
      inspect.isroutine(object.__init__) and
      inspect.ismethoddescriptor(object.__init__) and
      hasattr(object.__init__, "__doc__") and
      object.__init__.__doc__ == f"__init__(self: {getFullClassName(object)}, value: int) -> None\n" and
      hasattr(object, "name") and
      inspect.isdatadescriptor(object.name) and
      object.name.__doc__ == 'name(self: object) -> str\n' and
      hasattr(object, "value") and
      inspect.isdatadescriptor(object.value))


def mightBeConstructor(object):
  return (
      inspect.isroutine(object) and
      (inspect.ismethoddescriptor(object) or inspect.isfunction(object)) and
      object.__name__ == "__init__")


def isConstructor(parent, key: str, object):
  return (
      mightBeConstructor(object) and
      inspect.isclass(parent) and
      not isEnum(parent))


def isFunction(parent, key: str, object):
  return (
    inspect.isroutine(object) and
    not key.startswith("_"))


def isNothing(object):
  return (
      not inspect.ismodule(object) and
      not inspect.isclass(object) and
      not inspect.isfunction(object) and
      not inspect.isgeneratorfunction(object) and
      not inspect.isgenerator(object) and
      not inspect.iscoroutinefunction(object) and
      not inspect.iscoroutine(object) and
      not inspect.isawaitable(object) and
      not inspect.isasyncgenfunction(object) and
      not inspect.isasyncgen(object) and
      not inspect.istraceback(object) and
      not inspect.isframe(object) and
      not inspect.iscode(object) and
      not inspect.isbuiltin(object) and
      not inspect.ismethodwrapper(object) and
      not inspect.isroutine(object) and
      not inspect.isabstract(object) and
      not inspect.ismethoddescriptor(object) and
      not inspect.isdatadescriptor(object) and
      not inspect.isgetsetdescriptor(object) and
      not inspect.ismemberdescriptor(object))


def isModuleVariableReadable(parent, key: str, object):
  return (
      inspect.ismodule(parent) and
      not (key.startswith("_") and not startsWithUnderscoreDigit(key)) and
      isNothing(object) and
      not (type(object) == logging.Logger) and
      not (type(object).__module__ == "typing") and
      not (type(object).__module__ == "__future__"))


def isModuleVariableWritable(parent, key: str, object):
  return (
    isModuleVariableReadable(parent, key, object) and
    not key.isupper() and
    not startsWithkUpper(key))


def isClassVariableReadable(parent, key: str, object):
  return (
    inspect.isclass(parent) and
    not (key.startswith("_") and not startsWithUnderscoreDigit(key)) and
    isNothing(object) and
    not (isEnum(parent) and type(object) == parent) and
    not (type(object) == logging.Logger) and
    not (key == "WPIStruct" and type(object).__name__ == "PyCapsule"))


def isClassVariableWritable(parent, key: str, object):
  return (
    isClassVariableReadable(parent, key, object) and
    not key.isupper() and
    not startsWithkUpper(key))


def isInstanceVariableReadable(parent, key: str, object):
  return (
    inspect.isclass(parent) and not isEnum(parent) and
    not key.startswith("_") and
    not key.startswith("m_") and
    inspect.isdatadescriptor(object) and
    type(object) == property and
    object.fget is not None and inspect.isroutine(object.fget))


def isInstanceVariableWritable(parent, key: str, object):
  return (
    isInstanceVariableReadable(parent, key, object) and
    object.fset is not None and inspect.isroutine(object.fset))


def isTypeAlias(parent, key: str, object):
  return (
    inspect.isclass(object) and
    key and
    parent and
    object.__name__ != key and
    (inspect.ismodule(parent) or inspect.isclass(parent)))


def isOverloaded(object):
  return (
    inspect.isroutine(object) and
    object.__doc__ and object.__doc__.startswith(f"{object.__name__}(*args, **kwargs)\nOverloaded function.\n\n"))


def _annotationToType(annotation) -> str:
  if inspect.isclass(annotation):
    return getFullClassName(annotation)
  return annotation


def inspectSignature(object, cls=None) -> str:
  try:
    sig = inspect.signature(object)
    s = f"{object.__name__}("
    delimiter = ""
    for param in sig.parameters.values():
      param_name_prefix = ""
      param_type = ""
      if param.annotation != inspect.Parameter.empty:
        param_type = _annotationToType(param.annotation)
      else:
        if param.name == "self" and cls:
          param_type = getFullClassName(cls)
        elif param.name == "args":
          param_name_prefix = "*"
        elif param.name == "kwargs":
          param_name_prefix = "**"
      if param_type:
        s = f"{s}{delimiter}{param_name_prefix}{param.name}: {param_type}"
      else:
        s = f"{s}{delimiter}{param_name_prefix}{param.name}"
      delimiter = ", "
    s = f"{s})"

    if sig.return_annotation != inspect.Signature.empty:
      s = f"{s} -> {_annotationToType(sig.return_annotation)}"
    else:
      if object.__name__ == "__init__":
        s = f"{s} -> None"
  except:
    s = ""
  return s


def processFunction(object, cls=None) -> tuple[list[str], list[str]]:
  if not inspect.isroutine(object):
    raise Exception(f"Argument object must be a function. inspect.isroutine returned False.")
  signatures = []
  comments = []
  if not object.__doc__:
    signature = inspectSignature(object, cls)
    if signature:
      signatures.append(signature)
      comments.append("")
    return (signatures, comments)

  doc = re.sub(r" object at 0x[0-9a-fA-F]{9}", "", object.__doc__)

  if not isOverloaded(object):
    eolIndex = doc.find("\n")
    line = doc[:eolIndex]
    if _isSignature(line):
      signatures.append(line)
      comments.append(doc[eolIndex + 1:].strip())
    else:
      signature = inspectSignature(object, cls)
      if signature:
        signatures.append(signature)
        comments.append(doc)
    return (signatures, comments)

  signatureIndices = []
  commentEndIndices = []

  # Find the indices of the start of signatures
  expected_number = 1
  index = 0
  while True:
    s = f"\n\n{expected_number}. "
    index = doc.find(s, index)
    if index == -1:
      commentEndIndices.append(len(doc))
      break
    if expected_number > 1:
      commentEndIndices.append(index)
    index += len(s)
    signatureIndices.append(index)
    expected_number += 1

  for i in range(len(signatureIndices)):
    index = signatureIndices[i]
    eolIndex = doc.find("\n", index)
    signatures.append(doc[index:eolIndex])
    comments.append(doc[eolIndex + 1 : commentEndIndices[i]].strip())
  return (signatures, comments)


def getClassesFromSignatureLine(signature_line: str):
  classes = []
  try:
    (function_name, arg_names, arg_types, arg_default_values, return_type) = processSignature(signature_line)
    for arg_type in arg_types:
      if arg_type == "bool" or arg_type == "str" or arg_type == "float" or arg_type == "int":
        continue
      classes.append(getClass(arg_type))
    if return_type != "None" and return_type != "bool" and return_type != "str" and return_type != "float" and return_type != "int":
      classes.append(getClass(return_type))
  except:
    pass
  return classes


def _processGetter(fget: types.FunctionType) -> tuple[str, str, str, str]:
  signature_line = fget.__doc__.split("\n")[0]
  match = re.fullmatch(r"(\w*)\((\w+)\: (.+)\) \-\> (.+)", signature_line)
  if not match:
    raise Exception(f"Failed to parse signature line {signature_line}")
  var_name = match.group(1)
  self_name = match.group(2)
  self_type = match.group(3)
  var_type = match.group(4)
  return (var_name, self_name, self_type, var_type)


def getVarTypeFromGetter(fget: types.FunctionType) -> str:
  try:
    (var_name, self_name, self_type, var_type) = _processGetter(fget)
    return var_type
  except:
    return None


def _isBuiltInModuleName(first_module_name: str):
  if first_module_name in sys.stdlib_module_names:
    return True
  if first_module_name == "pybind11_builtins":
    return True
  return False


def isBuiltInModule(module: types.ModuleType):
  return _isBuiltInModuleName(getFullModuleName(module).split(".")[0])


def isBuiltInClass(cls: type):
  return _isBuiltInModuleName(cls.__module__.split(".")[0])


def _collectModulesAndClasses(
    object, packages: list[str], modules: list[types.ModuleType], classes: list[type],
    dict_class_name_to_alias: dict[str, str], ids: list[int]):
  if id(object) in ids:
    return
  ids.append(id(object))

  if inspect.ismodule(object):
    if isBuiltInModule(object):
      return
    if object not in modules:
      modules.append(object)
    if object.__package__:
      if object.__package__ not in packages:
        packages.append(object.__package__)
  if inspect.isclass(object):
    if isBuiltInClass(object):
      return
    if object not in classes:
      classes.append(object)

  for key, member in inspect.getmembers(object):
    if key == "_":
      continue
    if ignoreMember(object, key, member):
      continue

    if isTypeAlias(object, key, member):
      alias = member
      if inspect.ismodule(object):
        dict_class_name_to_alias.update({f"{getFullModuleName(object)}.{key}": getFullClassName(alias)})
      elif inspect.isclass(object):
        dict_class_name_to_alias.update({f"{getFullClassName(object)}.{key}": getFullClassName(alias)})

    if inspect.ismodule(member):
      _collectModulesAndClasses(member, packages, modules, classes, dict_class_name_to_alias, ids)
    if inspect.isclass(member):
      # Collect the classes in the base classes (including this class).
      for cls in inspect.getmro(member):
        if isBuiltInClass(cls):
          break
        _collectModulesAndClasses(cls, packages, modules, classes, dict_class_name_to_alias, ids)
    if inspect.isroutine(member) and member.__doc__:
      # Collect the classes for the function arguments and return types.
      signature_line = member.__doc__.split("\n")[0]
      for cls in getClassesFromSignatureLine(signature_line):
        if isBuiltInClass(cls):
          continue
        _collectModulesAndClasses(cls, packages, modules, classes, dict_class_name_to_alias, ids)
    if isNothing(member):
      # Collect the class of this class variable.
      cls = type(member)
      if not isBuiltInClass(cls):
        _collectModulesAndClasses(cls, packages, modules, classes, dict_class_name_to_alias, ids)
    if inspect.isdatadescriptor(member):
      if hasattr(member, "fget"):
        # Collect the class of this instance variable.
        var_type = getVarTypeFromGetter(member.fget)
        if var_type and var_type.find(".") != -1:
          try:
            cls = getClass(var_type)
          except:
            cls = None
          if cls and not isBuiltInClass(cls):
            _collectModulesAndClasses(cls, packages, modules, classes, dict_class_name_to_alias, ids)


def collectModulesAndClasses(root_modules: list[types.ModuleType]) -> tuple[list[types.ModuleType], list[type], dict[str, list[str]]]:
  packages = []
  modules = []
  classes = []
  dict_class_name_to_alias = {}
  ids = []
  for module in root_modules:
    _collectModulesAndClasses(module, packages, modules, classes, dict_class_name_to_alias, ids)
  classes.sort(key=lambda c: getFullClassName(c))
  return (packages, modules, classes, dict_class_name_to_alias)


def collectSubclasses(classes: list[type]) -> dict[str, list[str]]:
  dict_class_name_to_subclass_names = {}
  for subclass in classes:
    for base_class in subclass.__bases__:
      if isBuiltInClass(base_class):
        continue
      base_class_name = getFullClassName(base_class)
      subclass_names = dict_class_name_to_subclass_names.get(base_class_name)
      if not subclass_names:
        subclass_names = []
        dict_class_name_to_subclass_names.update({base_class_name: subclass_names})
      subclass_name = getFullClassName(subclass)
      if subclass_name not in subclass_names:
        subclass_names.append(subclass_name)
  return dict_class_name_to_subclass_names
