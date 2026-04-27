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
 * @fileoverview This has the fields for selecting gamepad ports and buttons
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import * as storageProject from '../storage/project';
import { GamepadType, GamepadTypeUtils } from '../types/GamepadType';
import { GamepadDropdownOptionsChange } from './gamepad_dropdown_options_change';

const MIN_GAMEPAD_PORT = 0;
const MAX_GAMEPAD_PORT = 5;

// Module-level variable to store the current gamepad configuration
let currentGamepadConfig: storageProject.GamepadConfig = GamepadTypeUtils.getDefaultGamepadConfig();

/**
 * Updates the current gamepad configuration used for dynamic dropdown generation.
 * This should be called when the project is loaded or when the gamepad config changes.
 */
export function updateGamepadConfig(config: storageProject.GamepadConfig): void {
    currentGamepadConfig = config;
}

export const PORT_FIELD_NAME = 'GAMEPAD_PORT';
export const BUTTON_FIELD_NAME = 'GAMEPAD_BUTTON';
export const ACTION_FIELD_NAME = 'GAMEPAD_ACTION';
export const AXIS_FIELD_NAME = 'GAMEPAD_AXIS';
export const EVENT_FIELD_NAME = 'GAMEPAD_EVENT';
export const RUMBLE_FIELD_NAME = 'GAMEPAD_RUMBLE';

const ACTION_CONFIG = new Map([
    ['IS_DOWN', { display: () => Blockly.Msg['GAMEPAD_IS_DOWN'], suffix: '' }],
    ['WAS_PRESSED', { display: () => Blockly.Msg['GAMEPAD_PRESSED'], suffix: 'Pressed' }],
    ['WAS_RELEASED', { display: () => Blockly.Msg['GAMEPAD_RELEASED'], suffix: 'Released' }]
]);

const EVENT_CONFIG = new Map([
    ['GAMEPAD_EVENT_PRESSED', { display: () => Blockly.Msg['GAMEPAD_EVENT_PRESSED'] }],
    ['GAMEPAD_EVENT_RELEASED', { display: () => Blockly.Msg['GAMEPAD_EVENT_RELEASED'] }],
    ['GAMEPAD_EVENT_CHANGED', { display: () => Blockly.Msg['GAMEPAD_EVENT_CHANGED'] }]
]);


export function createTitleField(): Blockly.Field {
    return new Blockly.FieldLabel(Blockly.Msg['GAMEPAD']);   
}

export function createPortField(onlyWithRumble: boolean = false): Blockly.FieldDropdown {
    return new Blockly.FieldDropdown(function(this: Blockly.FieldDropdown): Blockly.MenuOption[] {
        const options: Blockly.MenuOption[] = [];

        // Only show ports that have gamepads configured (not NONE)
        for (let port = MIN_GAMEPAD_PORT; port <= MAX_GAMEPAD_PORT; port++) {
            const gamepadType = GamepadTypeUtils.getGamepad(port, currentGamepadConfig);
            if (gamepadType !== GamepadType.NONE) {
                if (onlyWithRumble && !GamepadTypeUtils.getRumbleConfig(gamepadType)) {
                    continue;
                }
                const portStr = port.toString();
                options.push([portStr, portStr]);
            }
        }

        // If no ports have gamepads, show disabled placeholder
        if (options.length === 0) {
            options.push(['---', '---']);
            this.setEnabled(false);
        } else {
            this.setEnabled(true);
        }

        return options;
    });
}

/**
 * A structure for managing data needed by the menu generator of a gamepad dropdown.
 */
interface DependencyData {
  /**
   * A reference to the parent field (port field) of an associated gamepad dropdown.
   * This field's value determines the available options of the child field.
   */
  parentField?: Blockly.Field<string>;

  /**
   * The child field's currently available menu options based on the current
   * value of the parent field.
   */
  derivedOptions?: Blockly.MenuOption[];
}

/**
 * A dropdown field for gamepad buttons that automatically updates its options
 * based on the selected gamepad port. When the port changes, the button options
 * update to match the capabilities of the newly selected gamepad type.
 */
export class FieldGamepadButtonDropdown extends Blockly.FieldDropdown {
  /**
   * Contains data used by this dropdown field's menu generator.
   * This is public so that the GamepadDropdownOptionsChange event can
   * update it while undoing/redoing.
   */
  dependencyData: DependencyData;

  /** The name of the field that determines this field's options. */
  private parentName: string;

