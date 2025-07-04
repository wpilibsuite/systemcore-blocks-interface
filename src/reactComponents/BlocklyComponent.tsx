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
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as React from 'react';
import * as Blockly from 'blockly/core';
import * as locale from 'blockly/msg/en';
import * as MrcDarkTheme from '../themes/mrc_theme_dark';
import * as MrcLightTheme from '../themes/mrc_theme_light';
import {pluginInfo as HardwareConnectionsPluginInfo} from '../blocks/utils/connection_checker';

import 'blockly/blocks'; // Includes standard blocks like controls_if, logic_compare, etc.

/** Interface for methods exposed by the BlocklyComponent. */
export interface BlocklyComponentType {
  getBlocklyWorkspace: () => Blockly.WorkspaceSvg;
}

/** Interface for props passed to the BlocklyComponent. */
export interface BlocklyComponentProps {
  theme: string;
}

/** Grid spacing for the Blockly workspace. */
const GRID_SPACING = 20;

/** Grid line length for the Blockly workspace. */
const GRID_LENGTH = 3;

/** Grid color for the Blockly workspace. */
const GRID_COLOR = '#ccc';

/** Default zoom start scale. */
const DEFAULT_ZOOM_START_SCALE = 1.0;

/** Maximum zoom scale. */
const MAX_ZOOM_SCALE = 3;

/** Minimum zoom scale. */
const MIN_ZOOM_SCALE = 0.3;

/** Zoom scale speed multiplier. */
const ZOOM_SCALE_SPEED = 1.2;

/** Container and workspace styling. */
const FULL_SIZE_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

/** Workspace positioning style. */
const WORKSPACE_STYLE: React.CSSProperties = {
  ...FULL_SIZE_STYLE,
  position: 'relative',
};

/**
 * React component that renders a Blockly workspace with proper initialization,
 * cleanup, and resize handling.
 */
const BlocklyComponent = React.forwardRef<BlocklyComponentType | null, BlocklyComponentProps>(
    ({ theme }, ref): React.JSX.Element => {
      const blocklyDiv = React.useRef<HTMLDivElement | null>(null);
      const workspaceRef = React.useRef<Blockly.WorkspaceSvg | null>(null);

      const getBlocklyTheme = (): Blockly.Theme => {
        if (theme === 'dark' || theme === 'compact-dark') {
          return MrcDarkTheme.theme;
        }
        if (theme === 'light' || theme === 'compact') {
          return MrcLightTheme.theme;
        }
        // Default to light theme if unknown
        return MrcLightTheme.theme;
      };

      /** Creates the Blockly workspace configuration object. */
      const createWorkspaceConfig = (): Blockly.BlocklyOptions => ({
        theme: getBlocklyTheme(),
        horizontalLayout: false, // Forces vertical layout for the workspace
        // Start with an empty (but not null) toolbox. It will be replaced later.
        toolbox: {
          kind: 'categoryToolbox',
          contents: [],
        },
        grid: {
          spacing: GRID_SPACING,
          length: GRID_LENGTH,
          colour: GRID_COLOR,
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: DEFAULT_ZOOM_START_SCALE,
          maxScale: MAX_ZOOM_SCALE,
          minScale: MIN_ZOOM_SCALE,
          scaleSpeed: ZOOM_SCALE_SPEED,
        },
        scrollbars: true,
        trashcan: false,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true,
        },
        oneBasedIndex: false,
        plugins: {
          ...HardwareConnectionsPluginInfo,
        },
      });

      /** Initializes the Blockly workspace. */
      const initializeWorkspace = (): void => {
        if (!blocklyDiv.current) {
          return;
        }

        // Set Blockly locale
        Blockly.setLocale(locale as any);

        // Create workspace
        const workspaceConfig = createWorkspaceConfig();
        const workspace = Blockly.inject(blocklyDiv.current, workspaceConfig);
        workspaceRef.current = workspace;
      };

      /** Cleans up the Blockly workspace on unmount. */
      const cleanupWorkspace = (): void => {
        if (workspaceRef.current) {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
        }
      };

      /** Handles workspace resize events. */
      const handleWorkspaceResize = (): void => {
        if (workspaceRef.current) {
          Blockly.svgResize(workspaceRef.current);
        }
      };

      /** Sets up resize observer for the workspace container. */
      const setupResizeObserver = (): (() => void) | undefined => {
        const div = blocklyDiv.current;
        if (!div) {
          return undefined;
        }

        const resizeObserver = new ResizeObserver(handleWorkspaceResize);
        resizeObserver.observe(div);

        return () => {
          resizeObserver.unobserve(div);
        };
      };

      /** Gets the current Blockly workspace instance. */
      const getBlocklyWorkspace = (): Blockly.WorkspaceSvg => {
        if (!workspaceRef.current) {
          throw new Error('Blockly workspace not initialized');
        }
        return workspaceRef.current;
      };

      // Initialize Blockly workspace
      React.useEffect(() => {
        initializeWorkspace();
        return cleanupWorkspace;
      }, []);

      // Update theme when theme prop changes
      React.useEffect(() => {
        if (workspaceRef.current) {
          const newTheme = getBlocklyTheme();
          workspaceRef.current.setTheme(newTheme);
        }
      }, [theme]);

      // Handle workspace resize
      React.useEffect(() => {
        return setupResizeObserver();
      }, []);

      // Expose methods through ref
      React.useImperativeHandle(
          ref,
          (): BlocklyComponentType => ({
            getBlocklyWorkspace,
          }),
          []
      );

      return (
        <div className="blockly-workspace-container" style={FULL_SIZE_STYLE}>
          <div ref={blocklyDiv} style={WORKSPACE_STYLE} />
        </div>
      );
    }
);

BlocklyComponent.displayName = 'BlocklyComponent';

export default BlocklyComponent;
