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
import * as Antd from 'antd';
import * as Blockly from 'blockly/core';
import {pythonGenerator} from 'blockly/python';

import Header from './reactComponents/Header';
import * as Menu from './reactComponents/Menu';
import CodeDisplay from './reactComponents/CodeDisplay';
import BlocklyComponent, {BlocklyComponentType} from './reactComponents/BlocklyComponent';
import ToolboxSettingsModal from './reactComponents/ToolboxSettings';
import * as Tabs from './reactComponents/Tabs';

import {createGeneratorContext, GeneratorContext} from './editor/generator_context';
import * as editor from './editor/editor';
import {extendedPythonGenerator} from './editor/extended_python_generator';

import * as commonStorage from './storage/common_storage';
import * as clientSideStorage from './storage/client_side_storage';

import * as CustomBlocks from './blocks/setup_custom_blocks';

import { initialize as initializePythonBlocks } from './blocks/utils/python';
import * as ChangeFramework from './blocks/utils/change_framework'
import { mutatorOpenListener } from './blocks/mrc_param_container'

/** Storage key for shown toolbox categories. */
const SHOWN_TOOLBOX_CATEGORIES_KEY = 'shownPythonToolboxCategories';

/** Default toolbox categories JSON. */
const DEFAULT_TOOLBOX_CATEGORIES_JSON = '[]';

/** Success message for save operations. */
const SAVE_SUCCESS_MESSAGE = 'Save completed successfully.';

/** Error message for save failures. */
const SAVE_ERROR_MESSAGE = 'Failed to save the blocks.';

/** Error message for storage opening failures. */
const STORAGE_ERROR_MESSAGE = 'Failed to open client side storage. Caught the following error...';

/** Error message for toolbox categories fetch failures. */
const TOOLBOX_FETCH_ERROR_MESSAGE = 'Failed to fetch shownPythonToolboxCategories. Caught the following error...';

/** Layout height for full viewport. */
const FULL_VIEWPORT_HEIGHT = '100vh';

/** Layout height for remaining space. */
const FULL_HEIGHT = '100%';

/** Default size for code panel. */
const CODE_PANEL_DEFAULT_SIZE = '25%';

/** Minimum size for code panel. */
const CODE_PANEL_MIN_SIZE = 40;

/** Background color for testing layout. */
const LAYOUT_BACKGROUND_COLOR = '#0F0';

/**
 * Main application component that manages the Blockly interface, code generation,
 * project management, and user interface layout.
 */
