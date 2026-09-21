/**
 * @license
 * Copyright 2026 Google LLC
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
 * A block to represent a component reference that can be plugged into function
 * argument inputs that accept the component's type.
 * @author lizlooney@google.com (Liz Looney)
 */
import * as Blockly from 'blockly';
import { Order } from 'blockly/python';

import {
    classNameToShowOnBlocks,
    getOutputCheck } from './utils/python';
import { Editor } from '../editor/editor';
import { ExtendedPythonGenerator } from '../editor/extended_python_generator';
import { createFieldDropdown } from '../fields/FieldDropdown';
import { createFieldNonEditableText } from '../fields/FieldNonEditableText';
import { MRC_STYLE_COMPONENTS } from '../themes/styles'
import * as toolboxItems from '../toolbox/items';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';

export const BLOCK_NAME = 'mrc_component_reference';

const INPUT_TITLE = 'TITLE';
const FIELD_COMPONENT_NAME = 'COMPONENT_NAME';
const FIELD_MECHANISM_NAME = 'MECHANISM_NAME';
const FIELD_COMPONENT_CLASS_NAME = 'COMPONENT_CLASS_NAME';

const WARNING_ID_COMPONENT_CHANGED = 'component changed';

type ComponentReferenceBlock = Blockly.Block & ComponentReferenceMixin;
interface ComponentReferenceMixin extends ComponentReferenceMixinType {
  mrcComponentId: string,
  mrcMechanismId: string,
  mrcComponentClassName: string,
  mrcMapComponentNameToId: {[componentName: string]: string},
}
type ComponentReferenceMixinType = typeof COMPONENT_REFERENCE;

/** Extra state for serialising mrc_component_reference blocks. */
type ComponentReferenceExtraState = {
  /**
   * The mrcComponentId of the mrc_component block that adds the component to the robot or a mechanism.
   */
  componentId: string,
  /**
   * The mrcMechanismId of the mrc_mechanism block that adds the mechanism to the robot.
   * Specified only if the component belongs to a mechanism.
   */
  mechanismId?: string,
  /**
   * The component name.
   */
  componentName: string,
  /**
   * The component class name.
   */
  componentClassName: string,
};

