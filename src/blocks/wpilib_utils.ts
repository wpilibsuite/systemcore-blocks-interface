/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import * as wpilibUtils from './generated/wpilib_utils';

// Functions used in multiple python block definitions.

export function getAllowedTypesForSetCheck(type) {
  // For the given python type, returns an array of compatible input types.

  // Type Aliases
  const alias = wpilibUtils.getAlias(type);
  if (alias) {
    return [type].concat(getAllowedTypesForSetCheck(alias));
  }

  // Builtin python types.
  const check = getCheckForBuiltInType(type);
  if (check) {
    return check;
  }

  const allowedTypes = wpilibUtils.getAllowedTypes(type);
  if (allowedTypes) {
    return allowedTypes;
  }

  return type;
}

export function getCheckForBuiltInType(type) {
  // If type is a built-in python type, return the blockly check for it.
  if (type === 'bool') {
    return 'Boolean';
  }
  if (type === 'str') {
    return 'String';
  }
  if (type === 'float' || type === 'int') {
    return 'Number';
  }
  if (type.startsWith('tuple[') && type.endsWith(']')) {
    return 'Tuple';
  }
  if (type.startsWith('dict[') && type.endsWith(']')) {
    return 'Dict';
  }
  if (type.startsWith('Optional[') && type.endsWith(']')) {
    return type.substring('Optional['.length, type.length-1);
  }
  // If type is not a built-in python type, return empty string.
  return '';
}

export function getOutputCheck(type) {
  // For the given python type, returns the output type.
  if (type === 'None') {
    return '';
  }

  // Type Aliases
  const alias = wpilibUtils.getAlias(type);
  if (alias) {
    return getOutputCheck(alias);
  }

  // Builtin python types.
  const check = getCheckForBuiltInType(type);
  if (check) {
    return check;
  }

  return type;
}