  /**
   * Constructs a new FieldGamepadButtonDropdown.
   *
   * @param parentName The name of the parent field whose value determines this
   *    field's available options. Defaults to PORT_FIELD_NAME.
   * @param validator An optional function that is called to validate changes to
   *    this field's value.
   * @param config An optional map of general options used to configure the
   *    field, such as a tooltip.
   */
  constructor(
    parentName: string = PORT_FIELD_NAME,
    validator?: Blockly.FieldValidator,
    config?: Blockly.FieldConfig,
  ) {
    const dependencyData: DependencyData = {};

    // A menu option generator function for this child field that reads the
    // derived options in the dependency data if available.
    const menuGenerator: Blockly.MenuGeneratorFunction = () => {
      // If derivedOptions has been initialized, use that.
      if (dependencyData.derivedOptions) {
        return dependencyData.derivedOptions;
      }

      // Fall back on the options corresponding to the parent field's current value.
      if (dependencyData.parentField) {
        const portValue = dependencyData.parentField.getValue();
        if (portValue) {
          const port = Number(portValue);
          const gamepadType = GamepadTypeUtils.getGamepad(port, currentGamepadConfig);
          const buttonConfig = GamepadTypeUtils.getButtonConfig(gamepadType);
          if (buttonConfig) {
            const options: Blockly.MenuOption[] = [];
            for (const [key, configItem] of buttonConfig.entries()) {
              options.push([configItem.display(), key]);
            }
            if (options.length > 0) {
              return options;
            }
          }
        }
      }

      // Fall back on basic default options.
      return [['---', '---']];
    };

    super(menuGenerator, validator, config);
    this.parentName = parentName;
    this.dependencyData = dependencyData;
  }

  /**
   * Constructs a FieldGamepadButtonDropdown from a JSON arg object.
   *
   * @param options A JSON object with optional "parentName" property.
   * @returns The new field instance.
   */
  static fromJson(options: any): FieldGamepadButtonDropdown {
    return new FieldGamepadButtonDropdown(
      options['parentName'],
      undefined,
      options,
    );
  }

  /**
   * Attach this field to a block.
   *
   * @param block The block containing this field.
   */
  setSourceBlock(block: Blockly.Block) {
    super.setSourceBlock(block);

    const parentField: Blockly.Field<string> | null = block.getField(
      this.parentName,
    );

    if (!parentField) {
      throw new Error(
        'Could not find a parent field with the name ' +
          this.parentName +
          ' for the gamepad button dropdown.',
      );
    }

    this.dependencyData.parentField = parentField;

    const oldValidator = parentField.getValidator();

    // A validator function for the parent field that has the side effect of
    // updating the options of this child dropdown field based on the new value
    // of the parent field whenever it changes.
    parentField.setValidator((newValue) => {
      if (oldValidator) {
        const validatedValue = oldValidator(newValue);
        // If a validator returns null, that means the new value is invalid and
        // the change should be canceled.
        if (validatedValue === null) {
          return null;
        }
        // If a validator returns undefined, that means no change. Otherwise,
        // use the returned value as the new value.
        if (validatedValue !== undefined) {
          newValue = validatedValue;
        }
      }
      this.updateOptionsBasedOnNewValue(newValue);
      return newValue;
    });
    this.updateOptionsBasedOnNewValue(parentField.getValue() ?? undefined);
  }

