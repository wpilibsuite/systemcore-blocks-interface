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

import * as semver from 'semver';
import * as Blockly from 'blockly/core';

import * as commonStorage from './common_storage';
import * as componentBlock from '../blocks/mrc_component';
import * as mechanismBlock from '../blocks/mrc_mechanism';
import * as portBlock from '../blocks/mrc_port';
import * as storageModule from './module';
import * as storageModuleContent from './module_content';
import * as storageNames from './names';
import * as storageProject from './project';
import {
    upgradeTo_0_3_1 as classMethodDefUpgradeTo_0_3_1
    } from '../blocks/mrc_class_method_def';
import * as workspaces from '../blocks/utils/workspaces';

declare const __APP_VERSION__: string;

export const CURRENT_VERSION: string = __APP_VERSION__;

export async function upgradeProjectIfNecessary(
    storage: commonStorage.Storage, projectName: string): Promise<void> {
  const projectInfo = await storageProject.fetchProjectInfo(storage, projectName);

  // If only the patch version changed (same major.minor), no migration needed.
  const sameMajorMinor =
      semver.major(projectInfo.version) === semver.major(CURRENT_VERSION) &&
      semver.minor(projectInfo.version) === semver.minor(CURRENT_VERSION);
  
  if (sameMajorMinor) {
    return;
  }

  // Major or minor version changed — add migration functions here for future transitions.
  if (semver.lt(projectInfo.version, '0.3.0')) {
    await upgradeBlocksFiles(
        storage, projectName,
        anyModuleType, upgradeA301ToCanPort,
        noModuleTypes, noUpgrade);
  }
  if (semver.lt(projectInfo.version, '0.3.1')) {
     await upgradeTo_0_3_1(storage, projectName);
  }

  projectInfo.version = CURRENT_VERSION;
  await storageProject.saveProjectInfo(storage, projectName, projectInfo);
}

async function upgradeBlocksFiles(
    storage: commonStorage.Storage,
    projectName: string,
    preupgradePredicate: (moduleType: storageModule.ModuleType) => boolean,
    preupgradeFunc: (moduleContentText: string) => string,
    upgradePredicate: (moduleType: storageModule.ModuleType) => boolean,
    upgradeFunc: (w: Blockly.Workspace) => void
): Promise<void> {
  const projectFileNames: string[] = await storage.list(
    storageNames.makeProjectDirectoryPath(projectName));
  for (const projectFileName of projectFileNames) {
    if (!storageNames.isValidModuleFileName(projectFileName)) {
      continue;
    }
    const modulePath = storageNames.makeFilePath(projectName, projectFileName);
    const moduleType = storageNames.getModuleType(modulePath);
    const originalModuleContentText = await storage.fetchFileContentText(modulePath);
    let moduleContentText = originalModuleContentText;

    if (preupgradePredicate(moduleType)) {
      moduleContentText = preupgradeFunc(moduleContentText);
    }

    if (upgradePredicate(moduleType)) {
      const moduleContent = storageModuleContent.parseModuleContentText(moduleContentText);
      let blocks = moduleContent.getBlocks();

      // Create a temporary workspace to upgrade the blocks.
      const headlessWorkspace = workspaces.createHeadlessWorkspace(moduleType);

      try {
        Blockly.serialization.workspaces.load(blocks, headlessWorkspace);
        upgradeFunc(headlessWorkspace);
        blocks = Blockly.serialization.workspaces.save(headlessWorkspace);
      } finally {
        workspaces.destroyHeadlessWorkspace(headlessWorkspace);
      }

      moduleContent.setBlocks(blocks);
      moduleContentText = moduleContent.getModuleContentText();
    }

    if (moduleContentText !== originalModuleContentText) {
      await storage.saveFile(modulePath, moduleContentText);
    }
  }
}

/** Predicate: all module types are affected. */
function anyModuleType(_moduleType: storageModule.ModuleType): boolean {
  return true;
}

/** Predicate: only OpMode modules are affected. */
// @ts-expect-error: declared but not used
function isOpMode(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.OPMODE;
}

/** Predicate: only Mechanism modules are affected. */
function isMechanism(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.MECHANISM;
}

/** Predicate: only Robot modules are affected. */
// @ts-expect-error: declared but not used
function isRobot(moduleType: storageModule.ModuleType): boolean {
  return moduleType === storageModule.ModuleType.ROBOT;
}

/** Predicate: no modules are affected. */
function noModuleTypes(_moduleType: storageModule.ModuleType): boolean {
  return false;
}

/** Pre-upgrade passthrough: makes no changes to moduleContentText. */
function noPreupgrade(moduleContentText: string): string {
  return moduleContentText;
}

/** Upgrade passthrough: makes no changes to the workspace. */
function noUpgrade(_workspace: Blockly.Workspace): void {
}

// Upgrade from before 0.3.0: rev.A301 used to take two int arguments, busId and deviceId.
// It now takes a single port argument, so that A301s can be checked for using the same
// CAN bus and device id as another component.