const COMPONENT_REFERENCE = {
  /**
   * Block initialization.
   */
  init: function(this: ComponentReferenceBlock): void {
    this.setStyle(MRC_STYLE_COMPONENTS);
    this.setTooltip(() => {
      const className = this.mrcComponentClassName;
      let tooltip: string;
      if (this.mrcMechanismId) {
        tooltip = Blockly.Msg.MECHANISM_COMPONENT_REFERENCE_TOOLTIP;
        tooltip = tooltip
            .replace('{{className}}', className)
            .replace('{{componentName}}', this.getFieldValue(FIELD_COMPONENT_NAME))
            .replace('{{mechanismName}}', this.getFieldValue(FIELD_MECHANISM_NAME));
      } else {
        tooltip = Blockly.Msg.COMPONENT_REFERENCE_TOOLTIP;
        tooltip = tooltip
            .replace('{{className}}', className)
            .replace('{{componentName}}', this.getFieldValue(FIELD_COMPONENT_NAME));
      }
      return tooltip;
    });
  },
  /**
   * Returns the state of this block as a JSON serializable object.
   */
  saveExtraState: function(this: ComponentReferenceBlock): ComponentReferenceExtraState {
    const componentName = this.getFieldValue(FIELD_COMPONENT_NAME);
    const extraState: ComponentReferenceExtraState = {
      componentId: this.mrcComponentId,
      mechanismId: this.mrcMechanismId,
      componentName: componentName,
      componentClassName: this.mrcComponentClassName,
    };
    // Since the user may have chosen a different component name from the dropdown, we need to get
    // the componentId of the component that the user has chosen.
    if (componentName in this.mrcMapComponentNameToId) {
      extraState.componentId = this.mrcMapComponentNameToId[componentName];
    }
    return extraState;
  },
  /**
   * Applies the given state to this block.
   */
  loadExtraState: function(
      this: ComponentReferenceBlock,
      extraState: ComponentReferenceExtraState
  ): void {
    this.mrcComponentId = extraState.componentId ? extraState.componentId : '';
    this.mrcMechanismId = extraState.mechanismId ? extraState.mechanismId : '';
    this.mrcComponentClassName = extraState.componentClassName ? extraState.componentClassName : '';
    // Initialize mrcMapComponentNameToId here. It will be filled during checkBlock.
    this.mrcMapComponentNameToId = {};

    // Set the output plug.
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    const outputCheck = getOutputCheck(this.mrcComponentClassName);
    if (outputCheck) {
      this.setOutput(true, outputCheck);
    } else {
      this.setOutput(true);
    }
    const titleInput = this.appendDummyInput(INPUT_TITLE);
    if (this.mrcMechanismId) {
      titleInput
          .appendField(createFieldNonEditableText(''), FIELD_MECHANISM_NAME)
          .appendField('.');
    }
    // Here we create a text field for the component name.
    // Later, in checkBlock, we will replace it with a dropdown.
    titleInput
        .appendField(createFieldNonEditableText(''), FIELD_COMPONENT_NAME)
        .appendField(Blockly.Msg['OF_TYPE'])
        .appendField(createFieldNonEditableText(''), FIELD_COMPONENT_CLASS_NAME);
  },
  getComponents: function(this: ComponentReferenceBlock, editor: Editor): storageModuleContent.Component[] {
    // Get the list of components whose type matches this.mrcComponentClassName.
    const components: storageModuleContent.Component[] = [];
    let componentsToConsider: storageModuleContent.Component[] = [];
    if (this.mrcMechanismId) {
      // Only consider components that belong to the mechanism.
      // this.mrcMechanismId is the mechanismId from the MechanismInRobot.
      // We need to get the MechanismInRobot with that id, then get the mechanism, and then get
      // the public components defined in that mechanism.
      for (const mechanismInRobot of editor.getMechanismsFromRobot()) {
        if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
          for (const mechanism of editor.getMechanisms()) {
            if (mechanism.moduleId === mechanismInRobot.moduleId) {
              componentsToConsider = editor.getComponentsFromMechanism(mechanism);
              break;
            }
          }
          break;
        }
      }
    } else if (editor.getModuleType() === storageModule.ModuleType.MECHANISM) {
      // Only consider components (regular and private) in the current workspace.
      componentsToConsider = editor.getAllComponentsFromWorkspace();
    } else {
      // Only consider components in the robot.
      componentsToConsider = editor.getComponentsFromRobot();
    }
    componentsToConsider.forEach(component => {
      if (component.className === this.mrcComponentClassName) {
        components.push(component);
      }
    });
    return components;
  },

  /**
   * mrcOnModuleCurrent is called for each ComponentReferenceBlock when the module becomes the current module.
   */
  mrcOnModuleCurrent: function(this: ComponentReferenceBlock, editor: Editor): void {
    this.checkBlock(editor);
  },
  /**
   * mrcOnLoad is called for each ComponentReferenceBlock when the blocks are loaded in the blockly
   * workspace.
   */
  mrcOnLoad: function(this: ComponentReferenceBlock, editor: Editor): void {
    this.checkBlock(editor);
  },
  /**
   * mrcOnCreate is called for each ComponentReferenceBlock when it is created.
   */
  mrcOnCreate: function(this: ComponentReferenceBlock, editor: Editor): void {
    this.checkBlock(editor);
  },
  /**
   * checkBlock checks the block, updates it, and/or adds a warning balloon if necessary.
   * It is called from mrcOnModuleCurrent, mrcOnLoad, and mrcOnCreate above.
   */
  checkBlock: function(this: ComponentReferenceBlock, editor: Editor): void {
    const warnings: string[] = [];

    // Check whether the component still exists and whether it has been changed.
    // If the component doesn't exist, put a visible warning on this block.
    // If the component has changed, update the block.
    // If the component belongs to a mechanism, also check whether the mechanism
    // still exists and whether it has been changed.
    const componentNames: string[] = [];
    this.mrcMapComponentNameToId = {}
    this.getComponents(editor).forEach(component => {
      componentNames.push(component.name);
      this.mrcMapComponentNameToId[component.name] = component.componentId;
    });

    let warnedAboutMissingMechanism = false;
    if (this.mrcMechanismId) {
      let foundMechanism = false;
      const mechanismsInRobot = editor.getMechanismsFromRobot();
      for (const mechanismInRobot of mechanismsInRobot) {
        if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
          foundMechanism = true;

          // If the mechanism name has changed, we can handle that.
          if (this.getFieldValue(FIELD_MECHANISM_NAME) !== mechanismInRobot.name) {
            this.setFieldValue(mechanismInRobot.name, FIELD_MECHANISM_NAME);
          }
          break;
        }
      }
      if (!foundMechanism) {
        warnings.push(Blockly.Msg.WARNING_COMPONENT_REFERENCE_MISSING_MECHANISM);
        warnedAboutMissingMechanism = true;
      }
    }

    if (!warnedAboutMissingMechanism) {
      let foundComponent = false;
      for (const componentName of componentNames) {
        const componentId = this.mrcMapComponentNameToId[componentName];
        if (componentId === this.mrcComponentId) {
          foundComponent = true;

          // Replace the text field for the component name with a dropdown where the user can choose
          // between different components of the same type. For example, they can easily switch from
          // a motor component name "left_motor" to a motor component named "right_motor".
          const titleInput = this.getInput(INPUT_TITLE)
          if (!titleInput) {
            throw new Error('Could not find the title input');
          }
          let indexOfComponentNameField = -1;
          for (let i = 0, field; (field = titleInput.fieldRow[i]); i++) {
            if (field.name === FIELD_COMPONENT_NAME) {
              indexOfComponentNameField = i;
              break;
            }
          }
          if (indexOfComponentNameField === -1) {
            throw new Error('Could not find the component name field');
          }
          titleInput.removeField(FIELD_COMPONENT_NAME);
          titleInput.insertFieldAt(indexOfComponentNameField,
              createFieldDropdown(componentNames), FIELD_COMPONENT_NAME);
          // TODO(lizlooney): If the current module is the robot or a mechanism, we need to update the
          // items in the dropdown if the user adds or removes a component.

          this.setFieldValue(componentName, FIELD_COMPONENT_NAME);

          // Since we found the component, we can break out of the loop.
          break;
        }
      }
      if (!foundComponent) {
        if (this.mrcMechanismId) {
          // Check whether the the component still exists, but is a private component in the mechanism.
          for (const mechanismInRobot of editor.getMechanismsFromRobot()) {
            if (mechanismInRobot.mechanismId === this.mrcMechanismId) {
              for (const mechanism of editor.getMechanisms()) {
                if (mechanism.moduleId === mechanismInRobot.moduleId) {
                  for (const privateComponent of editor.getPrivateComponentsFromMechanism(mechanism)) {
                    if (privateComponent.className === this.mrcComponentClassName &&
                        privateComponent.componentId === this.mrcComponentId) {
                      foundComponent = true;
                      let warning = Blockly.Msg.WARNING_COMPONENT_REFERENCE_PRIVATE_COMPONENT;
                      warning = warning.replace('{{mechanismClassName}}', mechanism.className);
                      warnings.push(warning);
                      break
                    }
                  }
                  break;
                }
                if (foundComponent) {
                  break;
                }
              }
              break;
            }
            if (foundComponent) {
              break;
            }
          }
        }
      }

      if (!foundComponent) {
        warnings.push(Blockly.Msg.WARNING_COMPONENT_REFERENCE_MISSING_COMPONENT);
      }
    }

    if (warnings.length) {
      // Add a warnings to the block.
      const warningText = warnings.join('\n\n');
      this.setWarningText(warningText, WARNING_ID_COMPONENT_CHANGED);
      const icon = this.getIcon(Blockly.icons.IconType.WARNING);
      if (icon) {
        icon.setBubbleVisible(true);
      }
      if (this.rendered) {
        (this as unknown as Blockly.BlockSvg).bringToFront();
      }
    } else {
      // Clear the existing warning on the block.
      this.setWarningText(null, WARNING_ID_COMPONENT_CHANGED);
    }
  },

  /**
   * mrcShowSimpleClassNames is called for each ComponentReferenceBlock:
   * 1. after a block is loaded in the blockly workspace
   * 2. after a block is created
   * 3. when showSimpleClassNames has been changed
   */
  mrcShowSimpleClassNames: function(this: ComponentReferenceBlock, _editor: Editor, showSimpleClassNames: boolean): void {
    this.setFieldValue(
        classNameToShowOnBlocks(this.mrcComponentClassName, showSimpleClassNames),
        FIELD_COMPONENT_CLASS_NAME);
  },

  /**
   * mrcChangeIds is called when a module is copied so that the copy has different ids than the original.
   */
  mrcChangeIds: function (this: ComponentReferenceBlock, oldIdToNewId: { [oldId: string]: string }): void {
    if (this.mrcComponentId && this.mrcComponentId in oldIdToNewId) {
      this.mrcComponentId = oldIdToNewId[this.mrcComponentId];
    }
    if (this.mrcMechanismId && this.mrcMechanismId in oldIdToNewId) {
      this.mrcMechanismId = oldIdToNewId[this.mrcMechanismId];
    }
  },
  mrcGetFullLabel: function(this: ComponentReferenceBlock): string {
    let fullLabel: string = '';
    if (this.mrcMechanismId) {
      fullLabel += this.getFieldValue(FIELD_MECHANISM_NAME) + '.';
    }
    fullLabel += this.getFieldValue(FIELD_COMPONENT_NAME) +
        Blockly.Msg['OF_TYPE'] +
        this.getFieldValue(FIELD_COMPONENT_CLASS_NAME);
    return fullLabel;
  },
  renameComponentOrMechanism: function(this: ComponentReferenceBlock, id: string, newName: string): void {
    // renameComponentOrMechanism is called when a component or mechanism block in the same module is modified.
    if (id === this.mrcComponentId) {
      this.setFieldValue(newName, FIELD_COMPONENT_NAME);
    }
    if (this.mrcMechanismId) {
      if (id === this.mrcMechanismId) {
        this.setFieldValue(newName, FIELD_MECHANISM_NAME);
      }
    }
  },
};

