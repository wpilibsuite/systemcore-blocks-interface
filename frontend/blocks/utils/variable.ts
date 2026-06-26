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

import { getAlias, simpleClassName } from './python';
import { pascalCaseToSnakeCase } from '../../storage/names';
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

  // TODO(lizlooney): Should the prefix "my" in my_tuple, my_dict, ... be localized?

  if (type.startsWith('tuple[') || type.startsWith('Tuple[')) {
    return 'my_tuple';
  }
  if (type.startsWith('dict[') || type.startsWith('Dict[')) {
    return 'my_dict';
  }
  if (type.startsWith('list[') || type.startsWith('List[')) {
    return 'my_list';
  }
  if (type.startsWith('callable[') || type.startsWith('Callable[')) {
    return 'my_callable';
  }
  if (type.includes('[')) {
    // The type is an array.
    return 'my_array';
  }
  // If the type has a dot, it is an object and we should provide a variable
  // block for this type.
  if (type.includes('.')) {
    return 'my_' + pascalCaseToSnakeCase(simpleClassName(type));
  }
  // Otherwise, we don't provide a variable block for this type.
  return ''
}

/** Returns a reasonable name for a label of a self argument of a block that calls an instance method. */
export function getSelfArgName(className: string): string {
  const simpleClassNameClassName = simpleClassName(className);
  return simpleClassNameClassName.charAt(0).toLowerCase() + simpleClassNameClassName.substring(1);
}
