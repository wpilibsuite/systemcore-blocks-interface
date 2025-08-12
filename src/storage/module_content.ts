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

import * as Blockly from 'blockly/core';
import * as storageModule from './module';
import * as storageNames from './names';
import startingOpModeBlocks from '../modules/opmode_start.json';
import startingMechanismBlocks from '../modules/mechanism_start.json';
import startingRobotBlocks from '../modules/robot_start.json';

export type MethodArg = {
  name: string,
  type: string, // '' for an untyped arg.
};

export type Method = {
  blockId: string, // ID of the mrc_class_method_def block that defines the method.
  visibleName: string,
  pythonName: string,
  returnType: string, // 'None' for no return value, '' for an untyped return value.
  args: MethodArg[],
};

export type MechanismInRobot = {
  moduleId: string // ID of the mechanism module.
  blockId: string, // ID of the mrc_mechanism block that adds the mechanism to the robot.
  name: string,
  className: string, // Includes the module name, for example 'game_piece_shooter.GamePieceShooter'.
}

export type Component = {
  blockId: string, // ID of the mrc_component block that adds the component to the robot or to a mechanism.
  name: string,
  className: string, // Includes the module name, for example 'smart_motor.SmartMotor'.
  ports: {[port: string]: string}, // The value is the type.
}

export type Event = {
  blockId: string, // ID of the mrc_event block that defines the event.
  name: string,
  args: MethodArg[],
};

function startingBlocksToModuleContentText(
    module: storageModule.Module, startingBlocks: { [key: string]: any }): string {
  const mechanisms: MechanismInRobot[] = [];
  const components: Component[] = [];
  const events: Event[] = [];
  const methods: Method[] = [];
  return makeModuleContentText(
      module,
      startingBlocks,
      mechanisms,
      components,
      events,
      methods);
}

/**
 * Returns the robot module content for a new Project.
 */
export function newRobotContent(projectName: string): string {
  const module: storageModule.Robot = {
    modulePath: storageNames.makeRobotPath(projectName),
    moduleType: storageModule.MODULE_TYPE_ROBOT,
    moduleId: Blockly.utils.idGenerator.genUid(),
    projectName: projectName,
    className: storageNames.CLASS_NAME_ROBOT,
    dateModifiedMillis: 0,
  };

  return startingBlocksToModuleContentText(module, startingRobotBlocks);
}

/**
 * Returns the module content for a new Mechanism.
 */
export function newMechanismContent(projectName: string, mechanismClassName: string): string {
  const module: storageModule.Mechanism = {
    modulePath: storageNames.makeModulePath(projectName, mechanismClassName),
    moduleType: storageModule.MODULE_TYPE_MECHANISM,
    moduleId: Blockly.utils.idGenerator.genUid(),
    projectName: projectName,
    className: mechanismClassName,
    dateModifiedMillis: 0,
  };

  return startingBlocksToModuleContentText(module, startingMechanismBlocks);
}

/**
 * Returns the module content for a new OpMode.
 */
export function newOpModeContent(projectName: string, opModeClassName: string): string {
  const module: storageModule.OpMode = {
    modulePath: storageNames.makeModulePath(projectName, opModeClassName),
    moduleType: storageModule.MODULE_TYPE_OPMODE,
    moduleId: Blockly.utils.idGenerator.genUid(),
    projectName: projectName,
    className: opModeClassName,
    dateModifiedMillis: 0,
  };

  return startingBlocksToModuleContentText(module, startingOpModeBlocks);
}

/**
 * Make the module content from the given python code and blocks content.
 */
export function makeModuleContentText(
    module: storageModule.Module,
    blocks: { [key: string]: any },
    mechanisms: MechanismInRobot[],
    components: Component[],
    events: Event[],
    methods: Method[]): string {
  const moduleContent = new ModuleContent(
      module.moduleType,
      module.moduleId,
      blocks,
      mechanisms,
      components,
      events,
      methods);
  return moduleContent.getModuleContentText();
}

export function parseModuleContentText(moduleContentText: string): ModuleContent {
  const parsedContent = JSON.parse(moduleContentText);
  if (!parsedContent.moduleId) {
    parsedContent.moduleId = Blockly.utils.idGenerator.genUid();
  }
  return new ModuleContent(
      parsedContent.moduleType,
      parsedContent.moduleId,
      parsedContent.blocks,
      parsedContent.mechanisms,
      parsedContent.components,
      parsedContent.events,
      parsedContent.methods);
}

export class ModuleContent {
  constructor(
      private moduleType: string,
      private moduleId: string,
      private blocks : { [key: string]: any },
      private mechanisms: MechanismInRobot[],
      private components: Component[],
      private events: Event[],
      private methods: Method[]) {
  }

  getModuleContentText(): string {
    return JSON.stringify(this, null, 2);
  }

  getModuleType(): string {
    return this.moduleType;
  }

  getModuleId(): string {
    return this.moduleId;
  }

  getBlocks(): { [key: string]: any } {
    return this.blocks;
  }

  getMechanisms(): MechanismInRobot[] {
    return this.mechanisms;
  }

  getComponents(): Component[] {
    return this.components;
  }

  getEvents(): Event[] {
    return this.events;
  }

  getMethods(): Method[] {
    return this.methods;
  }
}
