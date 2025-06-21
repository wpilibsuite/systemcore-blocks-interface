/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @fileoverview Styles added for MRC
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly/core'

export const MRC_STYLE_FUNCTIONS = 'mrc_style_function';
export const MRC_STYLE_ENUM = 'mrc_style_enum';
export const MRC_STYLE_VARIABLES = 'mrc_style_variables';
export const MRC_STYLE_COMMENTS = 'mrc_style_comments';
export const MRC_STYLE_MISC = 'mrc_style_misc';
export const MRC_STYLE_CLASS_BLOCKS = 'mrc_style_class_blocks';
export const MRC_CATEGORY_STYLE_METHODS = 'mrc_category_style_methods';
export const MRC_STYLE_MECHANISMS = 'mrc_style_mechanisms';
export const MRC_STYLE_COMPONENTS = 'mrc_style_components';
export const MRC_STYLE_EVENTS = 'mrc_style_events';
export const MRC_STYLE_PORTS = 'mrc_style_ports';
export const MRC_STYLE_EVENT_HANDLER = 'mrc_style_event_handler';
export const MRC_CATEGORY_STYLE_COMPONENTS = 'mrc_category_style_components';

export const add_mrc_styles = function (theme: Blockly.Theme): Blockly.Theme {
    theme.setBlockStyle(MRC_STYLE_FUNCTIONS, {
        colourPrimary: "#805ba5",
        colourSecondary: "#e6deed",
        colourTertiary: "#664984",
        hat: ""
    });
    theme.setBlockStyle(MRC_STYLE_EVENT_HANDLER, {
        colourPrimary: "#805ba5",
        colourSecondary: "#e6deed",
        colourTertiary: "#664984",
        hat: "cap"
    });
    theme.setBlockStyle(MRC_STYLE_EVENTS, {
        colourPrimary: "#805ba5",
        colourSecondary: "#e6deed",
        colourTertiary: "#664984",
        hat: ""
    });
    theme.setBlockStyle(MRC_STYLE_ENUM, {
        colourPrimary: "#5ba5a5",
        colourSecondary: "#deeded",
        colourTertiary: "#498484",
        hat: ""
    });
    theme.setBlockStyle(MRC_STYLE_VARIABLES, {
        colourPrimary: "#5ba55b",
        colourSecondary: "#deedde",
        colourTertiary: "#498449",
        hat: ""
    });
    theme.setBlockStyle(MRC_STYLE_CLASS_BLOCKS, {
        colourPrimary: "#4a148c",
        colourSecondary: "#AD7BE9",
        colourTertiary: "#CDB6E9",
        hat: ""
    });
    theme.setCategoryStyle(MRC_CATEGORY_STYLE_METHODS, {
        colour: '#4A148C',
    });
    theme.setCategoryStyle(MRC_CATEGORY_STYLE_COMPONENTS, {
        colour: '#4A148C',
    });

    theme.setBlockStyle(MRC_STYLE_COMMENTS, {
        colourPrimary: "#5b5ba5",
        colourSecondary: "#dedeed",
        colourTertiary: "#494984",
        hat: ""
    });
    theme.setBlockStyle(MRC_STYLE_MISC, {
        colourPrimary: "#5b5ba5",
        colourSecondary: "#dedeed",
        colourTertiary: "#494984",
        hat: ""
    });
    theme.setBlockStyle(MRC_STYLE_MECHANISMS, {
        "colourPrimary": "#5b61a5",
        "colourSecondary": "#dedfed",
        "colourTertiary": "#494e84",
        hat: ""

    });
    theme.setBlockStyle(MRC_STYLE_COMPONENTS, {
        "colourPrimary": "#5b80a5",
        "colourSecondary": "#dee6ed",
        "colourTertiary": "#496684",
        hat: ""
    });
    theme.setBlockStyle(MRC_STYLE_PORTS, {
        colourPrimary: "#5ba55b",
        colourSecondary: "#deedde",
        colourTertiary: "#498449",
        hat: ""
    });

    return theme;
}