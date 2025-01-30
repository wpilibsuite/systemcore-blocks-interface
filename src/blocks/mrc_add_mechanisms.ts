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
 * @fileoverview Add Mechanisms to this mechanism (or Robot which is a mechanism)
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { Order, PythonGenerator } from 'blockly/python';

import { MRC_STYLE_FUNCTIONS } from '../themes/styles'
import { createFieldNonEditableText } from 'src/fields/FieldNonEditableText';

export const BLOCK_NAME = 'mrc_add_mechanisms';

type MechanismExtraState = {
    numInputs: number
}
type AddMechanismBlock = Blockly.Block & AddMechanismMixin;
interface AddMechanismMixin extends AddMechanismMixinType {
    mrcNumInputs: number,
}
type AddMechanismMixinType = typeof ADD_MECHANISM_FUNCTION;


const ADD_MECHANISM_FUNCTION = {
    init: function (this: AddMechanismBlock): void {
        this.setStyle(MRC_STYLE_FUNCTIONS);

        this.setPreviousStatement(false);
        this.setNextStatement(false);
    },
}