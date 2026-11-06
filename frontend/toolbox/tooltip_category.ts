// Copyright (c) FIRST and other WPILib contributors.

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
