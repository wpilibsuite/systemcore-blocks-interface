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

/**
 * TODO: This is all fake right now, it will be generated dynamically
 * based on the components that are available in the current module.
 */

import * as Blockly from 'blockly/core';

import * as commonStorage from '../storage/common_storage';
import { getAllPossibleMechanisms } from './blocks_mechanisms';
import { getAllPossibleComponents, getBlocks } from './blocks_components';
import * as mechanismComponentHolder from '../blocks/mrc_mechanism_component_holder';

export function getHardwareCategory(currentModule: commonStorage.Module) {
  if (currentModule.moduleType === commonStorage.MODULE_TYPE_OPMODE) {
    return {
      kind: 'category',
      name: 'Robot',
      contents: [
        getRobotMechanismsBlocks(currentModule),
        getRobotComponentsBlocks(currentModule),
        getRobotMethodsBlocks(currentModule),
      ]
    };
  }
  if (currentModule.moduleType === commonStorage.MODULE_TYPE_ROBOT) {
    return {
      kind: 'category',
      name: 'Hardware',
      contents: [
        getRobotMechanismsBlocks(currentModule),
        getComponentsBlocks(currentModule, false),
      ]
    };
  }
  if (currentModule.moduleType === commonStorage.MODULE_TYPE_MECHANISM) {
    return getComponentsBlocks(currentModule, true);
  }
  // Return default empty category if module type doesn't match
  return {
    kind: 'category',
    name: 'Hardware',
    contents: []
  };
}

// TODO: This needs to load the robot file and get the list of mechanisms
function getRobotMechanismsBlocks(currentModule: commonStorage.Module) {
  const includeAdd = currentModule.moduleType !== commonStorage.MODULE_TYPE_OPMODE;

  const contents = [];

  // Only include the "+ Mechanism" category if includeAdd is true
  if (includeAdd) {
    contents.push({
      kind: 'category',
      name: '+ Mechanism',
      contents: getAllPossibleMechanisms(),
    });
  }

  // Add the existing mechanisms
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

  return {
    kind: 'category',
    name: 'Mechanisms',
    contents,
  };
}

// TODO: This needs to load the robot file and get the list of components
function getRobotComponentsBlocks(currentModule: commonStorage.Module) {
  const includeAdd = currentModule.moduleType !== commonStorage.MODULE_TYPE_OPMODE;
  const contents = [];

  if (includeAdd) {
    contents.push({
      kind: 'category',
      name: '+ Component',
      contents: getAllPossibleComponents(false)
    });
  }

  return {
    kind: 'category',
    name: 'Components',
    contents,
  };
}

function getRobotMethodsBlocks(currentModule: commonStorage.Module) {
  return {
    kind: 'category',
    name: 'Methods',
    contents: []
  };
}

// This is called when the user is editing a mechanism or the robot and allows
// the user to add a component or use an existing component.
function getComponentsBlocks(currentModule: commonStorage.Module, hideParams : boolean) {
  const contents = [];

  // Add the "+ Component" category
  contents.push({
    kind: 'category',
    name: '+ Component',
    contents: getAllPossibleComponents(hideParams)
  });

  // Get components from the current workspace
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    // Get the holder block and ask it for the components.
    const holderBlocks = workspace.getBlocksByType(mechanismComponentHolder.BLOCK_NAME);

    holderBlocks.forEach(holderBlock => {
      const componentsFromHolder: commonStorage.Component[] = holderBlock.getComponents();
      componentsFromHolder.forEach(component => {
        // Get the blocks for this specific component
        contents.push({
          kind: 'category',
          name: component.name,
          contents: getBlocks(component.className, component.name),
        });
      });
    });
  }
  return {
    kind: 'category',
    name: 'Components',
    contents,
  };
}
