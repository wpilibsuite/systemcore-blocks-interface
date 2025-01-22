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
 * @fileoverview Dark theme
 * @author alan@porpoiseful.com (Alan Smith)
 */
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