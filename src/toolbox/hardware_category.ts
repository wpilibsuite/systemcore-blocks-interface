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
import { getRobotEventHandlersCategory, getMechanismEventHandlersCategory } from './event_handlers_category';
import { createMechanismBlock } from '../blocks/mrc_mechanism';
import { getAllPossibleComponents } from '../blocks/mrc_component';
import {
    getInstanceComponentBlocks,
    getInstanceMechanismComponentBlocks,
    addInstanceRobotBlocks,
    addInstanceMechanismBlocks } from '../blocks/mrc_call_python_function';
import { Editor } from '../editor/editor';

export function getHardwareCategory(
    editor: Editor): toolboxItems.Category {

  const moduleType = editor.getCurrentModuleType();
  switch (moduleType) {
    case storageModule.ModuleType.ROBOT:
      return {
        kind: 'category',
        name: Blockly.Msg['MRC_CATEGORY_HARDWARE'],
        contents: [
          getRobotMechanismsCategory(editor),
          getComponentsCategory(editor, moduleType),
        ],
      };
    case storageModule.ModuleType.MECHANISM:
      return getComponentsCategory(editor, moduleType);
    case storageModule.ModuleType.OPMODE:
      return {
        kind: 'category',
        name: Blockly.Msg['MRC_CATEGORY_ROBOT'],
        contents: [
          getRobotMechanismsCategory(editor),
          getRobotComponentsCategory(editor),
          getRobotMethodsCategory(editor),
          getRobotEventHandlersCategory(editor),
        ],
      };
  }
  throw new Error('moduleType has unexpected value: ' + moduleType);
}

function getRobotMechanismsCategory(editor: Editor): toolboxItems.Category {
  // getRobotMechanismsCategory is called when the user is editing the robot or an opmode.
  // If the user is editing the robot, it allows the user to add a mechanism to
  // the robot or use an existing mechanism.
  // If the user is editing an opmode, it allows the user to use a mechanism that
  // was previously added to the Robot.

  const contents: toolboxItems.ContentsType[] = [];

  // Include the "+ Mechanism" category if the user it editing the robot and there are any mechanism modules.
  if (editor.getCurrentModuleType() === storageModule.ModuleType.ROBOT) {
    const mechanisms = editor.getMechanisms();
    if (mechanisms.length) {
      const mechanismBlocks: toolboxItems.Block[] = [];
      mechanisms.forEach(mechanism => {
        // Here we need all the components (regular and private) from the mechanism because we need
        // to create port parameters for all the components.
        const components = editor.getAllComponentsFromMechanism(mechanism);
        mechanismBlocks.push(createMechanismBlock(mechanism, components));
      });

      contents.push({
        kind: 'category',
        name: Blockly.Msg['MRC_CATEGORY_ADD_MECHANISM'],
        contents: mechanismBlocks,
      });
    }
  }

  editor.getMechanismsFromRobot().forEach(mechanismInRobot => {
    // Add the blocks for this mechanism's methods and events.
    const mechanism = editor.getMechanism(mechanismInRobot);
    if (mechanism) {
      const mechanismCategories: toolboxItems.Category[] = [];

      // Get the list of methods from the mechanism and add the blocks for calling the methods.
      const mechanismMethodBlocks: toolboxItems.Item[] = [];
      const methodsFromMechanism = editor.getMethodsFromMechanism(mechanism);
      addInstanceMechanismBlocks(mechanismInRobot, methodsFromMechanism, mechanismMethodBlocks);
      if (mechanismMethodBlocks.length === 0) {
        const label : toolboxItems.Label = new toolboxItems.Label(Blockly.Msg['NO_MECHANISM_CONTENTS']);
        mechanismMethodBlocks.push(label);
      }
      mechanismCategories.push({
        kind: 'category',
        name: Blockly.Msg['MRC_CATEGORY_METHODS'],
        contents: mechanismMethodBlocks,
      });

      // Get the public components from the mechanism and add the blocks for calling the
      // component functions.
      const componentsFromMechanism = editor.getComponentsFromMechanism(mechanism);
      if (componentsFromMechanism.length > 0) {
        const componentBlocks: toolboxItems.ContentsType[] = [];
        componentsFromMechanism.forEach(component => {
          // Get the blocks for this specific component.
          componentBlocks.push({
            kind: 'category',
            name: component.name,
            contents: getInstanceMechanismComponentBlocks(component, mechanismInRobot),
          });
        });
        mechanismCategories.push({
          kind: 'category',
          name: Blockly.Msg['MRC_CATEGORY_COMPONENTS'],
          contents: componentBlocks,
        });
      }

      mechanismCategories.push(getMechanismEventHandlersCategory(editor, mechanismInRobot));

      contents.push({
        kind: 'category',
        name: mechanismInRobot.name,
        contents: mechanismCategories,
      });
    }
  });

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_MECHANISMS'],
    contents,
  };
}

function getRobotComponentsCategory(editor: Editor): toolboxItems.Category {
  // getRobotComponentsCategory is called when the user is editing an opmode.
  // It allows the user to use a component that was previously added to the Robot.

  const contents: toolboxItems.ContentsType[] = [];

  // Get the list of components from the robot and add the blocks for calling the
  // component functions.
  editor.getComponentsFromRobot().forEach(component => {
    // Get the blocks for this specific component.
    contents.push({
      kind: 'category',
      name: component.name,
      contents: getInstanceComponentBlocks(component),
    });
  });

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_COMPONENTS'],
    contents,
  };
}

function getRobotMethodsCategory(editor: Editor): toolboxItems.Category {
  // getRobotMethodsCategory is called when the user is editing an opmode.
  // It allows the user to use methods that were previously defined in the Robot.

  const contents: toolboxItems.ContentsType[] = [];

  // Get the list of methods from the robot and add the blocks for calling the
  // robot functions.
  const methodsFromRobot = editor.getMethodsFromRobot();
  addInstanceRobotBlocks(methodsFromRobot, contents);

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_METHODS'],
    contents,
  };
}

function getComponentsCategory(
    editor: Editor,
    moduleType: storageModule.ModuleType): toolboxItems.Category {
  // getComponentsCategory is called when the user is editing the robot or a
  // mechanism. It allows the user to add a component or use an existing component.

  const contents: toolboxItems.ContentsType[] = [];

  // Add the "+ Component" category
  contents.push({
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_ADD_COMPONENT'],
    contents: getAllPossibleComponents(moduleType),
  });

  // Get all (regular and private) components from the current workspace.
  // For a robot module, we can only have regular components. For a mechanism module, we can have
  // regular and/or private components. Rather than checking what the current module type is, it's
  // simpler to just call getAllComponentsFromWorkspace for both robot and mechanism modules. Since
  // robot modules don't have private components, getAllComponentsFromWorkspace is equivalent to
  // getComponentsFromWorkspace for a robot module.
  editor.getAllComponentsFromWorkspace().forEach(component => {
    // Get the blocks for this specific component
    contents.push({
      kind: 'category',
      name: component.name,
      contents: getInstanceComponentBlocks(component),
    });
  });

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_COMPONENTS'],
    contents,
  };
}
