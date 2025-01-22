import * as Blockly from 'blockly/core'
import { add_mrc_styles } from './styles';

export const THEME_NAME = 'mrc_theme_light';

const create_theme = function() : Blockly.Theme{    
   let newTheme = Blockly.Theme.defineTheme(THEME_NAME, {
        name: THEME_NAME,
        base: Blockly.Themes.Classic,
    });
    return add_mrc_styles(newTheme);
}

export const theme = create_theme();