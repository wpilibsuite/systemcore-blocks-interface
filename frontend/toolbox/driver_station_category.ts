import * as Blockly from 'blockly/core';

import * as toolboxItems from './items';
import { Editor } from '../editor/editor';
import { BLOCK_NAME as MRC_CALL_PYTHON_FUNCTION } from '../blocks/mrc_call_python_function';
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

function getDriverStationDisplayCategory(_editor: Editor): toolboxItems.Category {
    return new toolboxItems.Category(
        Blockly.Msg['MRC_CATEGORY_DRIVER_STATION_DISPLAY'],
        [
          //TODO: This is hacky.   When the display part of the driver station
          // is done for real, we'll use that JSON to generate this block instead of hardcoding it like this.
            new toolboxItems.Block(
                MRC_CALL_PYTHON_FUNCTION,
                {
                    functionKind: 'built-in',
                    returnType: 'None',
                    actualFunctionName: 'self.display.addData',
                    args: [
                        {name: 'key', type: 'str'},
                        {name: 'value', type: 'str'}
                    ],
                    tooltip: 'Add data to display'
                },
                {
                    'FUNC': 'display.addData'
                },
                null
            )
        ],
        toolboxItems.ExpandedState.EXPANDED
    );
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