const App: React.FC = (): React.JSX.Element => {
  const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
  const [storage, setStorage] = React.useState<commonStorage.Storage | null>(null);
  const [currentModule, setCurrentModule] = React.useState<commonStorage.Module | null>(null);
  const [messageApi, contextHolder] = Antd.message.useMessage();
  const [generatedCode, setGeneratedCode] = React.useState<string>('');
  const [toolboxSettingsModalIsOpen, setToolboxSettingsModalIsOpen] = React.useState(false);
  const [project, setProject] = React.useState<commonStorage.Project | null>(null);
  const [tabItems, setTabItems] = React.useState<Tabs.TabItem[]>([]);
  const [activeTab, setActiveTab] = React.useState('');
  const [shownPythonToolboxCategories, setShownPythonToolboxCategories] = React.useState<Set<string>>(new Set());
  const [triggerPythonRegeneration, setTriggerPythonRegeneration] = React.useState(0);
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);

  const blocksEditor = React.useRef<editor.Editor | null>(null);
  const generatorContext = React.useRef<GeneratorContext | null>(null);
  const blocklyComponent = React.useRef<BlocklyComponentType | null>(null);

  /** Opens client-side storage asynchronously. */
  const openStorage = async (): Promise<void> => {
    try {
      const clientStorage = await clientSideStorage.openClientSideStorage();
      setStorage(clientStorage);
    } catch (e) {
      console.error(STORAGE_ERROR_MESSAGE);
      console.error(e);
    }
  };

  /** Initializes custom blocks and Python generator. */
  const initializeBlocks = (): void => {
    const forBlock = Object.create(null);
    CustomBlocks.setup(forBlock);
    Object.assign(pythonGenerator.forBlock, forBlock);
    Object.assign(extendedPythonGenerator.forBlock, pythonGenerator.forBlock);
    initializePythonBlocks();
  };

  /** Initializes shown Python toolbox categories from storage. */
  const initializeShownPythonToolboxCategories = async (): Promise<void> => {
    if (!storage) {
      return;
    }

    try {
      const value = await storage.fetchEntry(SHOWN_TOOLBOX_CATEGORIES_KEY, DEFAULT_TOOLBOX_CATEGORIES_JSON);
      const shownCategories: string[] = JSON.parse(value);
      setShownPythonToolboxCategories(new Set(shownCategories));
    } catch (e) {
      console.error(TOOLBOX_FETCH_ERROR_MESSAGE);
      console.error(e);
    }
  };

  /** Handles Blockly workspace changes and triggers code regeneration. */
  const handleBlocksChanged = (event: Blockly.Events.Abstract): void => {
    if (event.isUiEvent) {
      // UI events are things like scrolling, zooming, etc.
      // No need to regenerate python code after one of these.
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
      // Don't regenerate python code mid-drag.
      return;
    }

    setTriggerPythonRegeneration(Date.now());
  };

  /** Saves blocks to storage with success/error messaging. */
  const saveBlocks = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!blocksEditor.current) {
        reject(new Error('Blocks editor not initialized'));
        return;
      }

      try {
        await blocksEditor.current.saveBlocks();
        messageApi.open({
          type: 'success',
          content: SAVE_SUCCESS_MESSAGE,
        });
        resolve(true);
      } catch (e) {
        console.error('Failed to save the blocks. Caught the following error...');
        console.error(e);
        setAlertErrorMessage(SAVE_ERROR_MESSAGE);
        reject(new Error(SAVE_ERROR_MESSAGE));
      }
    });
  };

  /** Handles toolbox settings modal confirmation. */
  const handleToolboxSettingsOk = async (updatedShownCategories: Set<string>): Promise<void> => {
    if (!storage) {
      return;
    }

    setShownPythonToolboxCategories(updatedShownCategories);
    const array = Array.from(updatedShownCategories);
    array.sort();
    await storage.saveEntry(SHOWN_TOOLBOX_CATEGORIES_KEY, JSON.stringify(array));
  };

  /** Checks if blocks have been modified. */
  const areBlocksModified = (): boolean => {
    return blocksEditor.current ? blocksEditor.current.isModified() : false;
  };

  /** Changes current module with automatic saving if modified. */
  const changeModule = async (module: commonStorage.Module | null): Promise<void> => {
    if (currentModule && areBlocksModified()) {
      await saveBlocks();
    }
    setCurrentModule(module);
  };

  /** Handles left sidebar collapse state change. */
  const handleSiderCollapse = (collapsed: boolean): void => {
    setLeftCollapsed(collapsed);
  };

  /** Handles toolbox settings modal close. */
  const handleToolboxSettingsCancel = (): void => {
    setToolboxSettingsModalIsOpen(false);
  };

  /** Handles toolbox settings modal OK with updated categories. */
  const handleToolboxSettingsConfirm = (updatedShownCategories: Set<string>): void => {
    setToolboxSettingsModalIsOpen(false);
    handleToolboxSettingsOk(updatedShownCategories);
  };

  /** Creates tab items from project data. */
  const createTabItemsFromProject = (projectData: commonStorage.Project): Tabs.TabItem[] => {
    const tabs: Tabs.TabItem[] = [
      {
        key: projectData.modulePath,
        title: 'Robot',
        type: Tabs.TabType.ROBOT,
      },
    ];

    projectData.mechanisms.forEach((mechanism) => {
      tabs.push({
        key: mechanism.modulePath,
        title: mechanism.className,
        type: Tabs.TabType.MECHANISM,
      });
    });

    projectData.opModes.forEach((opmode) => {
      tabs.push({
        key: opmode.modulePath,
        title: opmode.className,
        type: Tabs.TabType.OPMODE,
      });
    });

    return tabs;
  };

  // Initialize storage and blocks when app loads
  React.useEffect(() => {
    openStorage();
    initializeBlocks();
  }, []);

  // Update generator context and load module blocks when current module changes
  React.useEffect(() => {
    if (generatorContext.current) {
      generatorContext.current.setModule(currentModule);
    }
    if (blocksEditor.current) {
      blocksEditor.current.loadModuleBlocks(currentModule);
    }
  }, [currentModule]);

  // Update toolbox when shown categories change
  React.useEffect(() => {
    if (blocksEditor.current) {
      blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
    }
  }, [shownPythonToolboxCategories]);

  // Initialize Blockly workspace and editor when component and storage are ready
  React.useEffect(() => {
    if (!blocklyComponent.current || !storage) {
      return;
    }

    const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
    if (blocklyWorkspace) {
      ChangeFramework.setup(blocklyWorkspace);
      blocklyWorkspace.addChangeListener(mutatorOpenListener);
      blocklyWorkspace.addChangeListener(handleBlocksChanged);
    }

    generatorContext.current = createGeneratorContext();
    if (currentModule) {
      generatorContext.current.setModule(currentModule);
    }

    blocksEditor.current = new editor.Editor(blocklyWorkspace, generatorContext.current, storage);
  }, [blocklyComponent, storage]);

  // Generate code when module or regeneration trigger changes
  React.useEffect(() => {
    if (currentModule && blocklyComponent.current && generatorContext.current) {
      const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
      setGeneratedCode(extendedPythonGenerator.mrcWorkspaceToCode(
          blocklyWorkspace,
          generatorContext.current
      ));
    } else {
      setGeneratedCode('');
    }
  }, [currentModule, triggerPythonRegeneration, blocklyComponent]);

  // Update toolbox when module or categories change
  React.useEffect(() => {
    if (blocksEditor.current) {
      blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
    }
  }, [currentModule, shownPythonToolboxCategories]);

  // Update tab items when project changes
  React.useEffect(() => {
    if (project) {
      const tabs = createTabItemsFromProject(project);
      setTabItems(tabs);
      setActiveTab(project.modulePath);
    }
  }, [project]);

  const {Sider} = Antd.Layout;

  return (
    <Antd.ConfigProvider
      theme={{
        algorithm: Antd.theme.darkAlgorithm,
        components: {
          Tree: {
            directoryNodeSelectedBg: '#1677ff',
            directoryNodeSelectedColor: '#fff',
            nodeSelectedBg: '#1677ff',
            nodeSelectedColor: '#fff',
            nodeHoverBg: '#333',
            nodeHoverColor: '#fff',
          },
        },
      }}
    >
      {contextHolder}
      <Antd.Layout style={{height: FULL_VIEWPORT_HEIGHT}}>
        <Header
          alertErrorMessage={alertErrorMessage}
          setAlertErrorMessage={setAlertErrorMessage}
          project={project}
        />
        <Antd.Layout
          style={{
            background: LAYOUT_BACKGROUND_COLOR,
            height: FULL_HEIGHT,
          }}
        >
          <Sider
            collapsible
            collapsed={leftCollapsed}
            onCollapse={handleSiderCollapse}
          >
            <Menu.Component
              storage={storage}
              setAlertErrorMessage={setAlertErrorMessage}
              gotoTab={setActiveTab}
              project={project}
              setProject={setProject}
            />
          </Sider>
          <Antd.Layout>
            <Tabs.Component
              tabList={tabItems}
              activeTab={activeTab}
              setTabList={setTabItems}
              setAlertErrorMessage={setAlertErrorMessage}
              currentModule={currentModule}
              setCurrentModule={changeModule}
              project={project}
              setProject={setProject}
              storage={storage}
            />
            <Antd.Splitter>
              <Antd.Splitter.Panel>
                <BlocklyComponent ref={blocklyComponent} />
              </Antd.Splitter.Panel>
              <Antd.Splitter.Panel
                min={CODE_PANEL_MIN_SIZE}
                defaultSize={CODE_PANEL_DEFAULT_SIZE}
                collapsible={true}
              >
                <CodeDisplay
                  generatedCode={generatedCode}
                  messageApi={messageApi}
                  setAlertErrorMessage={setAlertErrorMessage}
                />
              </Antd.Splitter.Panel>
            </Antd.Splitter>
          </Antd.Layout>
        </Antd.Layout>
      </Antd.Layout>

      <ToolboxSettingsModal
        isOpen={toolboxSettingsModalIsOpen}
        shownCategories={shownPythonToolboxCategories}
        onOk={handleToolboxSettingsConfirm}
        onCancel={handleToolboxSettingsCancel}
      />
    </Antd.ConfigProvider>
  );
};

export default App;
