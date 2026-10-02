/**
 * @license
 * Copyright 2024 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */

import * as Blockly from 'blockly/core';

const CSS_CLASS_NAME = 'mrcNonEditableTextField';

// Blockly only adds the blocklyEditableField/blocklyNonEditableField classes (which the renderers
// use to style field rects) to fields that are EDITABLE, so this field's rect would otherwise get
// the SVG default black fill. Instead, make it look like a label (text on the block colour) with
// a thin outline.
Blockly.Css.register(`
  .${CSS_CLASS_NAME}>rect {
    fill: none;
    stroke-width: 1;
  }
`);

class FieldNonEditableText extends Blockly.FieldTextInput {
  constructor(value: string) {
    super(value);
    this.EDITABLE = false; // This field is not editable
  }

  protected override showEditor_() {
  }

  override initView(): void {
    super.initView();
    Blockly.utils.dom.addClass(this.fieldGroup_!, CSS_CLASS_NAME);
  }

  override applyColour(): void {
    // Called when the block is coloured, including when the theme changes.
    super.applyColour();
    this.matchBorderToText_();
  }

  protected override render_(): void {
    super.render_();
    this.matchBorderToText_();
  }

  /**
   * Sets the outline colour to the text colour, which comes from the renderer and theme CSS.
   * CSS can't refer to another element's colour, so this copies it.
   */
  private matchBorderToText_(): void {
    if (!this.borderRect_ || !this.textElement_) {
      return;
    }
    // The computed fill is empty if the field isn't in the document yet. It is set on a later call.
    const textColour = getComputedStyle(this.textElement_).fill;
    if (textColour) {
      this.borderRect_.setAttribute('stroke', textColour);
    }
  }
}

export function createFieldNonEditableText(label: string): Blockly.Field {
  return new FieldNonEditableText(label);
}