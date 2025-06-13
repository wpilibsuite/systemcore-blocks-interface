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
import React from 'react';
import * as Antd from 'antd';
import * as commonStorage from '../storage/common_storage';
import * as I18Next from "react-i18next";
import { Dropdown } from 'antd';

import {
  RobotOutlined,
  CodeOutlined,
  BlockOutlined,
  CloseOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import AddTabDialog from './AddTabDialog';

export enum TabType {
  ROBOT,
  MECHANISM,
  OPMODE
}

export namespace TabTypeUtils {
  export function toString(type: TabType): string {
    switch (type) {
      case TabType.ROBOT: return "Robot";
      case TabType.MECHANISM: return "Mechanism"; 
      case TabType.OPMODE: return "OpMode";
      default: return "";
    }
  }
  export function getIcon(type: TabType) {
    switch (type) {
      case TabType.ROBOT:
        return (<RobotOutlined />);
      case TabType.MECHANISM:
        return (<BlockOutlined />);
      case TabType.OPMODE:
        return (<CodeOutlined />);
      default:
        return (<></>);
    }
  }
}

export interface TabItem {
  key: string;
  title: string;
  type: TabType;
}

export interface TabsProps {
  tabList: TabItem[];
  setTabList: (items: TabItem[]) => void;
  activeTab: string;
  project: commonStorage.Project | null;
  setProject: (project: commonStorage.Project | null) => void;
  setAlertErrorMessage: (message: string) => void;
  currentModule: commonStorage.Module | null;
  setCurrentModule: (module: commonStorage.Module | null) => void;
  storage : commonStorage.Storage | null;
}

export function Component(props: TabsProps) {
  const { t } = I18Next.useTranslation();
  const [modal, contextHolder] = Antd.Modal.useModal();

  const [activeKey, setActiveKey] = React.useState(props.activeTab);
  const [addTabDialogOpen, setAddTabDialogOpen] = React.useState(false);

  const onChange = (key: string) => {
    if (props.project) {
      props.setCurrentModule(commonStorage.findModuleInProject(props.project, key));
      setActiveKey(key);
    }
  }
  const inTabs = (key: string): boolean => {
    return props.tabList.some((tab) => tab.key === key);
  }

  const addTab = (key: string) => {
    const newTabs = [...props.tabList];
    if (props.project) {
      const module = commonStorage.findModuleInProject(props.project, key);
      if (module) {
        switch (module.moduleType) {
          case commonStorage.MODULE_TYPE_MECHANISM:
            newTabs.push({ key: key, title: module.className, type: TabType.MECHANISM });
            break;
          case commonStorage.MODULE_TYPE_OPMODE:
            newTabs.push({ key: key, title: module.className, type: TabType.OPMODE });
            break;
          default:
            console.log("Unknown module type", module.moduleType);
            break;
        }
      }
      props.setTabList(newTabs);
    }
  };

  React.useEffect(() => {
    if (activeKey != props.activeTab) {
      if (!inTabs(props.activeTab)) {
        addTab(props.activeTab);
      }
      onChange(props.activeTab);
    }
  }, [props.activeTab]);

  const onEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    const items = props.tabList;
    if (action === 'add') {
      setAddTabDialogOpen(true);
    } else if (action === 'remove') {
      if (!items) return;
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

  const handleAddTabOk = (newTabs : TabItem[]) => {
    props.setTabList([props.tabList[0], ...newTabs]);
    setActiveKey(props.tabList[0].key);
    setAddTabDialogOpen(false);
  };

  const handleOk = (key: string) => {
    const input = document.querySelector('input') as HTMLInputElement;
    if (input && input.value.trim()) {
      const newTabs = props.tabList.map(t => {
        if (t.key === key) {
          return { ...t, title: input.value.trim() };
        }
        return t;
      });
      props.setTabList(newTabs);
    }
    Antd.Modal.destroyAll();
  };

  return (
    <>
      {contextHolder}
      <AddTabDialog
        isOpen={addTabDialogOpen}
        onCancel={() => setAddTabDialogOpen(false)}
        onOk={handleAddTabOk}
        project={props.project}
        currentTabs={props.tabList}
        storage={props.storage}
      />
      <Antd.Tabs
        type="editable-card"
        onChange={onChange}
        onEdit={onEdit}
        activeKey={activeKey}
        tabBarStyle={{ padding: 0, margin: 0 }}
        hideAdd={false}
        items={props.tabList.map((tab) => {
          return {
            key: tab.key,
            label: (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'close',
                      label: t("Close Tab"),
                      onClick: () => {
                        onEdit(tab.key, 'remove');
                      },
                      disabled: tab.type === TabType.ROBOT,
                      icon: <CloseOutlined />
                    },
                    {
                      key: 'close-others',
                      label: t("Close Other tabs"),
                      onClick: () => {
                        const newTabs = props.tabList.filter(t => (t.key === tab.key) || (t.type === TabType.ROBOT));
                        props.setTabList(newTabs);
                        setActiveKey(tab.key);
                      },
                      disabled: props.tabList.length <= ((tab.type === TabType.ROBOT) ? 1 : 2),
                      icon: <CloseCircleOutlined />
                    },
                    {
                      key: 'rename',
                      label: t("Rename..."),
                      disabled: tab.type === TabType.ROBOT,
                      onClick: () => {
                        modal.confirm({
                          title: 'Rename ' + TabTypeUtils.toString(tab.type) + ': ' + tab.title,
                          content: (
                            <Antd.Input
                              autoFocus
                              defaultValue={tab.title}
                              onPressEnter={e => { handleOk(tab.key) }}
                            />
                          ),
                          icon: null,
                          onOk: () => { handleOk(tab.key) }
                        });
                      },
                      icon: <EditOutlined />
                    },
                    {
                      key: 'delete',
                      label: t("Delete..."),
                      disabled: tab.type === TabType.ROBOT,
                      icon: <DeleteOutlined />,
                      onClick: () => {
                        modal.confirm({
                          title: `${t("Delete")} ${TabTypeUtils.toString(tab.type)}: ${tab.title}`,
                          content: t("Are you sure you want to delete this? This action cannot be undone."),
                          okText: t("Delete"),
                          okType: 'danger',
                          cancelText: t("Cancel"),
                          onOk: async () => {
                            const newTabs = props.tabList.filter(t => t.key !== tab.key);
                            props.setTabList(newTabs);
                            if(props.storage && props.project) {
                              commonStorage.removeModuleFromProject(props.storage, props.project, tab.key);                              
                            }
                            setActiveKey(props.tabList[0].key);
                          },
                        });
                      }
                    },
                    {
                      key: 'copy',
                      label: t('Copy...'),
                      disabled: tab.type === TabType.ROBOT,
                      icon: <CopyOutlined />
                    },

                  ],
                }}
                trigger={['contextMenu']}
              >
                <span>
                  {tab.title}
                </span>
              </Dropdown >
            ),
            icon: TabTypeUtils.getIcon(tab.type),
            closable: (tab.type == TabType.ROBOT) ? false : true,
          }
        })}
      />
    </>
  );
};