  /**
   * Updates the options of this child dropdown field based on the new value of
   * the parent field.
   *
   * @param newValue The newly assigned port value.
   */
  private updateOptionsBasedOnNewValue(newValue: string | undefined): void {
    if (newValue == undefined) {
      return;
    }

    const block = this.getSourceBlock();
    if (!block) {
      throw new Error(
        'Could not validate a field that is not attached to a block: ' +
          this.name,
      );
    }

    const port = Number(newValue);
    const gamepadType = GamepadTypeUtils.getGamepad(port, currentGamepadConfig);
    const buttonConfig = GamepadTypeUtils.getButtonConfig(gamepadType);

    const oldChildValue = this.getValue();
    const oldChildOptions = this.getOptions(false);
    let newChildOptions: Blockly.MenuOption[] = [];

    if (buttonConfig) {
      for (const [key, configItem] of buttonConfig.entries()) {
        newChildOptions.push([configItem.display(), key]);
      }
    }

    // If no options available, use placeholder
    if (newChildOptions.length === 0) {
      newChildOptions = [['---', '---']];
    }

    // If the child field's value is still available in the new options, keep
    // it, otherwise change the field's value to the first available option.
    const newOptionsIncludeOldValue =
      newChildOptions.find((option) => option[1] == oldChildValue) != undefined;
    const newChildValue = newOptionsIncludeOldValue
      ? oldChildValue
      : newChildOptions[0][1];

    // Record the options so that the option generator can access them.
    this.dependencyData.derivedOptions = newChildOptions;

    // Re-run the option generator to update the options on the dropdown.
    this.getOptions(false);

    // Update this child field's value without broadcasting the normal change
    // event. The normal value change event can't be properly undone, because
    // the old value may not be one of the currently valid options, so a custom
    // change event will be broadcast instead that handles swapping the options
    // and the value at the same time.
    Blockly.Events.disable();
    this.setValue(newChildValue);
    Blockly.Events.enable();

    if (Blockly.Events.getRecordUndo()) {
      if (!Blockly.Events.getGroup()) {
        // Start a change group before the change event. The change event for
        // the parent field value will be created after this function returns
        // and will be part of the same group.
        Blockly.Events.setGroup(true);
        // Clear the change group later, after all related events have been
        // broadcast, but before the user performs any more actions.
        setTimeout(() => Blockly.Events.setGroup(false));
      }

      // Record that the child field's options and value have changed.
      Blockly.Events.fire(
        new GamepadDropdownOptionsChange(
          block,
          this.name,
          oldChildValue ?? undefined,
          newChildValue ?? undefined,
          oldChildOptions,
          newChildOptions,
        ),
      );
    }
  }
}

/**
 * A dropdown field for gamepad axes that automatically updates its options
 * based on the selected gamepad port. When the port changes, the axis options
 * update to match the capabilities of the newly selected gamepad type.
 */
export class FieldGamepadAxisDropdown extends Blockly.FieldDropdown {
  /**
   * Contains data used by this dropdown field's menu generator.
   * This is public so that the GamepadDropdownOptionsChange event can
   * update it while undoing/redoing.
   */
  dependencyData: DependencyData;

  /** The name of the field that determines this field's options. */
  private parentName: string;

  /**
   * Constructs a new FieldGamepadAxisDropdown.
   *
   * @param parentName The name of the parent field whose value determines this
   *    field's available options. Defaults to PORT_FIELD_NAME.
   * @param validator An optional function that is called to validate changes to
   *    this field's value.
   * @param config An optional map of general options used to configure the
   *    field, such as a tooltip.
   */
  constructor(
    parentName: string = PORT_FIELD_NAME,
    validator?: Blockly.FieldValidator,
    config?: Blockly.FieldConfig,
  ) {
    const dependencyData: DependencyData = {};

    // A menu option generator function for this child field that reads the
    // derived options in the dependency data if available.
    const menuGenerator: Blockly.MenuGeneratorFunction = () => {
      // If derivedOptions has been initialized, use that.
      if (dependencyData.derivedOptions) {
        return dependencyData.derivedOptions;
      }

      // Fall back on the options corresponding to the parent field's current value.
      if (dependencyData.parentField) {
        const portValue = dependencyData.parentField.getValue();
        if (portValue) {
          const port = Number(portValue);
          const gamepadType = GamepadTypeUtils.getGamepad(port, currentGamepadConfig);
          const axisConfig = GamepadTypeUtils.getAxisConfig(gamepadType);
          if (axisConfig) {
            const options: Blockly.MenuOption[] = [];
            for (const [key, configItem] of axisConfig.entries()) {
              options.push([configItem.display(), key]);
            }
            if (options.length > 0) {
              return options;
            }
          }
        }
      }

      // Fall back on basic default options.
      return [['---', '---']];
    };

    super(menuGenerator, validator, config);
    this.parentName = parentName;
    this.dependencyData = dependencyData;
  }

  /**
   * Constructs a FieldGamepadAxisDropdown from a JSON arg object.
   *
   * @param options A JSON object with optional "parentName" property.
   * @returns The new field instance.
   */
  static fromJson(options: any): FieldGamepadAxisDropdown {
    return new FieldGamepadAxisDropdown(
      options['parentName'],
      undefined,
      options,
    );
  }