const A301_CLASS_NAME = 'rev.A301';
const A301_ARG_NAME = 'a301';
const A301_ARG_TYPE = 'SYSTEMCORE_CAN_PORT__CAN_DEVICE_ID';
// The bus id defaults to 5, which is the first MotionCore CAN bus, shown as MC00. The
// device id defaults to 3, which is the device id an A301 has out of the factory.
const A301_ARG_DEFAULT_VALUE = '5__3';
const A301_OLD_BUS_ID_ARG_NAME = 'busId';
const A301_OLD_DEVICE_ID_ARG_NAME = 'deviceId';
const A301_OLD_ARG_TYPE = 'int';

const MATH_NUMBER_BLOCK_NAME = 'math_number';
const MATH_NUMBER_FIELD_NUM = 'NUM';
const INPUT_ARG_PREFIX = 'ARG';

/** The largest bus id that the CAN bus dropdown offers. */
const MAX_CAN_BUS_ID = 24;
/** The largest device id that the CAN device id dropdown offers. */
const MAX_CAN_DEVICE_ID = 15;

/** The single port argument that replaces the old busId and deviceId arguments. */
function makeA301Arg(): storageModuleContent.MethodArg {
  return {
    name: A301_ARG_NAME,
    type: A301_ARG_TYPE,
    defaultValue: A301_ARG_DEFAULT_VALUE,
  };
}

/** Returns whether the given args are the old busId and deviceId arguments. */
function isOldA301Args(args: any): boolean {
  return Array.isArray(args) && args.length === 2 &&
      args[0].name === A301_OLD_BUS_ID_ARG_NAME && args[0].type === A301_OLD_ARG_TYPE &&
      args[1].name === A301_OLD_DEVICE_ID_ARG_NAME && args[1].type === A301_OLD_ARG_TYPE;
}

/**
 * Returns whether the given mechanism block parameters are the old busId and deviceId
 * arguments of a single A301 component. The robot module doesn't say which class each of a
 * mechanism's components is, so we have to recognize the arguments themselves.
 */
function isOldA301ParameterPair(parameter: any, nextParameter: any): boolean {
  return parameter.componentId !== undefined &&
      parameter.componentId === nextParameter.componentId &&
      parameter.name === A301_OLD_BUS_ID_ARG_NAME && parameter.type === A301_OLD_ARG_TYPE &&
      parameter.componentArgsIndex === 0 &&
      nextParameter.name === A301_OLD_DEVICE_ID_ARG_NAME &&
      nextParameter.type === A301_OLD_ARG_TYPE &&
      nextParameter.componentArgsIndex === 1;
}

/**
 * Returns the value of the math_number block plugged into the given input, or null if the
 * input is empty or holds some other kind of block.
 */
function getMathNumberValue(input: any): string | null {
  if (!input || !input.block || input.block.type !== MATH_NUMBER_BLOCK_NAME) {
    return null;
  }
  const fields = input.block.fields;
  if (!fields || fields[MATH_NUMBER_FIELD_NUM] === undefined ||
      fields[MATH_NUMBER_FIELD_NUM] === null) {
    return null;
  }
  return String(fields[MATH_NUMBER_FIELD_NUM]);
}

/**
 * Returns the input holding the port block that replaces the old busId and deviceId
 * math_number blocks, or null if either of them is missing.
 */
function makeA301PortInput(busIdInput: any, deviceIdInput: any, where: string): any {
  const busId = getMathNumberValue(busIdInput);
  const deviceId = getMathNumberValue(deviceIdInput);
  if (busId === null || deviceId === null) {
    console.warn('upgrade to 0.3.0: could not read the bus id and device id of the A301 in ' +
        where + '. Its port will have to be filled in again.');
    return null;
  }
  // The dropdowns can only show values that they offer, so tell the user if we are about to
  // put a value into one that it doesn't have.
  if (Number(busId) < 0 || Number(busId) > MAX_CAN_BUS_ID) {
    console.warn('upgrade to 0.3.0: the A301 in ' + where + ' has bus id ' + busId +
        ', which is not a bus that can be selected.');
  }
  if (Number(deviceId) < 0 || Number(deviceId) > MAX_CAN_DEVICE_ID) {
    console.warn('upgrade to 0.3.0: the A301 in ' + where + ' has device id ' + deviceId +
        ', which is not a device id that can be selected.');
  }
  return portBlock.createPort(A301_ARG_TYPE, busId + '__' + deviceId);
}

/**
 * Changes the two int arguments of every rev.A301 component into a single port argument.
 */
export function upgradeA301ToCanPort(moduleContentText: string): string {
  const parsedContent = JSON.parse(moduleContentText);
  let changed = false;

  // Update the components metadata, which has its own copy of each component's args.
  ['components', 'privateComponents'].forEach(key => {
    const components = parsedContent[key];
    if (!Array.isArray(components)) {
      return;
    }
    components.forEach((component: any) => {
      if (component.className === A301_CLASS_NAME && isOldA301Args(component.args)) {
        component.args = [makeA301Arg()];
        changed = true;
      }
    });
  });

  // Update the blocks.
  storageModuleContent.getTopLevelBlocksJson(parsedContent.blocks).forEach((blockJson: any) => {
    if (upgradeA301InBlockJson(blockJson)) {
      changed = true;
    }
  });

  return changed ? JSON.stringify(parsedContent, null, 2) : moduleContentText;
}

