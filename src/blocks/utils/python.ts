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

import { robotPyData } from './robotpy_data';

// Utilities related to RobotPy modules and classes.

export function getAlias(type: string): string | null {
  const aliases: {[key: string]: string} = robotPyData.aliases;
  for (const className in aliases) {
    if (type === className) {
      return aliases[className];
    }
  }
  return null;
}

function getSubclassNames(type: string): string[] | null {
  const subclasses: {[key: string]: string[]} = robotPyData.subclasses;
  for (const className in subclasses) {
    if (type === className) {
      return subclasses[className];
    }
  }
  return null;
}

// Functions used in multiple python block definitions.

export function getAllowedTypesForSetCheck(type: string): string[] {
  // For the given python type, returns an array of compatible input types.

  // Type Aliases
  const alias = getAlias(type);
  if (alias) {
    return [type].concat(getAllowedTypesForSetCheck(alias));
  }

  // Builtin python types.
  const check = getCheckForBuiltInType(type);
  if (check) {
    return [check];
  }

  const subclassNames = getSubclassNames(type);
  if (subclassNames) {
    return subclassNames;
  }

  return [type];
}

export function getCheckForBuiltInType(type: string): string {
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

export function getOutputCheck(type: string): string {
  // For the given python type, returns the output type.
  if (type === 'None') {
    return '';
  }

  // Type Aliases
  const alias = getAlias(type);
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

// Function to return a legal name based off of proposed names and making sure it doesn't conflict
// This is a legal name for python methods and variables. 
export function getLegalName(proposedName: string, existingNames: string[]){
  let newName = proposedName.trim().replace(' ', '_');
  
  if (!/^[A-Za-z_]/.test(newName)){
      newName = "_" + newName;
  }
      
  while (existingNames.includes(newName)){
      const match = /(.*?)(\d+)$/.exec(newName)

      if(match){
          let lastNumber  = +match[2]
          newName = match[1] + (lastNumber + 1)
      }else{
          newName += "2"
      }
  }
  return newName;
}