  /**
   * Attach this field to a block.
   *
   * @param block The block containing this field.
   */
  setSourceBlock(block: Blockly.Block) {
    super.setSourceBlock(block);

    const parentField: Blockly.Field<string> | null = block.getField(
      this.parentName,
    );

    if (!parentField) {
      throw new Error(
        'Could not find a parent field with the name ' +
          this.parentName +
          ' for the gamepad axis dropdown.',
      );
    }

    this.dependencyData.parentField = parentField;

    const oldValidator = parentField.getValidator();

    // A validator function for the parent field that has the side effect of
    // updating the options of this child dropdown field based on the new value
    // of the parent field whenever it changes.
    parentField.setValidator((newValue) => {
      if (oldValidator) {
        const validatedValue = oldValidator(newValue);
        // If a validator returns null, that means the new value is invalid and
        // the change should be canceled.
        if (validatedValue === null) {
          return null;
        }
        // If a validator returns undefined, that means no change. Otherwise,
        // use the returned value as the new value.
        if (validatedValue !== undefined) {
          newValue = validatedValue;
        }
      }
      this.updateOptionsBasedOnNewValue(newValue);
      return newValue;
    });
    this.updateOptionsBasedOnNewValue(parentField.getValue() ?? undefined);
  }

  /**
   * Updates the options of this child dropdown field based on the new value of
   * the parent field.
   *
   * @param newValue The newly assigned port value.
   */
  private updateOptionsBasedOnNewValue(newValue: string | undefined): void {
    if (newValue == undefined) {
      return;
    }

    const block = this.getSourceBlock();
    if (!block) {
      throw new Error(
        'Could not validate a field that is not attached to a block: ' +
          this.name,
      );
    }

    const port = Number(newValue);
    const gamepadType = GamepadTypeUtils.getGamepad(port, currentGamepadConfig);
    const axisConfig = GamepadTypeUtils.getAxisConfig(gamepadType);

    const oldChildValue = this.getValue();
    const oldChildOptions = this.getOptions(false);
    let newChildOptions: Blockly.MenuOption[] = [];

    if (axisConfig) {
      for (const [key, configItem] of axisConfig.entries()) {
        newChildOptions.push([configItem.display(), key]);
      }
    }

    // If no options available, use placeholder
    if (newChildOptions.length === 0) {
      newChildOptions = [['---', '---']];
    }

    // If the child field's value is still available in the new options, keep
    // it, otherwise change the field's value to the first available option.
    const newOptionsIncludeOldValue =
      newChildOptions.find((option) => option[1] == oldChildValue) != undefined;
    const newChildValue = newOptionsIncludeOldValue
      ? oldChildValue
      : newChildOptions[0][1];

    // Record the options so that the option generator can access them.
    this.dependencyData.derivedOptions = newChildOptions;

    // Re-run the option generator to update the options on the dropdown.
    this.getOptions(false);

    // Update this child field's value without broadcasting the normal change
    // event. The normal value change event can't be properly undone, because
    // the old value may not be one of the currently valid options, so a custom
    // change event will be broadcast instead that handles swapping the options
    // and the value at the same time.
    Blockly.Events.disable();
    this.setValue(newChildValue);
    Blockly.Events.enable();

    if (Blockly.Events.getRecordUndo()) {
      if (!Blockly.Events.getGroup()) {
        // Start a change group before the change event. The change event for
        // the parent field value will be created after this function returns
        // and will be part of the same group.
        Blockly.Events.setGroup(true);
        // Clear the change group later, after all related events have been
        // broadcast, but before the user performs any more actions.
        setTimeout(() => Blockly.Events.setGroup(false));
      }

      // Record that the child field's options and value have changed.
      Blockly.Events.fire(
        new GamepadDropdownOptionsChange(
          block,
          this.name,
          oldChildValue ?? undefined,
          newChildValue ?? undefined,
          oldChildOptions,
          newChildOptions,
        ),
      );
    }
  }
}

/**
 * A dropdown field for gamepad rumble motors that automatically updates its options
 * based on the selected gamepad port. When the port changes, the rumble options
 * update to match the capabilities of the newly selected gamepad type.
 */
export class FieldGamepadRumbleDropdown extends Blockly.FieldDropdown {
  /**
   * Contains data used by this dropdown field's menu generator.
   * This is public so that the GamepadDropdownOptionsChange event can
   * update it while undoing/redoing.
   */
  dependencyData: DependencyData;

  /** The name of the field that determines this field's options. */
  private parentName: string;

