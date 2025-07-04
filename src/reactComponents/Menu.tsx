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
  project: commonStorage.Project | null;
  openWPIToolboxSettings: () => void;
  setProject: (project: commonStorage.Project | null) => void;
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
function getMenuItems(t: (key: string) => string, project: commonStorage.Project): MenuItem[] {
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
    getItem(t('Project'), 'project', <FolderOutlined />, [
      getItem(t('Save'), 'save', <SaveOutlined />),
      getItem(t('Deploy'), 'deploy', undefined, undefined, true),
      getDivider(),
      getItem(t('Manage') + '...', 'manageProjects'),
    ]),
    getItem(t('Explorer'), 'explorer', <FileOutlined />, [
      getItem(t('Robot'), project.robot.modulePath, <RobotOutlined />),
      getItem(t('Mechanisms'), 'mechanisms', <BlockOutlined />, mechanisms),
      getItem(t('OpModes'), 'opmodes', <CodeOutlined />, opmodes),
    ]),
    getItem(t('Settings'), 'settings', <SettingOutlined />, [
      getItem(t('WPI toolbox'), 'wpi_toolbox'),
      getItem(t('Theme') + '...', 'theme', <BgColorsOutlined />)
    ]),
    getItem(t('Help'), 'help', <QuestionCircleOutlined />, [
      getItem(t('About') + '...', 'about', <InfoCircleOutlined />
),
    ]),
  ];
}

/**
 * Menu component that displays the project structure and navigation options.
 * Provides access to mechanisms, opmodes, and project management functionality.
 */
export function Component(props: MenuProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();

  const [projects, setProjects] = React.useState<commonStorage.Project[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [fileModalOpen, setFileModalOpen] = React.useState<boolean>(false);
  const [projectModalOpen, setProjectModalOpen] = React.useState<boolean>(false);
  const [moduleType, setModuleType] = React.useState<TabType>(TabType.MECHANISM);
  const [noProjects, setNoProjects] = React.useState<boolean>(false);
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState<boolean>(false);
  const [themeModalOpen, setThemeModalOpen] = React.useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = React.useState('dark');


  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    props.setTheme(newTheme);
  };

  /** Fetches the list of projects from storage. */
  const fetchListOfProjects = async (): Promise<commonStorage.Project[]> => {
    return new Promise(async (resolve, reject) => {
      if (!props.storage) {
        reject(new Error('Storage not available'));
        return;
      }
      try {
        const array = await props.storage.listProjects();
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
      commonStorage.findModuleByModulePath(props.project, key) :
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
    } else {
      // TODO: Handle other menu actions
      console.log(`Selected key that wasn't module: ${key}`);
    }
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

  // Update menu items and save project when project changes
  React.useEffect(() => {
    if (props.project) {
      setMostRecentProject();
      setMenuItems(getMenuItems(t, props.project));
      setNoProjects(false);
    }
  }, [props.project]);

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
      <AboutDialog
        visible={aboutDialogVisible}
        onClose={() => setAboutDialogVisible(false)}
      />
      <ThemeModal
          open={themeModalOpen}
          onClose={() => setThemeModalOpen(false)}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
    </>
  );
}
