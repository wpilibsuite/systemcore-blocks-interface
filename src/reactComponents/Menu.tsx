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
import * as Antd from 'antd';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageNames from '../storage/names';
import * as storageProject from '../storage/project';
import * as createPythonFiles from '../storage/create_python_files';
import * as serverSideStorage from '../storage/server_side_storage';
import * as I18Next from 'react-i18next';
import {TabType } from '../types/TabType';

import {
  SettingOutlined,
  CodeOutlined,
  BlockOutlined,
  FileOutlined,
  FolderOutlined,
  RobotOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  ControlOutlined
} from '@ant-design/icons';
import FileManageModal from './FileManageModal';
import ProjectManageModal from './ProjectManageModal';
import AboutDialog from './AboutModal';
import ThemeModal from './ThemeModal';

/** Type definition for menu items. */
type MenuItem = Required<Antd.MenuProps>['items'][number];

/** Props for the Menu component. */
export interface MenuProps {
  storage: commonStorage.Storage | null;
  setAlertErrorMessage: (message: string) => void;
  gotoTab: (tabKey: string) => void;
  closeTab: (tabKey: string) => void;
  currentProject: storageProject.Project | null;
  setCurrentProject: (project: storageProject.Project | null) => void;
  onProjectChanged: () => Promise<void>;
  openWPIToolboxSettings: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  saveCurrentTab: () => Promise<void>;
}

/** Default selected menu keys. */
const DEFAULT_SELECTED_KEYS = ['1'];

/** Storage key for the most recent project name. */
const MOST_RECENT_PROJECT_NAME_KEY = 'mostRecentProject';

/**
 * Creates a menu item with the specified properties.
 */
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    disabled?: boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled
  } as MenuItem;
}


/**
 * Generates menu items for a given project.
 */
function getMenuItems(t: (key: string) => string, project: storageProject.Project, currentLanguage: string): MenuItem[] {
  const mechanisms: MenuItem[] = [];
  const opmodes: MenuItem[] = [];

  // Build mechanisms menu items
  project.mechanisms.forEach((mechanism) => {
    mechanisms.push(getItem(
        mechanism.className,
        mechanism.modulePath,
        <BlockOutlined />
    ));
  });

  // Build opmodes menu items
  project.opModes.forEach((opmode) => {
    opmodes.push(getItem(
        opmode.className,
        opmode.modulePath,
        <CodeOutlined />
    ));
  });

  return [
    getItem(t('PROJECT'), 'project', <FolderOutlined />, [
      getItem(t('SAVE'), 'save', <SaveOutlined />),
      getItem(t('DEPLOY'), 'deploy'),
      getItem(t('DOWNLOAD'), 'download', <DownloadOutlined />),
      getItem(t('UPLOAD') + '...', 'upload', <UploadOutlined />),
    ]),
    getItem(t('MANAGE'), 'manage', <ControlOutlined />, [
      getItem(t('PROJECTS') + '...', 'manageProjects', <FolderOutlined />),
      getItem(t('MECHANISMS') + '...', 'manageMechanisms', <BlockOutlined />),
      getItem(t('OPMODES') + '...', 'manageOpmodes', <CodeOutlined />),
    ]),
    getItem(t('EXPLORER'), 'explorer', <FileOutlined />, [
      getItem(t('ROBOT'), project.robot.modulePath, <RobotOutlined />),
      getItem(t('MECHANISMS'), 'mechanisms', <BlockOutlined />, mechanisms),
      getItem(t('OPMODES'), 'opmodes', <CodeOutlined />, opmodes),
    ]),
    getItem(t('SETTINGS'), 'settings', <SettingOutlined />, [
      getItem(t('WPI_TOOLBOX'), 'wpi_toolbox'),
      getItem(t('THEME') + '...', 'theme', <BgColorsOutlined />),
      getItem(t('LANGUAGE'), 'language', <GlobalOutlined />, [
        getItem(
          t('ENGLISH'),
          'setlang:en',
          currentLanguage === 'en' ? <CheckOutlined /> : undefined
        ),
        getItem(
          t('SPANISH'),
          'setlang:es',
          currentLanguage === 'es' ? <CheckOutlined /> : undefined
        ),
        getItem(
          t('HEBREW'),
          'setlang:he',
          currentLanguage === 'he' ? <CheckOutlined /> : undefined
        ),
      ]),
    ]),
    getItem(t('HELP'), 'help', <QuestionCircleOutlined />, [
      getItem(t('ABOUT.TITLE') + '...', 'about', <InfoCircleOutlined />),
    ]),
  ];
}

