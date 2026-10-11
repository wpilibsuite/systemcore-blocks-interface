import { beforeAll, describe, expect, test } from 'vitest';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import {
    getDifferentTypeWarning,
    registerVariableMap,
    updateVariableTypes } from '../frontend/blocks/utils/variable_types';

const TABLE_TYPE = 'telemetry.TelemetryTable';

function setter(varId: string, value?: any): any {
  return {
    type: 'variables_set',
    fields: { VAR: { id: varId } },
    inputs: value ? { VALUE: { block: value } } : {},
  };
}

function getter(varId: string): any {
  return { type: 'variables_get', fields: { VAR: { id: varId } } };
}

const TABLE = { type: 'test_get_table' };
const NUMBER = { type: 'math_number', fields: { NUM: 1 } };
const TEXT = { type: 'text', fields: { TEXT: 'a' } };
const BOOLEAN = { type: 'logic_boolean', fields: { BOOL: 'TRUE' } };
const LIST = { type: 'lists_create_with', extraState: { itemCount: 0 } };
const PYTHON_LIST = { type: 'test_get_python_list' };
const TUPLE = { type: 'test_get_tuple' };
const DICT = { type: 'test_get_dict' };
const PYTHON_DICT = { type: 'test_get_python_dict' };
const UNTYPED = { type: 'test_get_untyped' };

// Loads the given variables and top level blocks into a new workspace and infers the variable
// types. Returns the workspace.
function loadAndInfer(variables: {id: string, name: string, type?: string}[], blocks: any[]) {
  const workspace = new Blockly.Workspace();
  Blockly.serialization.workspaces.load({
    variables: variables,
    blocks: { languageVersion: 0, blocks: blocks.map((block, i) => ({ ...block, id: 'block' + i, x: 0, y: i * 100 })) },
  }, workspace);
  updateVariableTypes(workspace);
  return workspace;
}

// Like loadAndInfer, but returns a function that gets the type of a variable.
function inferTypes(variables: {id: string, name: string, type?: string}[], blocks: any[]) {
  const workspace = loadAndInfer(variables, blocks);
  return (varId: string) => workspace.getVariableMap().getVariableById(varId)!.getType();
}

