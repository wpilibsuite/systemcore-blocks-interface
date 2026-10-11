import { describe, expect, test } from 'vitest';
import * as Blockly from 'blockly';
import {
    ModuleWithContent,
    analyzeMove,
    applyBlockEdits,
    getMovedBlockState } from '../frontend/editor/move_blocks_to_module';
import * as storageModule from '../frontend/storage/module';
import * as storageModuleContent from '../frontend/storage/module_content';

// Normally set from the translations when the app starts.
Blockly.Msg.ROBOT_LOWER_CASE = 'robot';

const ROBOT: storageModule.Module = {
  modulePath: 'p/Robot.robot.json', moduleType: storageModule.ModuleType.ROBOT,
  moduleId: 'robot', projectName: 'p', className: 'Robot',
};
const ARM: storageModule.Module = {
  modulePath: 'p/Arm.mechanism.json', moduleType: storageModule.ModuleType.MECHANISM,
  moduleId: 'arm', projectName: 'p', className: 'Arm',
};
const AUTO: storageModule.Module = {
  modulePath: 'p/Auto.opmode.json', moduleType: storageModule.ModuleType.OPMODE,
  moduleId: 'auto', projectName: 'p', className: 'Auto',
};
const TELEOP: storageModule.Module = {
  modulePath: 'p/Teleop.opmode.json', moduleType: storageModule.ModuleType.OPMODE,
  moduleId: 'teleop', projectName: 'p', className: 'Teleop',
};

const ARM_IN_ROBOT: storageModuleContent.MechanismInRobot = {
  moduleId: 'arm', mechanismId: 'armInstance', name: 'arm', className: 'arm.Arm',
};
const SECOND_ARM_IN_ROBOT: storageModuleContent.MechanismInRobot = {
  moduleId: 'arm', mechanismId: 'secondArmInstance', name: 'arm2', className: 'arm.Arm',
};

function method(methodId: string): storageModuleContent.Method {
  return { methodId, visibleName: methodId, pythonName: methodId, returnType: 'None', args: [] };
}

function component(componentId: string): storageModuleContent.Component {
  return { componentId, name: componentId, className: 'wpilib.Motor', args: [] };
}

function makeBlocks(...topLevelBlocks: any[]): any {
  return { blocks: { languageVersion: 0, blocks: topLevelBlocks } };
}

function methodDef(id: string, methodId: string, ...statements: any[]): any {
  const blockJson: any = {
    type: 'mrc_class_method_def', id,
    extraState: { methodId, canChangeSignature: true, canBeCalledWithinClass: true,
        canBeCalledOutsideClass: true, returnType: 'None', params: [] },
  };
  if (statements.length) {
    for (let i = statements.length - 1; i > 0; i--) {
      statements[i - 1].next = { block: statements[i] };
    }
    blockJson.inputs = { STACK: { block: statements[0] } };
  }
  return blockJson;
}

function callMethod(id: string, functionKind: string, methodId: string, mechanism?: storageModuleContent.MechanismInRobot): any {
  const blockJson: any = {
    type: 'mrc_call_python_function', id,
    extraState: { functionKind, returnType: 'None', args: [], methodId },
    fields: { FUNC: methodId },
  };
  if (mechanism) {
    blockJson.extraState.mechanismId = mechanism.mechanismId;
    blockJson.extraState.mechanismClassName = mechanism.className;
    blockJson.fields.MECHANISM_NAME = mechanism.name;
  }
  return blockJson;
}

function callComponent(id: string, componentId: string, mechanism?: storageModuleContent.MechanismInRobot): any {
  const blockJson: any = {
    type: 'mrc_call_python_function', id,
    extraState: { functionKind: 'instance_component', returnType: 'None', args: [], componentId,
        componentName: componentId, componentClassName: 'wpilib.Motor' },
    fields: { FUNC: 'set', COMPONENT_NAME: componentId },
  };
  if (mechanism) {
    blockJson.extraState.mechanismId = mechanism.mechanismId;
    blockJson.fields.MECHANISM_NAME = mechanism.name;
  }
  return blockJson;
}

function fireEvent(id: string, eventId: string): any {
  return {
    type: 'mrc_call_python_function', id,
    extraState: { functionKind: 'event', returnType: 'None', args: [], eventId },
    fields: { EVENT: eventId },
  };
}

function moduleWithContent(
    module: storageModule.Module,
    blocks: any,
    extra: {
      mechanisms?: storageModuleContent.MechanismInRobot[],
      components?: storageModuleContent.Component[],
      privateComponents?: storageModuleContent.Component[],
      methods?: storageModuleContent.Method[],
    } = {}): ModuleWithContent {
  const text = storageModuleContent.makeModuleContentText(
      module, blocks, extra.mechanisms, extra.components, extra.privateComponents, [], extra.methods);
  return { module, content: storageModuleContent.parseModuleContentText(text) };
}

