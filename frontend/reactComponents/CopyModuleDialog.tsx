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
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageProject from '../storage/project';
import { TabType, TabTypeUtils } from '../types/TabType';
import { Editor } from '../editor/editor';
import ClassNameComponent from './ClassNameComponent';

/** The module being copied. */
export interface ModuleToCopy {
  path: string;
  title: string;
  type: TabType;
}

/** Props for the CopyModuleDialog component. */
interface CopyModuleDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  storage: commonStorage.Storage | null;
  project: storageProject.Project | null;
  module: ModuleToCopy | null;
  onCopiedWithinProject: (newModulePath: string, newClassName: string) => void;
  onCopiedToOtherProject: (mechanism: storageModule.Mechanism, destProject: storageProject.Project) => void;
}

/** Height of the scrollable project list in pixels. */
const LIST_HEIGHT = 200;

/** Default copy suffix for the prefilled name. */
const COPY_SUFFIX = 'Copy';

/**
 * Dialog for copying a mechanism or opmode, either within the current project (giving it a new
 * name) or into a different project (mechanisms only).
 */
export default function CopyModuleDialog(props: CopyModuleDialogProps) {
  const { t } = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();

  const [destination, setDestination] = React.useState<'same' | 'other'>('same');
  const [newClassName, setNewClassName] = React.useState('');
  const [projectNames, setProjectNames] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const allowCrossProject = props.module?.type === TabType.MECHANISM;

  React.useEffect(() => {
    if (!props.isOpen || !props.module) {
      return;
    }
    setDestination('same');
    setNewClassName(props.module.title + COPY_SUFFIX);
    setErrorMessage('');

    if (props.module.type === TabType.MECHANISM && props.storage && props.project) {
      const currentProjectName = props.project.projectName;
      setLoading(true);
      storageProject.listProjectNames(props.storage)
          .then((names) => {
            setProjectNames(names.filter((name) => name !== currentProjectName));
          })
          .catch((error) => {
            console.error('Error listing projects:', error);
            setErrorMessage(t('FAILED_TO_COPY_MECHANISM'));
          })
          .finally(() => setLoading(false));
    }
  }, [props.isOpen, props.module]);

  /** Copies the module within the current project, under newClassName. */
  const handleCopyWithinProject = async (): Promise<void> => {
    if (!props.storage || !props.project || !props.module) {
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const newModulePath = await storageProject.copyModuleInProject(
          props.storage, props.project, newClassName, props.module.path,
          props.module.type === TabType.MECHANISM
            ? (mech) => {
                Editor.getEditorForModulePath(props.project!.robot.modulePath)
                    ?.incorporateNewMechanism(mech);
              }
            : undefined);
      props.onCopiedWithinProject(newModulePath, newClassName);
    } catch (error) {
      console.error('Error copying module:', error);
      setErrorMessage(t('FAILED_TO_COPY_MODULE'));
    } finally {
      setLoading(false);
    }
  };

  /** Copies the mechanism into the selected destination project. */
  const handleSelectDestinationProject = async (projectName: string): Promise<void> => {
    if (!props.storage || !props.module) {
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const destProject = await storageProject.fetchProject(props.storage, projectName);
      const mechanism = await storageProject.copyMechanismToProject(
          props.storage, props.module.path, destProject);
      props.onCopiedToOtherProject(mechanism, destProject);
    } catch (error) {
      console.error('Error copying mechanism to project:', error);
      setErrorMessage(t('FAILED_TO_COPY_MECHANISM'));
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (): string => {
    return t('COPY_TYPE_TITLE', {
      type: props.module ? TabTypeUtils.toString(props.module.type) : '',
      title: props.module ? props.module.title : '',
    });
  };

  return (
    <Antd.Modal
      title={getTitle()}
      open={props.isOpen}
      onCancel={props.onCancel}
      footer={destination === 'same' ? undefined : null}
      onOk={destination === 'same' ? handleCopyWithinProject : undefined}
      okText={t('COPY')}
      cancelText={t('CANCEL')}
    >
      {allowCrossProject && (
        <Antd.Radio.Group
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ marginBottom: 16 }}
        >
          <Antd.Radio value="same">{t('COPY_WITHIN_PROJECT')}</Antd.Radio>
          <Antd.Radio value="other">{t('COPY_TO_ANOTHER_PROJECT')}</Antd.Radio>
        </Antd.Radio.Group>
      )}

      {errorMessage && (
        <Antd.Alert
          type="error"
          message={errorMessage}
          closable
          onClose={() => setErrorMessage('')}
          style={{ marginBottom: 16 }}
        />
      )}

      <Antd.Spin spinning={loading}>
        {destination === 'same' ? (
          <ClassNameComponent
            tabType={props.module?.type ?? TabType.MECHANISM}
            newItemName={newClassName}
            setNewItemName={setNewClassName}
            onAddNewItem={handleCopyWithinProject}
            project={props.project}
            storage={props.storage}
            buttonLabel=""
          />
        ) : (
          <div>
            <h4 style={{ margin: '0 0 8px 0' }}>{t('SELECT_PROJECT')}</h4>
            <div
              style={{
                height: LIST_HEIGHT,
                overflow: 'auto',
                border: `1px solid ${token.colorBorder}`,
                borderRadius: '6px',
              }}
            >
              {projectNames.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: token.colorTextSecondary }}>
                  {t('NO_OTHER_PROJECTS')}
                </div>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {projectNames.map((name) => (
                    <li
                      key={name}
                      onClick={() => handleSelectDestinationProject(name)}
                      style={{
                        cursor: 'pointer',
                        padding: '12px 16px',
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = token.colorBgTextHover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span style={{ fontSize: '14px' }}>{name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Antd.Spin>
    </Antd.Modal>
  );
}
