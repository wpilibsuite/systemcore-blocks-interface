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
 * @fileoverview Blocks for class method definition
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';
import { MRC_STYLE_FUNCTIONS } from '../themes/styles';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText'
import { createFieldFlydown } from '../fields/field_flydown';
import { Order } from 'blockly/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import { renameMethodCallers, mutateMethodCallers } from './mrc_call_python_function'
import * as toolboxItems from '../toolbox/items';
import { getClassData } from './utils/python';
import { FunctionData } from './utils/python_json_types';
import { findConnectedBlocksOfType } from './utils/find_connected_blocks';
import { BLOCK_NAME as MRC_GET_PARAMETER_BLOCK_NAME } from './mrc_get_parameter';
import { MUTATOR_BLOCK_NAME, PARAM_CONTAINER_BLOCK_NAME, MethodMutatorArgBlock } from './mrc_param_container'

export const BLOCK_NAME = 'mrc_class_method_def';

export const FIELD_METHOD_NAME = 'NAME';
export const RETURN_VALUE = 'RETURN';

type Parameter = {
    name: string,
    type?: string,
};

export type ClassMethodDefBlock = Blockly.Block & ClassMethodDefMixin & Blockly.BlockSvg;
interface ClassMethodDefMixin extends ClassMethodDefMixinType {
    mrcMethodId: string,
    mrcCanChangeSignature: boolean,
    mrcCanBeCalledWithinClass: boolean,
    mrcCanBeCalledOutsideClass: boolean,
    mrcReturnType: string,
    mrcParameters: Parameter[],
    mrcPythonMethodName: string,
    mrcFuncName: string | null,
    mrcUpdateReturnInput(): void,
}
type ClassMethodDefMixinType = typeof CLASS_METHOD_DEF;

