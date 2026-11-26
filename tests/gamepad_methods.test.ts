// Copyright (c) FIRST and other WPILib contributors.

import { describe, expect, test } from 'vitest';
import robotpyData from '../frontend/blocks/utils/generated/robotpy_data.json';
import { GAMEPAD_TYPE_NONE, GamepadTypeUtils } from '../frontend/types/GamepadType';
import { upgradeTo_0_9_0 } from '../frontend/storage/upgrade_project';

type ClassData = { className: string, instanceMethods: { functionName: string }[] };

const METHODS_BY_CLASS = new Map<string, Set<string>>();
for (const c of (robotpyData as unknown as { classes: ClassData[] }).classes) {
  METHODS_BY_CLASS.set(c.className, new Set(c.instanceMethods.map((m) => m.functionName)));
}

const TYPES = GamepadTypeUtils.getAllTypes().filter((t) => t !== GAMEPAD_TYPE_NONE);

describe('gamepad configs', () => {
  describe.each(TYPES)('%s', (type) => {
    const className = 'wpilib.' + GamepadTypeUtils.getWpilibClassName(type);
    const methods = METHODS_BY_CLASS.get(className);

    test('wpilib class exists', () => {
      expect(methods, className).toBeDefined();
    });

    test('button methods exist', () => {
      for (const [key, entry] of GamepadTypeUtils.getButtonConfig(type) ?? []) {
        for (const suffix of ['', '_pressed', '_released']) {
          expect(
              methods?.has(entry.method + suffix),
              `${className}.${entry.method}${suffix} (${key})`).toBe(true);
        }
      }
    });

    test('axis methods exist', () => {
      for (const [key, entry] of GamepadTypeUtils.getAxisConfig(type) ?? []) {
        expect(methods?.has(entry.method), `${className}.${entry.method} (${key})`).toBe(true);
      }
    });

    test('rumble and led methods exist', () => {
      if (GamepadTypeUtils.getRumbleConfig(type)) {
        expect(methods?.has('set_rumble'), `${className}.set_rumble`).toBe(true);
      }
      for (const [key, entry] of GamepadTypeUtils.getLEDConfig(type) ?? []) {
        expect(methods?.has(entry.method), `${className}.${entry.method} (${key})`).toBe(true);
      }
    });
  });

  test('the same index is the same physical position on every controller', () => {
    // Index 0 is the south face button, and index 9 is the left bumper.
    const label = (type: string, index: string) =>
        GamepadTypeUtils.getButtonConfig(type)?.get(index)?.display();
    expect(label('XBOX Gamepad', '0')).toBe('A');
    expect(label('PlayStation 4 Gamepad', '0')).toBe('Cross');
    expect(label('PlayStation 4 Gamepad', '9')).toBe('L1');
    expect(label('Steam Controller', '9')).toBe('Left Bumper');
  });
});

describe('upgradeTo_0_9_0', () => {
  const makeContent = (blocks: object[]) => JSON.stringify({
    blocks: { blocks: { blocks: blocks } },
  });

  test('replaces old button and axis names with indexes', () => {
    const upgraded = JSON.parse(upgradeTo_0_9_0(makeContent([
      {
        type: 'mrc_gamepad_boolean',
        fields: { GAMEPAD_PORT: '0', GAMEPAD_BUTTON: 'LEFT_BUMPER', GAMEPAD_ACTION: 'IS_DOWN' },
      },
      { type: 'mrc_gamepad_analog', fields: { GAMEPAD_PORT: '0', GAMEPAD_AXIS: 'RIGHT_TRIGGER' } },
      { type: 'mrc_gamepad_boolean_event', fields: { GAMEPAD_BUTTON: 'MISC6' } },
    ])));
    const blocks = upgraded.blocks.blocks.blocks;
    expect(blocks[0].fields.GAMEPAD_BUTTON).toBe('9');
    expect(blocks[1].fields.GAMEPAD_AXIS).toBe('5');
    expect(blocks[2].fields.GAMEPAD_BUTTON).toBe('25');
  });

  test('leaves generic HID button numbers and other blocks alone', () => {
    const text = makeContent([
      {
        type: 'mrc_gamepad_boolean',
        fields: { GAMEPAD_PORT: '1', GAMEPAD_BUTTON: '7', GAMEPAD_ACTION: 'IS_DOWN' },
      },
      { type: 'logic_boolean', fields: { BOOL: 'TRUE' } },
    ]);
    expect(upgradeTo_0_9_0(text)).toBe(text);
  });
});
