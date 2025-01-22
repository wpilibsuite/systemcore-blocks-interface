import * as Blockly from 'blockly/core'

export const MRC_STYLE_FUNCTIONS = 'mrc_style_function';
export const MRC_STYLE_ENUM = 'mrc_style_enum';
export const MRC_STYLE_VARIABLES = 'mrc_style_variables';
export const MRC_STYLE_COMMENTS = 'mrc_style_comments';
export const MRC_STYLE_MISC = 'mrc_style_misc';

export const add_mrc_styles = function(theme : Blockly.Theme) : Blockly.Theme {
    theme.setBlockStyle(MRC_STYLE_FUNCTIONS,{
        colourPrimary: "#805ba5",
        colourSecondary: "#e6deed",
        colourTertiary: "#664984",
        hat: ""          
    });
    theme.setBlockStyle(MRC_STYLE_ENUM,{
        colourPrimary: "#5ba5a5",
        colourSecondary: "#deeded",
        colourTertiary: "#498484",
        hat: ""   
    });
    theme.setBlockStyle(MRC_STYLE_VARIABLES, {
        colourPrimary: "#5ba55b",
        colourSecondary: "#deedde",
        colourTertiary: "#498449",
        hat:""
    });
    theme.setBlockStyle(MRC_STYLE_COMMENTS,{
        colourPrimary: "#5b5ba5",
        colourSecondary: "#dedeed",
        colourTertiary: "#494984",
        hat:""
    });
    theme.setBlockStyle(MRC_STYLE_MISC,{
        colourPrimary: "#5b5ba5",
        colourSecondary: "#dedeed",
        colourTertiary: "#494984",
        hat:""
    });
    return theme;
}