  /**
   * Constructs a new FieldGamepadRumbleDropdown.
   *
   * @param parentName The name of the parent field whose value determines this
   *    field's available options. Defaults to PORT_FIELD_NAME.
   * @param validator An optional function that is called to validate changes to
   *    this field's value.
   * @param config An optional map of general options used to configure the
   *    field, such as a tooltip.
   */
  constructor(
    parentName: string = PORT_FIELD_NAME,
    validator?: Blockly.FieldValidator,
    config?: Blockly.FieldConfig,
  ) {
    const dependencyData: DependencyData = {};

    // A menu option generator function for this child field that reads the
    // derived options in the dependency data if available.
    const menuGenerator: Blockly.MenuGeneratorFunction = () => {
      // If derivedOptions has been initialized, use that.
      if (dependencyData.derivedOptions) {
        return dependencyData.derivedOptions;
      }

      // Fall back on the options corresponding to the parent field's current value.
      if (dependencyData.parentField) {
        const portValue = dependencyData.parentField.getValue();
        if (portValue) {
          const port = Number(portValue);
          const gamepadType = GamepadTypeUtils.getGamepad(port, currentGamepadConfig);
          const rumbleConfig = GamepadTypeUtils.getRumbleConfig(gamepadType);
          if (rumbleConfig) {
            const options: Blockly.MenuOption[] = [];
            for (const [key, configItem] of rumbleConfig.entries()) {
              options.push([configItem.display(), key]);
            }
            if (options.length > 0) {
              return options;
            }
          }
        }
      }

      // Fall back on basic default options.
      return [['---', '---']];
    };

    super(menuGenerator, validator, config);
    this.parentName = parentName;
    this.dependencyData = dependencyData;
  }

  /**
   * Constructs a FieldGamepadRumbleDropdown from a JSON arg object.
   *
   * @param options A JSON object with optional "parentName" property.
   * @returns The new field instance.
   */
  static fromJson(options: any): FieldGamepadRumbleDropdown {
    return new FieldGamepadRumbleDropdown(
      options['parentName'],
      undefined,
      options,
    );
  }

  /**
   * Attach this field to a block.
   *
   * @param block The block containing this field.
   */
  setSourceBlock(block: Blockly.Block) {
    super.setSourceBlock(block);

    const parentField: Blockly.Field<string> | null = block.getField(
      this.parentName,
    );

    if (!parentField) {
      throw new Error(
        'Could not find a parent field with the name ' +
          this.parentName +
          ' for the gamepad rumble dropdown.',
      );
    }

    this.dependencyData.parentField = parentField;

    const oldValidator = parentField.getValidator();

    // A validator function for the parent field that has the side effect of
    // updating the options of this child dropdown field based on the new value
    // of the parent field whenever it changes.
    parentField.setValidator((newValue) => {
      if (oldValidator) {
        const validatedValue = oldValidator(newValue);
        // If a validator returns null, that means the new value is invalid and
        // the change should be canceled.
        if (validatedValue === null) {
          return null;
        }
        // If a validator returns undefined, that means no change. Otherwise,
        // use the returned value as the new value.
        if (validatedValue !== undefined) {
          newValue = validatedValue;
        }
      }
      this.updateOptionsBasedOnNewValue(newValue);
      return newValue;
    });
    this.updateOptionsBasedOnNewValue(parentField.getValue() ?? undefined);
  }

