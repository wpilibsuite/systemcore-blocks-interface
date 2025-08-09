/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import * as storageModule from '../storage/module';
import * as toolboxItems from './items';
import { createMechanismBlock } from '../blocks/mrc_mechanism';
import { getAllPossibleComponents } from '../blocks/mrc_component';
import {
    getInstanceComponentBlocks,
    addInstanceRobotBlocks,
    addInstanceMechanismBlocks } from '../blocks/mrc_call_python_function';
import { addRobotEventHandlerBlocks } from '../blocks/mrc_event_handler';
import { Editor } from '../editor/editor';

export function getHardwareCategory(currentModule: storageModule.Module): toolboxItems.Category {
  switch (currentModule.moduleType) {
    case storageModule.MODULE_TYPE_ROBOT:
      return {
        kind: 'category',
        name: Blockly.Msg['MRC_CATEGORY_HARDWARE'],
        contents: [
          getRobotMechanismsCategory(currentModule),
          getComponentsCategory(currentModule.moduleType),
        ]
      };
    case storageModule.MODULE_TYPE_MECHANISM:
      return getComponentsCategory(currentModule.moduleType);
    case storageModule.MODULE_TYPE_OPMODE:
      return {
        kind: 'category',
        name: Blockly.Msg['MRC_CATEGORY_ROBOT'],
        contents: [
          getRobotMechanismsCategory(currentModule),
          getRobotComponentsCategory(),
          getRobotMethodsCategory(),
          getRobotEventsCategory(),
        ]
      };
  }
  throw new Error('currentModule.moduleType has unexpected value: ' + currentModule.moduleType)
}

function getRobotMechanismsCategory(currentModule: storageModule.Module): toolboxItems.Category {
  // getRobotMechanismsCategory is called when the user is editing the robot or an opmode.
  // If the user is editing the robot, it allows the user to add a mechanism to
  // the robot or use an existing mechanism.
  // If the user is editing an opmode, it allows the user to use a mechanism that
  // was previously added to the Robot.

  const contents: toolboxItems.ContentsType[] = [];

  const editor = Editor.getCurrentEditor();

  // Include the "+ Mechanism" category if the user it editing the robot and there are any mechanism modules.
  if (currentModule.moduleType === storageModule.MODULE_TYPE_ROBOT) {
    if (editor) {
      const mechanisms = editor.getMechanisms();
      if (mechanisms.length) {
        const mechanismBlocks: toolboxItems.Block[] = [];
        mechanisms.forEach(mechanism => {
          const components = editor.getComponentsFromMechanism(mechanism);
          mechanismBlocks.push(createMechanismBlock(mechanism, components));
        });

        contents.push({
          kind: 'category',
          name: Blockly.Msg['MRC_CATEGORY_ADD_MECHANISM'],
          contents: mechanismBlocks,
        });
      }
    }
  }

  if (editor) {
    editor.getMechanismsFromRobot().forEach(mechanismInRobot => {
      const mechanismBlocks: toolboxItems.Block[] = [];

      // Add the blocks for this mechanism's methods.
      const mechanism = editor.getMechanism(mechanismInRobot);
      if (mechanism) {
        const methodsFromMechanism = editor.getMethodsFromMechanism(mechanism);
        addInstanceMechanismBlocks(mechanismInRobot, methodsFromMechanism, mechanismBlocks);

        contents.push({
          kind: 'category',
          name: mechanismInRobot.name,
          contents: mechanismBlocks,
        });
      }
    });
  }

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_MECHANISMS'],
    contents,
  };
}

function getRobotComponentsCategory(): toolboxItems.Category {
  // getRobotComponentsCategory is called when the user is editing an opmode.
  // It allows the user to use a component that was previously added to the Robot.

  const contents: toolboxItems.ContentsType[] = [];

  const editor = Editor.getCurrentEditor();

  // Get the list of components from the robot and add the blocks for calling the
  // component functions.
  if (editor) {
    const componentsFromRobot = editor.getComponentsFromRobot();
    componentsFromRobot.forEach(component => {
      // Get the blocks for this specific component.
      contents.push({
        kind: 'category',
        name: component.name,
        contents: getInstanceComponentBlocks(component),
      });
    });
  }

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_COMPONENTS'],
    contents,
  };
}

function getRobotMethodsCategory(): toolboxItems.Category {
  // getRobotMethodsCategory is called when the user is editing an opmode.
  // It allows the user to use methods there previously defined in the Robot.

  const contents: toolboxItems.ContentsType[] = [];

  // Get the list of methods from the robot and add the blocks for calling the
  // robot functions.
  const editor = Editor.getCurrentEditor();
  if (editor) {
    const methodsFromRobot = editor.getMethodsFromRobot();
    addInstanceRobotBlocks(methodsFromRobot, contents);
  }

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_METHODS'],
    contents,
  };
}

function getComponentsCategory(moduleType : string): toolboxItems.Category {
  // getComponentsCategory is called when the user is editing the robot or a
  // mechanism. It allows the user to add a component or use an existing component.

  const contents: toolboxItems.ContentsType[] = [];

  // Add the "+ Component" category
  contents.push({
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_ADD_COMPONENT'],
    contents: getAllPossibleComponents(moduleType),
  });

  // Get components from the current workspace.
  const editor = Editor.getCurrentEditor();
  if (editor) {
    const componentsFromWorkspace = editor.getComponentsFromWorkspace();
    componentsFromWorkspace.forEach(component => {
      // Get the blocks for this specific component
      contents.push({
        kind: 'category',
        name: component.name,
        contents: getInstanceComponentBlocks(component),
      });
    });
  }

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_COMPONENTS'],
    contents,
  };
}

const CUSTOM_CATEGORY_ROBOT_EVENTS = 'ROBOT_EVENTS';

// The robot events category is shown when the user is editing an opmode.
// It allows the user to create event handlers for events previously defined in the Robot.
const getRobotEventsCategory = () => ({
  kind: 'category',
  name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
  custom: CUSTOM_CATEGORY_ROBOT_EVENTS,
});

export class RobotEventsCategory {
  constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_ROBOT_EVENTS, this.robotEventsFlyout.bind(this));
  }

  public robotEventsFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    // Get the list of events from the robot and add the blocks for handling events.

    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (editor) {
      const eventsFromRobot = editor.getEventsFromRobot();
      // Remove events if there is already a corresponding handler in the workspace.
      const eventHandlerNames = editor.getEventHandlerNamesFromWorkspace();
      const eventsToShow = eventsFromRobot.filter(event => {
        return !eventHandlerNames.includes(event.name);
      });
      addRobotEventHandlerBlocks(eventsToShow, contents);
    }

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }
}
