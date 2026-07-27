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
import * as storageModule from '../storage/module';
import * as storageProject from '../storage/project';
import * as I18Next from 'react-i18next';
import { MessageInstance } from 'antd/es/message/interface';
import {
  CloseOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddTabDialog from './AddTabDialog';
import HiddenTabsDialog, { getHiddenModules } from './HiddenTabsDialog';
import ClassNameComponent from './ClassNameComponent';
import CopyModuleDialog from './CopyModuleDialog';
import { TabType, TabTypeUtils } from '../types/TabType';
import { TabContent, TabContentRef } from './TabContent';

/** Props passed by Antd.Tabs's default tab bar to each rendered tab node. */
interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-node-key': string;
}

/** Wraps a single tab bar node so it can be dragged to reorder tabs. */
const DraggableTabNode: React.FC<DraggableTabPaneProps> = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props['data-node-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
  };

  return React.cloneElement(children as React.ReactElement<any>, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};

/** Represents a tab item in the tab bar. */
export interface TabItem {
  key: string;
  title: string;
  type: TabType;
}

/** Imperative methods exposed by Tabs component. */
export interface TabsRef {
  gotoTab: (tabKey: string) => void;
  closeTab: (tabKey: string) => void;
  saveCurrentTab: () => Promise<void>;
  getActiveTabKey: () => string;
}

/** Props for the Tabs component. */
export interface TabsProps {
  tabList: TabItem[];
  setTabList: (items: TabItem[]) => void;
  project: storageProject.Project | null;
  onProjectChanged: () => Promise<void>;
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  theme: string;
  renderer: string;
  showSimpleClassNames: boolean;
  shownPythonToolboxCategories: Set<string>;
  messageApi: MessageInstance;
  openGamepadConfigDialog?: () => void;
  switchToProjectAndSelectTab: (project: storageProject.Project, tabKey: string) => void;
}

/**
 * Tab component that manages project module tabs with add, edit, delete, and rename functionality.
 * Provides context menus for tab operations and modal dialogs for user input.
 */
