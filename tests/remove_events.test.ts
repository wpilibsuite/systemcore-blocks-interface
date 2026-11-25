// Copyright (c) FIRST and other WPILib contributors.

import { beforeAll, describe, expect, test } from 'vitest';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { pythonGenerator } from 'blockly/python';
import * as customBlocks from '../frontend/blocks/setup_custom_blocks';
import { customTokens } from '../frontend/blocks/tokens';
import { extendedPythonGenerator } from '../frontend/editor/extended_python_generator';
import { MemoryStorage } from '../frontend/storage/memory_storage';
import * as storageModule from '../frontend/storage/module';
import * as storageModuleContent from '../frontend/storage/module_content';
import * as storageNames from '../frontend/storage/names';
import * as storageProject from '../frontend/storage/project';
import { upgradeProjectIfNecessary } from '../frontend/storage/upgrade_project';
import * as workspaces from '../frontend/blocks/utils/workspaces';

const PROJECT_NAME = 'MyRobot';

function eventBlock(id: string, eventId: string, name: string): any {
  return {
    type: 'mrc_event', id,
    extraState: { eventId, params: [{ name: 'speed', type: '' }] },
    fields: { NAME: name },
  };
}

function fireEventBlock(id: string, eventId: string, name: string): any {
  return {
    type: 'mrc_call_python_function', id,
    extraState: { functionKind: 'event', returnType: 'None', args: [{ name: 'speed', type: '' }], eventId },
    fields: { EVENT: name },
  };
}

function printBlock(id: string, text: string): any {
  return {
    type: 'text_print', id,
    inputs: { TEXT: { block: { type: 'text', id: id + '_text', fields: { TEXT: text } } } },
  };
}

/**
 * Changes the robot of the given project into one saved with 0.8.0, when events still existed. It
 * defines an event in its mrc_mechanism_component_holder block, has an mrc_event block that isn't
 * in the holder, handles the event, and fires it.
 */
async function makeRobotWithEvents(storage: MemoryStorage): Promise<void> {
  const robotPath = storageNames.makeRobotPath(PROJECT_NAME);
  const robot = JSON.parse(await storage.fetchFileContentText(robotPath));
  const holder = robot.blocks.blocks.blocks.find(
      (blockJson: any) => blockJson.type === 'mrc_mechanism_component_holder');
  holder.inputs = { EVENTS: { block: eventBlock('event1', 'eventId1', 'arm_up') } };
  robot.blocks.blocks.blocks.push(
      { ...eventBlock('event2', 'eventId2', 'arm_down'), x: 300, y: 10 },
      {
        type: 'mrc_event_handler', id: 'handler', x: 10, y: 300,
        extraState: { senderType: 'robot', params: [{ name: 'speed', type: '' }], eventId: 'eventId1' },
        fields: { SENDER: 'robot', EVENT_NAME: 'arm_up' },
        inputs: { STACK: { block: printBlock('printInHandler', 'in handler') } },
      },
      {
        ...printBlock('printBeforeFire', 'before fire'), x: 10, y: 600,
        next: { block: {
          ...fireEventBlock('fire', 'eventId1', 'arm_up'),
          next: { block: printBlock('printAfterFire', 'after fire') },
        } },
      });
  robot.events = [
    { eventId: 'eventId1', name: 'arm_up', args: [{ name: 'speed', type: '' }] },
    { eventId: 'eventId2', name: 'arm_down', args: [{ name: 'speed', type: '' }] },
  ];
  await storage.saveFile(robotPath, JSON.stringify(robot, null, 2));

  const infoPath = storageNames.makeProjectInfoPath(PROJECT_NAME);
  const info = JSON.parse(await storage.fetchFileContentText(infoPath));
  info.version = '0.8.0';
  await storage.saveFile(infoPath, JSON.stringify(info, null, 2));
}

describe('projects saved before events were removed', () => {
  beforeAll(() => {
    Object.assign(Blockly.Msg, customTokens((key: string) => key));
    const forBlock = Object.create(null);
    customBlocks.setup(forBlock);
    Object.assign(pythonGenerator.forBlock, forBlock);
    Object.assign(extendedPythonGenerator.forBlock, pythonGenerator.forBlock);
  });

  test('are upgraded, load, and generate code without the events', async () => {
    const storage = new MemoryStorage();
    await storageProject.createProject(storage, PROJECT_NAME);
    await makeRobotWithEvents(storage);

    await upgradeProjectIfNecessary(storage, PROJECT_NAME);

    const robotPath = storageNames.makeRobotPath(PROJECT_NAME);
    const robotText = await storage.fetchFileContentText(robotPath);
    expect(JSON.parse(robotText).events).toBeUndefined();
    expect(robotText).not.toContain('"mrc_event"');
    expect(robotText).not.toContain('"EVENTS"');

    const robotContent = storageModuleContent.parseModuleContentText(robotText);
    const workspace = workspaces.createHeadlessWorkspace(storageModule.ModuleType.ROBOT);
    try {
      Blockly.serialization.workspaces.load(robotContent.getBlocks(), workspace);

      // The event handler and the block that fired the event are kept, but disabled.
      const handler = workspace.getBlockById('handler')!;
      expect(handler.isEnabled()).toBe(false);
      expect(handler.getInputTargetBlock('STACK')!.id).toBe('printInHandler');
      const fire = workspace.getBlockById('fire')!;
      expect(fire.isEnabled()).toBe(false);
      expect(fire.getPreviousBlock()!.id).toBe('printBeforeFire');
      expect(fire.getNextBlock()!.id).toBe('printAfterFire');

      // The disabled blocks are still disabled after they are saved and loaded again.
      const savedBlocks = Blockly.serialization.workspaces.save(workspace);
      workspace.clear();
      Blockly.serialization.workspaces.load(savedBlocks, workspace);
      expect(workspace.getBlockById('handler')!.isEnabled()).toBe(false);
      expect(workspace.getBlockById('fire')!.isEnabled()).toBe(false);

      const module: storageModule.Robot = {
        modulePath: robotPath,
        moduleType: storageModule.ModuleType.ROBOT,
        moduleId: robotContent.getModuleId(),
        projectName: PROJECT_NAME,
        className: storageNames.CLASS_NAME_ROBOT,
      };
      const code = extendedPythonGenerator.mrcWorkspaceToCode(workspace, module);
      expect(code).not.toContain('in handler');
      expect(code).not.toContain('event');

      // The blocks around the block that fired the event still generate code.
      extendedPythonGenerator.init(workspace);
      const stackCode = extendedPythonGenerator.blockToCode(workspace.getBlockById('printBeforeFire'));
      expect(stackCode).toBe("print('before fire')\nprint('after fire')\n");
    } finally {
      workspaces.destroyHeadlessWorkspace(workspace);
    }
  });
});
