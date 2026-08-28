/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
import { TabType } from '../types/TabType';

import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageProject from '../storage/project';
import { Editor } from '../editor/editor';
import {
    MoveComponentResult,
    MoveComponentTarget,
    moveComponentToMechanism } from '../editor/move_component_to_mechanism';
import ClassNameComponent, { ClassNameComponentRef } from './ClassNameComponent';

/** The keys of the tabs in this dialog. */
const TAB_EXISTING_MECHANISM = 'existing';
const TAB_NEW_MECHANISM = 'new';

/** How tall the list of existing mechanisms can get before it scrolls. */
const MECHANISM_LIST_MAX_HEIGHT = 240;

/** Props for the MoveComponentToMechanismDialog component. */
interface MoveComponentToMechanismDialogProps {
  isOpen: boolean;
  componentName: string;
  componentBlockId: string;
  project: storageProject.Project | null;
  storage: commonStorage.Storage | null;
  onCancel: () => void;
  onMoved: (result: MoveComponentResult) => void;
  onProjectChanged: () => Promise<void>;
}

/**
 * Dialog for moving a component out of the robot and into a mechanism, either one that already
 * exists or a new one.
 */
export default function MoveComponentToMechanismDialog(
    props: MoveComponentToMechanismDialogProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [activeTab, setActiveTab] = React.useState(TAB_NEW_MECHANISM);
  const [selectedModulePath, setSelectedModulePath] = React.useState('');
  const [newItemName, setNewItemName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [moving, setMoving] = React.useState(false);
  const classNameRef = React.useRef<ClassNameComponentRef>(null);

  const mechanisms = props.project ? props.project.mechanisms : [];

  // Start on the existing mechanisms when the project has any, otherwise on a new mechanism.
  React.useEffect(() => {
    if (props.isOpen) {
      setActiveTab(mechanisms.length ? TAB_EXISTING_MECHANISM : TAB_NEW_MECHANISM);
      setSelectedModulePath(mechanisms.length ? mechanisms[0].modulePath : '');
      setNewItemName('');
      setErrorMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  /** Performs the move. */
  const handleMove = async (target: MoveComponentTarget): Promise<void> => {
    if (!props.storage || !props.project || moving) {
      return;
    }
    const robotEditor = Editor.getEditorForModulePath(props.project.robot.modulePath);
    if (!robotEditor) {
      return;
    }
    setMoving(true);
    setErrorMessage('');
    try {
      const result = await moveComponentToMechanism(
          props.storage, props.project, robotEditor, props.componentBlockId, target);
      await props.onProjectChanged();
      props.onMoved(result);
    } catch (e) {
      console.error('Failed to move the component into a mechanism:', e);
      setErrorMessage(t('MOVE_COMPONENT_FAILED', { componentName: props.componentName }));
    } finally {
      setMoving(false);
    }
  };

  /** Handles moving the component into a new mechanism, after the name has been validated. */
  const handleMoveToNewMechanism = (): void => {
    const newClassName = newItemName.trim();
    if (newClassName) {
      handleMove({ newClassName });
    }
  };

  /** Handles the Move button. */
  const handleOk = (): void => {
    if (activeTab === TAB_NEW_MECHANISM) {
      // Let ClassNameComponent validate the name it is showing before we use it.
      classNameRef.current?.submitNewItem();
      return;
    }
    const mechanism = mechanisms.find((m) => m.modulePath === selectedModulePath);
    if (mechanism) {
      handleMove({ mechanism });
    }
  };

  /** Whether there is enough entered for the Move button to do anything. */
  const canMove = (): boolean => {
    return activeTab === TAB_NEW_MECHANISM
      ? newItemName.trim() !== ''
      : selectedModulePath !== '';
  };

  const tabItems: Antd.TabsProps['items'] = [];
  if (mechanisms.length) {
    tabItems.push({
      key: TAB_EXISTING_MECHANISM,
      label: t('MOVE_TO_EXISTING_MECHANISM'),
      children: (
        <div style={{maxHeight: MECHANISM_LIST_MAX_HEIGHT, overflowY: 'auto'}}>
          <Antd.Radio.Group
            value={selectedModulePath}
            onChange={(e) => setSelectedModulePath(e.target.value)}
            style={{display: 'flex', flexDirection: 'column', gap: 8}}
          >
            {mechanisms.map((mechanism) => (
              <Antd.Radio key={mechanism.modulePath} value={mechanism.modulePath}>
                {mechanism.className}
              </Antd.Radio>
            ))}
          </Antd.Radio.Group>
        </div>
      ),
    });
  }
  tabItems.push({
    key: TAB_NEW_MECHANISM,
    label: t('MOVE_TO_NEW_MECHANISM'),
    children: (
      <ClassNameComponent
        ref={classNameRef}
        tabType={TabType.MECHANISM}
        newItemName={newItemName}
        setNewItemName={setNewItemName}
        onAddNewItem={handleMoveToNewMechanism}
        project={props.project}
        storage={props.storage}
        buttonLabel=""
      />
    ),
  });

  return (
    <Antd.Modal
      title={t('moveComponentDialog.title', { componentName: props.componentName })}
      open={props.isOpen}
      onCancel={props.onCancel}
      onOk={handleOk}
      okText={t('MOVE')}
      okButtonProps={{disabled: !canMove()}}
      confirmLoading={moving}
    >
      <Antd.Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
      {errorMessage && (
        <Antd.Alert
          type="error"
          title={errorMessage}
          closable={{ closeIcon: true, onClose: () => setErrorMessage('') }}
          style={{marginTop: 8}}
        />
      )}
    </Antd.Modal>
  );
}
