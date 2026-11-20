// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Plugs component reference blocks into the arguments of toolbox blocks that take a
 * component, like the left_motor and right_motor of a DifferentialDrive, so that the component can
 * be chosen from a dropdown instead of plugging in a variable.
 */

import {
    BLOCK_NAME as CALL_PYTHON_FUNCTION_BLOCK_NAME,
    FunctionKind } from '../blocks/mrc_call_python_function';
import { getComponentReferenceBlock } from '../blocks/mrc_component_reference';
import { getAllowedTypesForSetCheck } from '../blocks/utils/python';
import { Editor } from '../editor/editor';
import * as storageModule from '../storage/module';
import * as storageModuleContent from '../storage/module_content';
import * as toolboxItems from './items';

type Component = storageModuleContent.Component;

/**
 * Plugs a reference to one of the given components into each argument that takes a component,
 * in the given toolbox contents, including the blocks in categories and the blocks plugged into
 * other blocks. Within a block, a different component is chosen for each argument if there are
 * enough, and selfComponent (the component whose method the block calls) is only chosen if no
 * other component fits, so that a method like SparkMax.follow gets another Spark Max.
 */
export function plugComponentArgs(
    contents: toolboxItems.ContentsType[],
    components: Component[],
    createComponentReferenceBlock: (component: Component) => toolboxItems.Block,
    selfComponent?: Component) {
  if (!components.length) {
    return;
  }
  for (const item of contents) {
    if (item.kind === 'category') {
      plugComponentArgs((item as toolboxItems.Category).contents || [], components,
          createComponentReferenceBlock, selfComponent);
    } else if (item.kind === 'block') {
      plugComponentArgsInBlock(
          item as toolboxItems.Block, components, createComponentReferenceBlock, selfComponent);
    }
  }
}

/**
 * Plugs component references into the given contents for the components that the blocks of the
 * editor's module can refer to, which are the same components that the dropdown of a component
 * reference block offers.
 */
export function plugComponentArgsForEditor(
    contents: toolboxItems.ContentsType[], editor: Editor) {
  const components = (editor.getModuleType() === storageModule.ModuleType.OPMODE) ?
      editor.getComponentsFromRobot() : editor.getAllComponentsFromWorkspace();
  const showSimpleClassNames = editor.getShowSimpleClassNames();
  plugComponentArgs(contents, components,
      component => getComponentReferenceBlock(component, showSimpleClassNames));
}

function plugComponentArgsInBlock(
    block: toolboxItems.Block,
    components: Component[],
    createComponentReferenceBlock: (component: Component) => toolboxItems.Block,
    selfComponent?: Component) {
  // Blocks can be plugged into other blocks, for example a constructor block is plugged into a
  // block that sets a variable.
  for (const input of Object.values(block.inputs || {})) {
    for (const child of [input?.block, input?.shadow]) {
      if (child) {
        plugComponentArgsInBlock(child, components, createComponentReferenceBlock, selfComponent);
      }
    }
  }

  if (block.type !== CALL_PYTHON_FUNCTION_BLOCK_NAME) {
    return;
  }
  const args = block.extraState?.args as {name: string, type: string}[] | undefined;
  const usedComponentIds = new Set<string>(selfComponent ? [selfComponent.componentId] : []);
  args?.forEach((arg, i) => {
    if (i === 0 && block.extraState?.functionKind === FunctionKind.INSTANCE) {
      // The first argument is self, the object whose method is called.
      return;
    }
    const allowedTypes = getAllowedTypesForSetCheck(arg.type);
    if (!allowedTypes) {
      // Any value can be used, so don't choose a component for it.
      return;
    }
    const matchingComponents = components.filter(c => allowedTypes.includes(c.className));
    const component =
        matchingComponents.find(c => !usedComponentIds.has(c.componentId)) ??
        matchingComponents.find(c => c.componentId !== selfComponent?.componentId) ??
        matchingComponents[0];
    if (component) {
      usedComponentIds.add(component.componentId);
      block.inputs = block.inputs ?? {};
      block.inputs['ARG' + i] = {
        block: createComponentReferenceBlock(component),
      };
    }
  });
}
