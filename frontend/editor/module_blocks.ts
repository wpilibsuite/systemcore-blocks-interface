// Copyright (c) FIRST and other WPILib contributors.

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
