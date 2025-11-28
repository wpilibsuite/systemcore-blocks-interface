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

import { pythonGenerator } from 'blockly/python';

import Header from './reactComponents/Header';
import * as Menu from './reactComponents/Menu';
import SiderCollapseTrigger from './reactComponents/SiderCollapseTrigger';
import ToolboxSettingsModal from './reactComponents/ToolboxSettings';
import * as Tabs from './reactComponents/Tabs';
import { TabType } from './types/TabType';

import { extendedPythonGenerator } from './editor/extended_python_generator';

import * as commonStorage from './storage/common_storage';
import * as storageModule from './storage/module';
import * as storageProject from './storage/project';
import * as clientSideStorage from './storage/client_side_storage';

import * as CustomBlocks from './blocks/setup_custom_blocks';

import { initialize as initializePythonBlocks } from './blocks/utils/python';
import { antdThemeFromString } from './reactComponents/ThemeModal';
import { useTranslation } from 'react-i18next';
import { UserSettingsProvider } from './reactComponents/UserSettingsProvider';
import { useUserSettings } from './reactComponents/useUserSettings';

/** Storage key for shown toolbox categories. */
const SHOWN_TOOLBOX_CATEGORIES_KEY = 'shownPythonToolboxCategories';

/** Default toolbox categories JSON. */
const DEFAULT_TOOLBOX_CATEGORIES_JSON = '[]';

/** Error message for storage opening failures. */
const STORAGE_ERROR_MESSAGE = 'Failed to open client side storage. Caught the following error...';

/** Error message for toolbox categories fetch failures. */
const TOOLBOX_FETCH_ERROR_MESSAGE = 'Failed to fetch shownPythonToolboxCategories. Caught the following error...';

/** Layout height for full viewport. */
const FULL_VIEWPORT_HEIGHT = '100vh';