export const Component = React.forwardRef<TabsRef, TabsProps>((props, ref): React.JSX.Element => {
  const { t } = I18Next.useTranslation();
  const [modal, contextHolder] = Antd.Modal.useModal();

  const [activeKey, setActiveKey] = React.useState(props.tabList.length > 0 ? props.tabList[0].key : '');
  const [addTabDialogOpen, setAddTabDialogOpen] = React.useState(false);
  const [hiddenTabsDialogOpen, setHiddenTabsDialogOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState<TabItem | null>(null);
  const [contextMenuTabKey, setContextMenuTabKey] = React.useState<string | null>(null);

  // Store refs to TabContent components for each tab
  const tabContentRefs = React.useRef<Map<string, TabContentRef>>(new Map());

  // Force the tab context menu closed on any outside click. Listens for 'pointerdown' rather
  // than 'mousedown': Blockly calls preventDefault() on its own pointerdown handling within the
  // workspace, which makes the browser suppress the compatibility 'mousedown' event entirely,
  // so a 'mousedown' listener never sees clicks that land on the Blockly canvas. 'pointerdown'
  // itself is never suppressed. Listening on window during the capture phase also ensures this
  // fires before any descendant's own handler, regardless of that handler's propagation calls.
  React.useEffect(() => {
    if (!contextMenuTabKey) {
      return;
    }
    const handleWindowPointerDown = (event: PointerEvent): void => {
      const target = event.target as HTMLElement;
      if (!target.closest('.ant-dropdown')) {
        setContextMenuTabKey(null);
      }
    };
    window.addEventListener('pointerdown', handleWindowPointerDown, true);
    return () => window.removeEventListener('pointerdown', handleWindowPointerDown, true);
  }, [contextMenuTabKey]);

  /** Handles tab change and updates current module. */
  const handleTabChange = async (key: string): Promise<void> => {
    if (key !== activeKey) {
      // Save the tab we're switching FROM to preserve any recent changes
      const oldTabRef = tabContentRefs.current.get(activeKey);
      if (oldTabRef) {
        try {
          await oldTabRef.saveModule();
        } catch(error) {
          console.error('Error saving old module on tab switch:', error);
          props.setAlertErrorMessage(t('FAILED_TO_SAVE_MODULE'));
        }
      }
      
      // Switch to the new tab
      setActiveKey(key);
      
      // Immediately save the new tab to ensure it's up to date and prevent unsaved indicator
      const newTabRef = tabContentRefs.current.get(key);
      if (newTabRef) {
        try {
          await newTabRef.saveModule();
        } catch(error) {
          console.error('Error saving new module on tab switch:', error);
          props.setAlertErrorMessage(t('FAILED_TO_SAVE_MODULE'));
        }
      }
    }
  };

  /** Goes to a specific tab, adding it if needed or updating if renamed. */
  const gotoTab = (tabKey: string): void => {
    // Check if tab already exists
    const existingTab = props.tabList.find(tab => tab.key === tabKey);
    if (existingTab) {
      // Tab exists, just activate it
      setActiveKey(tabKey);
      return;
    }

    if (!props.project) return;

    // Check if this is a renamed module - look for a tab whose module no longer exists
    const targetModule = storageProject.findModuleByModulePath(props.project, tabKey);
    if (targetModule) {
      // Look for a tab with the same type but whose path no longer exists (indicating a rename)
      const staleTab = props.tabList.find(tab => {
        const tabModule = storageProject.findModuleByModulePath(props.project!, tab.key);
        // If tab's module doesn't exist and it matches the target type
        return !tabModule && 
               ((tab.type === TabType.MECHANISM && targetModule.moduleType === storageModule.ModuleType.MECHANISM) ||
                (tab.type === TabType.OPMODE && targetModule.moduleType === storageModule.ModuleType.OPMODE));
      });

      if (staleTab) {
        // This is a rename - update the existing tab
        const updatedTabs = props.tabList.map(tab => 
          tab.key === staleTab.key 
            ? { ...tab, key: tabKey, title: targetModule.className }
            : tab
        );
        props.setTabList(updatedTabs);
        setActiveKey(tabKey);
        return;
      }

      // Not a rename - add new tab
      let newTab: TabItem;
      switch (targetModule.moduleType) {
        case storageModule.ModuleType.MECHANISM:
          newTab = { key: tabKey, title: targetModule.className, type: TabType.MECHANISM };
          break;
        case storageModule.ModuleType.OPMODE:
          newTab = { key: tabKey, title: targetModule.className, type: TabType.OPMODE };
          break;
        case storageModule.ModuleType.ROBOT:
          newTab = { key: tabKey, title: targetModule.className, type: TabType.ROBOT };
          break;
        default:
          return;
      }
      props.setTabList([...props.tabList, newTab]);
      setActiveKey(tabKey);
    }
  };

  /** Closes a specific tab. */
  const closeTabMethod = (tabKey: string): void => {
    const newTabs = props.tabList.filter((tab) => tab.key !== tabKey);
    props.setTabList(newTabs);
    // The useEffect will handle switching to another tab if needed
  };

  // Expose imperative methods via ref
  React.useImperativeHandle(ref, () => ({
    gotoTab,
    closeTab: closeTabMethod,
    saveCurrentTab: async () => {
      const currentTabRef = tabContentRefs.current.get(activeKey);
      if (currentTabRef) {
        await currentTabRef.saveModule();
      }
    },
    getActiveTabKey: () => activeKey,
  }));

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

  const dragSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  /** Handles reordering tabs after a drag-and-drop. */
  const handleTabDragEnd = ({ active, over }: DragEndEvent): void => {
    if (over && active.id !== over.id) {
      const oldIndex = props.tabList.findIndex((tab) => tab.key === active.id);
      const newIndex = props.tabList.findIndex((tab) => tab.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        props.setTabList(arrayMove(props.tabList, oldIndex, newIndex));
      }
    }
  };

  /** Handles successful addition of new tabs. */
  const handleAddTabOk = (newTab: TabItem): void => {
    props.setTabList([...props.tabList, newTab]);

    handleTabChange(newTab.key);
    setAddTabDialogOpen(false);
  };

  /** Handles reopening one or more hidden tabs. */
  const handleHiddenTabOk = (newTabs: TabItem[]): void => {
    if (newTabs.length === 0) {
      setHiddenTabsDialogOpen(false);
      return;
    }

    props.setTabList([...props.tabList, ...newTabs]);

    handleTabChange(newTabs[newTabs.length - 1].key);
    setHiddenTabsDialogOpen(false);
  };

  /** Handles renaming a module tab. */
  const handleRename = async (key: string, newClassName: string): Promise<void> => {
    if (!props.storage || !props.project) {
      return;
    }

    const oldModulePath = key;

    try {
      const newModulePath = await storageProject.renameModuleInProject(
        props.storage,
        props.project,
        newClassName,
        oldModulePath,
      );
      await props.onProjectChanged();

      const newTabs = props.tabList.map((tab) => {
        if (tab.key === key) {
          return { ...tab, title: newClassName, key: newModulePath };
        }
        return tab;
      });

      props.setTabList(newTabs);
      setActiveKey(newModulePath);
    } catch (error) {
      console.error('Error renaming module:', error);
      props.setAlertErrorMessage(t('FAILED_TO_RENAME_MODULE'));
    }

    setRenameModalOpen(false);
  };

  /** Handles a module tab having been copied within this project. */
  const handleCopiedWithinProject = async (newModulePath: string, newClassName: string): Promise<void> => {
    await props.onProjectChanged();

    if (!currentTab) {
      console.error('No current tab for copying');
      props.setAlertErrorMessage(t('MODULE_NOT_FOUND_FOR_COPYING'));
      setCopyModalOpen(false);
      return;
    }

    const newTabs = [...props.tabList, { key: newModulePath, title: newClassName, type: currentTab.type }];
    props.setTabList(newTabs);
    setActiveKey(newModulePath);
    setCopyModalOpen(false);
  };

  /** Handles a mechanism tab having been copied into another project. */
  const handleCopiedToOtherProject = (
      mechanism: storageModule.Mechanism, destProject: storageProject.Project): void => {
    setCopyModalOpen(false);
    props.messageApi.success(t('MECHANISM_COPIED_TO_PROJECT', {
      name: mechanism.className,
      projectName: destProject.projectName,
    }));
    props.switchToProjectAndSelectTab(destProject, mechanism.modulePath);
  };

  /** Handles closing other tabs except the current one. */
  const handleCloseOtherTabs = (currentTabKey: string): void => {
    const newTabs = props.tabList.filter((tab) => tab.key === currentTabKey);
    props.setTabList(newTabs);
    setActiveKey(currentTabKey);
  };

  /** Gets the count of other closeable tabs. */
  const getOtherCloseableTabsCount = (tab: TabItem): number => {
    return props.tabList.filter((t) => t.key !== tab.key).length;
  };

  /** Computes tab order: Robot first, then Mechanisms alphabetically, then OpModes alphabetically. */
  const getSortedTabs = (): TabItem[] => {
    const robotTabs = props.tabList.filter((tab) => tab.type === TabType.ROBOT);
    const mechanismTabs = props.tabList
      .filter((tab) => tab.type === TabType.MECHANISM)
      .sort((a, b) => a.title.localeCompare(b.title));
    const opModeTabs = props.tabList
      .filter((tab) => tab.type === TabType.OPMODE)
      .sort((a, b) => a.title.localeCompare(b.title));
    return [...robotTabs, ...mechanismTabs, ...opModeTabs];
  };

  /** Whether sorting the tabs would actually change their order. */
  const isTabOrderSorted = (): boolean => {
    const sortedTabs = getSortedTabs();
    return sortedTabs.every((tab, index) => tab.key === props.tabList[index].key);
  };

  /** Reorders all tabs: Robot first, then Mechanisms alphabetically, then OpModes alphabetically. */
  const handleSortTabs = (): void => {
    props.setTabList(getSortedTabs());
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
    const resolvedTab = props.tabList.find((t) => t.key === tab.key) || tab;
    setCurrentTab(resolvedTab);
    setCopyModalOpen(true);
  };

  /** Handles deleting a module tab with confirmation. */
  const handleDeleteTab = (tab: TabItem): void => {
    const currentTab = props.tabList.find((t) => t.key === tab.key);
    const titleToShow = currentTab ? currentTab.title : tab.title;

    modal.confirm({
      title: t('DELETE_MODULE_CONFIRM', { title: `${TabTypeUtils.toString(tab.type)}: ${titleToShow}` }),
      content: t('DELETE_CANNOT_BE_UNDONE'),
      okText: t('DELETE'),
      okType: 'danger',
      cancelText: t('CANCEL'),
      onOk: async (): Promise<void> => {
        const newTabs = props.tabList.filter((t) => t.key !== tab.key);
        props.setTabList(newTabs);

        if (props.storage && props.project) {
          await storageProject.removeModuleFromProject(props.storage, props.project, tab.key);
          await props.onProjectChanged();
        }

        if (newTabs.length > 0) {
          setActiveKey(newTabs[0].key);
        }
      },
    });
  };

  /** Creates context menu items for a tab. */
  const createTabContextMenuItems = (tab: TabItem): any[] => [
    {
      key: 'close',
      label: t('CLOSE_TAB'),
      onClick: () => handleTabEdit(tab.key, 'remove'),
      icon: <CloseOutlined />,
    },
    {
      key: 'close-others',
      label: t('CLOSE_OTHER_TABS'),
      onClick: () => handleCloseOtherTabs(tab.key),
      disabled: getOtherCloseableTabsCount(tab) === 0,
      icon: <CloseCircleOutlined />,
    },
    {
      key: 'sort',
      label: t('SORT_TABS'),
      icon: <SortAscendingOutlined />,
      disabled: isTabOrderSorted(),
      onClick: handleSortTabs,
    },
    {
      key: 'rename',
      label: t('RENAME_ELLIPSIS'),
      disabled: tab.type === TabType.ROBOT,
      onClick: () => handleOpenRenameModal(tab),
      icon: <EditOutlined />,
    },
    {
      key: 'delete',
      label: t('DELETE_ELLIPSIS'),
      disabled: tab.type === TabType.ROBOT,
      icon: <DeleteOutlined />,
      onClick: () => handleDeleteTab(tab),
    },
    {
      key: 'copy',
      label: t('COPY_ELLIPSIS'),
      disabled: tab.type === TabType.ROBOT,
      icon: <CopyOutlined />,
      onClick: () => handleOpenCopyModal(tab),
    },
  ];

  /** Creates tab items for the Antd.Tabs component (no content children — content is rendered separately). */
  const createTabItems = (): any[] => {
    return props.tabList.map((tab) => ({
      key: tab.key,
      label: (
        <Antd.Dropdown
          menu={{ items: createTabContextMenuItems(tab) }}
          trigger={['contextMenu']}
          open={contextMenuTabKey === tab.key}
          onOpenChange={(open) => setContextMenuTabKey(open ? tab.key : null)}
        >
          <span>{tab.title}</span>
        </Antd.Dropdown>
      ),
      icon: TabTypeUtils.getIcon(tab.type),
      closable: true,
      children: null,
    }));
  };

  const addIcon = (
    <Antd.Tooltip title={t('TOOLTIP_ADD_TAB')}>
      <PlusOutlined />
    </Antd.Tooltip>
  );

  // Effect to ensure activeKey is valid when tab list changes
  React.useEffect(() => {
    // Check if current activeKey is still in the tab list
    const isActiveKeyValid = props.tabList.some(tab => tab.key === activeKey);
    
    if (!isActiveKeyValid && props.tabList.length > 0) {
      // Active tab was removed, switch to first available tab
      const newActiveKey = props.tabList[0].key;
      setActiveKey(newActiveKey);
    } else if (props.tabList.length === 0) {
      setActiveKey('');
    } else if (activeKey === '' && props.tabList.length > 0) {
      // No active tab but tabs exist, activate the first tab
      setActiveKey(props.tabList[0].key);
    }
  }, [props.tabList, activeKey]);

  return (
    <>
      <style>{`
        .tabs-row .ant-tabs-content-holder {
          display: none;
        }

        .ant-tabs-content {
          height: 100%;
        }

        .ant-tabs-tabpane {
          height: 100%;
        }
      `}</style>
      {contextHolder}
      <AddTabDialog
        isOpen={addTabDialogOpen}
        onCancel={() => setAddTabDialogOpen(false)}
        onOk={handleAddTabOk}
        project={props.project}
        onProjectChanged={props.onProjectChanged}
        storage={props.storage}
      />

      <HiddenTabsDialog
        isOpen={hiddenTabsDialogOpen}
        onCancel={() => setHiddenTabsDialogOpen(false)}
        onOk={handleHiddenTabOk}
        project={props.project}
        currentTabs={props.tabList}
      />

      <Antd.Modal
        title={t('RENAME_TYPE_TITLE', { type: currentTab ? TabTypeUtils.toString(currentTab.type) : '', title: currentTab ? currentTab.title : '' })}
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onOk={() => {
          if (currentTab) {
            handleRename(currentTab.key, name);
          }
        }}
        okText={t('RENAME')}
        cancelText={t('CANCEL')}
      >
        {currentTab && (
          <ClassNameComponent
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

      <CopyModuleDialog
        isOpen={copyModalOpen}
        onCancel={() => setCopyModalOpen(false)}
        storage={props.storage}
        project={props.project}
        module={currentTab ? { path: currentTab.key, title: currentTab.title, type: currentTab.type } : null}
        onCopiedWithinProject={handleCopiedWithinProject}
        onCopiedToOtherProject={handleCopiedToOtherProject}
      />

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div data-tour="tab-row">
          <Antd.Tabs
            addIcon={addIcon}
            className="tabs-row"
            type="editable-card"
            onChange={handleTabChange}
            onEdit={handleTabEdit}
            activeKey={activeKey}
            tabBarStyle={{ padding: 0, margin: 0 }}
            hideAdd={false}
            items={createTabItems()}
            tabBarExtraContent={{
              left: (() => {
                const hiddenTabsDisabled = getHiddenModules(props.project, props.tabList).length === 0;
                return (
                  <Antd.Tooltip
                    title={hiddenTabsDisabled ? t('TOOLTIP_HIDDEN_DISABLED') : t('TOOLTIP_HIDDEN_ENABLED')}
                    mouseEnterDelay={0}
                  >
                    <span style={{ marginRight: '1em', display: 'inline-block' }}>
                      <Antd.Button
                        disabled={hiddenTabsDisabled}
                        onClick={() => setHiddenTabsDialogOpen(true)}
                      >
                        {t('HIDDEN')}
                      </Antd.Button>
                    </span>
                  </Antd.Tooltip>
                );
              })(),
            }}
            renderTabBar={(tabBarProps, DefaultTabBar) => (
              <DndContext sensors={[dragSensor]} onDragEnd={handleTabDragEnd}>
                <SortableContext
                  items={props.tabList.map((tab) => tab.key)}
                  strategy={horizontalListSortingStrategy}
                >
                  <DefaultTabBar {...tabBarProps}>
                    {(node) => (
                      <DraggableTabNode
                        {...(node as React.ReactElement<DraggableTabPaneProps>).props}
                        key={node.key}
                      >
                        {node}
                      </DraggableTabNode>
                    )}
                  </DefaultTabBar>
                </SortableContext>
              </DndContext>
            )}
          />
        </div>
        <div style={{ flex: '1 1 auto', overflow: 'hidden', position: 'relative' }}>
          {props.tabList.map((tab) => {
            const module = props.project
              ? storageProject.findModuleByModulePath(props.project, tab.key)
              : null;
            return (
              <div
                key={tab.key}
                style={{ display: activeKey === tab.key ? 'block' : 'none', height: '100%' }}
              >
                {module && props.project && props.storage ? (
                  <TabContent
                    ref={(ref) => {
                      if (ref) {
                        tabContentRefs.current.set(tab.key, ref);
                      } else {
                        tabContentRefs.current.delete(tab.key);
                      }
                    }}
                    modulePath={tab.key}
                    module={module}
                    project={props.project}
                    storage={props.storage}
                    theme={props.theme}
                    renderer={props.renderer}
                    showSimpleClassNames={props.showSimpleClassNames}
                    shownPythonToolboxCategories={props.shownPythonToolboxCategories}
                    messageApi={props.messageApi}
                    setAlertErrorMessage={props.setAlertErrorMessage}
                    isActive={activeKey === tab.key}
                    openGamepadConfigDialog={props.openGamepadConfigDialog}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
});