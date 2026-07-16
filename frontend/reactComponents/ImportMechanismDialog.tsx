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
import { LeftOutlined } from '@ant-design/icons';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageProject from '../storage/project';
import { Editor } from '../editor/editor';

/** Props for the ImportMechanismDialog component. */
interface ImportMechanismDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  storage: commonStorage.Storage | null;
  // Choose a source project, then one of its mechanisms, and copy it into currentProject.
  currentProject: storageProject.Project | null;
  onCopied: (mechanism: storageModule.Mechanism, project: storageProject.Project) => void;
}

/** Height of the scrollable project/mechanism lists in pixels. */
const LIST_HEIGHT = 200;

/**
 * Dialog for copying a mechanism from another project into the current project.
 */
export default function ImportMechanismDialog(props: ImportMechanismDialogProps) {
  const { t } = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();

  const [projectNames, setProjectNames] = React.useState<string[]>([]);
  const [selectedProjectName, setSelectedProjectName] = React.useState<string | null>(null);
  const [sourceMechanisms, setSourceMechanisms] = React.useState<storageModule.Mechanism[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (!props.isOpen || !props.storage || !props.currentProject) {
      return;
    }
    setSelectedProjectName(null);
    setSourceMechanisms([]);
    setErrorMessage('');
    setLoading(true);
    storageProject.listProjectNames(props.storage)
        .then((names) => {
          setProjectNames(names.filter((name) => name !== props.currentProject!.projectName));
        })
        .catch((error) => {
          console.error('Error listing projects:', error);
          setErrorMessage(t('FAILED_TO_COPY_MECHANISM'));
        })
        .finally(() => setLoading(false));
  }, [props.isOpen, props.storage, props.currentProject]);

  /** Handles selecting the project to copy a mechanism from. */
  const handleSelectProject = async (projectName: string): Promise<void> => {
    if (!props.storage) {
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const sourceProject = await storageProject.fetchProject(props.storage, projectName);
      setSourceMechanisms(sourceProject.mechanisms);
      setSelectedProjectName(projectName);
    } catch (error) {
      console.error('Error fetching project:', error);
      setErrorMessage(t('FAILED_TO_COPY_MECHANISM'));
    } finally {
      setLoading(false);
    }
  };

  /** Handles selecting the mechanism to import from the selected project. */
  const handleSelectMechanism = async (mechanism: storageModule.Mechanism): Promise<void> => {
    if (!props.storage || !props.currentProject || !selectedProjectName) {
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const newMechanism = await storageProject.copyMechanismToProject(
          props.storage, mechanism.modulePath, props.currentProject,
          (mech) => {
            Editor.getEditorForModulePath(props.currentProject!.robot.modulePath)
                ?.incorporateNewMechanism(mech);
          });
      props.onCopied(newMechanism, props.currentProject);
    } catch (error) {
      console.error('Error copying mechanism from project:', error);
      setErrorMessage(t('FAILED_TO_COPY_MECHANISM'));
    } finally {
      setLoading(false);
    }
  };

  const renderList = <T,>(items: T[], keyFn: (item: T) => string, labelFn: (item: T) => string,
      onClick: (item: T) => void, emptyText: string): React.JSX.Element => (
    <div
      style={{
        height: LIST_HEIGHT,
        overflow: 'auto',
        border: `1px solid ${token.colorBorder}`,
        borderRadius: '6px',
      }}
    >
      {items.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: token.colorTextSecondary }}>
          {emptyText}
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li
              key={keyFn(item)}
              onClick={() => onClick(item)}
              style={{
                cursor: 'pointer',
                padding: '12px 16px',
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = token.colorBgTextHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span style={{ fontSize: '14px' }}>{labelFn(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Antd.Modal
      title={t('IMPORT_FROM_ANOTHER_PROJECT')}
      open={props.isOpen}
      onCancel={props.onCancel}
      footer={null}
    >
      <div style={{ marginTop: 16 }}>
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
          {selectedProjectName ? (
            <>
              <Antd.Button
                type="link"
                icon={<LeftOutlined />}
                style={{ paddingLeft: 0, marginBottom: 8 }}
                onClick={() => { setSelectedProjectName(null); setSourceMechanisms([]); }}
              >
                {t('BACK_TO_PROJECTS')}
              </Antd.Button>
              {renderList(
                  sourceMechanisms,
                  (m) => m.modulePath,
                  (m) => m.className,
                  handleSelectMechanism,
                  t('NO_MECHANISMS_IN_PROJECT'))}
            </>
          ) : (
            <>
              <h4 style={{ margin: '0 0 8px 0' }}>{t('SELECT_PROJECT')}</h4>
              {renderList(
                  projectNames,
                  (name) => name,
                  (name) => name,
                  handleSelectProject,
                  t('NO_OTHER_PROJECTS'))}
            </>
          )}
        </Antd.Spin>
      </div>
    </Antd.Modal>
  );
}