  /**
   * Updates the options of this child dropdown field based on the new value of
   * the parent field.
   *
   * @param newValue The newly assigned port value.
   */
  private updateOptionsBasedOnNewValue(newValue: string | undefined): void {
    if (newValue == undefined) {
      return;
    }

    const block = this.getSourceBlock();
    if (!block) {
      throw new Error(
        'Could not validate a field that is not attached to a block: ' +
          this.name,
      );
    }

    const port = Number(newValue);
    const gamepadType = GamepadTypeUtils.getGamepad(port, currentGamepadConfig);
    const rumbleConfig = GamepadTypeUtils.getRumbleConfig(gamepadType);

    const oldChildValue = this.getValue();
    const oldChildOptions = this.getOptions(false);
    let newChildOptions: Blockly.MenuOption[] = [];

    if (rumbleConfig) {
      for (const [key, configItem] of rumbleConfig.entries()) {
        newChildOptions.push([configItem.display(), key]);
      }
    }

    // If no options available, use placeholder
    if (newChildOptions.length === 0) {
      newChildOptions = [['---', '---']];
    }

    // If the child field's value is still available in the new options, keep
    // it, otherwise change the field's value to the first available option.
    const newOptionsIncludeOldValue =
      newChildOptions.find((option) => option[1] == oldChildValue) != undefined;
    const newChildValue = newOptionsIncludeOldValue
      ? oldChildValue
      : newChildOptions[0][1];

    // Record the options so that the option generator can access them.
    this.dependencyData.derivedOptions = newChildOptions;

    // Re-run the option generator to update the options on the dropdown.
    this.getOptions(false);

    // Update this child field's value without broadcasting the normal change
    // event. The normal value change event can't be properly undone, because
    // the old value may not be one of the currently valid options, so a custom
    // change event will be broadcast instead that handles swapping the options
    // and the value at the same time.
    Blockly.Events.disable();
    this.setValue(newChildValue);
    Blockly.Events.enable();

    if (Blockly.Events.getRecordUndo()) {
      if (!Blockly.Events.getGroup()) {
        // Start a change group before the change event. The change event for
        // the parent field value will be created after this function returns
        // and will be part of the same group.
        Blockly.Events.setGroup(true);
        // Clear the change group later, after all related events have been
        // broadcast, but before the user performs any more actions.
        setTimeout(() => Blockly.Events.setGroup(false));
      }

      // Record that the child field's options and value have changed.
      Blockly.Events.fire(
        new GamepadDropdownOptionsChange(
          block,
          this.name,
          oldChildValue ?? undefined,
          newChildValue ?? undefined,
          oldChildOptions,
          newChildOptions,
        ),
      );
    }
  }
}

export function createButtonField(): Blockly.Field {
    return new FieldGamepadButtonDropdown();
}

export function createAnalogAxisField(): Blockly.Field {
    return new FieldGamepadAxisDropdown();
}

export function createRumbleField(): Blockly.Field {
    return new FieldGamepadRumbleDropdown();
}

export function createActionField(): Blockly.Field {
    return new Blockly.FieldDropdown(
        Array.from(ACTION_CONFIG.entries()).map(([key, config]) => [config.display(), key])
    )
}

export function createEventField(): Blockly.Field {
    return new Blockly.FieldDropdown(
        Array.from(EVENT_CONFIG.entries()).map(([key, config]) => [config.display(), key])
    )
}

function getGamepad(gamepad: number): string {
    // TODO: Update this when the actual driver station display class is implemented
    return 'DriverStation.gamepads[' + gamepad + ']';
}

export function methodForButton(gamepad: number, button: string, action: string): string {
    const gamepadType = GamepadTypeUtils.getGamepad(gamepad, currentGamepadConfig);
    
    // Get the button configuration for this gamepad type
    const buttonConfig = GamepadTypeUtils.getButtonConfig(gamepadType);
    const config = buttonConfig?.get(button);
    const suffix = ACTION_CONFIG.get(action);

    if (config === undefined || suffix === undefined) {
        return '';
    }

    return getGamepad(gamepad) + '.' +
        config.method +
        suffix.suffix + '()';
}

export function methodForAxis(gamepad: number, axis: string): string {
    const gamepadType = GamepadTypeUtils.getGamepad(gamepad, currentGamepadConfig);
    
    // Get the axis configuration for this gamepad type
    const axisConfig = GamepadTypeUtils.getAxisConfig(gamepadType);
    
    return getGamepad(gamepad) + '.' +
        (axisConfig?.get(axis)?.method ?? '') + '()';
}

export function methodForRumble(gamepad: number, rumble: string, value : number): string {
    const gamepadType = GamepadTypeUtils.getGamepad(gamepad, currentGamepadConfig);
    
    // Get the rumble configuration for this gamepad type
    const rumbleConfig = GamepadTypeUtils.getRumbleConfig(gamepadType);
    
    return getGamepad(gamepad) + '.setRumble(' +
        (rumbleConfig?.get(rumble)?.rumbleType ?? '') + ', ' + value + ')\n';
}

// Register field types with Blockly
Blockly.fieldRegistry.register(
  'field_gamepad_button_dropdown',
  FieldGamepadButtonDropdown,
);

Blockly.fieldRegistry.register(
  'field_gamepad_axis_dropdown',
  FieldGamepadAxisDropdown,
);

Blockly.fieldRegistry.register(
  'field_gamepad_rumble_dropdown',
  FieldGamepadRumbleDropdown,
);