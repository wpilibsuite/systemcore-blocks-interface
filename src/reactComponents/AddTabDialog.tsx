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
import {TabItem} from './Tabs';
import {TabType, TabTypeUtils } from '../types/TabType';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageProject from '../storage/project';
import ClassNameComponent from './ClassNameComponent';

/** Represents a module item in the dialog. */
interface Module {
  path: string;
  title: string;
  type: TabType;
}

/** Props for the AddTabDialog component. */
interface AddTabDialogProps {
  isOpen: boolean;
  onOk: (newTab: TabItem) => void;
  onCancel: () => void;
  project: storageProject.Project | null;
  setProject: (project: storageProject.Project | null) => void;
  currentTabs: TabItem[];
  storage: commonStorage.Storage | null;
}

/** Height of the scrollable lists in pixels. */
const LIST_HEIGHT = 200;
const ITEM_HEIGHT = 45;
const EMPTY_HEIGHT = 60;

/**
 * Dialog component for adding new tabs to the workspace.
 * Allows users to create new modules or select from existing ones.
 */
export default function AddTabDialog(props: AddTabDialogProps) {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const [tabType, setTabType] = React.useState<TabType>(TabType.OPMODE);
  const [availableItems, setAvailableItems] = React.useState<Module[]>([]);
  const [newItemName, setNewItemName] = React.useState('');

  React.useEffect(() => {
    if (!props.project) {
      return;
    }

    // Get all modules of the selected type
    const mechanisms = props.project.mechanisms.map((m) => ({
      path: m.modulePath,
      title: m.className,
      type: TabType.MECHANISM,
    }));
    const opModes = props.project.opModes.map((o) => ({
      path: o.modulePath,
      title: o.className,
      type: TabType.OPMODE,
    }));

    // Filter by current tab type and exclude already open tabs
    const allItems = tabType === TabType.MECHANISM ? mechanisms : opModes;
    const notShownItems = allItems.filter((item) =>
      !props.currentTabs.some((tab) => tab.key === item.path)
    );

    setAvailableItems(notShownItems);
  }, [props.project, props.currentTabs, tabType]);

  /** Handles selecting an existing module. */
  const handleSelectModule = (item: Module): void => {
    const newTab: TabItem = {
      key: item.path,
      title: item.title,
      type: item.type,
    };
    props.onOk(newTab);
  };

  /** Handles creating a new module. */
  const handleCreateNewItem = async (): Promise<void> => {
    const newClassName = newItemName.trim();
    if (!newClassName || !props.storage || !props.project) {
      return;
    }

    const moduleType = (tabType === TabType.MECHANISM)
      ? storageModule.ModuleType.MECHANISM
      : storageModule.ModuleType.OPMODE;

    await storageProject.addModuleToProject(
        props.storage, props.project, moduleType, newClassName);

    const newModule = storageProject.findModuleByClassName(props.project, newClassName);
    if (newModule) {
      const newTab: TabItem = {
        key: newModule.modulePath,
        title: newModule.className,
        type: tabType,
      };
      setNewItemName('');
      props.onOk(newTab);
    }
  };

  /** Handles radio button change for tab type selection. */
  const handleTabTypeChange = (e: any): void => {
    if (e.target.value === 'opmode') {
      setTabType(TabType.OPMODE);
    } else if (e.target.value === 'mechanism') {
      setTabType(TabType.MECHANISM);
    }
  };

  const getListHeight = (): number => {
    return Math.max(EMPTY_HEIGHT, Math.min(LIST_HEIGHT, availableItems.length * ITEM_HEIGHT));
  }

  return (
    <Antd.Modal
      title={t('addTabDialog.title')}
      open={props.isOpen}
      onCancel={props.onCancel}
      footer={null}
    >
      <div style={{marginTop: 16}}>
        <Antd.Radio.Group
          defaultValue="opmode"
          buttonStyle="solid"
          style={{marginBottom: 16}}
          onChange={handleTabTypeChange}
        >
          <Antd.Radio.Button value="mechanism">
            {TabTypeUtils.getIcon(TabType.MECHANISM)} {t('MECHANISM')}
          </Antd.Radio.Button>
          <Antd.Radio.Button value="opmode">
            {TabTypeUtils.getIcon(TabType.OPMODE)} {t('OPMODE')}
          </Antd.Radio.Button>
        </Antd.Radio.Group>

        <h4 style={{margin: '0 0 8px 0'}}>
          {t('SELECT_HIDDEN')}
        </h4>
        <Antd.List
          size="small"
          bordered
          style={{height: getListHeight(), overflow: 'auto', marginBottom: 16}}
          dataSource={availableItems}
          renderItem={(item) => (
            <Antd.List.Item
              onClick={() => handleSelectModule(item)}
              style={{cursor: 'pointer'}}
            >
              <Antd.List.Item.Meta
                avatar={TabTypeUtils.getIcon(item.type)}
                title={
                  <span style={{fontSize: '14px'}}>
                    {item.title}
                  </span>
                }
              />
            </Antd.List.Item>
          )}
          locale={{emptyText: tabType === TabType.MECHANISM ? t('NO_HIDDEN_MECHANISMS') : t('NO_HIDDEN_OPMODES')}}
        />
        <h4 style={{margin: '0 0 8px 0'}}>
          {t('CREATE_NEW')}
        </h4>

        <div style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '6px',
          padding: '12px',
        }}>
          <ClassNameComponent
            tabType={tabType}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onAddNewItem={handleCreateNewItem}
            project={props.project}
            storage={props.storage}
            buttonLabel={t('CREATE')}
          />
        </div>
      </div>
    </Antd.Modal>
  );
}