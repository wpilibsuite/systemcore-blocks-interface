// Copyright (c) FIRST and other WPILib contributors.

import { describe, expect, test } from 'vitest';
import * as blocksLib from '../frontend/libraries/blocks_lib';
import { setInstalledLibraries } from '../frontend/libraries/library_registry';
import { Component, ModuleContent } from '../frontend/storage/module_content';
import { Module, ModuleType } from '../frontend/storage/module';
import { Project } from '../frontend/storage/project';
import { createUsageReport } from '../frontend/storage/usage_report';

const LIBRARY: blocksLib.Library = {
  metadata: {
    formatVersion: 1,
    name: 'demo',
    version: '1.2.3',
    author: 'Someone',
    summary: '',
    details: '',
    blocksVersion: '>=0.0.1',
  },
  toolboxes: {},
  wheels: [],
  pythonModules: [],
};

function makeModule(moduleType: ModuleType, className: string): Module {
  return {
    modulePath: `projects/P/${className}.${moduleType}.json`,
    moduleType,
    moduleId: className + 'Id',
    projectName: 'P',
    className,
  };
}

function component(className: string): Component {
  return { componentId: className, name: className, className, args: [] };
}

function makeBlocks(...topLevelBlocks: any[]): any {
  return { blocks: { languageVersion: 0, blocks: topLevelBlocks } };
}

describe('usage report', () => {
  test('counts libraries, blocks, and components', () => {
    const robot = makeModule(ModuleType.ROBOT, 'Robot');
    const arm = makeModule(ModuleType.MECHANISM, 'Arm');
    const unused = makeModule(ModuleType.MECHANISM, 'Unused');
    const teleop = makeModule(ModuleType.OPMODE, 'Teleop');
    const project: Project = {
      projectName: 'P',
      robot,
      mechanisms: [arm, unused],
      opModes: [teleop],
      projectInfo: {} as any,
    };

    const robotContent = new ModuleContent(
        ModuleType.ROBOT, robot.moduleId,
        makeBlocks({
          type: 'mrc_class_method_def',
          inputs: {
            STACK: {
              block: {
                type: 'controls_if',
                inputs: {
                  // The shadow isn't counted, but the block covering it is.
                  IF0: { shadow: { type: 'logic_boolean' }, block: { type: 'logic_compare' } },
                },
                next: { block: { type: 'controls_if' } },
              },
            },
          },
        }),
        [
          { moduleId: arm.moduleId, mechanismId: 'm1', name: 'leftArm', className: 'arm.Arm' },
          { moduleId: arm.moduleId, mechanismId: 'm2', name: 'rightArm', className: 'arm.Arm' },
        ],
        [component('wpilib.ExpansionHubMotor')], [], [], []);
    const armContent = new ModuleContent(
        ModuleType.MECHANISM, arm.moduleId, makeBlocks({ type: 'mrc_class_method_def' }), [],
        [component('wpilib.ExpansionHubMotor')], [component('wpilib.DigitalInput')], [], []);
    const unusedContent = new ModuleContent(
        ModuleType.MECHANISM, unused.moduleId, makeBlocks(), [],
        [component('wpilib.AnalogInput')], [], [], []);
    const teleopContent = new ModuleContent(
        ModuleType.OPMODE, teleop.moduleId,
        makeBlocks({ type: 'mrc_class_method_def' }, { type: 'mrc_opmode_details' }), [], [], [], [], []);

    setInstalledLibraries([LIBRARY]);
    try {
      const report = createUsageReport(project, new Map([
        [robot.moduleId, robotContent],
        [arm.moduleId, armContent],
        [unused.moduleId, unusedContent],
        [teleop.moduleId, teleopContent],
      ]));
      expect(report.version).toBe(blocksLib.getBlocksVersion());
      expect(report.libraries).toEqual({ demo: '1.2.3' });
      expect(report.blocks).toEqual({
        controls_if: 2,
        logic_compare: 1,
        mrc_class_method_def: 3,
        mrc_opmode_details: 1,
      });
      // The arm's components are counted once for each arm in the robot, and the unused
      // mechanism's components aren't counted.
      expect(report.components).toEqual({
        'wpilib.DigitalInput': 2,
        'wpilib.ExpansionHubMotor': 3,
      });
    } finally {
      setInstalledLibraries([]);
    }
  });
});
