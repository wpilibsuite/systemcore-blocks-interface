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
 * @fileoverview Component that contains BlocklyComponent and CodeDisplay for a single tab.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as React from 'react';
import * as Blockly from 'blockly';
import { MessageInstance } from 'antd/es/message/interface';

import BlocklyComponent, { BlocklyComponentType } from './BlocklyComponent';
import CodeDisplay from './CodeDisplay';
import * as editor from '../editor/editor';
import { extendedPythonGenerator } from '../editor/extended_python_generator';
import * as storageModule from '../storage/module';
import * as storageProject from '../storage/project';
import * as commonStorage from '../storage/common_storage';
import * as classMethodDef from '../blocks/mrc_class_method_def'
import * as eventHandler from '../blocks/mrc_event_handler'
import * as mrcComponent from '../blocks/mrc_component'
import * as moveComponentRequest from '../blocks/utils/move_component_request'
import { Content } from 'antd/es/layout/layout';
import { useAutosave } from './AutosaveManager';
import { useUserSettings } from './useUserSettings';

/** Default size for code panel. */
const CODE_PANEL_DEFAULT_SIZE = '25%';

/** Minimum size for code panel. */
const CODE_PANEL_MIN_SIZE = 100;

/** Interface for methods exposed by TabContent via ref. */
export interface TabContentRef {
  saveModule: () => Promise<void>;
}

export interface TabContentProps {
  modulePath: string;
  module: storageModule.Module;
  project: storageProject.Project;
  storage: commonStorage.Storage;
  theme: string;
  renderer: string;
  showSimpleClassNames: boolean;
  shownPythonToolboxCategories: Set<string>;
  messageApi: MessageInstance;
  setAlertErrorMessage: (message: string) => void;
  isActive: boolean;
  openGamepadConfigDialog?: () => void;
  onMoveComponentRequested?: (componentBlockId: string, componentName: string) => void;
}

/**
 * Component that manages a single tab's BlocklyComponent and CodeDisplay.
 * Each tab has its own workspace and code display.
 */