/**
 * Menu component that displays the project structure and navigation options.
 * Provides access to mechanisms, opmodes, and project management functionality.
 */
export function Component(props: MenuProps): React.JSX.Element {
  const {t, i18n} = I18Next.useTranslation();
  const [modal, contextHolder] = Antd.Modal.useModal();

  const [projectNames, setProjectNames] = React.useState<string[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [fileModalOpen, setFileModalOpen] = React.useState<boolean>(false);
  const [projectModalOpen, setProjectModalOpen] = React.useState<boolean>(false);
  const [tabType, setTabType] = React.useState<TabType>(TabType.MECHANISM);
  const [noProjects, setNoProjects] = React.useState<boolean>(false);
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState<boolean>(false);
  const [themeModalOpen, setThemeModalOpen] = React.useState<boolean>(false);

  const handleThemeChange = (newTheme: string) => {
    props.setTheme(newTheme);
  };

  /** Fetches the list of project names from storage. */
  const fetchListOfProjectNames = async (): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      if (!props.storage) {
        reject(new Error('Storage not available'));
        return;
      }
      try {
        const array = await storageProject.listProjectNames(props.storage);
        setProjectNames(array);
        resolve(array);
      } catch (e) {
        console.error('Failed to load the list of project names:', e);
        props.setAlertErrorMessage(t('fail_list_projects'));
        reject(new Error(t('fail_list_projects')));
      }
    });
  };

  /** Initializes the project names and handles no projects state. */
  const initializeProjectNames = async (): Promise<void> => {
    const array = await fetchListOfProjectNames();
    if (array.length === 0) {
      setNoProjects(true);
      setProjectModalOpen(true);
    }
  };

  /** Fetches and sets the most recent project. */
  const fetchMostRecentProject = async (): Promise<void> => {
    if (props.storage) {
      const mostRecentProjectName = await props.storage.fetchEntry(
          MOST_RECENT_PROJECT_NAME_KEY,
          ''
      );
      let projectNameToFetch: string = '';
      if (projectNames.includes(mostRecentProjectName)) {
        projectNameToFetch = mostRecentProjectName;
      } else if (projectNames.length) {
        projectNameToFetch = projectNames[0];
      }
      if (projectNameToFetch) {
        const project = await storageProject.fetchProject(props.storage, projectNameToFetch);
        props.setCurrentProject(project);
      }
    }
  };

  /** Saves the most recent project name to storage. */
  const setMostRecentProjectName = async (): Promise<void> => {
    if (props.storage) {
      await props.storage.saveEntry(
          MOST_RECENT_PROJECT_NAME_KEY,
          props.currentProject?.projectName || ''
      );
    }
  };

  /** Handles menu item clicks. */
  const handleClick: Antd.MenuProps['onClick'] = ({key}): void => {
    const newModule = props.currentProject ?
      storageProject.findModuleByModulePath(props.currentProject, key) :
      null;

    if (newModule) {
      props.gotoTab(newModule.modulePath);
      return;
    }

    // Handle management actions
    if (key === 'manageMechanisms') {
      setFileModalOpen(false);
      setTabType(TabType.MECHANISM);
      setTimeout(() => {
        setFileModalOpen(true);
      }, 0);
    } else if (key === 'manageOpmodes') {
      setFileModalOpen(false);
      setTabType(TabType.OPMODE);
      setTimeout(() => {
        setFileModalOpen(true);
      }, 0);
    } else if (key === 'manageProjects') {
      setProjectModalOpen(true);
    } else if (key === 'about') {
      setAboutDialogVisible(true);
    } else if (key === 'wpi_toolbox'){
      props.openWPIToolboxSettings();
    } else if (key === 'theme') {
      setThemeModalOpen(true);
    } else if (key == 'deploy') {
      handleDeploy();
    } else if (key == 'save') {
      handleSave();
    } else if (key == 'download') {
      handleDownload();
    } else if (key == 'upload') {
      handleUpload();
    } else if (key.startsWith('setlang:')) {
      const lang = key.split(':')[1];
      i18n.changeLanguage(lang);
    } else {
      // TODO: Handle other menu actions

      console.log(`Selected key that wasn't module: ${key}`);
    }
  };

  /** Handles the save action to save the current tab. */
  const handleSave = async (): Promise<void> => {
    try {
      await props.saveCurrentTab();
    } catch (error) {
      console.error('Failed to save current tab:', error);
      props.setAlertErrorMessage(t('FAILED_TO_SAVE_MODULE') || 'Failed to save module');
    }
  };

  /** Handles the deploy action to generate and download Python files. */
  const handleDeploy = async (): Promise<void> => {
    if (!props.currentProject) {
      props.setAlertErrorMessage(t('NO_PROJECT_SELECTED'));
      return;
    }
    if (!props.storage) {
      return;
    }

    try {
      // Save current tab before deploying
      await props.saveCurrentTab();
      
      const blobUrl = await createPythonFiles.producePythonProjectBlob(props.currentProject, props.storage);
      
      // Check if the backend server is available
      const serverAvailable = await serverSideStorage.isServerAvailable();
      console.log('Server available:', serverAvailable);
      
      if (serverAvailable) {
        // Send the file to the backend /deploy endpoint
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('file', blob, `${props.currentProject.projectName}.zip`);
        
        const deployResponse = await fetch('/deploy', {
          method: 'POST',
          body: formData,
        });
        
        if (!deployResponse.ok) {
          throw new Error('Deploy to server failed');
        }
        
        const result = await deployResponse.json();
        console.log('Deployment successful:', result);
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
      } else {
        // Download the file locally
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${props.currentProject.projectName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Failed to deploy project:', error);
      props.setAlertErrorMessage(t('DEPLOY_FAILED') || 'Failed to deploy project');
    }
  };

  /** Handles the download action to generate and download json files. */
  const handleDownload = async (): Promise<void> => {
    if (!props.currentProject) {
      props.setAlertErrorMessage(t('NO_PROJECT_SELECTED'));
      return;
    }
    if (!props.storage) {
      return;
    }

    try {
      const blobUrl = await storageProject.downloadProject(props.storage, props.currentProject.projectName);
      const filename = props.currentProject.projectName + storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION;

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download project:', error);
      props.setAlertErrorMessage(t('DOWNLOAD_FAILED'));
    }
  }

  /** Handles the upload action to upload a previously downloaded project. */
  const handleUpload = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION;
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) {
        return;
      }
      
      const isBlocks = file.name.endsWith(storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION);
      if (!isBlocks) {
        props.setAlertErrorMessage(t('UPLOAD_FILE_NOT_BLOCKS', { filename: file.name }));
        return;
      }
      
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (!event.target || !props.storage) {
            return;
          }
          
          const dataUrl = event.target.result as string;
          const existingProjectNames: string[] = projectNames;
          
          // Generate the initial project name
          const preferredName = file.name.substring(
            0, file.name.length - storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION.length);
          
          // Smart name conflict resolution: extract base name and trailing number
          // e.g., "PrSimplify2" -> base="PrSimplify", num=2
          const match = preferredName.match(/^(.+?)(\d+)$/);
          let uploadProjectName: string;
          
          if (match && existingProjectNames.includes(preferredName)) {
            // Name has a trailing number and conflicts - find next available
            const baseName = match[1];
            const startNum = parseInt(match[2], 10);
            let num = startNum + 1;
            while (existingProjectNames.includes(baseName + num)) {
              num++;
            }
            uploadProjectName = baseName + num;
          } else {
            // No trailing number or no conflict - use standard logic
            uploadProjectName = storageNames.makeUniqueName(preferredName, existingProjectNames);
          }
          
          // Check if there's a conflict (meaning we had to change the name)
          if (existingProjectNames.includes(preferredName)) {
            // Show a modal to let the user rename the project
            let inputValue = uploadProjectName;
            
            modal.confirm({
              title: t('PROJECT_NAME_CONFLICT'),
              content: (
                <div>
                  <p>{t('PROJECT_NAME_EXISTS', { projectName: preferredName })}</p>
                  <Antd.Input
                    defaultValue={uploadProjectName}
                    onChange={(e) => {
                      inputValue = e.target.value;
                    }}
                  />
                </div>
              ),
              okText: t('UPLOAD'),
              cancelText: t('CANCEL'),
              onOk: async () => {
                try {
                  if (props.storage) {
                    await storageProject.uploadProject(props.storage, inputValue, dataUrl);
                    await fetchListOfProjectNames();
                    const project = await storageProject.fetchProject(props.storage, inputValue);
                    props.setCurrentProject(project);
                    await props.onProjectChanged();
                    Antd.message.success(t('UPLOAD_SUCCESS', { projectName: inputValue }));
                  }
                } catch (error) {
                  console.error('Error uploading file:', error);
                  props.setAlertErrorMessage(t('UPLOAD_FAILED'));
                }
              },
            });
          } else {
            // No conflict, upload directly
            try {
              if (props.storage) {
                await storageProject.uploadProject(props.storage, uploadProjectName, dataUrl);
                await fetchListOfProjectNames();
                const project = await storageProject.fetchProject(props.storage, uploadProjectName);
                props.setCurrentProject(project);
                await props.onProjectChanged();
                Antd.message.success(t('UPLOAD_SUCCESS', { projectName: uploadProjectName }));
              }
            } catch (error) {
              console.error('Error uploading file:', error);
              props.setAlertErrorMessage(t('UPLOAD_FAILED'));
            }
          }
        };
        
        reader.onerror = (_error) => {
          console.log('Error reading file: ' + reader.error);
          props.setAlertErrorMessage(t('UPLOAD_FAILED'));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error handling upload:', error);
        props.setAlertErrorMessage(t('UPLOAD_FAILED'));
      }
    };
    
    input.click();
  };

  /** Handles closing the file management modal. */
  const handleFileModalClose = (): void => {
    setFileModalOpen(false);
  };

  /** Handles closing the project management modal. */
  const handleProjectModalClose = async (): Promise<void> => {
    setProjectModalOpen(false);
    // Refresh project names to reflect any changes (deletions, renames, etc.)
    if (props.storage) {
      await fetchListOfProjectNames();
    }
  };

  // Initialize project names when storage is available
  React.useEffect(() => {
    if (!props.storage) {
      return;
    }
    initializeProjectNames();
  }, [props.storage]);

  // Fetch most recent project when projectNames change
  React.useEffect(() => {
    fetchMostRecentProject();
  }, [projectNames]);

  // Update menu items and save project when project or language changes
  React.useEffect(() => {
    if (props.currentProject) {
      setMostRecentProjectName();
      setMenuItems(getMenuItems(t, props.currentProject, i18n.language));
      setNoProjects(false);
    }
  }, [props.currentProject, i18n.language]);

  return (
    <>
      {contextHolder}
      <FileManageModal
        isOpen={fileModalOpen}
        onClose={handleFileModalClose}
        project={props.currentProject}
        storage={props.storage}
        tabType={tabType}
        onProjectChanged={props.onProjectChanged}
        setAlertErrorMessage={props.setAlertErrorMessage}
        gotoTab={props.gotoTab}
        closeTab={props.closeTab}
      />
      <ProjectManageModal
        noProjects={noProjects}
        isOpen={projectModalOpen}
        onCancel={handleProjectModalClose}
        storage={props.storage}
        currentProject={props.currentProject}
        setCurrentProject={props.setCurrentProject}
        setAlertErrorMessage={props.setAlertErrorMessage}
      />
      <Antd.Menu
        theme="dark"
        defaultSelectedKeys={DEFAULT_SELECTED_KEYS}
        mode="inline"
        items={menuItems}
        onClick={handleClick}
      />
      <AboutDialog
        open={aboutDialogVisible}
        onClose={() => setAboutDialogVisible(false)}
      />
      <ThemeModal
          open={themeModalOpen}
          onClose={() => setThemeModalOpen(false)}
          currentTheme={props.theme}
          onThemeChange={handleThemeChange}
        />
    </>
  );
}