function copyDataFor(blockState: any): Blockly.clipboard.BlockCopyData {
  return { paster: 'block', blockState: structuredClone(blockState), typeCounts: {} };
}

/** Returns the moved blocks with their edits applied, by id. */
function movedBlocksById(plan: ReturnType<typeof analyzeMove>): Map<string, any> {
  const byId = new Map<string, any>();
  storageModuleContent.visitAllBlockJson(makeBlocks(getMovedBlockState(plan)), (blockJson) => {
    byId.set(blockJson.id, blockJson);
  });
  return byId;
}

/** Applies the caller edits for the given module to its blocks and returns its blocks, by id. */
function callersById(plan: ReturnType<typeof analyzeMove>, moduleWithContent: ModuleWithContent): Map<string, any> {
  const blocks = moduleWithContent.content.getBlocks();
  const moduleEdits = plan.callerEdits.get(moduleWithContent.module.modulePath);
  if (moduleEdits) {
    applyBlockEdits(blocks, moduleEdits.edits);
  }
  const byId = new Map<string, any>();
  storageModuleContent.visitAllBlockJson(blocks, (blockJson) => byId.set(blockJson.id, blockJson));
  return byId;
}

describe('moving blocks between modules', () => {
  test('robot to opmode: calls to robot methods go through the robot', () => {
    const moved = methodDef('def', 'moved',
        callMethod('callPublic', 'instance_within', 'public'),
        callMethod('callOverride', 'instance_within', 'periodic'),
        callMethod('callSelf', 'instance_within', 'moved'),
        callComponent('callMotor', 'motor'));
    const robot = moduleWithContent(ROBOT,
        makeBlocks(moved, methodDef('other', 'other', callMethod('robotCaller', 'instance_within', 'moved'))),
        { components: [component('motor')], methods: [method('public'), method('moved')] });
    const auto = moduleWithContent(AUTO, makeBlocks(callMethod('autoCaller', 'instance_robot', 'moved')));
    const teleop = moduleWithContent(TELEOP, makeBlocks(callMethod('teleopCaller', 'instance_robot', 'moved')));

    const plan = analyzeMove(copyDataFor(moved), 'def', ROBOT, AUTO, [robot, auto, teleop], true);

    const movedById = movedBlocksById(plan);
    expect(movedById.get('callPublic').extraState.functionKind).toBe('instance_robot');
    // A method that can't be called from outside the robot can't be called from the opmode.
    expect(movedById.get('callOverride').extraState.functionKind).toBe('instance_within');
    expect(movedById.get('callSelf').extraState.functionKind).toBe('instance_within');
    expect(movedById.get('callMotor').extraState.mechanismId).toBeUndefined();

    expect(callersById(plan, auto).get('autoCaller').extraState.functionKind).toBe('instance_within');
    expect(plan.callerEdits.has(TELEOP.modulePath)).toBe(false);

    expect(plan.breakages).toEqual([
      { moduleName: null, kind: 'call', label: 'periodic()' },
      { moduleName: 'Robot', kind: 'call', label: 'moved()' },
      { moduleName: 'Teleop', kind: 'call', label: 'robot.moved()' },
    ]);
    expect(plan.componentsToMove).toEqual([]);
  });

  test('robot to a mechanism with one instance: callers go through the mechanism', () => {
    const moved = methodDef('def', 'moved',
        callComponent('callMotor', 'motor'),
        callComponent('callArmMotor', 'armMotor', ARM_IN_ROBOT),
        callMethod('callArmMethod', 'instance_mechanism', 'armMethod', ARM_IN_ROBOT));
    const robot = moduleWithContent(ROBOT,
        makeBlocks(moved, methodDef('other', 'other', callMethod('robotCaller', 'instance_within', 'moved'))),
        { mechanisms: [ARM_IN_ROBOT], components: [component('motor')], methods: [method('moved')] });
    const arm = moduleWithContent(ARM, makeBlocks(),
        { components: [component('armMotor')], methods: [method('armMethod')] });
    const auto = moduleWithContent(AUTO, makeBlocks(callMethod('autoCaller', 'instance_robot', 'moved')));

    const plan = analyzeMove(copyDataFor(moved), 'def', ROBOT, ARM, [robot, arm, auto], true);

    const movedById = movedBlocksById(plan);
    expect(movedById.get('callArmMotor').extraState.mechanismId).toBeUndefined();
    expect(movedById.get('callArmMotor').fields.MECHANISM_NAME).toBeUndefined();
    expect(movedById.get('callArmMethod').extraState.functionKind).toBe('instance_within');

    const robotCaller = callersById(plan, robot).get('robotCaller');
    expect(robotCaller.extraState.functionKind).toBe('instance_mechanism');
    expect(robotCaller.extraState.mechanismId).toBe('armInstance');
    expect(robotCaller.fields.MECHANISM_NAME).toBe('arm');
    expect(callersById(plan, auto).get('autoCaller').extraState.functionKind).toBe('instance_mechanism');

    // The robot motor can't be used from the mechanism, unless it is moved into the mechanism too.
    expect(plan.breakages).toEqual([
      { moduleName: null, kind: 'call', label: 'motor.set()', fixedByMovingComponentId: 'motor' },
    ]);
    expect(plan.componentsToMove.map(c => c.componentId)).toEqual(['motor']);
  });

  test('robot to a mechanism: components are only offered when the robot is open', () => {
    const moved = methodDef('def', 'moved', callComponent('callMotor', 'motor'));
    const robot = moduleWithContent(ROBOT, makeBlocks(moved),
        { mechanisms: [ARM_IN_ROBOT], components: [component('motor')] });
    const arm = moduleWithContent(ARM, makeBlocks());

    const plan = analyzeMove(copyDataFor(moved), 'def', ROBOT, ARM, [robot, arm], false);

    expect(plan.breakages).toEqual([{ moduleName: null, kind: 'call', label: 'motor.set()' }]);
    expect(plan.componentsToMove).toEqual([]);
  });

  test('robot to a mechanism with two instances: callers outside the mechanism break', () => {
    const moved = methodDef('def', 'moved');
    const robot = moduleWithContent(ROBOT,
        makeBlocks(moved, methodDef('other', 'other', callMethod('robotCaller', 'instance_within', 'moved'))),
        { mechanisms: [ARM_IN_ROBOT, SECOND_ARM_IN_ROBOT], components: [component('motor')] });
    const arm = moduleWithContent(ARM, makeBlocks());

    const plan = analyzeMove(copyDataFor(moved), 'def', ROBOT, ARM, [robot, arm], true);

    expect(plan.callerEdits.size).toBe(0);
    expect(plan.breakages).toEqual([{ moduleName: 'Robot', kind: 'call', label: 'moved()' }]);
  });

  test('mechanism to opmode: own methods and public components go through the mechanism', () => {
    const moved = methodDef('def', 'moved',
        callMethod('callArmMethod', 'instance_within', 'armMethod'),
        callComponent('callPublic', 'publicMotor'),
        callComponent('callPrivate', 'privateMotor'),
        fireEvent('fire', 'armEvent'));
    const robot = moduleWithContent(ROBOT, makeBlocks(), { mechanisms: [ARM_IN_ROBOT] });
    const arm = moduleWithContent(ARM,
        makeBlocks(moved, methodDef('other', 'other', callMethod('armCaller', 'instance_within', 'moved'))), {
          components: [component('publicMotor')],
          privateComponents: [component('privateMotor')],
          methods: [method('armMethod'), method('moved')],
        });
    const auto = moduleWithContent(AUTO, makeBlocks());

    const plan = analyzeMove(copyDataFor(moved), 'def', ARM, AUTO, [robot, arm, auto], true);

    const movedById = movedBlocksById(plan);
    expect(movedById.get('callArmMethod').extraState.functionKind).toBe('instance_mechanism');
    expect(movedById.get('callArmMethod').extraState.mechanismId).toBe('armInstance');
    expect(movedById.get('callPublic').extraState.mechanismId).toBe('armInstance');
    expect(movedById.get('callPrivate').extraState.mechanismId).toBeUndefined();

    expect(plan.breakages).toEqual([
      { moduleName: null, kind: 'call', label: 'privateMotor.set()' },
      { moduleName: null, kind: 'fireEvent', label: 'armEvent' },
      { moduleName: 'Arm', kind: 'call', label: 'moved()' },
    ]);
  });

  test('blocks dragged from the toolbox have no callers to update', () => {
    const moved = methodDef('def', 'moved');
    const robot = moduleWithContent(ROBOT,
        makeBlocks(methodDef('other', 'other', callMethod('robotCaller', 'instance_within', 'moved'))));
    const auto = moduleWithContent(AUTO, makeBlocks());

    const plan = analyzeMove(copyDataFor(moved), null, ROBOT, AUTO, [robot, auto], true);

    expect(plan.callerEdits.size).toBe(0);
    expect(plan.breakages).toEqual([]);
  });

  test('getMovedBlockState does not change the original blocks', () => {
    const moved = methodDef('def', 'moved', callMethod('callPublic', 'instance_within', 'public'));
    const robot = moduleWithContent(ROBOT, makeBlocks(moved), { methods: [method('public')] });
    const auto = moduleWithContent(AUTO, makeBlocks());

    const plan = analyzeMove(copyDataFor(moved), 'def', ROBOT, AUTO, [robot, auto], true);
    getMovedBlockState(plan);

    expect(plan.copyData.blockState.inputs!.STACK.block!.extraState.functionKind).toBe('instance_within');
  });
});
