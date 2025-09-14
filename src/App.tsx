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
import '@ant-design/v5-patch-for-react-19';

import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

import Header from './reactComponents/Header';
import * as Menu from './reactComponents/Menu';
import CodeDisplay from './reactComponents/CodeDisplay';
import BlocklyComponent, { BlocklyComponentType } from './reactComponents/BlocklyComponent';
import ToolboxSettingsModal from './reactComponents/ToolboxSettings';
import * as Tabs from './reactComponents/Tabs';
import { TabType } from './types/TabType';

import { createGeneratorContext, GeneratorContext } from './editor/generator_context';
import * as editor from './editor/editor';
import { extendedPythonGenerator } from './editor/extended_python_generator';

import * as commonStorage from './storage/common_storage';
import * as storageModule from './storage/module';
import * as storageProject from './storage/project';
import * as clientSideStorage from './storage/client_side_storage';

import * as CustomBlocks from './blocks/setup_custom_blocks';

import { initialize as initializePythonBlocks } from './blocks/utils/python';
import * as ChangeFramework from './blocks/utils/change_framework'
import { registerToolboxButton } from './blocks/mrc_event_handler'
import { mutatorOpenListener } from './blocks/mrc_param_container'
import { TOOLBOX_UPDATE_EVENT } from './blocks/mrc_mechanism_component_holder';
import { antdThemeFromString } from './reactComponents/ThemeModal';
import { useTranslation } from 'react-i18next';
import { UserSettingsProvider } from './reactComponents/UserSettingsProvider';
import { useUserSettings } from './reactComponents/useUserSettings';

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
const CODE_PANEL_MIN_SIZE = 80;

/** Background color for testing layout. */
const LAYOUT_BACKGROUND_COLOR = '#0F0';

/**
 * Main application component that manages the Blockly interface, code generation,
 * project management, and user interface layout.
 */
const App: React.FC = (): React.JSX.Element => {
  const [storage, setStorage] = React.useState<commonStorage.Storage | null>(null);

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

  // Initialize storage when app loads
  React.useEffect(() => {
    openStorage();
  }, []);

  if (!storage) {
    return (
      <Antd.ConfigProvider>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Antd.Spin size="large" />
        </div>
      </Antd.ConfigProvider>
    );
  }

  return <AppWithUserSettings storage={storage} />;
};

/**
 * App wrapper that manages project state and provides it to UserSettingsProvider.
 */
const AppWithUserSettings: React.FC<{ storage: commonStorage.Storage }> = ({ storage }) => {
  const [project, setProject] = React.useState<storageProject.Project | null>(null);

  return (
    <UserSettingsProvider
      storage={storage}
      currentProjectName={project?.projectName}
    >
      <AppContent project={project} setProject={setProject} />
    </UserSettingsProvider>
  );
};

/**
 * Inner application content component that has access to UserSettings context.
 */
interface AppContentProps {
  project: storageProject.Project | null;
  setProject: React.Dispatch<React.SetStateAction<storageProject.Project | null>>;
}