/** Extra state for serialising call_python_* blocks. */
type ClassMethodDefExtraState = {
    /**
     * The id that identifies this method definition.
     */
    methodId?: string,
    /**
     * Can change name and parameters and return type
     */
    canChangeSignature: boolean,
    /**
     * Can be called from within the class.
     */
    canBeCalledWithinClass: boolean,
    /**
     * Can be called from outside the class.
     */
    canBeCalledOutsideClass: boolean,
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
            .appendField('', FIELD_METHOD_NAME);
        this.setOutput(false);
        this.setStyle(MRC_STYLE_FUNCTIONS);
        this.appendStatementInput('STACK').appendField('');
        this.mrcParameters = [];
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.updateBlock_();
    },
    /**
     * Returns the state of this block as a JSON serializable object.
     */
    saveExtraState: function (
        this: ClassMethodDefBlock): ClassMethodDefExtraState {
        const extraState: ClassMethodDefExtraState = {
            methodId: this.mrcMethodId,
            canChangeSignature: this.mrcCanChangeSignature,
            canBeCalledWithinClass: this.mrcCanBeCalledWithinClass,
            canBeCalledOutsideClass: this.mrcCanBeCalledOutsideClass,
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
        this: ClassMethodDefBlock,
        extraState: ClassMethodDefExtraState
    ): void {
        this.mrcMethodId = extraState.methodId ? extraState.methodId : this.id;
        this.mrcCanChangeSignature = extraState.canChangeSignature;
        this.mrcCanBeCalledWithinClass = extraState.canBeCalledWithinClass;
        this.mrcCanBeCalledOutsideClass = extraState.canBeCalledOutsideClass;
        this.mrcPythonMethodName = extraState.pythonMethodName ? extraState.pythonMethodName : '';
        this.mrcFuncName = null; // Set during python code generation.
        this.mrcReturnType = extraState.returnType;
        this.mrcParameters = [];
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
    updateBlock_: function (this: ClassMethodDefBlock): void {
        const name = this.getFieldValue(FIELD_METHOD_NAME);
        const input = this.getInput('TITLE');
        if (!input) {
            return;
        }
        input.removeField(FIELD_METHOD_NAME);

        if (this.mrcCanChangeSignature) {
            const nameField = new Blockly.FieldTextInput(name);
            input.insertFieldAt(0, nameField, FIELD_METHOD_NAME);
            this.setMutator(new Blockly.icons.MutatorIcon([MUTATOR_BLOCK_NAME], this));
            nameField.setValidator(this.mrcNameFieldValidator.bind(this, nameField));
        }
        else {
            input.insertFieldAt(0, createFieldNonEditableText(name), FIELD_METHOD_NAME);
            //Case because a current bug in blockly where it won't allow passing null to Blockly.Block.setMutator makes it necessary.
            (this as Blockly.BlockSvg).setMutator(null);
        }
        this.mrcUpdateParams();
        this.mrcUpdateReturnInput();
    },
    compose: function (this: ClassMethodDefBlock, containerBlock: any) {
        // Parameter list.
        this.mrcParameters = [];

        let paramBlock = containerBlock.getInputTargetBlock('STACK');
        while (paramBlock) {
            const param: Parameter = {
                name: paramBlock.getFieldValue('NAME'),
                type: ''
            }
            if (paramBlock.originalName) {
                // This is a mutator arg block, so we can get the original name.
                this.mrcRenameParameter(paramBlock.originalName, param.name);
                paramBlock.originalName = param.name;
            }
            this.mrcParameters.push(param);
            paramBlock =
                paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();
        }
        this.mrcUpdateParams();
        if (this.mrcCanBeCalledWithinClass) {
          const methodForWithin = this.getMethodForWithin();
          if (methodForWithin) {
            mutateMethodCallers(this.workspace, this.mrcMethodId, methodForWithin);
          }
        }
    },
    decompose: function (this: ClassMethodDefBlock, workspace: Blockly.Workspace) {
        // This is a special sub-block that only gets created in the mutator UI.
        // It acts as our "top block"
        const topBlock = workspace.newBlock(PARAM_CONTAINER_BLOCK_NAME);
        (topBlock as Blockly.BlockSvg).initSvg();

        // Then we add one sub-block for each item in the list.
        let connection = topBlock!.getInput('STACK')!.connection;

        for (let i = 0; i < this.mrcParameters.length; i++) {
            let itemBlock = workspace.newBlock(MUTATOR_BLOCK_NAME);
            (itemBlock as Blockly.BlockSvg).initSvg();
            itemBlock.setFieldValue(this.mrcParameters[i].name, 'NAME');
            (itemBlock as MethodMutatorArgBlock).originalName = this.mrcParameters[i].name;

            connection!.connect(itemBlock.previousConnection!);
            connection = itemBlock.nextConnection;
        }
        return topBlock;
    },
    mrcRenameParameter: function (this: ClassMethodDefBlock, oldName: string, newName: string) {
        let nextBlock = this.getInputTargetBlock('STACK');

        if (nextBlock){
            findConnectedBlocksOfType(nextBlock, MRC_GET_PARAMETER_BLOCK_NAME).forEach((block) => {
                if (block.getFieldValue('PARAMETER_NAME') === oldName) {
                    block.setFieldValue(newName, 'PARAMETER_NAME');
                }
            });
        }
    },
    mrcUpdateParams: function (this: ClassMethodDefBlock) {
        if (this.mrcParameters.length > 0) {
            let input = this.getInput('TITLE');
            if (input) {
                this.removeParameterFields(input);
                this.mrcParameters.forEach((param) => {
                    const paramName = 'PARAM_' + param.name;                    
                    input.appendField(createFieldFlydown(param.name, false), paramName);
                });
            }
        }
    },
    mrcUpdateReturnInput: function (this: ClassMethodDefBlock) {
        // Remove existing return input if it exists
        if (this.getInput(RETURN_VALUE)) {
            this.removeInput(RETURN_VALUE);
        }
        
        // Add return input if return type is not 'None'
        if (this.mrcReturnType && this.mrcReturnType !== 'None') {
            this.appendValueInput(RETURN_VALUE)
                .setAlign(Blockly.inputs.Align.RIGHT)
                .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
            // Move the return input to be after the statement input
            this.moveInputBefore('STACK', RETURN_VALUE);
        }
    },
    removeParameterFields: function (input: Blockly.Input) {
        const fieldsToRemove = input.fieldRow
            .filter(field => field.name?.startsWith('PARAM_'))
            .map(field => field.name!);

        fieldsToRemove.forEach(fieldName => {
            input.removeField(fieldName);
        });
    },
    mrcNameFieldValidator(this: ClassMethodDefBlock, nameField: Blockly.FieldTextInput, name: string): string {
        // When the user changes the method name on the block, clear the mrcPythonMethodName field.
        this.mrcPythonMethodName = '';

        // Strip leading and trailing whitespace.
        name = name.trim();

        const legalName = findLegalMethodName(name, this);
        const oldName = nameField.getValue();
        if (oldName && oldName !== name && oldName !== legalName) {
            // Rename any callers.
            renameMethodCallers(this.workspace, this.mrcMethodId, legalName);
        }
        return legalName;
    },
    getMethod: function (this: ClassMethodDefBlock): storageModuleContent.Method | null {
        const method: storageModuleContent.Method = {
            methodId: this.mrcMethodId,
            visibleName: this.getFieldValue(FIELD_METHOD_NAME),
            pythonName: this.mrcFuncName ? this.mrcFuncName : '',
            returnType: this.mrcReturnType,
            args: [{
                name: 'self',
                type: '',
            }],
        };
        if (!method.pythonName) {
            method.pythonName = method.visibleName;
        }
        this.mrcParameters.forEach(param => {
            method.args.push({
                name: param.name,
                type: param.type ? param.type : '',
            });
        });
        return method;
    },
    getMethodForWithin: function (this: ClassMethodDefBlock): storageModuleContent.Method | null {
        if (this.mrcCanBeCalledWithinClass) {
            return this.getMethod();
        }
        return null;
    },
    getMethodForOutside: function (this: ClassMethodDefBlock): storageModuleContent.Method | null {
        if (this.mrcCanBeCalledOutsideClass) {
            return this.getMethod();
        }
        return null;
    },
    canChangeSignature: function (this: ClassMethodDefBlock): boolean {
        return this.mrcCanChangeSignature;
    },
    getMethodName: function (this: ClassMethodDefBlock): string {
        return this.getFieldValue(FIELD_METHOD_NAME);
    },
    /**
     * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
     */
    mrcChangeIds: function (this: ClassMethodDefBlock, oldIdToNewId: { [oldId: string]: string }): void {
        if (this.mrcMethodId in oldIdToNewId) {
            this.mrcMethodId = oldIdToNewId[this.mrcMethodId];
        }
    },
    upgrade_002_to_003: function(this: ClassMethodDefBlock) {
        if (this.getFieldValue('NAME') === 'init') {
            // Remove robot parameter from init method
            const methodBlock = this as ClassMethodDefBlock;
            let filteredParams: Parameter[] = methodBlock.mrcParameters.filter(param => param.name !== 'robot');
            methodBlock.mrcParameters = filteredParams;
        }
    },
};

/**
 * Ensure two identically-named methods don't exist.
 * Take the proposed method name, and return a legal name i.e. one that
 * is not empty and doesn't collide with other methods.
 *
 * @param name Proposed method name.
 * @param block Block to disambiguate.
 * @returns Non-colliding name.
 */
function findLegalMethodName(name: string, block: ClassMethodDefBlock): string {
    if (block.isInFlyout) {
        // Flyouts can have multiple methods called 'my_method'.
        return name;
    }
    name = name || 'unnamed';
    while (isMethodNameUsed(name, block.workspace, block)) {
        // Collision with another method.
        const r = name.match(/^(.*?)(\d+)$/);
        if (!r) {
            name += '2';
        } else {
            name = r[1] + (parseInt(r[2]) + 1);
        }
    }
    return name;
}

/**
 * Return if the given name is already a method name.
 *
 * @param name The questionable name.
 * @param workspace The workspace to scan for collisions.
 * @param opt_exclude Optional block to exclude from comparisons (one doesn't
 *     want to collide with oneself).
 * @returns True if the name is used, otherwise return false.
 */
function isMethodNameUsed(
    name: string, workspace: Blockly.Workspace, opt_exclude?: Blockly.Block): boolean {
    const nameLowerCase = name.toLowerCase();
    for (const block of workspace.getBlocksByType(BLOCK_NAME)) {
        if (block === opt_exclude) {
            continue;
        }
        if (nameLowerCase === block.getFieldValue(FIELD_METHOD_NAME).toLowerCase()) {
            return true;
        }
        const classMethodDefBlock = block as ClassMethodDefBlock;
        if (classMethodDefBlock.mrcPythonMethodName &&
            nameLowerCase === classMethodDefBlock.mrcPythonMethodName.toLowerCase()) {
            return true;
        }
    }
    return false;
}

export const setup = function () {
    Blockly.Blocks[BLOCK_NAME] = CLASS_METHOD_DEF;
};

export const pythonFromBlock = function (
    block: ClassMethodDefBlock,
    generator: ExtendedPythonGenerator,
) {
    const blocklyName = block.mrcPythonMethodName ? block.mrcPythonMethodName : block.getFieldValue(FIELD_METHOD_NAME);

    // Call generator.getProcedureName so our function name is not a reserved word such as "while".
    const funcName = generator.getProcedureName(blocklyName);

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
    if (block.mrcPythonMethodName === '__init__') {
        let class_specific = generator.getClassSpecificForInit();
        branch = generator.INDENT + 'super().__init__(' + class_specific + ')\n' +
            generator.generateInitStatements() + branch;
    }
    else if (generator.inBaseClassMethod(blocklyName)){
        // Special case for methods inherited from the based class: generate the
        // call to the method in the base class.
        branch = generator.INDENT + 'super().' + blocklyName + '()\n' + branch;
    }
    if (returnValue) {
        returnValue = generator.INDENT + 'return ' + returnValue + '\n';
    } else if (!branch) {
        branch = generator.PASS;
    }

    let params = block.mrcParameters;
    let paramString = "self";
    if (generator.getModuleType() === storageModule.ModuleType.MECHANISM && block.mrcPythonMethodName === '__init__') {
        const ports: string[] = generator.getComponentPortParameters();
        if (ports.length) {
            paramString += ', ' + ports.join(', ');
        }
    }

    if (generator.getModuleType() === storageModule.ModuleType.OPMODE && block.mrcPythonMethodName === '__init__') {
        paramString += ', robot';
    }

    if (params.length != 0) {
        block.mrcParameters.forEach((param) => {
            paramString += ', ' + param.name;
        });
    }

    let code = 'def ' +
        funcName +
        '(' +
        paramString +
        '):\n';

    code +=
        xfix1 +
        loopTrap +
        branch +
        xfix2 +
        returnValue;
    code = generator.scrub_(block, code);
    generator.addClassMethodDefinition(funcName, code);

    // Save the name of the function we just generated so we can use it to create the storageModuleContent.Method.
    // in the getMethod function.
    block.mrcFuncName = funcName;

    return '';
}

// Functions used for creating blocks for the toolbox.

export function createCustomMethodBlock(): toolboxItems.Block {
  const extraState: ClassMethodDefExtraState = {
    canChangeSignature: true,
    canBeCalledWithinClass: true,
    canBeCalledOutsideClass: true,
    returnType: 'None',
    params: [],
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_METHOD_NAME] = 'my_method';
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, null);
}

