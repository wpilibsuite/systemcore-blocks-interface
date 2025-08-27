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
  methodId: string, // The mrcMethodId of the mrc_class_method_def block that defines the method.
  visibleName: string,
  pythonName: string,
  returnType: string, // 'None' for no return value, '' for an untyped return value.
  args: MethodArg[],
};

export type MechanismInRobot = {
  moduleId: string // The id of the mechanism module.
  mechanismId: string, // The mrcMechanismId of the mrc_mechanism block that adds the mechanism to the robot.
  name: string,
  className: string, // Includes the module name, for example 'game_piece_shooter.GamePieceShooter'.
}

export type Component = {
  componentId: string, // The mrcComponentId of the mrc_component block that adds the component to the robot or to a mechanism.
  name: string,
  className: string, // Includes the module name, for example 'smart_motor.SmartMotor'.
  ports: {[port: string]: string}, // The value is the type.
}

export type Event = {
  eventId: string, // The mrcEventId of the mrc_event block that defines the event.
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
    moduleType: storageModule.ModuleType.ROBOT,
    moduleId: Blockly.utils.idGenerator.genUid(),
    projectName: projectName,
    className: storageNames.CLASS_NAME_ROBOT,
  };

  return startingBlocksToModuleContentText(module, startingRobotBlocks);
}

/**
 * Returns the module content for a new Mechanism.
 */
export function newMechanismContent(projectName: string, mechanismClassName: string): string {
  const module: storageModule.Mechanism = {
    modulePath: storageNames.makeModulePath(projectName, mechanismClassName, storageModule.ModuleType.MECHANISM),
    moduleType: storageModule.ModuleType.MECHANISM,
    moduleId: Blockly.utils.idGenerator.genUid(),
    projectName: projectName,
    className: mechanismClassName,
  };

  return startingBlocksToModuleContentText(module, startingMechanismBlocks);
}

/**
 * Returns the module content for a new OpMode.
 */
export function newOpModeContent(projectName: string, opModeClassName: string): string {
  const module: storageModule.OpMode = {
    modulePath: storageNames.makeModulePath(projectName, opModeClassName, storageModule.ModuleType.OPMODE),
    moduleType: storageModule.ModuleType.OPMODE,
    moduleId: Blockly.utils.idGenerator.genUid(),
    projectName: projectName,
    className: opModeClassName,
  };

  return startingBlocksToModuleContentText(module, startingOpModeBlocks);
}

/**
 * Make the module content from the given python code and blocks content.
 * If the given module has an empty moduleId field, it will be set to a valid id.
 */
export function makeModuleContentText(
    module: storageModule.Module,
    blocks: { [key: string]: any },
    mechanisms: MechanismInRobot[],
    components: Component[],
    events: Event[],
    methods: Method[]): string {
  if (!module.moduleId) {
    module.moduleId = Blockly.utils.idGenerator.genUid();
  }
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
  fixOldParsedContent(parsedContent);
  return new ModuleContent(
      parsedContent.moduleType,
      parsedContent.moduleId,
      parsedContent.blocks,
      parsedContent.mechanisms,
      parsedContent.components,
      parsedContent.events,
      parsedContent.methods);
}

// The following function allows Alan and Liz to load older projects.
// TODO(lizlooney): Remove this function.
function fixOldParsedContent(parsedContent: any): void {
  if (!('moduleId' in parsedContent)) {
    parsedContent.moduleId = '';
  }
  parsedContent.mechanisms.forEach((mechanism: any) => {
    if (!('mechanismId' in mechanism) && ('blockId' in mechanism)) {
      mechanism.mechanismId = mechanism['blockId'];
      delete mechanism['blockId'];
    }
  });
  parsedContent.components.forEach((component: any) => {
    if (!('componentId' in component) && ('blockId' in component)) {
      component.componentId = component['blockId'];
      delete component['blockId'];
    }
  });
  parsedContent.events.forEach((event: any) => {
    if (!('eventId' in event) && ('blockId' in event)) {
      event.eventId = event['blockId'];
      delete event['blockId'];
    }
  });
  parsedContent.methods.forEach((method: any) => {
    if (!('methodId' in method) && ('blockId' in method)) {
      method.methodId = method['blockId'];
      delete method['blockId'];
    }
  });
}

export class ModuleContent {
  constructor(
      private moduleType: storageModule.ModuleType,
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

  getModuleType(): storageModule.ModuleType {
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

  changeIds(): void {
    const oldIdToNewId: { [oldId: string]: string } = {}; // value is new id

    // Change the ids for the mechanisms defined in this module.
    this.mechanisms.forEach(mechanism => {
      const oldMechanismId = mechanism.mechanismId;
      mechanism.mechanismId = Blockly.utils.idGenerator.genUid();
      oldIdToNewId[oldMechanismId] = mechanism.mechanismId;
    });
    // Change the ids for the components defined in this module.
    this.components.forEach(component => {
      const oldComponentId = component.componentId;
      component.componentId = Blockly.utils.idGenerator.genUid();
      oldIdToNewId[oldComponentId] = component.componentId;
    });
    // Change the ids for the events defined in this module.
    this.events.forEach(event => {
      const oldEventId = event.eventId;
      event.eventId = Blockly.utils.idGenerator.genUid();
      oldIdToNewId[oldEventId] = event.eventId;
    });
    // Change the ids for the methods defined in this module.
    this.methods.forEach(method => {
      const oldMethodId = method.methodId;
      method.methodId = Blockly.utils.idGenerator.genUid();
      oldIdToNewId[oldMethodId] = method.methodId;
    });

    if (Object.keys(oldIdToNewId).length) {
      // Change the ids in the blocks.
      const workspace = new Blockly.Workspace();
      Blockly.serialization.workspaces.load(this.blocks, workspace);
      workspace.getAllBlocks().forEach(block => {
        if ('mrcChangeIds' in block && typeof block.mrcChangeIds === "function") {
          block.mrcChangeIds(oldIdToNewId);
        }
      });
      this.blocks = Blockly.serialization.workspaces.save(workspace);

      // Clean up the workspace
      workspace.dispose();
    }
  }
}
