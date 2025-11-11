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
import * as En from 'blockly/msg/en';
import * as Es from 'blockly/msg/es';
import * as He from 'blockly/msg/he';
import { customTokens } from '../blocks/tokens';

import { themes } from '../themes/mrc_themes';
import {pluginInfo as HardwareConnectionsPluginInfo} from '../blocks/utils/connection_checker';

import 'blockly/blocks'; // Includes standard blocks like controls_if, logic_compare, etc.
import { useTranslation } from 'react-i18next';


/** Interface for methods exposed by the BlocklyComponent. */
export interface BlocklyComponentType {
  getBlocklyWorkspace: () => Blockly.WorkspaceSvg;
  setActive: (active: boolean) => void;
}

/** Interface for props passed to the BlocklyComponent. */
export interface BlocklyComponentProps {
  modulePath: string;
  onBlocklyComponentCreated: (modulePath: string, blocklyComponent: BlocklyComponentType) => void;
  theme: string;
  onWorkspaceCreated: (modulePath: string, workspace: Blockly.WorkspaceSvg) => void;
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
export default function BlocklyComponent(props: BlocklyComponentProps): React.JSX.Element {
  const blocklyDiv = React.useRef<HTMLDivElement | null>(null);
  const workspaceRef = React.useRef<Blockly.WorkspaceSvg | null>(null);
  const parentDiv = React.useRef<HTMLDivElement | null>(null);
  const savedScrollX = React.useRef<number>(0);
  const savedScrollY = React.useRef<number>(0);

  const { t, i18n } = useTranslation();
  

  const getBlocklyTheme = (): Blockly.Theme => {
    const blocklyTheme = 'mrc_theme_' + props.theme.replace(/-/g, '_');
    // Find the theme by key
    const themeObj = themes.find(t => t.name === blocklyTheme);
    if (!themeObj) {
      throw new Error(`Theme not found: ${blocklyTheme}`);
    }

    // Return the corresponding Blockly theme
    return themeObj;
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

  /** Updates the Blockly locale when the language changes. */
  const updateBlocklyLocale = (): void => {
    if (!workspaceRef.current) {
      return;
    }

    const newIsRtl = i18n.dir() === 'rtl';
    const currentIsRtl = workspaceRef.current.RTL;

    // If RTL direction changed, we need to recreate the workspace
    if (newIsRtl !== currentIsRtl) {
      cleanupWorkspace();
      initializeWorkspace();
      if (props.onWorkspaceCreated) {
        props.onWorkspaceCreated(props.modulePath, workspaceRef.current!);
      }
      return;
    }

    // Set new locale
    switch (i18n.language) {
      case 'es':
        Blockly.setLocale(Es as any);
        break;
      case 'en':
        Blockly.setLocale(En as any);
        break;
      case 'he':
        Blockly.setLocale(He as any);
        break;
      default:
        Blockly.setLocale(En as any);
        break;
    }
    // Apply custom tokens
    Blockly.setLocale(customTokens(t));

    // Force complete toolbox rebuild by calling onWorkspaceCreated AFTER locale is set
    if (props.onWorkspaceCreated) {
      props.onWorkspaceCreated(props.modulePath, workspaceRef.current);
    }
  };

  /** Initializes the Blockly workspace. */
  const initializeWorkspace = (): void => {
    if (!blocklyDiv.current) {
      return;
    }

    // Set Blockly locale
    switch (i18n.language) {
      case 'es':
        Blockly.setLocale(Es as any);
        break;
      case 'en':
        Blockly.setLocale(En as any);
        break;
      case 'he':
        Blockly.setLocale(He as any);
        break;
      default:
        Blockly.setLocale(En as any);
        break;
    }
    Blockly.setLocale(customTokens(t));
    
    // Create workspace
    const workspaceConfig = createWorkspaceConfig();
    workspaceConfig.rtl = i18n.dir() === 'rtl';
    const workspace = Blockly.inject(blocklyDiv.current, workspaceConfig);
    workspaceRef.current = workspace;
    parentDiv.current = blocklyDiv.current.parentNode as HTMLDivElement;
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
      if (workspaceRef.current.isVisible() &&
          Blockly.getMainWorkspace().id === workspaceRef.current.id) {
        // Save scroll position before resize
        const scrollX = workspaceRef.current.scrollX;
        const scrollY = workspaceRef.current.scrollY;
        
        Blockly.svgResize(workspaceRef.current);
        
        // Restore scroll position after resize
        workspaceRef.current.scroll(scrollX, scrollY);
      }
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

  const setActive = (active: boolean): void => {
    if (workspaceRef.current) {
      if (!active) {
        // Always save the scroll position before making this workspace invisible
        savedScrollX.current = workspaceRef.current.scrollX;
        savedScrollY.current = workspaceRef.current.scrollY;
        workspaceRef.current.setVisible(active);
      } else {
        // Make visible first
        workspaceRef.current.setVisible(active);
      }
    }
    if (parentDiv.current) {
      parentDiv.current.hidden = !active;
    }
    if (workspaceRef.current && active) {
      workspaceRef.current.markFocused();
      // Restore scroll position after making visible, with double RAF for proper rendering
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (workspaceRef.current) {
            workspaceRef.current.scroll(savedScrollX.current, savedScrollY.current);
          }
        });
      });
    }
  };

  // Initialize Blockly workspace
  React.useEffect(() => {
    if (props.onBlocklyComponentCreated) {
      const blocklyComponent: BlocklyComponentType = {
        getBlocklyWorkspace,
        setActive,
      };
      props.onBlocklyComponentCreated(props.modulePath, blocklyComponent);
    }
    initializeWorkspace();
    return cleanupWorkspace;
  }, []);

  // Update theme when theme prop changes
  React.useEffect(() => {
    if (workspaceRef.current) {
      const newTheme = getBlocklyTheme();
      workspaceRef.current.setTheme(newTheme);
    }
  }, [props.theme]);

  React.useEffect(() => {
    updateBlocklyLocale();
  }, [i18n.language]);

  // Handle workspace resize
  React.useEffect(() => {
    return setupResizeObserver();
  }, []);

  return (
    <div className="blockly-workspace-container" style={FULL_SIZE_STYLE}>
      <div ref={blocklyDiv} style={WORKSPACE_STYLE} />
    </div>
  );
}
