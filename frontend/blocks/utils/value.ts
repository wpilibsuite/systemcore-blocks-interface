// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */

import { getAlias, getEnumData } from './python';
import { isPortType } from './python_json_types';
import * as variable from './variable';
import { createNoneBlock, createNoneShadowValue } from '../mrc_none';
import { createEnumBlock } from '../mrc_get_python_enum_value';
import { createPort } from '../mrc_port';


export function valueForFunctionArgInput(
    argType: string, argDefaultValue: string, showSimpleClassNames: boolean): any {
  const enumData = getEnumData(getAlias(argType) || argType);
  if (enumData && enumData.enumValues.length) {
    // Use the argument's default value if it has one, otherwise the first value of the enum.
    const enumValue = enumValueFromDefaultValue(argDefaultValue, enumData.enumValues) ||
        enumData.enumValues[0];
    return {
      shadow: createEnumBlock(enumValue, enumData, showSimpleClassNames),
    };
  }
  const valueVarName = variable.varNameForType(argType);
  if (valueVarName) {
    return variable.createVariableGetterBlockValue(valueVarName);
  }
  const alias = getAlias(argType);
  if (alias) {
    argType = alias;
  }
  switch (argType) {
    case 'int':
      if (argDefaultValue) {
        const intNum = parseInt(argDefaultValue, 10);
        if (!isNaN(intNum) && intNum.toString() === argDefaultValue) {
          return createNumberShadowValue(intNum);
        }
      } else {
        return createNumberBlock(0);
      }
      break;
    case 'float':
      if (argDefaultValue) {
        const floatNum = Number(argDefaultValue);
        if (!isNaN(floatNum)) {
          return createNumberShadowValue(floatNum)
        }
      } else {
        return createNumberBlock(0);
      }
      break;
    case 'str':
      if (argDefaultValue) {
        if (argDefaultValue === 'None') {
          return createNoneShadowValue();
        }
        // If argDefaultValue is surrounded by single or double quotes, it's a literal string.
        if (argDefaultValue.startsWith("'") && argDefaultValue.endsWith("'") ||
            argDefaultValue.startsWith('"') && argDefaultValue.endsWith('"')) {
          const textValue = argDefaultValue.substring(1, argDefaultValue.length-1);
          return createTextShadowValue(textValue);
        }
      } else {
        return createTextBlock('');
      }
      break;
    case 'bool':
      if (argDefaultValue) {
        if (argDefaultValue === 'True') {
          return createBooleanShadowValue(true);
        }
        if (argDefaultValue === 'False') {
          return createBooleanShadowValue(false);
        }
      } else {
        return createBooleanBlock(false);
      }
      break;
  }
  return null;
}

/**
 * Returns the enum value that the given default value of an argument refers to, or '' if it
 * doesn't refer to one of the given enum values. Default values of enum arguments look like
 * "<DebounceType.RISING: 0>".
 */
function enumValueFromDefaultValue(argDefaultValue: string, enumValues: string[]): string {
  const match = argDefaultValue.match(/^<(?:\w+\.)*(\w+): .*>$/);
  const enumValue = match ? match[1] : argDefaultValue;
  return enumValues.includes(enumValue) ? enumValue : '';
}

export function valueForComponentArgInput(argType: string, argDefaultValue: string, showSimpleClassNames: boolean): any {
  if (isPortType(argType)) {
    return createPort(argType, argDefaultValue);
  }

  const alias = getAlias(argType);
  if (alias) {
    argType = alias;
  }
  switch (argType) {
    case 'int':
      if (argDefaultValue) {
        const intNum = parseInt(argDefaultValue, 10);
        if (!isNaN(intNum) && intNum.toString() === argDefaultValue) {
          return createNumberBlock(intNum);
        }
      }
      return createNumberBlock(0);
    case 'float':
      if (argDefaultValue) {
        const floatNum = Number(argDefaultValue);
        if (!isNaN(floatNum)) {
          return createNumberBlock(floatNum);
        }
      }
      return createNumberBlock(0);
    case 'str':
      if (argDefaultValue === 'None') {
        return createNoneBlock();
      }
      // If argDefaultValue is surrounded by single or double quotes, it's a literal string.
      if (argDefaultValue.startsWith("'") && argDefaultValue.endsWith("'") ||
          argDefaultValue.startsWith('"') && argDefaultValue.endsWith('"')) {
        const textValue = argDefaultValue.substring(1, argDefaultValue.length-1);
        return createTextBlock(textValue);
      }
      return createTextBlock('');
    case 'bool':
      if (argDefaultValue === 'True') {
        return createBooleanBlock(true);
      }
      return createBooleanBlock(false);
  }

  const enumData = getEnumData(argType);
  if (enumData && enumData.enumValues.length) {
    let enumValue: string = enumData.enumValues[0];
    if (argDefaultValue) {
      for (const v of enumData.enumValues) {
        if (v === argDefaultValue) {
          enumValue = argDefaultValue;
          break;
        }
      }
    }
    return {
      block: createEnumBlock(enumValue, enumData, showSimpleClassNames),
    };
  }

  return null;
}

export function createNumberBlock(numValue: number): any {
  return {
    'block': {
      'type': 'math_number',
      'fields': {
        'NUM': numValue,
      },
    },
  };
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

export function createTextBlock(textValue: string): any {
  return {
    'block': {
      'type': 'text',
      'fields': {
        'TEXT': textValue,
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

export function createBooleanBlock(boolValue: boolean): any {
  return {
    'block': {
      'type': 'logic_boolean',
      'fields': {
        'BOOL': (boolValue ? 'TRUE' : 'FALSE'),
      },
    },
  }
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
