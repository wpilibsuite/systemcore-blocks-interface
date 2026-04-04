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
 * @fileoverview An event representing when a gamepad dropdown field changes
 * state based on parent port field changes.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';

/**
 * A deep equality comparison between the two provided arrays recursively
 * comparing any child elements that are also arrays.
 *
 * @param a The first array to compare.
 * @param b The second array to compare.
 * @returns Whether the arrays are deeply equivalent.
 */
function arraysAreEquivalent<T>(a: T[], b: T[]): boolean {
  return (
    a.length === b.length &&
    a.every((aElement, index) => {
      const bElement = b[index];
      if (Array.isArray(aElement) && Array.isArray(bElement)) {
        return arraysAreEquivalent(aElement, bElement);
      }
      return aElement === bElement;
    })
  );
}

/** The structure of a serialized GamepadDropdownOptionsChange. */
export interface GamepadDropdownOptionsChangeJson
  extends Blockly.Events.BlockBaseJson {
  name: string;
  newValue: string;
  oldValue: string;
  oldOptions: Blockly.MenuOption[];
  newOptions: Blockly.MenuOption[];
}

/**
 * A change event representing a simultaneous change to a dropdown field's
 * options and value. The old value must be one of the old options, and the new
 * value must be one of the new options. Unlike a normal value change event,
 * it's possible for this event to change the value to something that wasn't
 * previously one of the valid options--in either direction--by also changing
 * the options at the same time.
 */
export class GamepadDropdownOptionsChange extends Blockly.Events.BlockBase {
  /** The name to register with Blockly for the type of event. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static readonly EVENT_TYPE: string = 'gamepad_dropdown_options_change';

  /** The name of the change event type for registering with Blockly. */
  readonly type = GamepadDropdownOptionsChange.EVENT_TYPE;

  /** The name of the field that changed. */
  name?: string;

  /** The original value of the field. */
  oldValue?: string;

  /** The new value of the field. */
  newValue?: string;

  /** The original available options for the dropdown field. */
  oldOptions?: Blockly.MenuOption[];

  /** The new available options for the dropdown field. */
  newOptions?: Blockly.MenuOption[];

  /**
   * Construct a new GamepadDropdownOptionsChange.
   *
   * @param block The changed block. Undefined for a blank event.
   * @param name Name of the field affected.
   * @param oldValue Previous value of field.
   * @param newValue New value of field.
   * @param oldOptions Previous options for the dropdown.
   * @param newOptions New options for the dropdown.
   */
  constructor(
    block?: Blockly.Block,
    name?: string,
    oldValue?: string,
    newValue?: string,
    oldOptions?: Blockly.MenuOption[],
    newOptions?: Blockly.MenuOption[],
  ) {
    super(block);

    if (
      !block ||
      !name ||
      !oldValue ||
      !newValue ||
      !oldOptions ||
      !newOptions
    ) {
      // Blank event to be populated by fromJson.
      return;
    }

    this.name = name;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.oldOptions = oldOptions;
    this.newOptions = newOptions;
  }

  /**
   * Encode the event as JSON.
   *
   * @returns JSON representation.
   */
  toJson(): GamepadDropdownOptionsChangeJson {
    const json = super.toJson() as GamepadDropdownOptionsChangeJson;
    if (
      !this.name ||
      !this.oldValue ||
      !this.newValue ||
      !this.oldOptions ||
      !this.newOptions
    ) {
      throw new Error(
        'The changed element is undefined. Either pass all needed ' +
          'parameters to the constructor, or call fromJson.',
      );
    }
    json['name'] = this.name;
    json['oldValue'] = this.oldValue;
    json['newValue'] = this.newValue;
    json['oldOptions'] = this.oldOptions;
    json['newOptions'] = this.newOptions;
    return json;
  }

  /**
   * Decode the JSON event.
   *
   * @param json JSON representation.
   * @param workspace
   * @param event
   * @returns The deserialized event.
   */
  static fromJson(
    json: GamepadDropdownOptionsChangeJson,
    workspace: Blockly.Workspace,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    event?: any,
  ): GamepadDropdownOptionsChange {
    const newEvent = super.fromJson(
      json,
      workspace,
      event,
    ) as GamepadDropdownOptionsChange;
    newEvent.name = json['name'];
    newEvent.oldValue = json['oldValue'];
    newEvent.newValue = json['newValue'];
    newEvent.oldOptions = json['oldOptions'];
    newEvent.newOptions = json['newOptions'];
    return newEvent;
  }

  /**
   * Does this event leave all state as it was before?
   *
   * @returns False if something changed.
   */
  isNull(): boolean {
    const valuesAreEqual = this.oldValue === this.newValue;
    const optionsAreEquivalent =
      this.oldOptions === this.newOptions ||
      (Array.isArray(this.oldOptions) &&
        Array.isArray(this.newOptions) &&
        arraysAreEquivalent(this.oldOptions, this.newOptions));
    return valuesAreEqual && optionsAreEquivalent;
  }

  /**
   * Run a change event.
   *
   * @param forward True if run forward, false if run backward (undo).
   */
  run(forward: boolean): void {
    if (
      !this.blockId ||
      !this.name ||
      !this.oldValue ||
      !this.newValue ||
      !this.oldOptions ||
      !this.newOptions
    ) {
      console.warn("Can't run uninitialized event.");
      return;
    }

    const workspace = this.getEventWorkspace_();
    if (!workspace) {
      throw new Error('Workspace is null. Event must have been generated from real block (npt a shadow block).');
    }

    const block = workspace.getBlockById(this.blockId);
    if (!block) {
      throw new Error('Block not found: ' + this.blockId);
    }

    const field = block.getField(this.name);
    if (!field) {
      throw new Error('Field not found: ' + this.name);
    }

    if (!(field instanceof Blockly.FieldDropdown)) {
      throw new Error('Field is not a dropdown: ' + this.name);
    }

    // Apply the appropriate change based on direction.
    const targetValue = forward ? this.newValue : this.oldValue;
    const targetOptions = forward ? this.newOptions : this.oldOptions;

    // Update the field's options and value without broadcasting another event.
    // The options need to be updated through the field's internal state.
    // We need to access the field's dependency data structure if it exists.
    const fieldWithDependencyData = field as any;
    if (fieldWithDependencyData.dependencyData) {
      fieldWithDependencyData.dependencyData.derivedOptions = targetOptions;
    }

    // Force the dropdown to regenerate its options.
    field.getOptions(false);

    // Update the value without broadcasting.
    Blockly.Events.disable();
    field.setValue(targetValue);
    Blockly.Events.enable();
  }
}

// Note: Event registration may be handled automatically through Blockly's event system
// If explicit registration is needed, use:
// Blockly.registry.register(
//   Blockly.registry.Type.EVENT,
//   GamepadDropdownOptionsChange.EVENT_TYPE,
//   GamepadDropdownOptionsChange,
// );
