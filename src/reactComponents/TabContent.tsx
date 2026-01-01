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
import { Content } from 'antd/es/layout/layout';
import { useAutosave } from './AutosaveManager';

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
  shownPythonToolboxCategories: Set<string>;
  messageApi: MessageInstance;
  setAlertErrorMessage: (message: string) => void;
  isActive: boolean;
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
  shownPythonToolboxCategories,
  messageApi,
  setAlertErrorMessage,
  isActive,
}, ref) => {
  const blocklyComponent = React.useRef<BlocklyComponentType | null>(null);
  const [editorInstance, setEditorInstance] = React.useState<editor.Editor | null>(null);
  const [generatedCode, setGeneratedCode] = React.useState<string>('');
  const [triggerPythonRegeneration, setTriggerPythonRegeneration] = React.useState(0);
  const [codePanelSize, setCodePanelSize] = React.useState<string | number>(CODE_PANEL_DEFAULT_SIZE);
  const [codePanelCollapsed, setCodePanelCollapsed] = React.useState(false);
  const [codePanelExpandedSize, setCodePanelExpandedSize] = React.useState<string | number>(CODE_PANEL_DEFAULT_SIZE);
  const [codePanelAnimating, setCodePanelAnimating] = React.useState(false);
  const autosave = useAutosave();
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

    // Fetch the module content from storage
    const moduleContentText = await storage.fetchFileContentText(modulePath);

    const newEditor = new editor.Editor(
      newWorkspace,
      module,
      project,
      storage,
      moduleContentText
    );
    
    // Parse modules after editor is created
    await newEditor.makeCurrent(project);
    
    setEditorInstance(newEditor);
    newEditor.loadModuleBlocks();
    newEditor.updateToolbox(shownPythonToolboxCategories);
  }, [module, project, storage, modulePath, shownPythonToolboxCategories, messageApi, handleBlocksChanged]);

  /** Update editor toolbox when categories change. */
  React.useEffect(() => {
    if (editorInstance) {
      editorInstance.updateToolbox(shownPythonToolboxCategories);
    }
  }, [shownPythonToolboxCategories, editorInstance]);

  /** Update active state when isActive changes. */
  React.useEffect(() => {
    if (blocklyComponent.current) {
      blocklyComponent.current.setActive(isActive);
    }
    if (editorInstance && isActive) {
      // Set flag to ignore changes during activation
      isInitialActivation.current = true;
      editorInstance.makeCurrent(project).then(() => {
        // Clear the flag after a brief delay to allow workspace to settle
        setTimeout(() => {
          isInitialActivation.current = false;
        }, 100);
      });
    }
  }, [isActive, blocklyComponent, editorInstance, project]);

  /** Generate code when regeneration is triggered. */
  React.useEffect(() => {
    if (blocklyComponent.current && module) {
      const code = extendedPythonGenerator.mrcWorkspaceToCode(
        blocklyComponent.current.getBlocklyWorkspace(),
        module
      );
      setGeneratedCode(code);
    }
  }, [triggerPythonRegeneration, blocklyComponent, module]);

  /** Cleanup on unmount. */
  React.useEffect(() => {
    return () => {
      if (editorInstance) {
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
          onWorkspaceCreated={setupWorkspace}
        />
      </Content>
      <div
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
