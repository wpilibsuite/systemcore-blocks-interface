/**
 * @license
 * Copyright 2025 Google LLC
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

import { getAlias } from './python';
import * as toolboxItems from '../../toolbox/items';


/** Returns a variable getter block that can be used as an input of another block. */
export function createVariableGetterBlockValue(varName: string): any {
  return {
    'block': {
      'type': 'variables_get',
      'fields': {
        'VAR': {
          'name': varName,
        },
      },
    },
  };
}

/** Returns a variable setter block. */
export function createVariableSetterBlock(varName: string, block: toolboxItems.Block): toolboxItems.Block {
  return {
    'kind': 'block',
    'type': 'variables_set',
    'fields': {
      'VAR': {
        'name': varName,
      },
    },
    'inputs': {
      'VALUE': {
        'block': block,
      },
    },
  }
}

/** Returns a reasonable variable name for the given type */
export function varNameForType(type: string): string {
  const alias = getAlias(type);
  if (alias) {
    type = alias;
  }
  
  if (type.startsWith('tuple[') || type.startsWith('Tuple[')) {
    return 'myTuple';
  }
  if (type.startsWith('dict[') || type.startsWith('Dict[')) {
    return 'myDict';
  }
  if (type.startsWith('list[') || type.startsWith('List[')) {
    return 'myList';
  }
  if (type.startsWith('callable[') || type.startsWith('Callable[')) {
    return 'myCallable';
  }
  if (type.includes('[')) {
    // The type is an array.
    return 'myArray';
  }
  // If the type has a dot, it is an object and we should provide a variable
  // block for this type.
  const lastDot = type.lastIndexOf('.')
  if (lastDot !== -1) {
    return 'my' + type.substring(lastDot + 1);
  }
  // Otherwise, we don't provide a variable block for this type.
  return ''
}

/** Returns a reasonable name for a label of a self argument of a block that calls an instance method. */
export function getSelfArgName(className: string): string {
  const lastDot = className.lastIndexOf('.')
  const shortClassName = (lastDot !== -1)
    ? className.substring(lastDot + 1)
    : className;
  return shortClassName.charAt(0).toLowerCase() + shortClassName.substring(1);
}