/** Updates the given block and every block below it. */
function upgradeA301InBlockJson(blockJson: any): boolean {
  if (!blockJson || typeof blockJson !== 'object') {
    return false;
  }
  let changed = false;

  if (blockJson.type === componentBlock.BLOCK_NAME) {
    if (upgradeA301InComponentBlockJson(blockJson)) {
      changed = true;
    }
  } else if (blockJson.type === mechanismBlock.BLOCK_NAME) {
    if (upgradeA301InMechanismBlockJson(blockJson)) {
      changed = true;
    }
  }

  if (blockJson.inputs) {
    for (const inputName in blockJson.inputs) {
      const input = blockJson.inputs[inputName];
      if (input && input.block && upgradeA301InBlockJson(input.block)) {
        changed = true;
      }
    }
  }
  if (blockJson.next && blockJson.next.block &&
      upgradeA301InBlockJson(blockJson.next.block)) {
    changed = true;
  }
  return changed;
}

/**
 * Updates an mrc_component block for an A301. Only a component in the robot module has
 * inputs for its args. A component in a mechanism module gets its ports from the robot.
 */
function upgradeA301InComponentBlockJson(blockJson: any): boolean {
  const extraState = blockJson.extraState;
  if (!extraState || extraState.className !== A301_CLASS_NAME ||
      !isOldA301Args(extraState.params)) {
    return false;
  }
  extraState.params = [makeA301Arg()];

  if (blockJson.inputs) {
    const componentName = blockJson.fields
        ? blockJson.fields[componentBlock.FIELD_NAME] : A301_CLASS_NAME;
    const portInput = makeA301PortInput(
        blockJson.inputs[INPUT_ARG_PREFIX + 0],
        blockJson.inputs[INPUT_ARG_PREFIX + 1],
        componentName);
    if (portInput) {
      blockJson.inputs[INPUT_ARG_PREFIX + 0] = portInput;
    } else {
      delete blockJson.inputs[INPUT_ARG_PREFIX + 0];
    }
    delete blockJson.inputs[INPUT_ARG_PREFIX + 1];
  }
  return true;
}

/**
 * Updates an mrc_mechanism block, whose parameters are the args of all of the mechanism's
 * components, flattened into a single list. Each A301 contributes two parameters that
 * become one, so the parameters after it shift down and their inputs are renumbered.
 */
function upgradeA301InMechanismBlockJson(blockJson: any): boolean {
  const parameters = blockJson.extraState ? blockJson.extraState.parameters : null;
  if (!Array.isArray(parameters)) {
    return false;
  }
  const mechanismName = blockJson.fields
      ? blockJson.fields[mechanismBlock.FIELD_NAME] : '';
  const oldInputs = blockJson.inputs ? blockJson.inputs : {};
  const newParameters: any[] = [];
  const newInputs: {[key: string]: any} = {};
  let changed = false;

  let iOld = 0;
  while (iOld < parameters.length) {
    const parameter = parameters[iOld];
    const nextParameter = iOld + 1 < parameters.length ? parameters[iOld + 1] : null;
    const iNew = newParameters.length;
    if (nextParameter && isOldA301ParameterPair(parameter, nextParameter)) {
      newParameters.push({
        ...makeA301Arg(),
        componentId: parameter.componentId,
        componentName: parameter.componentName,
        componentArgsIndex: 0,
      });
      const portInput = makeA301PortInput(
          oldInputs[INPUT_ARG_PREFIX + iOld],
          oldInputs[INPUT_ARG_PREFIX + (iOld + 1)],
          mechanismName + '.' + parameter.componentName);
      if (portInput) {
        newInputs[INPUT_ARG_PREFIX + iNew] = portInput;
      }
      iOld += 2;
      changed = true;
    } else {
      newParameters.push(parameter);
      const oldInput = oldInputs[INPUT_ARG_PREFIX + iOld];
      if (oldInput) {
        newInputs[INPUT_ARG_PREFIX + iNew] = oldInput;
      }
      iOld += 1;
    }
  }

  if (!changed) {
    return false;
  }
  blockJson.extraState.parameters = newParameters;
  if (Object.keys(newInputs).length) {
    blockJson.inputs = newInputs;
  } else {
    delete blockJson.inputs;
  }
  return true;
}

// Upgrade from before 0.3.1: snake_case!

async function upgradeTo_0_3_1(
    storage: commonStorage.Storage,
    projectName: string): Promise<void> {
  // mrc_class_method_def blocks for mechanism 'opmodeStart' method need to be changed to 'opmode_start'.
  // mrc_class_method_def blocks for mechanism 'opmodePeriodic' method need to be changed to 'opmode_periodic'.
  // mrc_class_method_def blocks for mechanism 'opmodeEnd' method need to be changed to 'opmode_end'.
  await upgradeBlocksFiles(
      storage, projectName,
      noModuleTypes, noPreupgrade,
      isMechanism, classMethodDefUpgradeTo_0_3_1);
}
