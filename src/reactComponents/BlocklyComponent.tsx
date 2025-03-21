/**
 * @license
 * Copyright 2025 Google LLC
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
 * @author liz@google.com (Liz Looney)
 */
import React from 'react';
// import * as Antd from 'antd';

import * as Blockly from 'blockly/core';
import * as locale from 'blockly/msg/en';
import * as MrcTheme from '../themes/mrc_theme_dark'

import 'blockly/blocks'; // Includes standard blocks like controls_if, logic_compare, etc.

export type BlocklyComponentType = {
  getBlocklyWorkspace: () => Blockly.WorkspaceSvg,
};

const BlocklyComponent = React.forwardRef<BlocklyComponentType | null>((props, ref) => {
  const blocklyDiv = React.useRef<HTMLDivElement | null>(null);
  const workspaceRef = React.useRef<Blockly.WorkspaceSvg>(null);

  // Initialize Blockly
  React.useEffect(() => {
    // Configure Blockly workspace
    const workspaceConfig = {
      theme: MrcTheme.theme,
      horizontalLayout: false, // Forces vertical layout for the workspace

      // Start with an empty (but not null) toolbox. It will be replaced later.
      toolbox: {
        kind: 'categoryToolbox',
        contents: [],
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      scrollbars: true,
      trashcan: false,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      },
      oneBasedIndex: false,
    };

    // Set Blockly locale
    Blockly.setLocale(locale as any);

    // Create workspace
    if (blocklyDiv.current) {
      const workspace = Blockly.inject(blocklyDiv.current, workspaceConfig);
      workspaceRef.current = workspace;
    }

    // Cleanup on unmount
    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  // Handle workspace resize
  React.useEffect(() => {
    const div = blocklyDiv.current;
    if (div) {
      const resizeObserver = new ResizeObserver(() => {
        if (workspaceRef.current) {
          Blockly.svgResize(workspaceRef.current);
        }
      });
      resizeObserver.observe(div);

      return () => {
        resizeObserver.unobserve(div);
      };
    }
  }, [blocklyDiv]);
  
  // Public methods exposed through ref
  const getBlocklyWorkspace = () => workspaceRef.current;
  
  // Expose methods through ref
  // TODO(Alan) - figure out the real way to do this instead of any
  React.useImperativeHandle(ref as any, () => ({getBlocklyWorkspace}));

  return (
    <div
      className="blockly-workspace-container"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div
        ref={blocklyDiv}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      />
    </div>
  );
});

export default BlocklyComponent;
