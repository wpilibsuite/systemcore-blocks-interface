import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import { Editor } from '../editor/editor';
import { addStaticMethodBlocks } from '../blocks/mrc_call_python_function';
import { createModuleOrClassVariableGetterBlock, VariableKind } from '../blocks/mrc_get_python_variable';
import { makeOneContents } from './robotpy_toolbox';
import { CLASS_NAME_DRIVER_STATION_DISPLAY, getClassData } from '../blocks/utils/python';
import { BLOCK_NAME as MRC_GAMEPAD_BOOLEAN  } from '../blocks/mrc_gamepad_boolean';
import { BLOCK_NAME as MRC_GAMEPAD_ANALOG  } from '../blocks/mrc_gamepad_analog';
import { BLOCK_NAME as MRC_GAMEPAD_RUMBLE  } from '../blocks/mrc_gamepad_rumble';
import { BLOCK_NAME as MRC_WHEN, INPUT_BOOL as MRC_WHEN_INPUT_BOOL } from '../blocks/mrc_when';
import * as Gamepad from '../fields/field_gamepads';

// import { BLOCK_NAME as MRC_GAMEPAD_BOOLEAN_EVENT  } from '../blocks/mrc_gamepad_boolean_event';

export function getDriverStationCategory(editor: Editor): toolboxItems.Category {
    return new toolboxItems.Category(
              Blockly.Msg['MRC_CATEGORY_DRIVER_STATION'],
              [
                getDriverStationDisplayCategory(editor),
                getDriverStationGamepadsCategory(editor),
              ],
              toolboxItems.ExpandedState.EXPANDED);
}

// The display blocks (Add Data / Add Line) are just calls to the static
// methods of wpilib_blocks.DriverStationDisplay, generated via the generic
// mrc_call_python_function block.
export function getDriverStationDisplayCategory(editor: Editor): toolboxItems.Category {
    const commonContents: toolboxItems.ContentsType[] = [];
    const moreContents: toolboxItems.ContentsType[] = [];
    const classData = getClassData(CLASS_NAME_DRIVER_STATION_DISPLAY);
    if (classData) {
        addStaticMethodBlocks(classData, commonContents, moreContents, editor.getShowSimpleClassNames());
        plugDefaultColorBlocks([...commonContents, ...moreContents]);
    }
    return new toolboxItems.Category(
        Blockly.Msg['MRC_CATEGORY_DRIVER_STATION_DISPLAY'],
        makeOneContents(commonContents, moreContents),
        toolboxItems.ExpandedState.EXPANDED
    );
}

// addStaticMethodBlocks plugs a generic workspace-variable getter (e.g. "myColor")
// into object-typed arguments by default. For the color argument of the display
// methods, plug in a concrete wpiutil.Color.WHITE getter instead, so the block is
// immediately usable without the user having to declare a "myColor" variable.
function plugDefaultColorBlocks(blocks: toolboxItems.ContentsType[]) {
    blocks.forEach(item => {
        const block = item as toolboxItems.Block;
        const args = block.extraState?.args as {name: string, type: string}[] | undefined;
        if (!args || !block.inputs) {
            return;
        }
        const colorArgIndex = args.findIndex(arg => arg.type === 'wpiutil.Color');
        if (colorArgIndex !== -1) {
            // Plug in a real (non-shadow) wpiutil.Color.WHITE class variable getter, so
            // users can just change the color using the dropdown rather than needing to
            // find and attach the block themselves.
            block.inputs['ARG' + colorArgIndex] = {
                block: createModuleOrClassVariableGetterBlock(
                    VariableKind.CLASS, 'wpiutil', 'wpiutil.Color', 'wpiutil.Color', 'WHITE', false),
            };
        }
    });
}

function getDriverStationGamepadsCategory(_editor: Editor): toolboxItems.Category {
    return new toolboxItems.Category(
              Blockly.Msg['MRC_CATEGORY_DRIVER_STATION_GAMEPADS'],
              [
                new toolboxItems.Button(
                  Blockly.Msg['MRC_CONFIG_GAMEPADS_BUTTON'],
                  'CONFIG_GAMEPADS_BUTTON',
                  'primary'
                ),
                new toolboxItems.Block(MRC_GAMEPAD_BOOLEAN, null, null, null),
                new toolboxItems.Block(MRC_GAMEPAD_ANALOG, null, null, null),
                new toolboxItems.Block(MRC_GAMEPAD_RUMBLE, null, null, null),
                createSampleWhenGamepadButtonBlock(),
                // TODO: Add events back here when we figure out how the code will be generated
                //new toolboxItems.Label("Events"),
                //new toolboxItems.Block(MRC_GAMEPAD_BOOLEAN_EVENT, null, null, null),
              ],
              toolboxItems.ExpandedState.EXPANDED);
}

// Creates a sample "when" block, with a shadow block for "Gamepad 0 A is down" plugged
// into its condition, to show how the when block can be used with a gamepad button.
function createSampleWhenGamepadButtonBlock(): toolboxItems.Block {
    const inputs: {[key: string]: any} = {};
    inputs[MRC_WHEN_INPUT_BOOL] = {
        shadow: {
            type: MRC_GAMEPAD_BOOLEAN,
            fields: {
                [Gamepad.PORT_FIELD_NAME]: '0',
                [Gamepad.BUTTON_FIELD_NAME]: 'SOUTH_FACE',
                [Gamepad.ACTION_FIELD_NAME]: 'IS_DOWN',
            },
        },
    };
    return new toolboxItems.Block(MRC_WHEN, null, null, inputs);
}