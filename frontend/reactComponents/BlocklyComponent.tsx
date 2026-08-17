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
import '../themes/compact_zelos'; // Registers the compact_zelos renderer.
import {pluginInfo as HardwareConnectionsPluginInfo} from '../blocks/utils/connection_checker';
import { getGridColour, getGridConfig, getZoomConfig } from './BlocklyWorkspaceConfig';
import { DEFAULT_ZOOM } from './UserSettingsProvider';

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
  renderer: string;
  /**
   * Called (debounced) after the user changes the workspace's zoom level, so it can be saved
   * (e.g. per-module) and restored later. The workspace is injected at DEFAULT_ZOOM; if a
   * different zoom should be restored, call getBlocklyWorkspace().setScale() once it's known
   * (e.g. from onWorkspaceCreated).
   */
  onZoomChange: (zoom: number) => void;
  /**
   * Called (debounced) after the user scrolls/pans the workspace, so the position of its
   * upper-left corner can be saved (e.g. per-module) and restored later, the same way as zoom.
   */
  onScrollChange: (x: number, y: number) => void;
  onWorkspaceCreated: (modulePath: string, workspace: Blockly.WorkspaceSvg) => void;
}

/** Delay after the last viewport (zoom/scroll) change before it's reported. */
const VIEWPORT_CHANGE_REPORT_DELAY_MS = 500;

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
  const currentRenderer = React.useRef<string>(props.renderer);
  const currentGridColour = React.useRef<string>('');
  const parentDiv = React.useRef<HTMLDivElement | null>(null);
  const savedScrollX = React.useRef<number>(0);
  const savedScrollY = React.useRef<number>(0);
  const viewportChangeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // Kept fresh on every render so the debounced viewport-change listener (registered once per
  // workspace, not per render) always calls the latest callbacks, not stale ones.
  const onZoomChangeRef = React.useRef(props.onZoomChange);
  onZoomChangeRef.current = props.onZoomChange;
  const onScrollChangeRef = React.useRef(props.onScrollChange);
  onScrollChangeRef.current = props.onScrollChange;

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
    grid: getGridConfig(getBlocklyTheme(), /* snap= */ true),
    zoom: getZoomConfig(/* interactive= */ true, DEFAULT_ZOOM),
    scrollbars: true,
    trashcan: true,
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
    oneBasedIndex: false,
    renderer: props.renderer,
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

  /**
   * Reports user-driven zoom/scroll changes, debounced so rapid wheel-zooming or panning
   * doesn't trigger a save on every tick. Ignores the initial viewport event fired on
   * injection (it has no oldScale). Reads the workspace's current scale/scroll when the
   * debounce fires, rather than trusting the triggering event's values, since several
   * viewport changes may have collapsed into this one report.
   */
  const handleWorkspaceViewportChange = (event: Blockly.Events.Abstract): void => {
    if (event.type !== Blockly.Events.VIEWPORT_CHANGE) {
      return;
    }
    const { oldScale, scale } = event as Blockly.Events.ViewportChange;
    if (oldScale === undefined) {
      return;
    }
    const scaleChanged = scale !== undefined && scale !== oldScale;
    if (viewportChangeTimer.current) {
      clearTimeout(viewportChangeTimer.current);
    }
    viewportChangeTimer.current = setTimeout(() => {
      const workspace = workspaceRef.current;
      if (!workspace) {
        return;
      }
      if (scaleChanged) {
        onZoomChangeRef.current(workspace.scale);
      }
      onScrollChangeRef.current(workspace.scrollX, workspace.scrollY);
    }, VIEWPORT_CHANGE_REPORT_DELAY_MS);
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
    workspace.addChangeListener(handleWorkspaceViewportChange);
    workspaceRef.current = workspace;
    currentRenderer.current = props.renderer;
    currentGridColour.current = getGridColour(getBlocklyTheme());
    parentDiv.current = blocklyDiv.current.parentNode as HTMLDivElement;
  };

  /** Cleans up the Blockly workspace on unmount. */
  const cleanupWorkspace = (): void => {
    if (viewportChangeTimer.current) {
      clearTimeout(viewportChangeTimer.current);
      viewportChangeTimer.current = null;
    }
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
        Blockly.svgResize(workspaceRef.current);
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
        // Save the scroll position before making this workspace invisible.
        savedScrollX.current = workspaceRef.current.scrollX;
        savedScrollY.current = workspaceRef.current.scrollY;
      }
      workspaceRef.current.setVisible(active);
    }
    if (parentDiv.current) {
      parentDiv.current.hidden = !active;
    }
    if (workspaceRef.current && active) {
      workspaceRef.current.markFocused();

      if (Blockly.getMainWorkspace().id === workspaceRef.current.id) {
        Blockly.svgResize(workspaceRef.current);
        // We need to call Workspace.scroll, but it is not effective if we call it now.
        // I tried requestAnimationFrame, nested requestAnimationFrame, and setTimeout.
        // The requestAnimationFrame callback was called first, and calling Workspace.scroll was
        // not effective.
        // The setTimeout callback was called second, and calling Workspace.scroll was effective.
        // The nested requestAnimationFrame callback was called after the setTimeout callback.
        // I chose to use setTimeout because it was the earliest callback where calling
        // Workspace.scroll was effective.
        setTimeout(() => {
          if (workspaceRef.current) {
            workspaceRef.current.scroll(savedScrollX.current, savedScrollY.current);
          }
        });
      }
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

  // Update theme when theme prop changes.
  // Blockly's grid colour is baked into the SVG when the workspace is injected, so
  // setTheme() alone does not update it. If the new theme's grid colour differs, the
  // workspace must be recreated (the same approach used for renderer/RTL changes below).
  React.useEffect(() => {
    if (workspaceRef.current) {
      const newTheme = getBlocklyTheme();
      if (getGridColour(newTheme) !== currentGridColour.current) {
        cleanupWorkspace();
        initializeWorkspace();
        if (props.onWorkspaceCreated) {
          props.onWorkspaceCreated(props.modulePath, workspaceRef.current!);
        }
      } else {
        workspaceRef.current.setTheme(newTheme);
      }
    }
  }, [props.theme]);

  // Blockly does not support switching renderers on an existing workspace, so the
  // workspace must be recreated when the renderer changes.
  React.useEffect(() => {
    if (workspaceRef.current && currentRenderer.current !== props.renderer) {
      cleanupWorkspace();
      initializeWorkspace();
      if (props.onWorkspaceCreated) {
        props.onWorkspaceCreated(props.modulePath, workspaceRef.current!);
      }
    }
  }, [props.renderer]);

  React.useEffect(() => {
    updateBlocklyLocale();
  }, [i18n.language]);

  // Handle workspace resize
  React.useEffect(() => {
    return setupResizeObserver();
  }, []);

  return (
    <div className="blockly-workspace-container" data-tour="blockly-workspace" style={FULL_SIZE_STYLE}>
      <div ref={blocklyDiv} style={WORKSPACE_STYLE} />
    </div>
  );
}
