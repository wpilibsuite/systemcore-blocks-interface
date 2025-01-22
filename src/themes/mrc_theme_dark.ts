import * as Blockly from 'blockly/core'
import DarkTheme from '@blockly/theme-dark';
import { add_mrc_styles } from './styles';

const THEME_NAME = 'mrc_theme_dark';

const create_theme = function() : Blockly.Theme{    
   let newTheme = Blockly.Theme.defineTheme(THEME_NAME, {
        name: THEME_NAME,
        base: DarkTheme,
    });
    return add_mrc_styles(newTheme);
}

export const theme = create_theme();