// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Builds the usage report that deployed robot code sends with
 * wpiutil.report_usage('Blocks', ...).
 */

import { getBlocksVersion } from '../libraries/blocks_lib';
import { getInstalledLibraries } from '../libraries/library_registry';
import { ModuleContent, getTopLevelBlocksJson } from './module_content';
import { Project } from './project';

export interface UsageReport {
  /** The version of blocks that generated the code. */
  version: string;
  /** Maps the name of each installed third party library to its version. */
  libraries: {[name: string]: string};
  /**
   * Maps each block type used in the project to the number of times it is used. This also tells
   * how many modules there are: the robot and each mechanism have one
   * mrc_mechanism_component_holder block and each opmode has one mrc_opmode_details block.
   */
  blocks: {[blockType: string]: number};
  /**
   * Maps each component class (for example 'wpilib.ExpansionHubMotor') used by the robot to the
   * number of those components. Components of a mechanism are counted once for each time the
   * mechanism is added to the robot.
   */
  components: {[className: string]: number};
}

/**
 * Builds the usage report for the given project.
 * @param project The project.
 * @param moduleContents Maps the moduleId of each module in the project to its content.
 */
export function createUsageReport(
    project: Project, moduleContents: Map<string, ModuleContent>): UsageReport {
  const libraries: {[name: string]: string} = {};
  for (const library of getInstalledLibraries()) {
    libraries[library.metadata.name] = library.metadata.version;
  }

  const blocks: {[blockType: string]: number} = {};
  for (const moduleContent of moduleContents.values()) {
    countBlocks(moduleContent.getBlocks(), blocks);
  }

  const components: {[className: string]: number} = {};
  const robotContent = moduleContents.get(project.robot.moduleId);
  if (robotContent) {
    countComponents(robotContent, components);
    for (const mechanismInRobot of robotContent.getMechanisms()) {
      const mechanismContent = moduleContents.get(mechanismInRobot.moduleId);
      if (mechanismContent) {
        countComponents(mechanismContent, components);
      }
    }
  }

  return {
    version: getBlocksVersion(),
    libraries,
    blocks: sortKeys(blocks),
    components: sortKeys(components),
  };
}

/**
 * Adds the number of times each block type is used in the given blocks to counts. Shadow blocks
 * are not counted, since they are put there by the toolbox rather than by the user.
 */
function countBlocks(blocks: {[key: string]: any}, counts: {[blockType: string]: number}): void {
  const walk = (blockJson: {[key: string]: any}): void => {
    if (!blockJson || typeof blockJson !== 'object') {
      return;
    }
    if (typeof blockJson.type === 'string') {
      counts[blockJson.type] = (counts[blockJson.type] || 0) + 1;
    }
    if (blockJson.inputs) {
      for (const inputName in blockJson.inputs) {
        const input = blockJson.inputs[inputName];
        if (input && input.block) {
          walk(input.block);
        }
      }
    }
    if (blockJson.next && blockJson.next.block) {
      walk(blockJson.next.block);
    }
  };
  getTopLevelBlocksJson(blocks).forEach(walk);
}

/** Adds the public and private components of the given module to counts. */
function countComponents(
    moduleContent: ModuleContent, counts: {[className: string]: number}): void {
  for (const component of [...moduleContent.getComponents(), ...moduleContent.getPrivateComponents()]) {
    counts[component.className] = (counts[component.className] || 0) + 1;
  }
}

function sortKeys(counts: {[key: string]: number}): {[key: string]: number} {
  const sorted: {[key: string]: number} = {};
  for (const key of Object.keys(counts).sort()) {
    sorted[key] = counts[key];
  }
  return sorted;
}
