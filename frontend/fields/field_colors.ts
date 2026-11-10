// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author lizlooney@google.com (Liz Looney)
 */
import * as Blockly from 'blockly/core';
import { FieldDropdownWithBorderRect } from './FieldDropdown';

class FieldColorDropdown extends FieldDropdownWithBorderRect {
  static RECTANGLE_WIDTH = 40;
  static RECTANGLE_HEIGHT = 12;
  private static RECTANGLE_BORDER = 1;
  private static RECTANGLE_MARGIN = 2;

  // How long after the last key press the typed prefix is forgotten.
  private static TYPE_AHEAD_TIMEOUT_MS = 1000;

  private coloredRect: SVGRectElement | null = null;
  private selectedHtmlColor: string | null = null;
  private typedPrefix = '';
  private lastKeyTime = 0;

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

  protected override showEditor_(e?: MouseEvent) {
    super.showEditor_(e);
    this.typedPrefix = '';
    this.menu_?.getElement()?.addEventListener('keydown', (event) => this.onMenuKeyDown(event));
  }

  /**
   * Highlights the first color that starts with what the user has typed. Typing the same letter
   * repeatedly goes through the colors that start with that letter.
   */
  private onMenuKeyDown(event: KeyboardEvent) {
    if (!this.menu_ || event.key.length !== 1 || event.key === ' ' ||
        event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    const now = Date.now();
    if (now - this.lastKeyTime > FieldColorDropdown.TYPE_AHEAD_TIMEOUT_MS) {
      this.typedPrefix = '';
    }
    this.lastKeyTime = now;
    const key = event.key.toUpperCase();
    this.typedPrefix += key;

    // WARNING: menuItems and highlightedItem are private in Blockly's Menu.
    const menuItems: Blockly.MenuItem[] = ((this.menu_ as any).menuItems as unknown[])
        .filter((item): item is Blockly.MenuItem => item instanceof Blockly.MenuItem);
    const highlighted: Blockly.MenuItem | null = (this.menu_ as any).highlightedItem;
    const startsWith = (item: Blockly.MenuItem, prefix: string) =>
        (item.getValue() ?? '').toUpperCase().startsWith(prefix);

    let match = menuItems.find((item) => startsWith(item, this.typedPrefix));
    if (!match && this.typedPrefix === key.repeat(this.typedPrefix.length)) {
      // The same letter was typed more than once; go to the next color that starts with it.
      const start = highlighted ? menuItems.indexOf(highlighted) + 1 : 0;
      match = [...menuItems.slice(start), ...menuItems.slice(0, start)]
          .find((item) => startsWith(item, key));
    }
    if (match) {
      this.menu_.setHighlighted(match);
    }
    event.preventDefault();
    event.stopPropagation();
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
      // A tspan arrow is inside the text element, so it moves with the text, but an svg arrow
      // (used by zelos) is positioned separately by super.render_ and has to be moved too.
      // WARNING: svgArrow is private in Blockly's FieldDropdown.
      const svgArrow: SVGElement | null = (this as any).svgArrow;
      if (svgArrow) {
        svgArrow.setAttribute(
          'transform',
          'translate(' + rectangleAreaWidth + ', 0) ' + svgArrow.getAttribute('transform'),
        );
      }
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
