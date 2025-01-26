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
 * @fileoverview Blocks for class method defintion
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles';
import { RETURN_TYPE_NONE, getOutputCheck } from './utils/python'

export const BLOCK_NAME = 'mrc_class_method_def'

class MethodInput extends Blockly.inputs.Input {
    readonly type = Blockly.inputs.inputTypes.CUSTOM;
    constructor(name: string, block: Blockly.Block) {
        super(name, block);
    }
}

export type Parameter = {
    name: string,
    type?: string,
};

type ClassMethodDefBlock = Blockly.Block & ClassMethodDefMixin;
interface ClassMethodDefMixin extends ClassMethodDefMixinType {
    mrcCanChangeSignature: boolean,
    mrcCanDelete: boolean,
    mrcReturnType: string,
    mrcParameters: Parameter[],
    mrcPythonMethodName: string,
}
type ClassMethodDefMixinType = typeof CLASS_METHOD_DEF;

/** Extra state for serialising call_python_* blocks. */
type ClassMethodDefExtraState = {
    /**
     * Can change name and parameters and return type
     */
    canChangeSignature: boolean,
    /**
     * Can delete from class
     */
    canDelete: boolean,
    /**
     * The return type of the function.
     * Use 'None' for no return value.
     * Use '' for an untyped return value.
     */
    returnType: string,
    /**
     * The arguments of the method.
     */
    params: Parameter[],

    /**
     * Specified if the python method name is different than the name given in
     * the NAME field.
     */
    pythonMethodName?: string,
};

const CLASS_METHOD_DEF = {
    /**
     * Block initialization.
     */
    init: function (this: ClassMethodDefBlock): void {
        this.appendDummyInput("TITLE")
            .appendField('my_method', 'NAME')
            .appendField('', 'PARAMS');
        this.setInputsInline(false)
        this.setOutput(false);
        this.setStyle(MRC_STYLE_FUNCTIONS)
        this.appendStatementInput('STACK').appendField('');
    },
    /**
       * Returns the state of this block as a JSON serializable object.
       */
    saveExtraState: function (
        this: ClassMethodDefBlock): ClassMethodDefExtraState {
        const extraState: ClassMethodDefExtraState = {
            canChangeSignature: this.mrcCanChangeSignature,
            canDelete: this.mrcCanDelete,
            returnType: this.mrcReturnType,
            params: [],
        };
        this.mrcParameters.forEach((param) => {
            extraState.params.push({
                'name': param.name,
                'type': param.type,
            });
        });
        if (this.mrcPythonMethodName) {
            extraState.pythonMethodName = this.mrcPythonMethodName;
        }

        return extraState;
    },
    /**
     * Applies the given state to this block.
     */
    loadExtraState: function (
        this: ClassMethodDefBlock & Blockly.BlockSvg,
        extraState: ClassMethodDefExtraState
    ): void {
        this.mrcCanChangeSignature = extraState.canChangeSignature;
        this.mrcCanDelete = extraState.canDelete;
        this.mrcPythonMethodName = extraState.pythonMethodName ? extraState.pythonMethodName : '';
        this.mrcReturnType = extraState.returnType;
        extraState.params.forEach((param) => {
            this.mrcParameters.push({
                'name': param.name,
                'type': param.type,
            });
        });
        this.updateBlock_();
    },
    /**
     * Update the block to reflect the newly loaded extra state.
     */
    updateBlock_: function (this: ClassMethodDefBlock & Blockly.BlockSvg): void {
        if (this.mrcCanChangeSignature) {
            this.setMutator(new Blockly.icons.MutatorIcon(['methods_mutatorarg'], this));
        }
        else {
            //TODO: This should turn it off, but I have an outstanding question on blockly mailing list on how to do that in typescript
            // this.setMutator( null );
        }
        this.setDeletable(this.mrcCanDelete);

        let paramString = ''
        this.mrcParameters.forEach((param) => {
            if (paramString != '') {
                paramString += ', ';
            }
            paramString += param.name;
        });
    }
};

import { Order, PythonGenerator } from 'blockly/python';
import { MutatorIcon } from 'blockly/core/icons';

export const pythonFromBlock = function (
    block: Blockly.Block,
    generator: PythonGenerator,
) {
    const funcName = generator.getProcedureName(block.getFieldValue('NAME'));

    const comment = block.getCommentText();

    let xfix1 = '';
    if (generator.STATEMENT_PREFIX) {
        xfix1 += generator.injectId(generator.STATEMENT_PREFIX, block);
    }
    if (generator.STATEMENT_SUFFIX) {
        xfix1 += generator.injectId(generator.STATEMENT_SUFFIX, block);
    }
    if (xfix1) {
        xfix1 = generator.prefixLines(xfix1, generator.INDENT);
    }
    let loopTrap = '';
    if (generator.INFINITE_LOOP_TRAP) {
        loopTrap = generator.prefixLines(
            generator.injectId(generator.INFINITE_LOOP_TRAP, block),
            generator.INDENT,
        );
    }
    let branch = '';
    if (block.getInput('STACK')) {
        branch = generator.statementToCode(block, 'STACK');
    }
    let returnValue = '';
    if (block.getInput('RETURN')) {
        returnValue = generator.valueToCode(block, 'RETURN', Order.NONE) || '';
    }
    let xfix2 = '';
    if (branch && returnValue) {
        // After executing the function body, revisit this block for the return.
        xfix2 = xfix1;
    }
    if (returnValue) {
        returnValue = generator.INDENT + 'return ' + returnValue + '\n';
    } else if (!branch) {
        branch = generator.PASS;
    }
    let args = (block as any).arguments_;

    let code = ""
    if (comment) {
        code += generator.prefixLines(comment + '\n', '# ');
    }

    let argString = "self"
    if (args.length != 0) {
        argString = argString + ", " + args.join(', ')
    }

    code += 'def ' +
        funcName +
        '(' +
        argString +
        '):\n';

    code +=
        xfix1 +
        loopTrap +
        branch +
        xfix2 +
        returnValue;
    code = generator.scrub_(block, code);

    return [code, Order.NONE];
}