export const TabContent = React.forwardRef<TabContentRef, TabContentProps>(({
  modulePath,
  module,
  project,
  storage,
  theme,
  renderer,
  showSimpleClassNames,
  shownPythonToolboxCategories,
  messageApi,
  setAlertErrorMessage,
  isActive,
  openGamepadConfigDialog,
  onMoveComponentRequested,
}, ref) => {
  const blocklyComponent = React.useRef<BlocklyComponentType | null>(null);
  const [editorInstance, setEditorInstance] = React.useState<editor.Editor | null>(null);
  const [generatedCode, setGeneratedCode] = React.useState<string>('');
  const [triggerPythonRegeneration, setTriggerPythonRegeneration] = React.useState(0);
  const [codePanelSize, setCodePanelSize] = React.useState<string | number>(CODE_PANEL_MIN_SIZE);
  const [codePanelCollapsed, setCodePanelCollapsed] = React.useState(true);
  const [codePanelExpandedSize, setCodePanelExpandedSize] = React.useState<string | number>(CODE_PANEL_DEFAULT_SIZE);
  const [codePanelAnimating, setCodePanelAnimating] = React.useState(false);
  const autosave = useAutosave();
  const { getModuleZoom, updateModuleZoom, getModuleScroll, updateModuleScroll } = useUserSettings();
  const isInitialActivation = React.useRef(true);

  /** Expose saveModule method via ref. */
  React.useImperativeHandle(ref, () => ({
    saveModule: async () => {
      if (editorInstance) {
        await editorInstance.saveModule();
        // Mark as saved after successful save
        autosave.markAsSaved();
      }
    },
  }), [editorInstance, autosave]);

  /** Handles Blockly workspace changes and triggers code regeneration. */
  const handleBlocksChanged = React.useCallback((event: Blockly.Events.Abstract): void => {
    if (event.isUiEvent) {
      return;
    }

    if (!event.workspaceId) {
      return;
    }

    const blocklyWorkspace = Blockly.common.getWorkspaceById(event.workspaceId);
    if (!blocklyWorkspace) {
      return;
    }

    if ((blocklyWorkspace as Blockly.WorkspaceSvg).isDragging()) {
      return;
    }

    // Check if this event is for our workspace
    if (blocklyComponent.current &&
        event.workspaceId === blocklyComponent.current.getBlocklyWorkspace().id) {
      setTriggerPythonRegeneration(Date.now());
      // Mark as modified when blocks change, but not during initial activation
      if (!isInitialActivation.current) {
        autosave.markAsModified();
      }
    }
  }, [blocklyComponent, autosave]);

  /** Called when BlocklyComponent is created. */
  const setupBlocklyComponent = React.useCallback((_modulePath: string, newBlocklyComponent: BlocklyComponentType) => {
    blocklyComponent.current = newBlocklyComponent;
    newBlocklyComponent.setActive(isActive);
  }, [isActive]);

  /** Called when workspace is created. */
  const setupWorkspace = React.useCallback(async (_modulePath: string, newWorkspace: Blockly.WorkspaceSvg) => {
    newWorkspace.addChangeListener(handleBlocksChanged);
    classMethodDef.registerToolboxButton(newWorkspace, messageApi);
    eventHandler.registerToolboxButton(newWorkspace, messageApi);
    
    // Register gamepad config button callback if the function is provided
    if (openGamepadConfigDialog) {
      newWorkspace.registerButtonCallback('CONFIG_GAMEPADS_BUTTON', openGamepadConfigDialog);
    }

    // Let the component blocks in the robot ask to be moved into a mechanism.
    if (onMoveComponentRequested && module.moduleType === storageModule.ModuleType.ROBOT) {
      moveComponentRequest.registerMoveComponentHandler(newWorkspace.id, (componentBlock) => {
        onMoveComponentRequested(
            componentBlock.id, componentBlock.getFieldValue(mrcComponent.FIELD_NAME));
      });
    }

    // Fetch the module content and this module's saved zoom/scroll from storage.
    const [moduleContentText, moduleZoom, moduleScroll] = await Promise.all([
      storage.fetchFileContentText(modulePath),
      getModuleZoom(modulePath),
      getModuleScroll(modulePath),
    ]);
    // The workspace may have been disposed (e.g. by React StrictMode's dev-only double-mount,
    // or a theme/renderer change forcing a recreate) while the fetches above were in flight.
    // Bail out rather than touching a disposed workspace, whose behavior is undefined - e.g. it
    // silently ignored a scroll()/setScale() call in testing, racing with the *new* workspace's
    // own setupWorkspace() call and leaving things in a inconsistent, hard-to-predict state.
    if (!newWorkspace.rendered) {
      return;
    }
    newWorkspace.setScale(moduleZoom);

    const newEditor = new editor.Editor(
      newWorkspace,
      module,
      project,
      storage,
      moduleContentText
    );

    // Parse modules after editor is created
    await newEditor.makeCurrent(project);
    if (!newWorkspace.rendered) {
      return;
    }

    setEditorInstance(newEditor);
    newEditor.updateShowSimpleClassNames(showSimpleClassNames);
    newEditor.loadModuleBlocks();
    newEditor.updateToolbox(shownPythonToolboxCategories);

    const restoreViewport = (): void => {
      if (!newWorkspace.rendered) {
        return;
      }
      // Calling setScale()/scroll() with values that already match is a cheap no-op (Blockly
      // skips firing a change event when nothing actually changed), so it's fine to always
      // restore both together rather than tracking which one drifted.
      newWorkspace.setScale(moduleZoom);
      newWorkspace.scroll(moduleScroll.x, moduleScroll.y);
    };

    // For a while after load, something (e.g. editor.ts's updateToolboxAfterDelay(), triggered
    // by mrc_mechanism_component_holder.ts/mrc_component.ts the first time a mechanism's blocks
    // connect under their component-holder block, which happens on every fresh load) can rebuild
    // the toolbox and reset the workspace's zoom/scroll as a side effect - possibly more than
    // once, at an unpredictable delay (observed up to ~2s after load for a larger mechanism).
    // Rather than guessing a delay to reassert the restore after, actively defend the restored
    // viewport against any such drift for a grace period: whenever a viewport change lands away
    // from the target scale/scroll during the grace period, snap it back. This also prevents our
    // own zoom/scroll-change listener in BlocklyComponent.tsx from picking up the drifted
    // position and persisting it, permanently overwriting the correct saved one.
    const VIEWPORT_RESTORE_GRACE_PERIOD_MS = 3000;
    const gracePeriodEnd = Date.now() + VIEWPORT_RESTORE_GRACE_PERIOD_MS;
    const defendRestoredViewport = (event: Blockly.Events.Abstract): void => {
      if (event.type !== Blockly.Events.VIEWPORT_CHANGE || !newWorkspace.rendered) {
        return;
      }
      if (Date.now() >= gracePeriodEnd) {
        newWorkspace.removeChangeListener(defendRestoredViewport);
        return;
      }
      const scaleDrifted = Math.abs(newWorkspace.scale - moduleZoom) > 0.001;
      const scrollDrifted = Math.abs(newWorkspace.scrollX - moduleScroll.x) > 0.5 ||
          Math.abs(newWorkspace.scrollY - moduleScroll.y) > 0.5;
      if (scaleDrifted || scrollDrifted) {
        restoreViewport();
      }
    };
    newWorkspace.addChangeListener(defendRestoredViewport);
    setTimeout(() => newWorkspace.removeChangeListener(defendRestoredViewport), VIEWPORT_RESTORE_GRACE_PERIOD_MS);

    // Deferred to let the workspace settle after loading blocks - calling scroll() immediately
    // has no effect (see the same pattern/comment in BlocklyComponent.tsx's setActive()).
    setTimeout(restoreViewport);
  }, [module, project, storage, modulePath, showSimpleClassNames, shownPythonToolboxCategories, messageApi, handleBlocksChanged, openGamepadConfigDialog, onMoveComponentRequested, getModuleZoom, getModuleScroll]);

  /** Called (debounced) when the user changes the workspace's zoom level. */
  const handleZoomChange = React.useCallback((zoom: number) => {
    updateModuleZoom(modulePath, zoom).catch((error) => {
      console.error('Failed to save zoom level for module:', error);
    });
  }, [modulePath, updateModuleZoom]);

  /** Called (debounced) when the user scrolls/pans the workspace. */
  const handleScrollChange = React.useCallback((x: number, y: number) => {
    updateModuleScroll(modulePath, x, y).catch((error) => {
      console.error('Failed to save scroll position for module:', error);
    });
  }, [modulePath, updateModuleScroll]);

  /** Update editor when showSimpleClassNames changes. */
  React.useEffect(() => {
    if (editorInstance) {
      editorInstance.updateShowSimpleClassNames(showSimpleClassNames);
    }
  }, [showSimpleClassNames, editorInstance]);

  /** Update editor toolbox when categories change. */
  React.useEffect(() => {
    if (editorInstance) {
      editorInstance.updateToolbox(shownPythonToolboxCategories);
    }
  }, [shownPythonToolboxCategories, editorInstance]);

  /**
   * Update BlocklyComponent's active state, but only when isActive itself actually changes -
   * not merely because editorInstance/project changed while isActive stayed the same.
   * BlocklyComponentType.setActive(true) re-applies BlocklyComponent's own saved scroll
   * position (via a deferred setTimeout); if this ran again every time editorInstance became
   * available (e.g. right after setupWorkspace() restores the module's saved scroll position,
   * also via a deferred setTimeout), it would race with and often clobber that restore back to
   * (0, 0), since BlocklyComponent's saved scroll starts at (0, 0) until a tab is deactivated.
   */
  React.useEffect(() => {
    if (blocklyComponent.current) {
      blocklyComponent.current.setActive(isActive);
    }
  }, [isActive, blocklyComponent]);

  /** Make the module current whenever it becomes active, including once its editor loads. */
  React.useEffect(() => {
    if (editorInstance && isActive) {
      // Set flag to ignore changes during activation
      isInitialActivation.current = true;
      editorInstance.makeCurrent(project).then(() => {
        // Clear the flag after a brief delay to allow workspace to settle
        setTimeout(() => {
          isInitialActivation.current = false;
          // Re-generate code for the robot tab so opmode details (name, group, description, etc.)
          // from any recently-edited opmode tabs are reflected.
          if (module.moduleType === storageModule.ModuleType.ROBOT) {
            setTriggerPythonRegeneration(Date.now());
          }
        }, 100);
      });
    }
  }, [isActive, editorInstance, project]);

  /** Generate code when regeneration is triggered. */
  React.useEffect(() => {
    if (blocklyComponent.current && module) {
      if (module.moduleType === storageModule.ModuleType.ROBOT && editorInstance) {
        extendedPythonGenerator.setAllOpModeDetails(editorInstance.getAllOpModeDetails());
      }
      const code = extendedPythonGenerator.mrcWorkspaceToCode(
        blocklyComponent.current.getBlocklyWorkspace(),
        module
      );
      setGeneratedCode(code);
    }
  }, [triggerPythonRegeneration, blocklyComponent, module, editorInstance]);

  /** Cleanup on unmount. */
  React.useEffect(() => {
    return () => {
      if (editorInstance) {
        moveComponentRequest.unregisterMoveComponentHandler(
            editorInstance.getBlocklyWorkspace().id);
        editorInstance.abandon();
      }
    };
  }, [editorInstance]);

  /** Toggles the code panel between collapsed and expanded states. */
  const toggleCodePanelCollapse = (): void => {
    setCodePanelAnimating(true);
    
    if (codePanelCollapsed) {
      // Expand to previous size
      setCodePanelSize(codePanelExpandedSize);
      setCodePanelCollapsed(false);
    } else {
      // Collapse to minimum size - convert current size to pixels for storage
      const currentSizePx = typeof codePanelSize === 'string'
        ? (parseFloat(codePanelSize) / 100) * window.innerWidth
        : codePanelSize;
      setCodePanelExpandedSize(currentSizePx);
      setCodePanelSize(CODE_PANEL_MIN_SIZE);
      setCodePanelCollapsed(true);
    }

    // Reset animation flag after transition completes
    setTimeout(() => {
      setCodePanelAnimating(false);
    }, 200);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100%', height: '100%' }}>
      <Content style={{ flex: 1, minHeight: '100%' }}>
        <BlocklyComponent
          key={modulePath}
          modulePath={modulePath}
          onBlocklyComponentCreated={setupBlocklyComponent}
          theme={theme}
          renderer={renderer}
          onZoomChange={handleZoomChange}
          onScrollChange={handleScrollChange}
          onWorkspaceCreated={setupWorkspace}
        />
      </Content>
      <div
        data-tour="code-panel"
        style={{
          width: typeof codePanelSize === 'string' ? codePanelSize : `${codePanelSize}px`,
          minWidth: CODE_PANEL_MIN_SIZE,
          height: '100%',
          borderLeft: '1px solid #d9d9d9',
          position: 'relative',
          transition: codePanelAnimating ? 'width 0.2s ease' : 'none'
        }}
      >
        <div
          data-tour="code-panel-resize"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '4px',
            height: '100%',
            cursor: 'ew-resize',
            backgroundColor: 'transparent',
            zIndex: 10,
            transform: 'translateX(-2px)'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = codePanelSize;
            
            const handleMouseMove = (e: MouseEvent) => {
              const deltaX = startX - e.clientX;
              const startWidthPx = typeof startWidth === 'string' 
                ? (parseFloat(startWidth) / 100) * window.innerWidth
                : startWidth;
              const newWidth = Math.max(CODE_PANEL_MIN_SIZE, startWidthPx + deltaX);
              setCodePanelSize(newWidth);
              if (newWidth > CODE_PANEL_MIN_SIZE) {
                setCodePanelExpandedSize(newWidth);
                setCodePanelCollapsed(false);
              } else {
                setCodePanelCollapsed(true);
              }
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
        <CodeDisplay
          generatedCode={generatedCode}
          messageApi={messageApi}
          setAlertErrorMessage={setAlertErrorMessage}
          theme={theme}
          isCollapsed={codePanelCollapsed}
          onToggleCollapse={toggleCodePanelCollapse}
        />
      </div>
    </div>
  );
});

TabContent.displayName = 'TabContent';