export function createCustomMethodBlockWithReturn(): toolboxItems.Block {
    const extraState: ClassMethodDefExtraState = {
        canChangeSignature: true,
        canBeCalledWithinClass: true,
        canBeCalledOutsideClass: true,
        returnType: 'Any',
        params: [],
    };
    const fields: {[key: string]: any} = {};
    fields[FIELD_METHOD_NAME] = 'my_method_with_return';
    const inputs: {[key: string]: any} = {};
    inputs[RETURN_VALUE] = {
        'type': 'input_value',
    };
    return new toolboxItems.Block(BLOCK_NAME, extraState, fields, inputs);
}

export function getBaseClassBlocks(
    baseClassName: string): toolboxItems.Block[] {
  const blocks: toolboxItems.Block[] = [];
  const classData = getClassData(baseClassName);
  if (classData) {
    classData.instanceMethods.forEach(functionData => {
      blocks.push(createClassMethodDefBlock(
          functionData,
          /* canChangeSignature */ false,
          /* canBeCalledWithinClass */ false,
          /* canBeCalledOutsideClass */ false,
      ));
    });
  }
  return blocks;
}

function createClassMethodDefBlock(
    functionData: FunctionData,
    canChangeSignature: boolean,
    canBeCalledWithinClass: boolean,
    canBeCalledOutsideClass: boolean): toolboxItems.Block {
  const extraState: ClassMethodDefExtraState = {
    canChangeSignature,
    canBeCalledWithinClass,
    canBeCalledOutsideClass,
    returnType: functionData.returnType,
    params: [],
  };
  for (let i = 1; i < functionData.args.length; i++) {
    extraState.params.push({
      'name': functionData.args[i].name,
      'type': functionData.args[i].type,
    });
  }
  const fields: {[key: string]: any} = {};
  fields[FIELD_METHOD_NAME] = functionData.functionName;
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, null);
}

// Misc

export function getMethodsForWithin(
    workspace: Blockly.Workspace,
    methods: storageModuleContent.Method[]): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const method = (block as ClassMethodDefBlock).getMethodForWithin();
    if (method) {
      methods.push(method);
    }
  });
}

export function getMethodsForOutside(
    workspace: Blockly.Workspace,
    methods: storageModuleContent.Method[]): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const method = (block as ClassMethodDefBlock).getMethodForOutside();
    if (method) {
      methods.push(method);
    }
  });
}

export function getMethodNamesAlreadyOverriddenInWorkspace(
    workspace: Blockly.Workspace,
    methodNamesAlreadyOverridden: string[]): void {
  workspace.getBlocksByType(BLOCK_NAME).forEach(block => {
    const methodDefBlock = block as ClassMethodDefBlock;
    // If the user cannot change the signature, it means the block defines a method that overrides a baseclass method.
    // That's what we are looking for here.
    if (!methodDefBlock.canChangeSignature()) {
      methodNamesAlreadyOverridden.push(methodDefBlock.getMethodName());
    }
  });
}
