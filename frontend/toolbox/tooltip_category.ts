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
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';

// Blockly's toolbox categories don't support tooltips, so these subclasses show the
// category's optional tooltip property when the mouse hovers over the category row.

function applyTooltip(htmlDiv: HTMLDivElement, categoryDef: Blockly.utils.toolbox.CategoryInfo) {
  const tooltip = (categoryDef as {tooltip?: string}).tooltip;
  if (tooltip) {
    htmlDiv.title = tooltip;
  }
}

class TooltipToolboxCategory extends Blockly.ToolboxCategory {
  protected override createDom_(): HTMLDivElement {
    const htmlDiv = super.createDom_();
    applyTooltip(htmlDiv, this.toolboxItemDef_);
    return htmlDiv;
  }
}

class TooltipCollapsibleToolboxCategory extends Blockly.CollapsibleToolboxCategory {
  override createDom_(): HTMLDivElement {
    const htmlDiv = super.createDom_();
    applyTooltip(htmlDiv, this.toolboxItemDef_);
    return htmlDiv;
  }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    TooltipToolboxCategory,
    true);

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.CollapsibleToolboxCategory.registrationName,
    TooltipCollapsibleToolboxCategory,
    true);
