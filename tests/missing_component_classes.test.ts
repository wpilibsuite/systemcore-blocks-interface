import { describe, expect, test } from 'vitest';
import {
    collectComponentClassNamesFromBlocksJson,
    findMissingComponentClasses } from '../frontend/blocks/utils/missing_component_classes';
import * as blocksLib from '../frontend/libraries/blocks_lib';
import { setInstalledLibraries } from '../frontend/libraries/library_registry';

const LIBRARY_CLASS_NAME = 'demo_pkg.Sensor';

const LIBRARY: blocksLib.Library = {
  metadata: {
    formatVersion: 1,
    name: 'demo',
    version: '1.0.0',
    author: 'Someone',
    summary: '',
    details: '',
    blocksVersion: '>=0.0.1',
  },
  toolboxes: {},
  components: {
    'sensor.json': {
      className: LIBRARY_CLASS_NAME,
      moduleName: 'demo_pkg',
      constructors: [{ functionName: '__init__', args: [], componentArgs: [], isComponent: true }],
    } as any,
  },
  wheels: [],
  pythonModules: [],
};

function componentBlock(className: string, extra: any = {}): any {
  return { type: 'mrc_component', extraState: { className }, ...extra };
}

function componentMethodBlock(componentClassName: string, extra: any = {}): any {
  return { type: 'mrc_call_python_function', extraState: { functionKind: 'component', componentClassName }, ...extra };
}

function makeBlocks(...topLevelBlocks: any[]): any {
  return { blocks: { languageVersion: 0, blocks: topLevelBlocks } };
}

describe('missing component classes', () => {
  test('collects the component classes from component blocks and component method calls', () => {
    const blocks = makeBlocks(
        {
          type: 'mrc_mechanism_component_holder',
          inputs: { COMPONENTS: { block: componentBlock('a.A', { next: { block: componentBlock('b.B') } }) } },
        },
        {
          type: 'mrc_class_method_def',
          inputs: { STACK: { block: { type: 'controls_if', inputs: { DO0: { block: componentMethodBlock('c.C') } } } } },
        });
    expect([...collectComponentClassNamesFromBlocksJson(blocks)].sort()).toEqual(['a.A', 'b.B', 'c.C']);
  });

  test('leaves out disabled blocks and the blocks inside them, but not the blocks after them', () => {
    const disabled = componentBlock('a.A', {
      disabledReasons: ['MANUALLY_DISABLED'],
      inputs: { ARG0: { block: componentMethodBlock('b.B') } },
      next: { block: componentBlock('c.C') },
    });
    expect([...collectComponentClassNamesFromBlocksJson(makeBlocks(disabled))]).toEqual(['c.C']);
  });

  test('finds the classes that are not built in or from an installed library', () => {
    const moduleNameToBlocks = {
      Robot: makeBlocks(componentBlock('wpilib.ExpansionHubMotor'), componentBlock(LIBRARY_CLASS_NAME)),
      Drive: makeBlocks(componentBlock('rev.A301')),
      Teleop: makeBlocks(componentMethodBlock('rev.A301'), componentMethodBlock(LIBRARY_CLASS_NAME)),
    };
    expect(findMissingComponentClasses(moduleNameToBlocks)).toEqual([
      { className: LIBRARY_CLASS_NAME, moduleNames: ['Robot', 'Teleop'] },
      { className: 'rev.A301', moduleNames: ['Drive', 'Teleop'] },
    ]);
    setInstalledLibraries([LIBRARY]);
    try {
      expect(findMissingComponentClasses(moduleNameToBlocks)).toEqual([
        { className: 'rev.A301', moduleNames: ['Drive', 'Teleop'] },
      ]);
    } finally {
      setInstalledLibraries([]);
    }
  });
});
