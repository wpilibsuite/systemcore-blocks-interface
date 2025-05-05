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
import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText'
import * as ChangeFramework from './utils/change_framework'
import { getLegalName } from './utils/python';
import { Order } from 'blockly/python';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { renameMethodCallers, mutateMethodCallers } from './mrc_call_python_function'

export const BLOCK_NAME = 'mrc_class_method_def';

const MUTATOR_BLOCK_NAME = 'methods_mutatorarg';
const PARAM_CONTAINER_BLOCK_NAME    = 'method_param_container';

export type Parameter = {
    name: string,
    type?: string,
};

export type ClassMethodDefBlock = Blockly.Block & ClassMethodDefMixin & Blockly.BlockSvg;
interface ClassMethodDefMixin extends ClassMethodDefMixinType {
    mrcCanChangeSignature: boolean,
    mrcCanBeCalledWithinClass: boolean,
    mrcCanBeCalledOutsideClass: boolean,
    mrcReturnType: string,
    mrcParameters: Parameter[],
    mrcPythonMethodName: string,
}
type ClassMethodDefMixinType = typeof CLASS_METHOD_DEF;

/** Extra state for serialising call_python_* blocks. */
export type ClassMethodDefExtraState = {
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
            .appendField('', 'NAME')
            .appendField('', 'PARAMS');
        this.setOutput(false);
        this.setStyle(MRC_STYLE_CLASS_BLOCKS);
        this.appendStatementInput('STACK').appendField('');
        this.mrcParameters = [];
    },
    /**
       * Returns the state of this block as a JSON serializable object.
       */
    saveExtraState: function (
        this: ClassMethodDefBlock): ClassMethodDefExtraState {
        const extraState: ClassMethodDefExtraState = {
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
        this.mrcCanChangeSignature = extraState.canChangeSignature;
        this.mrcCanBeCalledWithinClass = extraState.canBeCalledWithinClass;
        this.mrcCanBeCalledOutsideClass = extraState.canBeCalledOutsideClass;
        this.mrcPythonMethodName = extraState.pythonMethodName ? extraState.pythonMethodName : '';
        this.mrcReturnType = extraState.returnType;
        this.mrcParameters = [];

        extraState.params.forEach((param) => {
            this.mrcParameters.push({
                'name': param.name,
                'type': param.type,
            });
        });
        this.updateBlock_();
        mutateMethodCallers(this.workspace, this.getFieldValue('NAME'), this.saveExtraState());
    },
    /**
     * Update the block to reflect the newly loaded extra state.
     */
    updateBlock_: function (this: ClassMethodDefBlock): void {
        const name = this.getFieldValue('NAME');
        const input = this.getInput('TITLE');
        if (!input){
            return;
        }
        input.removeField('NAME');
            
        if (this.mrcCanChangeSignature) {
            const nameField = new Blockly.FieldTextInput(name);
            input.insertFieldAt(0, nameField, 'NAME');
            this.setMutator(new Blockly.icons.MutatorIcon([MUTATOR_BLOCK_NAME], this));
            nameField.setValidator(this.mrcNameFieldValidator.bind(this, nameField));
        }
        else {
            input.insertFieldAt(0, createFieldNonEditableText(name), 'NAME');
            //Case because a current bug in blockly where it won't allow passing null to Blockly.Block.setMutator makes it necessary.
            (this as Blockly.BlockSvg).setMutator( null );
        }
        this.mrcUpdateParams();
    },
    compose: function (this: ClassMethodDefBlock, containerBlock: any) {
        // Parameter list.
        this.mrcParameters = [];

        let paramBlock = containerBlock.getInputTargetBlock('STACK');
        while (paramBlock && !paramBlock.isInsertionMarker()) {
            const param : Parameter = {
                name : paramBlock.getFieldValue('NAME'),
                type : ''
            }
            this.mrcParameters.push(param);
            paramBlock =
                paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();
        }
        this.mrcUpdateParams();
        mutateMethodCallers(this.workspace, this.getFieldValue('NAME'), this.saveExtraState());
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
            itemBlock.setFieldValue(this.mrcParameters[i].name, 'NAME')

            connection!.connect(itemBlock.previousConnection!);
            connection = itemBlock.nextConnection;
        }
        return topBlock;
    },
    mrcUpdateParams: function (this : ClassMethodDefBlock) {
        let paramString = '';
        if (this.mrcParameters.length > 0){
            this.mrcParameters.forEach((param) => {
                if (paramString != '') {
                    paramString += ', ';
                }
                paramString += param.name;
            });
            paramString = Blockly.Msg['PROCEDURES_BEFORE_PARAMS'] + ' ' + paramString;
        }
        // The params field is deterministic based on the mutation,
        // no need to fire a change event.
        Blockly.Events.disable();
        try {
            this.setFieldValue(paramString, 'PARAMS');
        } finally {
            Blockly.Events.enable();
        }
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
        renameMethodCallers(this.workspace, oldName, legalName);
      }
      return legalName;
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
  for (const block of workspace.getBlocksByType('mrc_class_method_def')) {
    if (block === opt_exclude) {
      continue;
    }
    if (nameLowerCase === block.getFieldValue('NAME').toLowerCase()) {
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

const METHOD_PARAM_CONTAINER = {
    init: function (this : Blockly.Block) {
        this.appendDummyInput("TITLE").appendField('Parameters');
        this.appendStatementInput('STACK');
        this.setStyle(MRC_STYLE_CLASS_BLOCKS);
        this.contextMenu = false;
    },
};

type MethodMutatorArgBlock = Blockly.Block & MethodMutatorArgMixin & Blockly.BlockSvg;
interface MethodMutatorArgMixin extends MethodMutatorArgMixinType{

}
type MethodMutatorArgMixinType = typeof METHODS_MUTATORARG;

function setName(block: Blockly.BlockSvg){
    const parentBlock = ChangeFramework.getParentOfType(block, PARAM_CONTAINER_BLOCK_NAME);
    if (parentBlock) {
        const variableBlocks = parentBlock!.getDescendants(true)
        const otherNames: string[] = []
        variableBlocks?.forEach(function (variableBlock) {
            if (variableBlock != block) {
                otherNames.push(variableBlock.getFieldValue('NAME'));
            }
        });
        const currentName = block.getFieldValue('NAME');       
        block.setFieldValue(getLegalName(currentName, otherNames), 'NAME');
        updateMutatorFlyout(block.workspace);
    }
}

const METHODS_MUTATORARG = {
    init: function (this : MethodMutatorArgBlock) {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(Blockly.Procedures.DEFAULT_ARG), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle(MRC_STYLE_CLASS_BLOCKS);
        this.contextMenu = false;
        ChangeFramework.registerCallback(MUTATOR_BLOCK_NAME, [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CHANGE], this.onBlockChanged);
    },
    onBlockChanged: function (block: Blockly.BlockSvg, blockEvent: Blockly.Events.BlockBase) {
        if (blockEvent.type == Blockly.Events.BLOCK_MOVE){
            let blockMoveEvent = blockEvent as Blockly.Events.BlockMove;
            if (blockMoveEvent.reason?.includes('connect')) {
                    setName(block);
            }
        }
        else{
            if(blockEvent.type == Blockly.Events.BLOCK_CHANGE){
                setName(block);
            }
        } 
    },
}

/**
 * Updates the procedure mutator's flyout so that the arg block is not a
 * duplicate of another arg.
 *
 * @param workspace The procedure mutator's workspace. This workspace's flyout
 *     is what is being updated.
 */
function updateMutatorFlyout(workspace: Blockly.WorkspaceSvg) {
  const usedNames = [];
  const blocks = workspace.getBlocksByType(MUTATOR_BLOCK_NAME, false);
  for (let i = 0, block; (block = blocks[i]); i++) {
    usedNames.push(block.getFieldValue('NAME'));
  }
  const argValue = Blockly.Variables.generateUniqueNameFromOptions(
    Blockly.Procedures.DEFAULT_ARG,
    usedNames,
  );
  const jsonBlock = {
    kind: 'block',
    type: MUTATOR_BLOCK_NAME,
    fields: {
        NAME: argValue,
    },
  };

  workspace.updateToolbox({contents:[jsonBlock]});
}


/**
 * Listens for when a procedure mutator is opened. Then it triggers a flyout
 * update and adds a mutator change listener to the mutator workspace.
 *
 * @param e The event that triggered this listener.
 * @internal
 */
export function mutatorOpenListener(e: Blockly.Events.Abstract) {
    if (e.type != Blockly.Events.BUBBLE_OPEN){
        return;  
    }   
    const bubbleEvent = e as Blockly.Events.BubbleOpen;
    if (
      !(bubbleEvent.bubbleType === 'mutator' && bubbleEvent.isOpen) ||
      !bubbleEvent.blockId
    ) {
      return;
    }
    const workspaceId = bubbleEvent.workspaceId;
    const block = Blockly.common
      .getWorkspaceById(workspaceId)!
      .getBlockById(bubbleEvent.blockId) as Blockly.BlockSvg;

    if (block.type !== BLOCK_NAME) {
      return;
    }
    const workspace = (
      block.getIcon(Blockly.icons.MutatorIcon.TYPE) as Blockly.icons.MutatorIcon
    ).getWorkspace()!;

    updateMutatorFlyout(workspace);
    ChangeFramework.setup(workspace);
  }


export const setup = function() {
  Blockly.Blocks[BLOCK_NAME] = CLASS_METHOD_DEF;
  Blockly.Blocks[MUTATOR_BLOCK_NAME] = METHODS_MUTATORARG;
  Blockly.Blocks[PARAM_CONTAINER_BLOCK_NAME] = METHOD_PARAM_CONTAINER;
};

export const pythonFromBlock = function (
    block: ClassMethodDefBlock,
    generator: ExtendedPythonGenerator,
) {
    const blocklyName = block.mrcPythonMethodName ? block.mrcPythonMethodName : block.getFieldValue('NAME');

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
    if(block.mrcPythonMethodName == '__init__'){
        let class_specific = generator.getClassSpecificForInit();
        branch = generator.INDENT + 'super().__init__(' + class_specific + ')\n' +
            generator.defineClassVariables() + branch;
    }    
    if (returnValue) {
        returnValue = generator.INDENT + 'return ' + returnValue + '\n';
    } else if (!branch) {
        branch = generator.PASS;
    }

    let params = block.mrcParameters;
    let paramString = "self";
    if (block.mrcPythonMethodName == '__init__') {
        paramString += generator.getListOfPorts(false);
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

    return '';
}
