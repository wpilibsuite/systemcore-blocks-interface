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
  InfoCircleOutlined
} from '@ant-design/icons';
import FileManageModal from './FileManageModal';
import RobotManageModal from './RobotManageModal';
import AboutDialog from './AboutModal';

/** Type definition for menu items. */
type MenuItem = Required<Antd.MenuProps>['items'][number];

/** Props for the Menu component. */
export interface MenuProps {
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  gotoTab: (tabKey: string) => void;
  robot: commonStorage.Robot | null;
  openWPIToolboxSettings: () => void;
  setRobot: (robot: commonStorage.Robot | null) => void;
}

/** Default selected menu keys. */
const DEFAULT_SELECTED_KEYS = ['1'];

/** Storage key for the most recent robot. */
const MOST_RECENT_ROBOT_KEY = 'mostRecentRobot';

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
 * Generates menu items for a given robot.
 */
function getMenuItems(t: (key: string) => string, robot: commonStorage.Robot): MenuItem[] {
  const mechanisms: MenuItem[] = [];
  const opmodes: MenuItem[] = [];

  // Build mechanisms menu items
  robot.mechanisms.forEach((mechanism) => {
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
  robot.opModes.forEach((opmode) => {
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
    getItem(t('Robot'), 'robot', <FolderOutlined />, [
      getItem(t('Save'), 'save', <SaveOutlined />),
      getItem(t('Deploy'), 'deploy', undefined, undefined, true),
      getDivider(),
      getItem(t('Manage') + '...', 'manageRobots'),
    ]),
    getItem(t('Explorer'), 'explorer', <FileOutlined />, [
      getItem(t('Robot'), robot.modulePath, <RobotOutlined />),
      getItem(t('Mechanisms'), 'mechanisms', <BlockOutlined />, mechanisms),
      getItem(t('OpModes'), 'opmodes', <CodeOutlined />, opmodes),
    ]),
    getItem(t('Settings'), 'settings', <SettingOutlined />, [
      getItem(t('WPI toolbox'), 'wpi_toolbox'),
      getItem(t('Theme') + '...', 'theme')
    ]),
    getItem(t('Help'), 'help', <QuestionCircleOutlined />, [
      getItem(t('About') + '...', 'about', <InfoCircleOutlined />
),
    ]),
  ];
}

/**
 * Menu component that displays the robot structure and navigation options.
 * Provides access to mechanisms, opmodes, and robot management functionality.
 */
export function Component(props: MenuProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();

  const [modules, setModules] = React.useState<commonStorage.Robot[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [fileModalOpen, setFileModalOpen] = React.useState<boolean>(false);
  const [robotModalOpen, setRobotModalOpen] = React.useState<boolean>(false);
  const [moduleType, setModuleType] = React.useState<TabType>(TabType.MECHANISM);
  const [noRobots, setNoRobots] = React.useState<boolean>(false);
  const [aboutDialogVisible, setAboutDialogVisible] = React.useState<boolean>(false);

  /** Fetches the list of modules from storage. */
  const fetchListOfModules = async (): Promise<commonStorage.Robot[]> => {
    return new Promise(async (resolve, reject) => {
      if (!props.storage) {
        reject(new Error('Storage not available'));
        return;
      }
      try {
        const array = await props.storage.listModules();
        setModules(array);
        resolve(array);
      } catch (e) {
        console.error('Failed to load the list of modules:', e);
        props.setAlertErrorMessage(t('fail_list_modules'));
        reject(new Error(t('fail_list_modules')));
      }
    });
  };

  /** Initializes the modules and handles empty robot state. */
  const initializeModules = async (): Promise<void> => {
    const array = await fetchListOfModules();
    if (array.length === 0) {
      setNoRobots(true);
      setRobotModalOpen(true);
    }
  };

  /** Fetches and sets the most recent robot. */
  const fetchMostRecentRobot = async (): Promise<void> => {
    let found = false;

    if (props.storage) {
      const mostRecentRobot = await props.storage.fetchEntry(
          MOST_RECENT_ROBOT_KEY,
          ''
      );
      modules.forEach((module) => {
        if (module.robotName === mostRecentRobot) {
          props.setRobot(module);
          found = true;
        }
      });
      if (!found && modules.length > 0) {
        props.setRobot(modules[0]);
      }
    }
  };

  /** Saves the most recent robot to storage. */
  const setMostRecentRobot = async (): Promise<void> => {
    if (props.storage) {
      await props.storage.saveEntry(
          MOST_RECENT_ROBOT_KEY,
          props.robot?.robotName || ''
      );
    }
  };

  /** Handles menu item clicks. */
  const handleClick: Antd.MenuProps['onClick'] = ({key}): void => {
    const newModule = props.robot ?
      commonStorage.findModuleInRobot(props.robot, key) :
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
    } else if (key === 'manageRobots') {
      console.log('Opening robots modal');
      setRobotModalOpen(true);
    } else if (key === 'about') {
      setAboutDialogVisible(true);
    } else if (key === 'wpi_toolbox'){
      props.openWPIToolboxSettings();
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

  /** Handles closing the robot management modal. */
  const handleRobotModalClose = (): void => {
    setRobotModalOpen(false);
  };

  // Initialize modules when storage is available
  React.useEffect(() => {
    if (!props.storage) {
      return;
    }
    initializeModules();
  }, [props.storage]);

  // Fetch most recent robot when modules change
  React.useEffect(() => {
    fetchMostRecentRobot();
  }, [modules]);

  // Update menu items and save robot when robot changes
  React.useEffect(() => {
    if (props.robot) {
      setMostRecentRobot();
      setMenuItems(getMenuItems(t, props.robot));
      setNoRobots(false);
    }
  }, [props.robot]);

  return (
    <>
      <FileManageModal
        isOpen={fileModalOpen}
        onCancel={handleFileModalClose}
        robot={props.robot}
        storage={props.storage}
        moduleType={moduleType}
        setRobot={props.setRobot}
        setAlertErrorMessage={props.setAlertErrorMessage}
        gotoTab={props.gotoTab}
      />
      <RobotManageModal
        noRobots={noRobots}
        isOpen={robotModalOpen}
        onCancel={handleRobotModalClose}
        storage={props.storage}
        moduleType={moduleType}
        setRobot={props.setRobot}
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
    </>
  );
}
