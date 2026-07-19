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
import * as storageProject from '../storage/project';
import * as createPythonFiles from '../storage/create_python_files';
import * as serverSideStorage from '../storage/server_side_storage';
import * as I18Next from 'react-i18next';
import {TabType, TabTypeUtils } from '../types/TabType';

import {
  SettingOutlined,
  FileOutlined,
  FolderOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  BgColorsOutlined,
  BuildOutlined,
  GlobalOutlined,
  CheckOutlined,
  ControlOutlined,
  PlaySquareOutlined
} from '@ant-design/icons';
import FileManageModal from './FileManageModal';
import ProjectManageModal from './ProjectManageModal';
import AboutDialog from './AboutModal';
import ThemeModal from './ThemeModal';
import LanguageModal from './LanguageModal';
import RendererModal from './RendererModal';

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
  renderer: string;
  setRenderer: (renderer: string) => void;
  showSimpleClassNames: boolean;
  setShowSimpleClassNames: (show: boolean) => void;
  saveCurrentTab: () => Promise<void>;
  startTour?: () => void;
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
function getMenuItems(
    t: (key: string) => string,
    project: storageProject.Project,
    showSimpleClassNames: boolean): MenuItem[] {
  const mechanisms: MenuItem[] = [];
  const opmodes: MenuItem[] = [];

  // Build mechanisms menu items
  project.mechanisms.forEach((mechanism) => {
    mechanisms.push(getItem(
        mechanism.className,
        mechanism.modulePath,
        TabTypeUtils.getIcon(TabType.MECHANISM) // Use mechanism icon for mechanisms
    ));
  });

  // Build opmodes menu items
  project.opModes.forEach((opmode) => {
    opmodes.push(getItem(
        opmode.className,
        opmode.modulePath,
        TabTypeUtils.getIcon(TabType.OPMODE) // Use opmode icon for opmodes
    ));
  });

  return [
    getItem(t('DEPLOY'), 'deploy', <PlaySquareOutlined />),
    getItem(t('MANAGE'), 'manage', <ControlOutlined />, [
      getItem(t('PROJECTS') + '...', 'manageProjects', <FolderOutlined />),
      getItem(t('MECHANISMS') + '...', 'manageMechanisms', TabTypeUtils.getIcon(TabType.MECHANISM)),
      getItem(t('OPMODES') + '...', 'manageOpmodes', TabTypeUtils.getIcon(TabType.OPMODE)),
    ]),
    getItem(t('EXPLORER'), 'explorer', <FileOutlined />, [
      getItem(t('ROBOT'), project.robot.modulePath, TabTypeUtils.getIcon(TabType.ROBOT)),
      ...(mechanisms.length > 0 ? [getItem(t('MECHANISMS'), 'mechanisms', TabTypeUtils.getIcon(TabType.MECHANISM), mechanisms)] : []),
      ...(opmodes.length > 0 ? [getItem(t('OPMODES'), 'opmodes', TabTypeUtils.getIcon(TabType.OPMODE), opmodes)] : []),
    ]),
    getItem(t('SETTINGS'), 'settings', <SettingOutlined />, [
      getItem(t('WPI_TOOLBOX'), 'wpi_toolbox'),
        getItem(
          t('SHOW_SIMPLE_CLASS_NAMES'),
          'toggle_show_simple_classNames',
          showSimpleClassNames ? <CheckOutlined /> : undefined
        ),
      getItem(t('THEME') + '...', 'theme', <BgColorsOutlined />),
      getItem(t('STYLE') + '...', 'renderer', <BuildOutlined />),
      getItem(t('LANGUAGE') + '...', 'language', <GlobalOutlined />),
    ]),
    getItem(t('HELP'), 'help', <QuestionCircleOutlined />, [
      getItem(t('TOUR.MENU_ITEM') + '...', 'tour', <QuestionCircleOutlined />),
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
  const [, contextHolder] = Antd.Modal.useModal();

  const [projectNames, setProjectNames] = React.useState<string[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [fileModalOpen, setFileModalOpen] = React.useState<boolean>(false);
  const [projectModalOpen, setProjectModalOpen] = React.useState<boolean>(false);
  const [tabType, setTabType] = React.useState<TabType>(TabType.MECHANISM);
  const [noProjects, setNoProjects] = React.useState<boolean>(false);
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState<boolean>(false);
  const [themeModalOpen, setThemeModalOpen] = React.useState<boolean>(false);
  const [rendererModalOpen, setRendererModalOpen] = React.useState<boolean>(false);
  const [languageModalOpen, setLanguageModalOpen] = React.useState<boolean>(false);
  const [deployModalOpen, setDeployModalOpen] = React.useState<boolean>(false);
  const [deployElapsed, setDeployElapsed] = React.useState<number>(0);
  const [deployStatus, setDeployStatus] = React.useState<'deploying' | 'success' | 'error'>('deploying');
  const [deployError, setDeployError] = React.useState<string>('');
  const deployIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const handleThemeChange = (newTheme: string) => {
    props.setTheme(newTheme);
  };

  const handleRendererChange = (newRenderer: string) => {
    props.setRenderer(newRenderer);
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
      if (!props.storage) {
        return;
      }
      const defaultProjectName = 'MyRobot';
      await storageProject.createProject(props.storage, defaultProjectName);
      const updatedArray = await fetchListOfProjectNames();
      if (updatedArray.length === 0) {
        setNoProjects(true);
        setProjectModalOpen(true);
      }
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
      props.saveCurrentTab();
      setProjectModalOpen(true);
    } else if (key === 'about') {
      setAboutDialogVisible(true);
    } else if (key === 'tour') {
      props.startTour?.();
    } else if (key === 'wpi_toolbox'){
      props.openWPIToolboxSettings();
    } else if (key === 'toggle_show_simple_classNames'){
      props.setShowSimpleClassNames(!props.showSimpleClassNames)
    } else if (key === 'theme') {
      setThemeModalOpen(true);
    } else if (key === 'renderer') {
      setRendererModalOpen(true);
    } else if (key === 'language') {
      setLanguageModalOpen(true);
    } else if (key == 'deploy') {
      handleDeploy();
    } else {
      // TODO: Handle other menu actions

      console.log(`Selected key that wasn't module: ${key}`);
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

    setDeployElapsed(0);
    setDeployStatus('deploying');
    setDeployError('');
    setDeployModalOpen(true);

    deployIntervalRef.current = setInterval(() => {
      setDeployElapsed((prev) => prev + 1);
    }, 1000);

    const stopTimer = () => {
      if (deployIntervalRef.current !== null) {
        clearInterval(deployIntervalRef.current);
        deployIntervalRef.current = null;
      }
    };

    try {
      await props.saveCurrentTab();

      const blobUrl = await createPythonFiles.producePythonProjectBlob(props.currentProject, props.storage);

      const serverAvailable = await serverSideStorage.isServerAvailable();

      if (serverAvailable) {
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

        await deployResponse.json();
        URL.revokeObjectURL(blobUrl);

        stopTimer();
        setDeployStatus('success');
        setTimeout(() => setDeployModalOpen(false), 2000);
      } else {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${props.currentProject.projectName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        stopTimer();
        setDeployModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to deploy project:', error);
      stopTimer();
      setDeployStatus('error');
      setDeployError(t('DEPLOY_FAILED'));
    }
  };

  /** Handles closing the file management modal. */
  const handleFileModalClose = (): void => {
    setFileModalOpen(false);
  };

  /** Handles closing the project management modal. */
  const handleProjectModalClose = (): void => {
    setProjectModalOpen(false);
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

  // Update menu items and save project when project, language, or showSimpleClassNames changes
  React.useEffect(() => {
    if (props.currentProject) {
      setMostRecentProjectName();
      setMenuItems(getMenuItems(t, props.currentProject, props.showSimpleClassNames));
      setNoProjects(false);
    }
  }, [props.currentProject, i18n.language, props.showSimpleClassNames]);

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
      <RendererModal
          open={rendererModalOpen}
          onClose={() => setRendererModalOpen(false)}
          currentRenderer={props.renderer}
          currentTheme={props.theme}
          onRendererChange={handleRendererChange}
        />
      <LanguageModal
          open={languageModalOpen}
          onClose={() => setLanguageModalOpen(false)}
        />
      <Antd.Modal
        open={deployModalOpen}
        closable={deployStatus === 'error'}
        onCancel={() => setDeployModalOpen(false)}
        footer={deployStatus === 'error' ? (
          <Antd.Button onClick={() => setDeployModalOpen(false)}>
            {t('OK')}
          </Antd.Button>
        ) : null}
        title={t('DEPLOY')}
        mask={{ closable: false }}
      >
        <div style={{textAlign: 'center', padding: '16px 0'}}>
          {deployStatus === 'deploying' && (
            <>
              <Antd.Spin size="large" />
              <div style={{marginTop: 16, fontSize: 16}}>
                {t('DEPLOY_IN_PROGRESS')}
              </div>
              <div style={{marginTop: 8, color: '#888'}}>
                {t('DEPLOY_ELAPSED', {seconds: deployElapsed})}
              </div>
            </>
          )}
          {deployStatus === 'success' && (
            <div style={{fontSize: 16, color: '#52c41a'}}>
              {t('DEPLOY_SUCCESS')}
            </div>
          )}
          {deployStatus === 'error' && (
            <div style={{fontSize: 16, color: '#ff4d4f'}}>
              {deployError}
            </div>
          )}
        </div>
      </Antd.Modal>
    </>
  );
}