export function setup(): void {
  Blockly.Blocks[BLOCK_NAME] = COMPONENT_REFERENCE;
}

export function pythonFromBlock(
    block: ComponentReferenceBlock,
    generator: ExtendedPythonGenerator,
) {
  let code = '';
  // Generate the correct code depending on the module type.
  switch (generator.getModuleType()) {
    case storageModule.ModuleType.ROBOT:
    case storageModule.ModuleType.MECHANISM:
      code = 'self.';
      break;
    case storageModule.ModuleType.OPMODE:
      code = 'self.robot.';
      break;
  }
  if (block.mrcMechanismId) {
    code += block.getFieldValue(FIELD_MECHANISM_NAME) + '.';
  }
  code += block.getFieldValue(FIELD_COMPONENT_NAME);
  return [code, Order.MEMBER];
};

function getAffectedBlocks(workspace: Blockly.Workspace, id: string): Blockly.Block[] {
  return workspace.getBlocksByType(BLOCK_NAME).filter((block) => {
    const componentReferenceBlock = block as ComponentReferenceBlock;
    return (
        componentReferenceBlock.mrcComponentId === id ||
        componentReferenceBlock.mrcMechanismId === id);
  });
}

export function checkComponentReferences(workspace: Blockly.Workspace, id: string, editor: Editor): void {
  getAffectedBlocks(workspace, id).forEach(block => {
    (block as ComponentReferenceBlock).checkBlock(editor);
  });
}

