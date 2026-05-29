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

class FieldColorDropdown extends Blockly.FieldDropdown {
  static RECTANGLE_WIDTH = 40;
  static RECTANGLE_HEIGHT = 12;
  private static RECTANGLE_BORDER = 1;
  private static RECTANGLE_MARGIN = 2;

  private coloredRect: SVGRectElement | null = null;
  private selectedHtmlColor: string | null = null;

  constructor(
    wpiutilColorNames: string[],
  ) {
    const options: Blockly.MenuOption[] = [];
    wpiutilColorNames.forEach((wpiutilColorName) => {
      const htmlElement = createHTMLElement(wpiutilColorName);
      options.push([htmlElement, wpiutilColorName]);
    });
    super(options);
  }

  override initView() {
    super.initView();

    this.coloredRect = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.RECT,
      {
        'width': FieldColorDropdown.RECTANGLE_WIDTH,
        'x': FieldColorDropdown.RECTANGLE_MARGIN + FieldColorDropdown.RECTANGLE_BORDER,
        'y': FieldColorDropdown.RECTANGLE_MARGIN + FieldColorDropdown.RECTANGLE_BORDER,
      },
      this.fieldGroup_,
    );
    this.coloredRect.style.setProperty('stroke', 'black');
    this.coloredRect.style.setProperty('stroke-width', String(FieldColorDropdown.RECTANGLE_BORDER));
  }

  private fillColoredRect() {
    if (this.coloredRect && this.selectedHtmlColor) {
      this.coloredRect.style.setProperty('fill', this.selectedHtmlColor);
      this.coloredRect.style.setProperty('fill-opacity', String(1.0));
    }
  }

  protected override doValueUpdate_(newValue: string) {
    super.doValueUpdate_(newValue);
    this.selectedHtmlColor = getHtmlColor(newValue);
  }

  protected override render_() {
    super.render_();

    if (!this.coloredRect || !this.textElement_) {
      return;
    }

    const borderAndMargin = 2 * FieldColorDropdown.RECTANGLE_BORDER + 2 * FieldColorDropdown.RECTANGLE_MARGIN;

    const heightWithoutBorder = this.size_.height - borderAndMargin;
    this.coloredRect.setAttribute('height', String(heightWithoutBorder));
    this.fillColoredRect();

    const rectangleAreaWidth = FieldColorDropdown.RECTANGLE_WIDTH + borderAndMargin;
    if (this.getSourceBlock()?.RTL) {
      const nonRectangleAreaWidth = this.size_.width;
      this.coloredRect.setAttribute(
        'transform',
        'translate(' + nonRectangleAreaWidth + ', 0)',
      );
    } else {
      this.textElement_.setAttribute(
        'transform',
        'translate(' + rectangleAreaWidth + ', 0)',
      );
    }
    this.size_.width += rectangleAreaWidth;
    this.positionBorderRect_();
  }
}

/**
 * Returns the HTML element that will be displayed in the dropdown.
 */
function createHTMLElement(wpiutilColorName: string): HTMLElement {
  const htmlColor = getHtmlColor(wpiutilColorName);

  // Create the container.
  const containerSpan = document.createElement('span');
  // Apply Flexbox for vertical alignment
  containerSpan.style.display = 'inline-flex';
  containerSpan.style.alignItems = 'center';
  containerSpan.style.gap = '6px';

  // Create the colored rectangle.
  const coloredRect = document.createElement('span');
  coloredRect.style.display = 'inline-block';
  coloredRect.style.width = FieldColorDropdown.RECTANGLE_WIDTH + 'px';
  coloredRect.style.height = FieldColorDropdown.RECTANGLE_HEIGHT + 'px';
  coloredRect.style.backgroundColor = htmlColor;
  coloredRect.style.border = '1px solid black';

  // Create the text element.
  const textNode = document.createTextNode(wpiutilColorName);

  // Assemble the elements.
  containerSpan.appendChild(coloredRect);
  containerSpan.appendChild(textNode);
  containerSpan.title = wpiutilColorName;

  return containerSpan;
}

/**
 * Returns the HTML color for the given wpiutil.Color.
 */
function getHtmlColor(wpiutilColorName: string): string {
  // FIRST Colors
  if (wpiutilColorName === 'DENIM') {
    return '#1560BD';
  }
  if (wpiutilColorName === 'FIRST_BLUE') {
    return '#0066B3';
  }
  if (wpiutilColorName === 'FIRST_RED') {
    return '#ED1C24';
  }

  let htmlColor = '';
  for (let i = 0; i < wpiutilColorName.length; i++) {
    const char = wpiutilColorName.charAt(i);
    if (char !== '_') {
      htmlColor += char;
    }
  }
  return htmlColor;
}

// Register field types with Blockly
Blockly.fieldRegistry.register(
  'field_color_dropdown',
  FieldColorDropdown,
);

export function createFieldColorDropdown(wpiutilColorNames: string[]): Blockly.Field {
  return new FieldColorDropdown(wpiutilColorNames);
}