describe('variable types', () => {
  beforeAll(() => {
    registerVariableMap();
    Blockly.Msg['WARNING_SET_VARIABLE_DIFFERENT_TYPE'] =
        '{{variableName}} {{valueType}} {{variableType}}';
    const defineValueBlock = (blockType: string, check: string | null) => {
      Blockly.Blocks[blockType] = {
        init: function(this: Blockly.Block) {
          this.setOutput(true, check);
        },
      };
    };
    defineValueBlock('test_get_table', TABLE_TYPE);
    defineValueBlock('test_get_python_list', 'list[wpimath.geometry.Pose2d]');
    defineValueBlock('test_get_tuple', 'Tuple');
    defineValueBlock('test_get_dict', 'Dict');
    defineValueBlock('test_get_python_dict', 'Dict[str, wpimath.geometry.Pose2d]');
    defineValueBlock('test_get_untyped', null);
  });

  test('a variable gets the class of the value assigned to it', () => {
    const typeOf = inferTypes([{ id: 'v', name: 'my_variable' }], [setter('v', TABLE)]);
    expect(typeOf('v')).toBe(TABLE_TYPE);
  });

  test('a variable gets the primitive type of the value assigned to it', () => {
    const typeOf = inferTypes(
        [{ id: 'n', name: 'n' }, { id: 's', name: 's' }, { id: 'b', name: 'b' }],
        [setter('n', NUMBER), setter('s', TEXT), setter('b', BOOLEAN)]);
    expect(typeOf('n')).toBe('Number');
    expect(typeOf('s')).toBe('String');
    expect(typeOf('b')).toBe('Boolean');
  });

  test('a variable assigned a list or a tuple gets the list or tuple type', () => {
    const typeOf = inferTypes(
        [{ id: 'l', name: 'l' }, { id: 'p', name: 'p' }, { id: 't', name: 't' }],
        [setter('l', LIST), setter('p', PYTHON_LIST), setter('t', TUPLE)]);
    expect(typeOf('l')).toBe('Array');
    expect(typeOf('p')).toBe('Array');
    expect(typeOf('t')).toBe('Tuple');
  });

  test('a variable assigned a dictionary gets the dictionary type', () => {
    const typeOf = inferTypes(
        [{ id: 'd', name: 'd' }, { id: 'p', name: 'p' }],
        [setter('d', DICT), setter('p', PYTHON_DICT)]);
    expect(typeOf('d')).toBe('Dict');
    expect(typeOf('p')).toBe('Dict');
  });

  test('assigning a list to a number variable gets a warning', () => {
    const workspace = loadAndInfer(
        [{ id: 'v', name: 'v' }], [setter('v', NUMBER), setter('v', LIST)]);
    expect(workspace.getVariableMap().getVariableById('v')!.getType()).toBe('Number');
    expect(getDifferentTypeWarning(workspace.getBlockById('block1')!)).toBe('v Array Number');
  });

  test('a variable keeps its type when it is also assigned a value of another type', () => {
    const workspace = loadAndInfer(
        [{ id: 'v', name: 'v', type: TABLE_TYPE }], [setter('v', NUMBER), setter('v', TABLE)]);
    expect(workspace.getVariableMap().getVariableById('v')!.getType()).toBe(TABLE_TYPE);
    expect(getDifferentTypeWarning(workspace.getBlockById('block0')!)).toBe('v Number ' + TABLE_TYPE);
    expect(getDifferentTypeWarning(workspace.getBlockById('block1')!)).toBeNull();
  });

  test('an untyped variable assigned values of different types gets the first type', () => {
    const workspace = loadAndInfer(
        [{ id: 'v', name: 'v' }], [setter('v', NUMBER), setter('v', TEXT)]);
    expect(workspace.getVariableMap().getVariableById('v')!.getType()).toBe('Number');
    expect(getDifferentTypeWarning(workspace.getBlockById('block0')!)).toBeNull();
    expect(getDifferentTypeWarning(workspace.getBlockById('block1')!)).toBe('v String Number');
  });

  test('a value without a type is ignored', () => {
    const workspace = loadAndInfer(
        [{ id: 'v', name: 'v' }],
        [setter('v', NUMBER), setter('v', UNTYPED)]);
    expect(workspace.getVariableMap().getVariableById('v')!.getType()).toBe('Number');
    expect(getDifferentTypeWarning(workspace.getBlockById('block1')!)).toBeNull();
  });

  test('a variable assigned only values without a type is untyped', () => {
    const typeOf = inferTypes(
        [{ id: 'v', name: 'v', type: 'Number' }],
        [setter('v', UNTYPED)]);
    expect(typeOf('v')).toBe('');
  });

  test('a variable without values assigned to it keeps its type', () => {
    const typeOf = inferTypes([{ id: 'v', name: 'v', type: TABLE_TYPE }], [setter('v')]);
    expect(typeOf('v')).toBe(TABLE_TYPE);
  });

  test('a variable assigned another variable gets the type of the other variable', () => {
    const typeOf = inferTypes(
        [{ id: 'a', name: 'a' }, { id: 'b', name: 'b' }, { id: 'c', name: 'c' }],
        // c is set from b before b is set from a, so the types take more than one pass.
        [setter('c', getter('b')), setter('b', getter('a')), setter('a', TABLE)]);
    expect(typeOf('a')).toBe(TABLE_TYPE);
    expect(typeOf('b')).toBe(TABLE_TYPE);
    expect(typeOf('c')).toBe(TABLE_TYPE);
  });

  test('referencing a variable by name with another type uses the existing variable', () => {
    const workspace = new Blockly.Workspace();
    const variableMap = workspace.getVariableMap();
    const existing = variableMap.createVariable('my_table', TABLE_TYPE);
    expect(variableMap.createVariable('my_table', '')).toBe(existing);
    expect(variableMap.createVariable('MY_TABLE', '', 'new_id')).toBe(existing);
    expect(variableMap.getAllVariables().length).toBe(1);
  });
});