export function renameComponentOrMechanism(workspace: Blockly.Workspace, id: string, newName: string): void {
  getAffectedBlocks(workspace, id).forEach(block => {
    (block as ComponentReferenceBlock).renameComponentOrMechanism(id, newName);
  });
}

/**
 * Repoints the mrc_component_reference blocks that represent the given component. This is used when
 * a component is moved out of the robot and into a mechanism: a blocks that used to be myMotor
 * becomes myMechanism.myMotor
 *
 * This works on the JSON produced by Blockly.serialization.workspaces.save, rather than on a live
 * workspace, so that it can also be applied to modules that aren't currently open.
 *
 * @param blocks The JSON produced by Blockly.serialization.workspaces.save that we are looking through
 * @param componentId The componentId of the component that is being moved into a mechanism.
 * @param mechanismId The mechanismId of the mechanism that the component is being moved into.
 * @param mechanismName The name of the mechanism that the component is being moved into.
 * 
 * @returns true if any block was changed.
 */
export function repointComponentReferenceIntoMechanism(
    blocks: {[key: string]: any},
    componentId: string,
    mechanismId: string,
    mechanismName: string): boolean {
  let changed = false;

  console.log("repoint - looking for componentId " + componentId);

  const visitBlock = (blockJson: {[key: string]: any}): void => {
    console.log("visitBlock - blockJson.type is " + blockJson.type);
    // If this is a mrc_component_reference block, and it is calling a method on the given component,
    // then update it to call the method on the component within the given mechanism.
    if (blockJson.type === BLOCK_NAME) {
      const extraState = blockJson.extraState;
      if (extraState) {
        console.log("visitBlock - extraState.componentId is " + extraState.componentId);
        console.log("visitBlock - extraState.mechanismId is " + extraState.mechanismId);
      } else {
        console.log("visitBlock - extraState is " + extraState);
      }
      if (extraState &&
          extraState.componentId === componentId &&
          !extraState.mechanismId) {
        extraState.mechanismId = mechanismId;
        if (!blockJson.fields) {
          blockJson.fields = {};
        }
        blockJson.fields[FIELD_MECHANISM_NAME] = mechanismName;
        changed = true;
      }
    }
    if (blockJson.next && blockJson.next.block) {
      visitBlock(blockJson.next.block);
    }
  };

  storageModuleContent.getTopLevelBlocksJson(blocks).forEach(visitBlock);
  return changed;
}

