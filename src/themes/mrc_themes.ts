import * as Blockly from 'blockly/core';

import DeuteranopiaTheme from '@blockly/theme-deuteranopia';
import TritanopiaTheme from '@blockly/theme-tritanopia';
import HighContrastTheme from '@blockly/theme-highcontrast';

import { add_mrc_styles } from './styles';

export const DARK_THEME_NAME = 'mrc_theme_dark';
export const LIGHT_THEME_NAME = 'mrc_theme_light';
export const DEUTERANOPIA_THEME_NAME = 'mrc_theme_deuteranopia';
export const TRITANOPIA_THEME_NAME = 'mrc_theme_tritanopia';
export const HIGHCONTRAST_THEME_NAME = 'mrc_theme_highcontrast';
export const DEUTERANOPIA_DARK_THEME_NAME = 'mrc_theme_deuteranopia_dark';
export const TRITANOPIA_DARK_THEME_NAME = 'mrc_theme_tritanopia_dark';
export const HIGHCONTRAST_DARK_THEME_NAME = 'mrc_theme_highcontrast_dark';

const create_theme = function (name: string, base: Blockly.Theme, dark: boolean = false): Blockly.Theme {
    let newTheme = Blockly.Theme.defineTheme(name, {
        name: name,
        base: base,
    });
    if (dark) {
        // These all come from the Blockly Dark theme plugin at 
        // https://github.com/google/blockly-samples/blob/master/plugins/theme-dark/src/index.ts
        newTheme.setComponentStyle('workspaceBackgroundColour', '#1e1e1e');
        newTheme.setComponentStyle('toolboxBackgroundColour', '#333');
        newTheme.setComponentStyle('toolboxForegroundColour', '#fff');
        newTheme.setComponentStyle('flyoutBackgroundColour', '#252526');
        newTheme.setComponentStyle('flyoutForegroundColour', '#ccc');
        newTheme.setComponentStyle('flyoutOpacity', 1);
        newTheme.setComponentStyle('scrollbarColour', '#797979');
        newTheme.setComponentStyle('insertionMarkerColour', '#fff');
        newTheme.setComponentStyle('insertionMarkerOpacity', 0.3);
        newTheme.setComponentStyle('scrollbarOpacity', 0.4);
        newTheme.setComponentStyle('cursorColour', '#d0d0d0');
    }
    return add_mrc_styles(newTheme);
};

const create_themes = function (): Blockly.Theme[] {
    return [
        create_theme(DARK_THEME_NAME, Blockly.Themes.Classic, true),
        create_theme(LIGHT_THEME_NAME, Blockly.Themes.Classic),
        create_theme(DEUTERANOPIA_THEME_NAME, DeuteranopiaTheme),
        create_theme(TRITANOPIA_THEME_NAME, TritanopiaTheme),
        create_theme(HIGHCONTRAST_THEME_NAME, HighContrastTheme),
        create_theme(DEUTERANOPIA_DARK_THEME_NAME, DeuteranopiaTheme, true),
        create_theme(TRITANOPIA_DARK_THEME_NAME, TritanopiaTheme, true),
        create_theme(HIGHCONTRAST_DARK_THEME_NAME, HighContrastTheme, true),
    ];
};

export const themes = create_themes();