/** Layout height for remaining space. */
const FULL_HEIGHT = '100%';

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
  const { settings, updateLanguage, updateTheme, updateOpenTabs, getOpenTabs, storage, isLoading } = useUserSettings();

  const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
  const [messageApi, contextHolder] = Antd.message.useMessage();
  const [toolboxSettingsModalIsOpen, setToolboxSettingsModalIsOpen] = React.useState(false);
  const [modulePathToContentText, setModulePathToContentText] = React.useState<{[modulePath: string]: string}>({});
  const [tabItems, setTabItems] = React.useState<Tabs.TabItem[]>([]);
  const [activeTab, setActiveTab] = React.useState('');
  const [isLoadingTabs, setIsLoadingTabs] = React.useState(false);
  const [shownPythonToolboxCategories, setShownPythonToolboxCategories] = React.useState<Set<string>>(new Set());
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [theme, setTheme] = React.useState('dark');
  const [languageInitialized, setLanguageInitialized] = React.useState(false);
  const [themeInitialized, setThemeInitialized] = React.useState(false);

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
      // Only save if this is not the initial load and the language is different
      if (languageInitialized && newLanguage !== settings.language) {
        try {
          await updateLanguage(newLanguage);
        } catch (error) {
          console.error('Failed to save language setting:', error);
        }
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [languageInitialized, settings.language, updateLanguage, i18n]);

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

  /** Handles toolbox settings modal close. */
  const handleToolboxSettingsCancel = (): void => {
    setToolboxSettingsModalIsOpen(false);
  };

  /** Handles toolbox settings modal OK with updated categories. */
  const handleToolboxSettingsConfirm = (updatedShownCategories: Set<string>): void => {
    setToolboxSettingsModalIsOpen(false);
    handleToolboxSettingsOk(updatedShownCategories);
  };

  // Initialize blocks when app loads
  React.useEffect(() => {
    initializeBlocks();
  }, []);

  React.useEffect(() => {
    initializeShownPythonToolboxCategories();
  }, [storage]);

  // Fetch any unfetched modules when project changes.
  React.useEffect(() => {
    fetchModules();
  }, [project]);

  const fetchModules = async () => {
    if (!project || !storage) {
      return;
    }
    const promises: {[modulePath: string]: Promise<string>} = {}; // value is promise of module content.
    const updatedModulePathToContentText: {[modulePath: string]: string} = {}; // value is module content text
    if (project.robot.modulePath in modulePathToContentText) {
      updatedModulePathToContentText[project.robot.modulePath] = modulePathToContentText[project.robot.modulePath];
    } else {
      promises[project.robot.modulePath] = storage.fetchFileContentText(project.robot.modulePath);
    }
    project.mechanisms.forEach(mechanism => {
      if (mechanism.modulePath in modulePathToContentText) {
        updatedModulePathToContentText[mechanism.modulePath] = modulePathToContentText[mechanism.modulePath];
      } else {
        promises[mechanism.modulePath] = storage.fetchFileContentText(mechanism.modulePath);
      }
    });
    project.opModes.forEach(opmode => {
      if (opmode.modulePath in modulePathToContentText) {
        updatedModulePathToContentText[opmode.modulePath] = modulePathToContentText[opmode.modulePath];
      } else {
        promises[opmode.modulePath] = storage.fetchFileContentText(opmode.modulePath);
      }
    });
    if (Object.keys(promises).length) {
      await Promise.all(
        Object.entries(promises).map(async ([modulePath, promise]) => {
          updatedModulePathToContentText[modulePath] = await promise;
        })
      );
      setModulePathToContentText(updatedModulePathToContentText);
    }
  };

  // Load saved tabs when project changes
  React.useEffect(() => {
    const loadSavedTabs = async () => {
      if (project && !isLoading) {
        setIsLoadingTabs(true);

        // Add a small delay to ensure UserSettingsProvider context is updated
        await new Promise(resolve => setTimeout(resolve, 0));
        
        let tabsToSet: Tabs.TabItem[] = [];
        let usedSavedTabs = false;
        
        // Try to load saved tabs first
        try {
          const savedTabPaths = await getOpenTabs(project.projectName);
          
          if (savedTabPaths.length > 0) {
            // Filter saved tabs to only include those that still exist in the project
            const validSavedTabs = savedTabPaths.filter((tabPath: string) => {
              const module = storageProject.findModuleByModulePath(project!, tabPath);
              return module !== null;
            });
            
            if (validSavedTabs.length > 0) {
              usedSavedTabs = true;
              // Convert paths back to TabItem objects
              tabsToSet = validSavedTabs.map((path: string) => {
                const module = storageProject.findModuleByModulePath(project!, path);
                if (!module) return null;
                
                let type: TabType;
                let title: string;
                
                switch (module.moduleType) {
                  case storageModule.ModuleType.ROBOT:
                    type = TabType.ROBOT;
                    title = t('ROBOT');
                    break;
                  case storageModule.ModuleType.MECHANISM:
                    type = TabType.MECHANISM;
                    title = module.className;
                    break;
                  case storageModule.ModuleType.OPMODE:
                    type = TabType.OPMODE;
                    title = module.className;
                    break;
                  default:
                    return null;
                }
                
                return {
                  key: path,
                  title,
                  type,
                };
              }).filter((item): item is Tabs.TabItem => item !== null);
            }
          }
        } catch (error) {
          console.error('Failed to load saved tabs:', error);
        }
        
        // If no saved tabs or loading failed, create default tabs (all project files)
        if (tabsToSet.length === 0) {
          tabsToSet = [
            {
              key: project.robot.modulePath,
              title: t('ROBOT'),
              type: TabType.ROBOT,
            }
          ];

          // Add all mechanisms
          project.mechanisms.forEach((mechanism) => {
            tabsToSet.push({
              key: mechanism.modulePath,
              title: mechanism.className,
              type: TabType.MECHANISM,
            });
          });

          // Add all opmodes
          project.opModes.forEach((opmode) => {
            tabsToSet.push({
              key: opmode.modulePath,
              title: opmode.className,
              type: TabType.OPMODE,
            });
          });
        }
        
        // Set the tabs
        setTabItems(tabsToSet);
        
        // Only set active tab to robot if no active tab is set or if the current active tab no longer exists
        const currentActiveTabExists = tabsToSet.some(tab => tab.key === activeTab);
        if (!activeTab || !currentActiveTabExists) {
          setActiveTab(project.robot.modulePath);
        }
        
        // Only auto-save if we didn't use saved tabs (i.e., this is a new project or the first time)
        if (!usedSavedTabs) {
          try {
            const tabPaths = tabsToSet.map(tab => tab.key);
            await updateOpenTabs(project.projectName, tabPaths);
          } catch (error) {
            console.error('Failed to auto-save default tabs:', error);
          }
        }
        
        setIsLoadingTabs(false);
      }
    };
    
    loadSavedTabs();
  }, [project?.projectName, isLoading, getOpenTabs]);

  // Update tab items when modules in project change (for title updates, etc)
  React.useEffect(() => {
    if (project && tabItems.length > 0) {
      // Update existing tab titles in case they changed
      const updatedTabs = tabItems.map(tab => {
        const module = storageProject.findModuleByModulePath(project, tab.key);
        if (module && module.moduleType !== storageModule.ModuleType.ROBOT) {
          return { ...tab, title: module.className };
        }
        return tab;
      });

      // Only update if something actually changed
      const titlesChanged = updatedTabs.some((tab, index) => tab.title !== tabItems[index]?.title);
      if (titlesChanged) {
        setTabItems(updatedTabs);
      }
    }
  }, [modulePathToContentText]);

  // Save tabs when tab list changes (but not during initial loading)
  React.useEffect(() => {
    const saveTabs = async () => {
      // Don't save tabs while we're in the process of loading them
      if (project?.projectName && tabItems.length > 0 && !isLoadingTabs) {
        try {
          const tabPaths = tabItems.map(tab => tab.key);
          await updateOpenTabs(project.projectName, tabPaths);
        } catch (error) {
          console.error('Failed to save open tabs:', error);
          // Don't show alert for save failures as they're not critical to user workflow
        }
      }
    };
    
    // Use a small delay to debounce rapid tab changes
    const timeoutId = setTimeout(saveTabs, 100);
    return () => clearTimeout(timeoutId);
  }, [tabItems, project?.projectName, isLoadingTabs]);

  const onProjectChanged = async (): Promise<void> => {
    await fetchModules();
  };

  const { Sider } = Antd.Layout;

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
              trigger={null}
              style={{ position: 'relative' }}
            >
              <Menu.Component
                storage={storage}
                setAlertErrorMessage={setAlertErrorMessage}
                gotoTab={setActiveTab}
                currentProject={project}
                setCurrentProject={setProject}
                onProjectChanged={onProjectChanged}
                openWPIToolboxSettings={() => setToolboxSettingsModalIsOpen(true)}
                theme={theme}
                setTheme={setTheme}
              />
              <SiderCollapseTrigger
                collapsed={leftCollapsed}
                onToggle={() => setLeftCollapsed(!leftCollapsed)}
              />
            </Sider>
            <Antd.Layout>
              <Tabs.Component
                tabList={tabItems}
                activeTab={activeTab}
                setTabList={setTabItems}
                setAlertErrorMessage={setAlertErrorMessage}
                project={project}
                onProjectChanged={onProjectChanged}
                storage={storage}
                theme={theme}
                shownPythonToolboxCategories={shownPythonToolboxCategories}
                modulePathToContentText={modulePathToContentText}
                messageApi={messageApi}
              />
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