const AppContent: React.FC<AppContentProps> = ({ project, setProject }): React.JSX.Element => {
  const { t, i18n } = useTranslation();
  const { settings, updateLanguage, updateTheme, storage, isLoading } = useUserSettings();

  const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
  const [currentModule, setCurrentModule] = React.useState<storageModule.Module | null>(null);
  const [messageApi, contextHolder] = Antd.message.useMessage();
  const [generatedCode, setGeneratedCode] = React.useState<string>('');
  const [toolboxSettingsModalIsOpen, setToolboxSettingsModalIsOpen] = React.useState(false);
  const [tabItems, setTabItems] = React.useState<Tabs.TabItem[]>([]);
  const [activeTab, setActiveTab] = React.useState('');
  const [shownPythonToolboxCategories, setShownPythonToolboxCategories] = React.useState<Set<string>>(new Set());
  const [triggerPythonRegeneration, setTriggerPythonRegeneration] = React.useState(0);
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  const [theme, setTheme] = React.useState('dark');
  const [languageInitialized, setLanguageInitialized] = React.useState(false);
  const [themeInitialized, setThemeInitialized] = React.useState(false);

  const generatorContext = React.useRef<GeneratorContext | null>(null);

  const blocksEditor = React.useRef<editor.Editor | null>(null);
  const blocklyComponent = React.useRef<BlocklyComponentType | null>(null);

  /** Initialize language from UserSettings when app first starts. */
  React.useEffect(() => {
    // Only proceed if settings are loaded
    if (!isLoading) {
      if (!languageInitialized && settings.language && i18n.language !== settings.language) {
        i18n.changeLanguage(settings.language);
        setLanguageInitialized(true);
      } else if (!languageInitialized) {
        setLanguageInitialized(true);
      }
    }
  }, [settings.language, i18n, languageInitialized, isLoading]);

  /** Initialize theme from UserSettings when app first starts. */
  React.useEffect(() => {
    // Only proceed if settings are loaded
    if (!isLoading) {
      if (!themeInitialized && settings.theme && settings.theme !== theme) {
        setTheme(settings.theme);
        setThemeInitialized(true);
      } else if (!themeInitialized) {
        setThemeInitialized(true);
      }
    }
  }, [settings.theme, theme, themeInitialized, isLoading]);

  /** Save language changes to UserSettings when i18n language changes. */
  React.useEffect(() => {
    const handleLanguageChange = async (newLanguage: string) => {
      // Save current blocks before language change
      if (currentModule && areBlocksModified()) {
        try {
          await saveBlocks();
        } catch (e) {
          console.error('Failed to save blocks before language change:', e);
        }
      }

      // Only save if this is not the initial load and the language is different
      if (languageInitialized && newLanguage !== settings.language) {
        try {
          await updateLanguage(newLanguage);
        } catch (error) {
          console.error('Failed to save language setting:', error);
        }
      }

      // Update toolbox after language change
      if (blocksEditor.current) {
        blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [languageInitialized, settings.language, updateLanguage, i18n, currentModule, shownPythonToolboxCategories]);

  /** Save theme changes to UserSettings when theme changes. */
  React.useEffect(() => {
    const saveThemeChange = async () => {
      // Only save if this is not the initial load and theme is different from settings
      if (themeInitialized && theme !== settings.theme && !isLoading) {
        try {
          await updateTheme(theme);
        } catch (error) {
          console.error('Failed to save theme setting:', error);
        }
      }
    };

    saveThemeChange();
  }, [theme, settings.theme, updateTheme, themeInitialized, isLoading]);

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
      const shownCategories: Set<string> = new Set(JSON.parse(value));
      setShownPythonToolboxCategories(shownCategories);
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
  const changeModule = async (module: storageModule.Module | null): Promise<void> => {
    if (currentModule && areBlocksModified()) {
      await saveBlocks();
    }
    setCurrentModule(module);
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
  const createTabItemsFromProject = (projectData: storageProject.Project): Tabs.TabItem[] => {
    const tabs: Tabs.TabItem[] = [
      {
        key: projectData.robot.modulePath,
        title: t('ROBOT'),
        type: TabType.ROBOT,
      },
    ];

    projectData.mechanisms.forEach((mechanism) => {
      tabs.push({
        key: mechanism.modulePath,
        title: mechanism.className,
        type: TabType.MECHANISM,
      });
    });

    projectData.opModes.forEach((opmode) => {
      tabs.push({
        key: opmode.modulePath,
        title: opmode.className,
        type: TabType.OPMODE,
      });
    });

    return tabs;
  };

  /** Handles toolbox update requests from blocks */
  const handleToolboxUpdateRequest = React.useCallback((e: Event) => {
    const workspaceId = (e as CustomEvent).detail.workspaceId;
    const correspondingEditor = editor.Editor.getEditorForBlocklyWorkspaceId(workspaceId);
    if (correspondingEditor) {
      correspondingEditor.updateToolbox(shownPythonToolboxCategories);
    }
  }, [shownPythonToolboxCategories, i18n.language]);

  // Add event listener for toolbox updates
  React.useEffect(() => {
    window.addEventListener(TOOLBOX_UPDATE_EVENT, handleToolboxUpdateRequest);

    return () => {
      window.removeEventListener(TOOLBOX_UPDATE_EVENT, handleToolboxUpdateRequest);
    };
  }, [handleToolboxUpdateRequest]);

  // Initialize blocks when app loads
  React.useEffect(() => {
    initializeBlocks();
    generatorContext.current = createGeneratorContext();
  }, []);

  React.useEffect(() => {
    initializeShownPythonToolboxCategories();
  }, [storage]);

  // Update generator context and load module blocks when current module changes
  React.useEffect(() => {
    if (generatorContext.current) {
      generatorContext.current.setModule(currentModule);
    }
    if (blocksEditor.current) {
      blocksEditor.current.loadModuleBlocks(currentModule, project);
    }
  }, [currentModule]);

  const setupBlocklyComponent = (newBlocklyComponent: BlocklyComponentType) => {
    blocklyComponent.current = newBlocklyComponent;
  };

  const setupWorkspace = (newWorkspace: Blockly.WorkspaceSvg) => {
    if (!blocklyComponent.current || !storage) {
      return;
    }
    // Recreate workspace when Blockly component is ready
    ChangeFramework.setup(newWorkspace);
    newWorkspace.addChangeListener(mutatorOpenListener);
    newWorkspace.addChangeListener(handleBlocksChanged);

    registerToolboxButton(newWorkspace, messageApi);

    if (currentModule) {
      generatorContext.current.setModule(currentModule);
    }

    if (blocksEditor.current) {
      blocksEditor.current.abandon();
    }
    blocksEditor.current = new editor.Editor(newWorkspace, generatorContext.current, storage);
    blocksEditor.current.makeCurrent();

    // Set the current module in the editor after creating it
    if (currentModule) {
      blocksEditor.current.loadModuleBlocks(currentModule, project);
    }

    blocksEditor.current.updateToolbox(shownPythonToolboxCategories);
  };

  // Initialize Blockly workspace and editor when component and storage are ready
  React.useEffect(() => {
    if (!blocklyComponent.current || !storage) {
      return;
    }

    const blocklyWorkspace = blocklyComponent.current.getBlocklyWorkspace();
    if (blocklyWorkspace) {
      setupWorkspace(blocklyWorkspace);
    }
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
  }, [currentModule, project, triggerPythonRegeneration, blocklyComponent]);

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
      setActiveTab(project.robot.modulePath);
    }
  }, [project]);

  const { Sider, Content } = Antd.Layout;

  return (
    <Antd.ConfigProvider
      theme={antdThemeFromString(theme)}
    >
      {contextHolder}
      <Antd.Layout style={{ height: FULL_VIEWPORT_HEIGHT }}>
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
              onCollapse={(collapsed: boolean) => setLeftCollapsed(collapsed)}
            >
              <Menu.Component
                storage={storage}
                setAlertErrorMessage={setAlertErrorMessage}
                gotoTab={setActiveTab}
                project={project}
                setProject={setProject}
                openWPIToolboxSettings={() => setToolboxSettingsModalIsOpen(true)}
                theme={theme}
                setTheme={setTheme}
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
              <Antd.Layout>
                <Content>
                  <BlocklyComponent
                    onBlocklyComponentCreated={setupBlocklyComponent}
                    theme={theme}
                    onWorkspaceRecreated={setupWorkspace}
                  />
                </Content>
                <Sider
                  collapsible
                  reverseArrow={true}
                  collapsed={rightCollapsed}
                  collapsedWidth={CODE_PANEL_MIN_SIZE}
                  width={CODE_PANEL_DEFAULT_SIZE}
                  onCollapse={(collapsed: boolean) => setRightCollapsed(collapsed)}
                >
                  <CodeDisplay
                    generatedCode={generatedCode}
                    messageApi={messageApi}
                    setAlertErrorMessage={setAlertErrorMessage}
                    theme={theme}
                  />
                </Sider>
              </Antd.Layout>
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
