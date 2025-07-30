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
import * as commonStorage from '../storage/common_storage';
import * as toolboxItems from './items';
import { getAllPossibleMechanisms } from './blocks_mechanisms';
import { getAllPossibleComponents } from '../blocks/mrc_component';
import { getInstanceComponentBlocks, addInstanceRobotBlocks } from '../blocks/mrc_call_python_function';
import { addRobotEventHandlerBlocks } from '../blocks/mrc_event_handler';
import { Editor } from '../editor/editor';

export function getHardwareCategory(currentModule: commonStorage.Module): toolboxItems.Category {
  if (currentModule.moduleType === commonStorage.MODULE_TYPE_ROBOT) {
    return {
      kind: 'category',
      name: Blockly.Msg['MRC_CATEGORY_HARDWARE'],
      contents: [
        getRobotMechanismsCategory(currentModule),
        getComponentsCategory(false),
      ]
    };
  }
  if (currentModule.moduleType === commonStorage.MODULE_TYPE_MECHANISM) {
    return getComponentsCategory(true);
  }
  if (currentModule.moduleType === commonStorage.MODULE_TYPE_OPMODE) {
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

function getRobotMechanismsCategory(currentModule: commonStorage.Module): toolboxItems.Category {
  // getRobotMechanismsCategory is called when the user is editing the robot or an opmode.
  // If the user is editing the robot, it allows the user to add a mechanism to
  // the robot or use an existing mechanism.
  // If the user is editing an opmode, it allows the user to use a mechanism that
  // was previously added to the Robot.

  const contents: toolboxItems.ContentsType[] = [];

  // Include the "+ Mechanism" category if the user it editing the robot.
  if (currentModule.moduleType === commonStorage.MODULE_TYPE_ROBOT) {
    contents.push({
      kind: 'category',
      name: Blockly.Msg['MRC_CATEGORY_ADD_MECHANISM'],
      contents: getAllPossibleMechanisms(),
    });
  }

  // TODO: Get the list of mechanisms from the robot and add the blocks for
  // calling the mechanism functions to the toolbox.

  /* // Uncomment this fake code for testing purposes only.
  contents.push(
    {
      kind: 'category',
      name: 'drive',
      contents: [
        {
          kind: 'block',
          type: 'mrc_call_python_function',
          extraState: {
            functionKind: 'instance_component',
            returnType: '',
            args: [
              {
                name: 'forward_speed',
                type: 'float',
              },
              {
                name: 'strafe_right_speed',
                type: 'float',
              },
              {
                name: 'rotate_cw_speed',
                type: 'float',
              },
            ],
            tooltip: 'Drive (robot relative)',
            importModule: '',
            componentClassName: 'DriveRobotRelative',
            componentName: 'robot.drive',
          },
          fields: {
            COMPONENT_NAME: 'robot.drive',
            FUNC: 'drive_field_relative',
          },
          inputs: {},
        },
      ]
    },
    {
      kind: 'category',
      name: 'claw',
      contents: [
        {
          kind: 'category',
          name: 'gripper',
          contents: [],
        },
        {
          kind: 'category',
          name: 'piece_sensor',
          contents: [
            // def get_color_rgb(self) -> tuple[int, int, int]:
            {
              kind: 'block',
              type: 'mrc_call_python_function',
              extraState: {
                functionKind: 'instance_component',
                returnType: 'tuple[int, int, int]',
                args: [],
                tooltip: 'Get the color in rgb (red, green, blue).',
                importModule: '',
                componentClassName: 'color_range_sensor.ColorRangeSensor',
                componentName: 'colorSensor',
              },
              fields: {
                COMPONENT_NAME: 'robot.claw.piece_sensor',
                FUNC: 'get_color_rgb',
              },
              inputs: {},
            },
            // def get_color_hsv(self) -> tuple[int, int, int]:
            {
              kind: 'block',
              type: 'mrc_call_python_function',
              extraState: {
                functionKind: 'instance_component',
                returnType: 'tuple[int, int, int]',
                args: [],
                tooltip: 'Get the color in hsv (hue, saturation, value).',
                importModule: '',
                componentClassName: 'color_range_sensor.ColorRangeSensor',
                componentName: 'colorSensor',
              },
              fields: {
                COMPONENT_NAME: 'robot.claw.piece_sensor',
                FUNC: 'get_color_hsv',
              },
              inputs: {},
            },
            // def get_distance_mm(self) -> float:
            {
              kind: 'block',
              type: 'mrc_call_python_function',
              extraState: {
                functionKind: 'instance_component',
                returnType: 'float',
                args: [],
                tooltip: 'Get the distance of the object seen.',
                importModule: '',
                componentClassName: 'color_range_sensor.ColorRangeSensor',
                componentName: 'colorSensor',
              },
              fields: {
                COMPONENT_NAME: 'robot.claw.piece_sensor',
                FUNC: 'get_distance_mm',
              },
              inputs: {},
            },
          ],
        },
      ]
    },
    {
      kind: 'category',
      name: 'flywheel',
      contents: [],
    },
    {
      kind: 'category',
      name: 'shooter',
      contents: [],
    }
  );
  */

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

  // Get the list of components from the robot and add the blocks for calling the
  // component functions.
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
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
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
    if (editor) {
      const methodsFromRobot = editor.getMethodsFromRobot();
      addInstanceRobotBlocks(methodsFromRobot, contents);
    }
  }

  return {
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_METHODS'],
    contents,
  };
}

function getComponentsCategory(hideParams : boolean): toolboxItems.Category {
  // getComponentsCategory is called when the user is editing the robot or a
  // mechanism. It allows the user to add a component or use an existing component.

  const contents: toolboxItems.ContentsType[] = [];

  // Add the "+ Component" category
  contents.push({
    kind: 'category',
    name: Blockly.Msg['MRC_CATEGORY_ADD_COMPONENT'],
    contents: getAllPossibleComponents(hideParams)
  });

  // Get components from the current workspace.
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    const editor = Editor.getEditorForBlocklyWorkspace(workspace);
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