// Functions used for creating blocks for the toolbox.

export function getComponentReferenceBlock(
    component: storageModuleContent.Component,
    showSimpleClassNames: boolean): toolboxItems.Block {
  const extraState: ComponentReferenceExtraState = {
    componentId: component.componentId,
    componentClassName: component.className,
    componentName: component.name,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_COMPONENT_NAME] = component.name;
  fields[FIELD_COMPONENT_CLASS_NAME] = classNameToShowOnBlocks(component.className, showSimpleClassNames)
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, null);
}

export function getMechanismComponentReferenceBlock(
    component: storageModuleContent.Component,
    mechanismInRobot: storageModuleContent.MechanismInRobot,
    showSimpleClassNames: boolean): toolboxItems.Block {
  const extraState: ComponentReferenceExtraState = {
    componentId: component.componentId,
    mechanismId: mechanismInRobot.mechanismId,
    componentName: component.name,
    componentClassName: component.className,
  };
  const fields: {[key: string]: any} = {};
  fields[FIELD_MECHANISM_NAME] = mechanismInRobot.name;
  fields[FIELD_COMPONENT_NAME] = component.name;
  fields[FIELD_COMPONENT_CLASS_NAME] = classNameToShowOnBlocks(component.className, showSimpleClassNames)
  return new toolboxItems.Block(BLOCK_NAME, extraState, fields, null);
}
