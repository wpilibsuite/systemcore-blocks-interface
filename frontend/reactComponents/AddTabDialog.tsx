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
import { Editor } from '../editor/editor';
import ClassNameComponent from './ClassNameComponent';
import ImportMechanismDialog from './ImportMechanismDialog';

/** Props for the AddTabDialog component. */
interface AddTabDialogProps {
  isOpen: boolean;
  onOk: (newTab: TabItem) => void;
  onCancel: () => void;
  project: storageProject.Project | null;
  onProjectChanged: () => Promise<void>;
  storage: commonStorage.Storage | null;
}

/**
 * Dialog component for adding new tabs to the workspace by creating new modules.
 */
export default function AddTabDialog(props: AddTabDialogProps) {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const [tabType, setTabType] = React.useState<TabType>(TabType.OPMODE);
  const [newItemName, setNewItemName] = React.useState('');
  const [copyFromProjectDialogOpen, setCopyFromProjectDialogOpen] = React.useState(false);
  const inputRef = React.useRef<Antd.InputRef>(null);

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
        props.storage, props.project, moduleType, newClassName,
        moduleType === storageModule.ModuleType.MECHANISM
          ? (mech) => {
              Editor.getEditorForModulePath(props.project!.robot.modulePath)
                ?.incorporateNewMechanism(mech);
            }
          : undefined);
    await props.onProjectChanged();

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

  /** Handles a mechanism having been copied in from another project. */
  const handleMechanismCopied = async (mechanism: storageModule.Mechanism): Promise<void> => {
    await props.onProjectChanged();
    setCopyFromProjectDialogOpen(false);
    const newTab: TabItem = {
      key: mechanism.modulePath,
      title: mechanism.className,
      type: TabType.MECHANISM,
    };
    props.onOk(newTab);
  };

  /** Handles radio button change for tab type selection. */
  const handleTabTypeChange = (e: any): void => {
    if (e.target.value === 'opmode') {
      setTabType(TabType.OPMODE);
    } else if (e.target.value === 'mechanism') {
      setTabType(TabType.MECHANISM);
    }
  };

  return (
    <>
    <Antd.Modal
      title={t('addTabDialog.title')}
      open={props.isOpen}
      onCancel={props.onCancel}
      footer={null}
      afterOpenChange={(open) => { if (open) inputRef.current?.focus(); }}
    >
      <div style={{marginTop: 16}}>
        <Antd.Radio.Group
          value={tabType === TabType.MECHANISM ? 'mechanism' : 'opmode'}
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

        {tabType === TabType.MECHANISM && (
          <div style={{ marginBottom: 16 }}>
            <Antd.Button onClick={() => setCopyFromProjectDialogOpen(true)}>
              {t('IMPORT_FROM_ANOTHER_PROJECT')}
            </Antd.Button>
          </div>
        )}

        <h4 style={{margin: '0 0 8px 0'}}>
          {t('CREATE_NEW', { type: TabTypeUtils.toString(tabType) })}
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
            inputRef={inputRef}
          />
        </div>
      </div>
    </Antd.Modal>

    <ImportMechanismDialog
      isOpen={copyFromProjectDialogOpen}
      onCancel={() => setCopyFromProjectDialogOpen(false)}
      storage={props.storage}
      currentProject={props.project}
      onCopied={handleMechanismCopied}
    />
    </>
  );
}