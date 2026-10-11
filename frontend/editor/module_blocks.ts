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
 * @fileoverview Changes the blocks of a module, whether or not the module is open in a tab.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly';

import { Editor } from './editor';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';

/**
 * Lets the given function change the blocks JSON of the given module and saves the module if the
 * function returns true. If the module is open in a tab, its live workspace is changed and
 * reloaded, so that unsaved changes aren't lost. Otherwise the module is changed in storage.
 *
 * @returns true if the blocks were changed.
 */
export async function mutateModuleBlocks(
    storage: commonStorage.Storage,
    module: storageModule.Module,
    mutate: (blocks: {[key: string]: any}) => boolean): Promise<boolean> {
  const editor = Editor.getEditorForModulePath(module.modulePath);
  if (editor) {
    const blocks = Blockly.serialization.workspaces.save(editor.getBlocklyWorkspace());
    if (!mutate(blocks)) {
      return false;
    }
    editor.reloadWithBlocks(blocks);
    await editor.saveModule();
    return true;
  }
  const moduleContent = storageModuleContent.parseModuleContentText(
      await storage.fetchFileContentText(module.modulePath));
  const blocks = moduleContent.getBlocks();
  if (!mutate(blocks)) {
    return false;
  }
  moduleContent.setBlocks(blocks);
  await storage.saveFile(module.modulePath, moduleContent.getModuleContentText());
  return true;
}
