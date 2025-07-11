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

import * as toolboxItems from './items';
import * as commonStorage from '../storage/common_storage';
import { EventBlock } from '../blocks/mrc_event';
import { MRC_CATEGORY_STYLE_METHODS } from '../themes/styles';
import { RETURN_TYPE_NONE, FunctionKind } from '../blocks/mrc_call_python_function';

const CUSTOM_CATEGORY_EVENTS = 'EVENTS';

export const getCategory = () => ({
  kind: 'category',
  categorystyle: MRC_CATEGORY_STYLE_METHODS,
  name: Blockly.Msg['MRC_CATEGORY_EVENTS'],
  custom: CUSTOM_CATEGORY_EVENTS,
});

export class EventsCategory {
  private currentModule: commonStorage.Module | null = null;

  constructor(blocklyWorkspace: Blockly.WorkspaceSvg) {
    blocklyWorkspace.registerToolboxCategoryCallback(CUSTOM_CATEGORY_EVENTS, this.eventsFlyout.bind(this));
  }

  public setCurrentModule(currentModule: commonStorage.Module | null) {
    this.currentModule = currentModule;
  }

  public eventsFlyout(workspace: Blockly.WorkspaceSvg) {
    const contents: toolboxItems.ContentsType[] = [];

    // Add blocks for defining any methods that can be defined in the current
    // module. For example, if the current module is an OpMode, add blocks to
    // define the methods declared in the OpMode class.
    if (this.currentModule) {
      // Collect the method names for mrc_class_method_def blocks that are
      // already in the blockly workspace.
      const eventNamesAlreadyUsed: string[] = [];
      workspace.getBlocksByType('mrc_event', false).forEach((block) => {
        eventNamesAlreadyUsed.push(block.getFieldValue('NAME'));
      });   
    }

    // Add a block that lets the user define a new method.
    contents.push(
      {
        kind: 'label',
        text: 'Custom Events',
      },
      {
        kind: 'block',
        type: 'mrc_event',
        fields: {NAME: "my_event"},
      });

    // For each mrc_class_method_def block in the blockly workspace, check if it
    // can be called from within the class, and if so, add a
    // mrc_call_python_function block.
    workspace.getBlocksByType('mrc_event', false).forEach((block) => {
        const eventBlock = block as EventBlock;
        const callPythonFunctionBlock: toolboxItems.Block = {
          kind: 'block',
          type: 'mrc_call_python_function',
          extraState: {
            functionKind: FunctionKind.EVENT,
            returnType: RETURN_TYPE_NONE,
            args: [],
            importModule: '',
          },
          fields: {
            FUNC: block.getFieldValue('NAME'),
          },
        };
        // Add the parameters from the event block to the callPythonFunctionBlock.        
        eventBlock.mrcParameters.forEach((param) => {
          if (callPythonFunctionBlock.extraState) {
            callPythonFunctionBlock.extraState.args.push(
              {
                name: param.name,
                type: param.type ?? '',
              });
            }
          });
        contents.push(callPythonFunctionBlock);
    });

    const toolboxInfo = {
      contents: contents,
    };

    return toolboxInfo;
  }
}