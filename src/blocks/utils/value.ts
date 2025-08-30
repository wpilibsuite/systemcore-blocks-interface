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
import * as variable from './variable';
import { createNoneShadowValue } from '../mrc_none';


export function valueForFunctionArgInput(argType: string, argDefaultValue: string): any {
  const valueVarName = variable.varNameForType(argType);
  if (valueVarName) {
    return variable.createVariableGetterBlockValue(valueVarName);
  }
  if (!argDefaultValue) {
    return null;
  }
  const alias = getAlias(argType);
  if (alias) {
    argType = alias;
  }
  switch (argType) {
    case 'int':
      const intNum = parseInt(argDefaultValue, 10);
      if (!isNaN(intNum) && intNum.toString() === argDefaultValue) {
        return createNumberShadowValue(intNum);
      }
      break;
    case 'float':
      const floatNum = Number(argDefaultValue);
      if (!isNaN(floatNum)) {
        return createNumberShadowValue(floatNum)
      }
      break;
    case 'str':
      if (argDefaultValue === 'None') {
        return createNoneShadowValue()
      }
      // If argDefaultValue is surrounded by single or double quotes, it's a literal string.
      if (argDefaultValue.startsWith("'") && argDefaultValue.endsWith("'") ||
          argDefaultValue.startsWith('"') && argDefaultValue.endsWith('"')) {
        const textValue = argDefaultValue.substring(1, argDefaultValue.length-1);
        return createTextShadowValue(textValue);
      }
      break;
    case 'bool':
      if (argDefaultValue === 'True') {
        return createBooleanShadowValue(true);
      }
      if (argDefaultValue === 'False') {
        return createBooleanShadowValue(false);
      }
      break;
  }
  return null;
}

export function createNumberShadowValue(numValue: number): any {
  return {
    'shadow': {
      'type': 'math_number',
      'fields': {
        'NUM': numValue,
      },
    },
  };
}

export function createTextShadowValue(textValue: string): any {
  return {
    'shadow': {
      'type': 'text',
      'fields': {
        'TEXT': textValue,
      },
    },
  };
}

export function createBooleanShadowValue(boolValue: boolean): any {
  return {
    'shadow': {
      'type': 'logic_boolean',
      'fields': {
        'BOOL': (boolValue ? 'TRUE' : 'FALSE'),
      },
    },
  }
}
