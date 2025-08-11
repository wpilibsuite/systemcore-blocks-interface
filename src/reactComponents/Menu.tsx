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
import { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';
import * as commonStorage from '../storage/common_storage';
import * as storageNames from '../storage/names';
import * as storageProject from '../storage/project';
import * as createPythonFiles from '../storage/create_python_files';
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
} from '@ant-design/icons';
import FileManageModal from './FileManageModal';
import ProjectManageModal from './ProjectManageModal';
import AboutDialog from './AboutModal';
import ThemeModal from './ThemeModal';

/** Type definition for menu items. */
type MenuItem = Required<Antd.MenuProps>['items'][number];

/** Props for the Menu component. */
export interface MenuProps {
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  gotoTab: (tabKey: string) => void;
  project: storageProject.Project | null;
  openWPIToolboxSettings: () => void;
  setProject: (project: storageProject.Project | null) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

/** Default selected menu keys. */
const DEFAULT_SELECTED_KEYS = ['1'];

/** Storage key for the most recent project. */
const MOST_RECENT_PROJECT_KEY = 'mostRecentProject';

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
 * Creates a divider menu item.
 */
function getDivider(): MenuItem {
  return {
    type: 'divider',
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
  if (mechanisms.length > 0) {
    mechanisms.push(getDivider());
  }
  mechanisms.push(getItem('Manage...', 'manageMechanisms'));

  // Build opmodes menu items
  project.opModes.forEach((opmode) => {
    opmodes.push(getItem(
        opmode.className,
        opmode.modulePath,
        <CodeOutlined />
    ));
  });
  if (opmodes.length > 0) {
    opmodes.push(getDivider());
  }
  opmodes.push(getItem('Manage...', 'manageOpmodes'));

  return [
    getItem(t('PROJECT'), 'project', <FolderOutlined />, [
      getItem(t('SAVE'), 'save', <SaveOutlined />),
      getItem(t('DEPLOY'), 'deploy'),
      getDivider(),
      getItem(t('MANAGE') + '...', 'manageProjects'),
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
      getItem(t('ABOUT') + '...', 'about', <InfoCircleOutlined />),
    ]),
  ];
}

/**
 * Menu component that displays the project structure and navigation options.
 * Provides access to mechanisms, opmodes, and project management functionality.
 */
export function Component(props: MenuProps): React.JSX.Element {
  const {t, i18n} = I18Next.useTranslation();

  const [projects, setProjects] = React.useState<storageProject.Project[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [fileModalOpen, setFileModalOpen] = React.useState<boolean>(false);
  const [projectModalOpen, setProjectModalOpen] = React.useState<boolean>(false);
  const [moduleType, setModuleType] = React.useState<TabType>(TabType.MECHANISM);
  const [noProjects, setNoProjects] = React.useState<boolean>(false);
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState<boolean>(false);
  const [themeModalOpen, setThemeModalOpen] = React.useState<boolean>(false);
  const [showUploadAndDownload, _setShowUploadAndDownload] = React.useState(false);

  const handleThemeChange = (newTheme: string) => {
    props.setTheme(newTheme);
  };

  /** Fetches the list of projects from storage. */
  const fetchListOfProjects = async (): Promise<storageProject.Project[]> => {
    return new Promise(async (resolve, reject) => {
      if (!props.storage) {
        reject(new Error('Storage not available'));
        return;
      }
      try {
        const array = await storageProject.listProjects(props.storage);
        setProjects(array);
        resolve(array);
      } catch (e) {
        console.error('Failed to load the list of projects:', e);
        props.setAlertErrorMessage(t('fail_list_projects'));
        reject(new Error(t('fail_list_projects')));
      }
    });
  };

  /** Initializes the projects and handles empty project state. */
  const initializeProjects = async (): Promise<void> => {
    const array = await fetchListOfProjects();
    if (array.length === 0) {
      setNoProjects(true);
      setProjectModalOpen(true);
    }
  };

  /** Fetches and sets the most recent project. */
  const fetchMostRecentProject = async (): Promise<void> => {
    let found = false;

    if (props.storage) {
      const mostRecentProject = await props.storage.fetchEntry(
          MOST_RECENT_PROJECT_KEY,
          ''
      );
      projects.forEach((project) => {
        if (project.projectName === mostRecentProject) {
          props.setProject(project);
          found = true;
        }
      });
      if (!found && projects.length > 0) {
        props.setProject(projects[0]);
      }
    }
  };

  /** Saves the most recent project to storage. */
  const setMostRecentProject = async (): Promise<void> => {
    if (props.storage) {
      await props.storage.saveEntry(
          MOST_RECENT_PROJECT_KEY,
          props.project?.projectName || ''
      );
    }
  };

  /** Handles menu item clicks. */
  const handleClick: Antd.MenuProps['onClick'] = ({key}): void => {
    const newModule = props.project ?
      storageProject.findModuleByModulePath(props.project, key) :
      null;

    if (newModule) {
      props.gotoTab(newModule.modulePath);
      return;
    }

    // Handle management actions
    if (key === 'manageMechanisms') {
      console.log('Opening mechanisms modal');
      setFileModalOpen(false);
      setModuleType(TabType.MECHANISM);
      setTimeout(() => {
        console.log('Setting fileModalOpen to true');
        setFileModalOpen(true);
      }, 0);
    } else if (key === 'manageOpmodes') {
      console.log('Opening opmodes modal');
      setFileModalOpen(false);
      setModuleType(TabType.OPMODE);
      setTimeout(() => {
        console.log('Setting fileModalOpen to true');
        setFileModalOpen(true);
      }, 0);
    } else if (key === 'manageProjects') {
      console.log('Opening projects modal');
      setProjectModalOpen(true);
    } else if (key === 'about') {
      setAboutDialogVisible(true);
    } else if (key === 'wpi_toolbox'){
      props.openWPIToolboxSettings();
    } else if (key === 'theme') {
      setThemeModalOpen(true);
    } else if (key == 'deploy') {
      if (props.project && props.storage) {
        handleDeploy();
      } else {
        props.setAlertErrorMessage(t('NO_PROJECT_SELECTED'));
      }
    } else if (key.startsWith('setlang:')) {
      const lang = key.split(':')[1];
      i18n.changeLanguage(lang);
    } else {
      // TODO: Handle other menu actions

      console.log(`Selected key that wasn't module: ${key}`);
    }
  };

  /** Handles the deploy action to generate and download Python files. */
  const handleDeploy = async (): Promise<void> => {
    if (!props.project || !props.storage) {
      return;
    }

    try {
      const blobUrl = await createPythonFiles.producePythonProjectBlob(props.project, props.storage);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${props.project.projectName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to deploy project:', error);
      props.setAlertErrorMessage(t('DEPLOY_FAILED') || 'Failed to deploy project');
    }
  };

  // TODO: Add UI for the download action.
  /** Handles the download action to generate and download json files. */
  const handleDownload = async (): Promise<void> => {
    if (!props.project || !props.storage) {
      return;
    }

    try {
      const blobUrl = await storageProject.downloadProject(props.storage, props.project.projectName);
      const filename = props.project.projectName + storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION;

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
      props.setAlertErrorMessage(t('DOWNLOAD_FAILED') || 'Failed to download project');
    }
  }

  // TODO: Add UI for the upload action.
  /** Handles the upload action to upload a previously downloaded project. */
  const handleUpload = (): Antd.UploadProps | null => {
    if (!props.storage) {
      return null;
    }

    const uploadProps: Antd.UploadProps = {
      accept: storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION,
      beforeUpload: (file) => {
        const isBlocks = file.name.endsWith(storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION)
        if (!isBlocks) {
          // TODO: i18n
          props.setAlertErrorMessage(file.name + ' is not a blocks file');
          return false;
        }
        return isBlocks || Antd.Upload.LIST_IGNORE;
      },
      onChange: (_info) => {
      },
      customRequest: (options: UploadRequestOption) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!event.target) {
            return;
          }
          const dataUrl = event.target.result as string;
          const existingProjectNames: string[] = [];
          projects.forEach(project => {
            existingProjectNames.push(project.projectName);
          });
          const file = options.file as RcFile;
          const uploadProjectName = storageProject.makeUploadProjectName(file.name, existingProjectNames);
          if (props.storage) {
            props.storage.uploadProject(uploadProjectName, dataUrl);
          }
        };
        reader.onerror = (_error) => {
          console.log('Error reading file: ' + reader.error);
          // TODO: i18n
          props.setAlertErrorMessage(t('UPLOAD_FAILED') || 'Failed to upload project');
        };
        reader.readAsDataURL(options.file as Blob);
      },
    };
    return uploadProps;
  };

  /** Handles closing the file management modal. */
  const handleFileModalClose = (): void => {
    console.log('Modal onCancel called');
    setFileModalOpen(false);
  };

  /** Handles closing the project management modal. */
  const handleProjectModalClose = (): void => {
    setProjectModalOpen(false);
  };

  // Initialize projects when storage is available
  React.useEffect(() => {
    if (!props.storage) {
      return;
    }
    initializeProjects();
  }, [props.storage]);

  // Fetch most recent project when projects change
  React.useEffect(() => {
    fetchMostRecentProject();
  }, [projects]);

  // Update menu items and save project when project or language changes
  React.useEffect(() => {
    if (props.project) {
      setMostRecentProject();
      setMenuItems(getMenuItems(t, props.project, i18n.language));
      setNoProjects(false);
    }
  }, [props.project, i18n.language]); 

  return (
    <>
      <FileManageModal
        isOpen={fileModalOpen}
        onCancel={handleFileModalClose}
        project={props.project}
        storage={props.storage}
        moduleType={moduleType}
        setProject={props.setProject}
        setAlertErrorMessage={props.setAlertErrorMessage}
        gotoTab={props.gotoTab}
      />
      <ProjectManageModal
        noProjects={noProjects}
        isOpen={projectModalOpen}
        onCancel={handleProjectModalClose}
        storage={props.storage}
        setProject={props.setProject}
        setAlertErrorMessage={props.setAlertErrorMessage}
      />
      <Antd.Menu
        theme="dark"
        defaultSelectedKeys={DEFAULT_SELECTED_KEYS}
        mode="inline"
        items={menuItems}
        onClick={handleClick}
      />
      {showUploadAndDownload ? (
        <div>
          <Antd.Upload
            {...handleUpload()}
            showUploadList={false}
          >
            <Antd.Button
              icon={<UploadOutlined />}
              size="small"
              style={{ color: 'white' }}
            />
          </Antd.Upload>
          <Antd.Button
            icon={<DownloadOutlined />}
            size="small"
            disabled={!props.project}
            onClick={handleDownload}
            style={{ color: 'white' }}
          />
        </div>
      ) : (
        <div>
        </div>
      )}
      <AboutDialog
        visible={aboutDialogVisible}
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
