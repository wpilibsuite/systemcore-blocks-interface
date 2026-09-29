/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview A variable dropdown that only contains the variables of one python type.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly';

import * as variable from '../blocks/utils/variable';

const CREATE_VARIABLE_ID = 'MRC_CREATE_TYPED_VARIABLE';

/**
 * A variable dropdown that only shows the variables of the given type. Variables belong to the
 * workspace, so only the variables in the current module are shown. The dropdown also has an
 * option to create a new variable of the given type.
 */
export class FieldTypedVariable extends Blockly.FieldVariable {
  private readonly varType: string;

  constructor(varType: string) {
    super(variable.varNameForType(varType) || null, undefined, [varType], varType);
    this.varType = varType;
    this.menuGenerator_ = (): Blockly.MenuOption[] => {
      const options = Blockly.FieldVariable.dropdownCreate.call(this);
      // Put the create option after the variables, before the rename and delete options.
      let index = options.findIndex(
          option => Array.isArray(option) && option[1] === Blockly.RENAME_VARIABLE_ID);
      if (index === -1) {
        index = options.length;
      }
      options.splice(index, 0, [Blockly.Msg['NEW_VARIABLE'], CREATE_VARIABLE_ID]);
      return options;
    };
  }

  protected override onItemSelected_(menu: Blockly.Menu, menuItem: Blockly.MenuItem) {
    if (menuItem.getValue() === CREATE_VARIABLE_ID) {
      const workspace = this.getSourceBlock()?.workspace as Blockly.WorkspaceSvg | undefined;
      if (workspace) {
        Blockly.Variables.createVariableButtonHandler(workspace, (name) => {
          const newVariable = name ? workspace.getVariableMap().getVariable(name, this.varType) : null;
          if (newVariable) {
            this.setValue(newVariable.getId());
          }
        }, this.varType);
      }
      return;
    }
    super.onItemSelected_(menu, menuItem);
  }
}

/** The value of a FieldTypedVariableOrDefault when the default option is chosen. */
export const DEFAULT_OPTION_VALUE = 'MRC_DEFAULT';

const RENAME_VARIABLE_ID = 'MRC_RENAME_TYPED_VARIABLE';
const DELETE_VARIABLE_ID = 'MRC_DELETE_TYPED_VARIABLE';

/** The saved state of a FieldTypedVariableOrDefault that has a variable chosen. */
type VariableState = {
  id: string,
  name: string,
  type: string,
};

/**
 * A dropdown with a "default" option followed by the variables of the given type in the current
 * module. The value is DEFAULT_OPTION_VALUE or the id of the chosen variable. Blockly finds the
 * blocks that use a variable through fields that reference variables, so renaming a variable
 * updates this field and deleting a variable deletes the blocks that have it chosen.
 *
 * FieldVariable can't be used because it only accepts variable ids.
 *
 * WARNING: This class relies on Blockly internals that are not part of the public API.
 */
export class FieldTypedVariableOrDefault extends Blockly.FieldDropdown {
  private readonly varType: string;

  constructor(varType: string) {
    super(Blockly.Field.SKIP_SETUP);
    this.varType = varType;
    this.menuGenerator_ = () => this.createOptions();
    this.setValue(DEFAULT_OPTION_VALUE);
  }

  override referencesVariables(): boolean {
    return true;
  }

  override refreshVariableName(): void {
    this.forceRerender();
  }

  private getVariable(): Blockly.IVariableModel<Blockly.IVariableState> | null {
    const workspace = this.getSourceBlock()?.workspace;
    if (!workspace || !this.value_ || this.value_ === DEFAULT_OPTION_VALUE) {
      return null;
    }
    return workspace.getVariableMap().getVariableById(this.value_);
  }

  private createOptions(): Blockly.MenuOption[] {
    const options: Blockly.MenuOption[] = [[Blockly.Msg['TYPED_VARIABLE_DEFAULT'], DEFAULT_OPTION_VALUE]];
    const workspace = this.getSourceBlock()?.workspace;
    if (!workspace) {
      return options;
    }
    const variables = workspace.getVariableMap().getVariablesOfType(this.varType);
    variables.sort((a, b) => a.getName().localeCompare(b.getName()));
    for (const variable of variables) {
      options.push([variable.getName(), variable.getId()]);
    }
    options.push([Blockly.Msg['NEW_VARIABLE'], CREATE_VARIABLE_ID]);
    const selectedVariable = this.getVariable();
    if (selectedVariable) {
      options.push([
        Blockly.Msg['RENAME_VARIABLE'].replace('%1', selectedVariable.getName()),
        RENAME_VARIABLE_ID,
      ]);
      options.push([
        Blockly.Msg['DELETE_VARIABLE'].replace('%1', selectedVariable.getName()),
        DELETE_VARIABLE_ID,
      ]);
    }
    return options;
  }

  protected override doClassValidation_(newValue?: string): string | null {
    if (newValue === DEFAULT_OPTION_VALUE) {
      return newValue;
    }
    const workspace = this.getSourceBlock()?.workspace;
    const variable = (workspace && newValue) ? workspace.getVariableMap().getVariableById(newValue) : null;
    return (variable && variable.getType() === this.varType) ? newValue! : null;
  }

  protected override doValueUpdate_(newValue: string): void {
    // Regenerate the options so the new value is found in them.
    this.getOptions(false);
    super.doValueUpdate_(newValue);
  }

  protected override getText_(): string {
    if (this.value_ === DEFAULT_OPTION_VALUE) {
      return Blockly.Msg['TYPED_VARIABLE_DEFAULT'];
    }
    return this.getVariable()?.getName() ?? '';
  }

  override saveState(): string | VariableState {
    // Save the name and type too, so the variable is created if the block is pasted into a
    // workspace that doesn't have it.
    const variable = this.getVariable();
    if (variable) {
      return {
        id: variable.getId(),
        name: variable.getName(),
        type: variable.getType(),
      };
    }
    return DEFAULT_OPTION_VALUE;
  }

  override loadState(state: string | VariableState): void {
    if (typeof state === 'object') {
      const workspace = this.getSourceBlock()?.workspace;
      if (workspace) {
        const variable = Blockly.Variables.getOrCreateVariablePackage(
            workspace, state.id, state.name, state.type);
        this.setValue(variable.getId());
        return;
      }
    }
    this.setValue(state === DEFAULT_OPTION_VALUE ? state : DEFAULT_OPTION_VALUE);
  }

  protected override onItemSelected_(_menu: Blockly.Menu, menuItem: Blockly.MenuItem) {
    const workspace = this.getSourceBlock()?.workspace as Blockly.WorkspaceSvg | undefined;
    const id = menuItem.getValue();
    const selectedVariable = this.getVariable();
    if (workspace && id === CREATE_VARIABLE_ID) {
      Blockly.Variables.createVariableButtonHandler(workspace, (name) => {
        const newVariable = name ? workspace.getVariableMap().getVariable(name, this.varType) : null;
        if (newVariable) {
          this.setValue(newVariable.getId());
        }
      }, this.varType);
    } else if (workspace && selectedVariable && id === RENAME_VARIABLE_ID) {
      Blockly.Variables.renameVariable(workspace, selectedVariable);
    } else if (workspace && selectedVariable && id === DELETE_VARIABLE_ID) {
      // This deletes all the blocks that use the variable, including this one.
      Blockly.Variables.deleteVariable(workspace, selectedVariable, this.getSourceBlock()!);
    } else {
      this.setValue(id);
    }
  }
}
