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
import * as commonStorage from '../storage/common_storage';
import * as I18Next from 'react-i18next';
import {
  RobotOutlined,
  CodeOutlined,
  BlockOutlined,
  CloseOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import AddTabDialog from './AddTabDialog';
import ModuleNameComponent from './ModuleNameComponent';
import { TabType, TabTypeUtils } from '../types/TabType';

/** Represents a tab item in the tab bar. */
export interface TabItem {
  key: string;
  title: string;
  type: TabType;
}

/** Props for the Tabs component. */
export interface TabsProps {
  tabList: TabItem[];
  setTabList: (items: TabItem[]) => void;
  activeTab: string;
  project: commonStorage.Project | null;
  setProject: (project: commonStorage.Project | null) => void;
  setAlertErrorMessage: (message: string) => void;
  currentModule: commonStorage.Module | null;
  setCurrentModule: (module: commonStorage.Module | null) => void;
  storage: commonStorage.Storage | null;
}

/** Default copy suffix for tab names. */
const COPY_SUFFIX = 'Copy';

/** Minimum number of tabs required to show close others option. */
const MIN_TABS_FOR_CLOSE_OTHERS = 2;

/**
 * Tab component that manages project module tabs with add, edit, delete, and rename functionality.
 * Provides context menus for tab operations and modal dialogs for user input.
 */
export function Component(props: TabsProps): React.JSX.Element {
  const { t } = I18Next.useTranslation();
  const [modal, contextHolder] = Antd.Modal.useModal();

  const [activeKey, setActiveKey] = React.useState(props.activeTab);
  const [addTabDialogOpen, setAddTabDialogOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState<TabItem | null>(null);

  const triggerProjectUpdate = (): void => {
    props.setProject(structuredClone(props.project));
  }

  /** Handles tab change and updates current module. */
  const handleTabChange = (key: string): void => {
    if (props.project) {
      props.setCurrentModule(commonStorage.findModuleByModulePath(props.project, key));
      setActiveKey(key);
    }
  };

  /** Checks if a key exists in the current tab list. */
  const isTabOpen = (key: string): boolean => {
    return props.tabList.some((tab) => tab.key === key);
  };

  /** Adds a new tab for the given module key. */
  const addTab = (key: string): void => {
    const newTabs = [...props.tabList];
    if (!props.project) {
      return;
    }

    const module = commonStorage.findModuleByModulePath(props.project, key);
    if (!module) {
      return;
    }

    switch (module.moduleType) {
      case commonStorage.MODULE_TYPE_MECHANISM:
        newTabs.push({ key, title: module.className, type: TabType.MECHANISM });
        break;
      case commonStorage.MODULE_TYPE_OPMODE:
        newTabs.push({ key, title: module.className, type: TabType.OPMODE });
        break;
      default:
        console.warn('Unknown module type:', module.moduleType);
        break;
    }

    props.setTabList(newTabs);
  };

  /** Handles tab edit actions (add/remove). */
  const handleTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ): void => {
    const items = props.tabList;
    if (action === 'add') {
      setAddTabDialogOpen(true);
    } else if (action === 'remove') {
      if (!items) {
        return;
      }

      const targetIndex = items.findIndex((item) => item.key === targetKey);
      const newItems = items.filter((item) => item.key !== targetKey);

      if (newItems.length && targetKey === activeKey) {
        const newActiveKey =
          newItems[targetIndex === newItems.length ? targetIndex - 1 : targetIndex].key;
        setActiveKey(newActiveKey);
      }

      props.setTabList(newItems);
    }
  };

  /** Handles successful addition of new tabs. */
  const handleAddTabOk = (newTabs: TabItem[]): void => {
    props.setTabList([props.tabList[0], ...newTabs]);

    setActiveKey(props.tabList[0].key);
    setAddTabDialogOpen(false);
  };

  /** Handles renaming a module tab. */
  const handleRename = async (key: string, newName: string): Promise<void> => {
    if (!props.storage || !props.project) {
      return;
    }

    try {
      const newPath = await commonStorage.renameModuleInProject(
        props.storage,
        props.project,
        newName,
        key
      );

      const newTabs = props.tabList.map((tab) => {
        if (tab.key === key) {
          return { ...tab, title: newName, key: newPath };
        }
        return tab;
      });

      props.setTabList(newTabs);
      setActiveKey(newPath);
      triggerProjectUpdate();
    } catch (error) {
      console.error('Error renaming module:', error);
      props.setAlertErrorMessage('Failed to rename module');
    }

    setRenameModalOpen(false);
  };

  /** Handles copying a module tab. */
  const handleCopy = async (key: string, newName: string): Promise<void> => {
    if (!props.storage || !props.project) {
      return;
    }

    try {
      const newPath = await commonStorage.copyModuleInProject(
        props.storage,
        props.project,
        newName,
        key
      );

      const newTabs = [...props.tabList];
      const originalTab = props.tabList.find((tab) => tab.key === key);

      if (!originalTab) {
        console.error('Original tab not found for copying:', key);
        props.setAlertErrorMessage('Original tab not found for copying');
        return;
      }

      newTabs.push({ key: newPath, title: newName, type: originalTab.type });
      props.setTabList(newTabs);
      setActiveKey(newPath);
      triggerProjectUpdate();
    } catch (error) {
      console.error('Error copying module:', error);
      props.setAlertErrorMessage('Failed to copy module');
    }

    setCopyModalOpen(false);
  };

  /** Handles closing other tabs except the current one. */
  const handleCloseOtherTabs = (currentTabKey: string): void => {
    const newTabs = props.tabList.filter(
      (tab) => tab.key === currentTabKey || tab.type === TabType.ROBOT
    );
    props.setTabList(newTabs);
    setActiveKey(currentTabKey);
  };

  /** Handles opening the rename modal. */
  const handleOpenRenameModal = (tab: TabItem): void => {
    const currentTab = props.tabList.find((t) => t.key === tab.key);
    setName(currentTab ? currentTab.title : tab.title);
    setCurrentTab(currentTab || tab);
    setRenameModalOpen(true);
  };

  /** Handles opening the copy modal. */
  const handleOpenCopyModal = (tab: TabItem): void => {
    const currentTab = props.tabList.find((t) => t.key === tab.key);
    setName((currentTab ? currentTab.title : tab.title) + COPY_SUFFIX);
    setCurrentTab(currentTab || tab);
    setCopyModalOpen(true);
  };

  /** Handles deleting a module tab with confirmation. */
  const handleDeleteTab = (tab: TabItem): void => {
    const currentTab = props.tabList.find((t) => t.key === tab.key);
    const titleToShow = currentTab ? currentTab.title : tab.title;

    modal.confirm({
      title: `${t('Delete')} ${TabTypeUtils.toString(tab.type)}: ${titleToShow}`,
      content: t('Are you sure you want to delete this? This action cannot be undone.'),
      okText: t('Delete'),
      okType: 'danger',
      cancelText: t('Cancel'),
      onOk: async (): Promise<void> => {
        const newTabs = props.tabList.filter((t) => t.key !== tab.key);
        props.setTabList(newTabs);

        if (props.storage && props.project) {
          await commonStorage.removeModuleFromProject(props.storage, props.project, tab.key);
          triggerProjectUpdate();
        }

        if (newTabs.length > 0) {
          setActiveKey(newTabs[0].key);
        }
      },
    });
  };

  /** Gets the minimum tabs count for close others functionality. */
  const getMinTabsForCloseOthers = (tabType: TabType): number => {
    return tabType === TabType.ROBOT ? 1 : MIN_TABS_FOR_CLOSE_OTHERS;
  };

  /** Creates context menu items for a tab. */
  const createTabContextMenuItems = (tab: TabItem): any[] => [
    {
      key: 'close',
      label: t('Close Tab'),
      onClick: () => handleTabEdit(tab.key, 'remove'),
      disabled: tab.type === TabType.ROBOT,
      icon: <CloseOutlined />,
    },
    {
      key: 'close-others',
      label: t('Close Other tabs'),
      onClick: () => handleCloseOtherTabs(tab.key),
      disabled: props.tabList.length <= getMinTabsForCloseOthers(tab.type),
      icon: <CloseCircleOutlined />,
    },
    {
      key: 'rename',
      label: t('Rename...'),
      disabled: tab.type === TabType.ROBOT,
      onClick: () => handleOpenRenameModal(tab),
      icon: <EditOutlined />,
    },
    {
      key: 'delete',
      label: t('Delete...'),
      disabled: tab.type === TabType.ROBOT,
      icon: <DeleteOutlined />,
      onClick: () => handleDeleteTab(tab),
    },
    {
      key: 'copy',
      label: t('Copy...'),
      disabled: tab.type === TabType.ROBOT,
      icon: <CopyOutlined />,
      onClick: () => handleOpenCopyModal(tab),
    },
  ];

  /** Creates tab items for the Antd.Tabs component. */
  const createTabItems = (): any[] => {
    return props.tabList.map((tab) => ({
      key: tab.key,
      label: (
        <Antd.Dropdown
          menu={{ items: createTabContextMenuItems(tab) }}
          trigger={['contextMenu']}
        >
          <span>{tab.title}</span>
        </Antd.Dropdown>
      ),
      icon: TabTypeUtils.getIcon(tab.type),
      closable: tab.type !== TabType.ROBOT,
    }));
  };

  // Effect to handle active tab changes
  React.useEffect(() => {
    if (activeKey !== props.activeTab) {
      if (!isTabOpen(props.activeTab)) {
        addTab(props.activeTab);
      }
      handleTabChange(props.activeTab);
    }
  }, [props.activeTab]);

  return (
    <>
      {contextHolder}
      <AddTabDialog
        isOpen={addTabDialogOpen}
        onCancel={() => setAddTabDialogOpen(false)}
        onOk={handleAddTabOk}
        project={props.project}
        setProject={props.setProject}
        currentTabs={props.tabList}
        storage={props.storage}
      />

      <Antd.Modal
        title={`Rename ${currentTab ? TabTypeUtils.toString(currentTab.type) : ''}: ${currentTab ? currentTab.title : ''
          }`}
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onOk={() => {
          if (currentTab) {
            handleRename(currentTab.key, name);
          }
        }}
        okText={t('Rename')}
        cancelText={t('Cancel')}
      >
        {currentTab && (
          <ModuleNameComponent
            tabType={currentTab.type}
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentTab) {
                handleRename(currentTab.key, name);
              }
            }}
            project={props.project}
            storage={props.storage}
            buttonLabel=""
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={`Copy ${currentTab ? TabTypeUtils.toString(currentTab.type) : ''}: ${currentTab ? currentTab.title : ''
          }`}
        open={copyModalOpen}
        onCancel={() => setCopyModalOpen(false)}
        onOk={() => {
          if (currentTab) {
            handleCopy(currentTab.key, name);
          }
        }}
        okText={t('Copy')}
        cancelText={t('Cancel')}
      >
        {currentTab && (
          <ModuleNameComponent
            tabType={currentTab.type}
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentTab) {
                handleCopy(currentTab.key, name);
              }
            }}
            project={props.project}
            storage={props.storage}
            buttonLabel=""
          />
        )}
      </Antd.Modal>

      <Antd.Tabs
        type="editable-card"
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        activeKey={activeKey}
        tabBarStyle={{ padding: 0, margin: 0 }}
        hideAdd={false}
        items={createTabItems()}
      />
    </>
  );
}