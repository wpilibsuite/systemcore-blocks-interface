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
import * as commonStorage from '../storage/common_storage';
import * as storageProject from '../storage/project';
import * as createPythonFiles from '../storage/create_python_files';
import * as serverSideStorage from '../storage/server_side_storage';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useAutosave } from './AutosaveManager';
import lightFIRSTLogo from '../assets/FIRST_HorzRGB.png';
import darkFIRSTLogo from '../assets/FIRST_HorzRGB_reverse.png';
import ProjectNameComponent from './ProjectNameComponent';
import { PlaySquareOutlined } from '@ant-design/icons';

/** Function type for setting string values. */
type StringFunction = (input: string) => void;

/** Props for the Header component. */
interface HeaderProps {
  alertErrorMessage: string;
  setAlertErrorMessage: StringFunction;
  project: storageProject.Project | null;
  storage: commonStorage.Storage | null;
  setProject: (project: storageProject.Project | null) => void;
  saveCurrentTab: () => Promise<void>;
}

/** Height of the logo image in pixels. */
const LOGO_HEIGHT = '30px';

/** Font weight for the main title. */
const TITLE_FONT_WEIGHT = 1000;

/** Font size for text elements. */
const TEXT_FONT_SIZE = '20px';

/** Left padding for text elements. */
const TEXT_PADDING_LEFT = 20;

/**
 * Header component that displays the application logo, title, current project,
 * and any error messages.
 */
export default function Header(props: HeaderProps): React.JSX.Element {
  const { token } = Antd.theme.useToken();
  const { t } = useTranslation();
  const autosave = useAutosave();

  const isDarkTheme = token.colorBgLayout === '#000000';

  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [allProjectNames, setAllProjectNames] = React.useState<string[]>([]);
  const [deployModalOpen, setDeployModalOpen] = React.useState<boolean>(false);
  const [deployElapsed, setDeployElapsed] = React.useState<number>(0);
  const [deployStatus, setDeployStatus] = React.useState<'deploying' | 'success' | 'error'>('deploying');
  const [deployError, setDeployError] = React.useState<string>('');
  const deployIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  /** Opens the rename modal and loads existing project names. */
  const openRenameModal = async (): Promise<void> => {
    if (!props.project || !props.storage) {
      return;
    }
    const names = await storageProject.listProjectNames(props.storage);
    names.sort();
    setAllProjectNames(names);
    setNewName(props.project.projectName);
    setRenameModalOpen(true);
  };

  /** Handles confirming the rename. */
  const handleRename = async (): Promise<void> => {
    if (!props.project || !props.storage) {
      return;
    }
    const trimmed = newName.trim();
    if (!trimmed || trimmed === props.project.projectName) {
      setRenameModalOpen(false);
      return;
    }
    try {
      await storageProject.renameProject(props.storage, props.project.projectName, trimmed);
      const updated = await storageProject.fetchProject(props.storage, trimmed);
      props.setProject(updated);
    } catch (error) {
      console.error('Error renaming project:', error);
      props.setAlertErrorMessage(t('FAILED_TO_RENAME_PROJECT'));
    }
    setRenameModalOpen(false);
  };

  /** Handles the deploy action to generate and send Python files to the robot. */
  const handleDeploy = async (): Promise<void> => {
    if (!props.project) {
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

      const blobUrl = await createPythonFiles.producePythonProjectBlob(props.project, props.storage);

      const serverAvailable = await serverSideStorage.isServerAvailable();

      if (serverAvailable) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('file', blob, `${props.project.projectName}.zip`);

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
        link.download = `${props.project.projectName}.zip`;
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

  /** Handles clearing the error message. */
  const handleClearError = (): void => {
    props.setAlertErrorMessage('');
  };

  /** Renders the error alert if there is an error message. */
  const renderErrorAlert = (): React.JSX.Element | null => {
    if (props.alertErrorMessage === '') {
      return null;
    }

    return (
      <Antd.Alert
        type="error"
        title={props.alertErrorMessage}
        closable={{ closeIcon: true, onClose: handleClearError }}
      />
    );
  };

  /** Gets the project name or fallback text. */
  const getProjectName = (): string => {
    return props.project?.projectName || t('NO_PROJECT_SELECTED');
  };

  const getFIRSTLogo = () => {
    return <img height={LOGO_HEIGHT} style={{objectFit: 'contain'}} 
        src={isDarkTheme ? darkFIRSTLogo : lightFIRSTLogo} alt="FIRST Logo" />;
  }

  /** Renders the unsaved changes indicator. */
  const renderUnsavedIndicator = (): React.JSX.Element | null => {
    if (!autosave.hasUnsavedChanges) {
      return null;
    }

    return (
      <Antd.Typography.Text
        style={{
          marginLeft: 8,
          fontSize: TEXT_FONT_SIZE,
          color: token.colorWarning,
          fontStyle: 'italic',
        }}
      >
        *
      </Antd.Typography.Text>
    );
  };

  return (
    <Antd.Flex vertical>
      <Antd.Modal
        title={`${t('RENAME_PROJECT')}: ${props.project?.projectName ?? ''}`}
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onOk={handleRename}
        okText={t('RENAME')}
        cancelText={t('CANCEL')}
      >
        <ProjectNameComponent
          newItemName={newName}
          setNewItemName={setNewName}
          onAddNewItem={handleRename}
          projectNames={allProjectNames.filter(n => n !== props.project?.projectName)}
        />
      </Antd.Modal>
      <Antd.Flex style={{alignItems: 'center'}}>
        {getFIRSTLogo()}
        <Antd.Typography
          style={{
            paddingLeft: TEXT_PADDING_LEFT,
            fontSize: TEXT_FONT_SIZE,
            fontWeight: TITLE_FONT_WEIGHT,
          }}
        >
          {t("BLOCKS")}
        </Antd.Typography>
        <Antd.Typography
          data-tour="project-name"
          style={{
            paddingLeft: TEXT_PADDING_LEFT,
            fontSize: TEXT_FONT_SIZE,
            fontWeight: 'normal',
          }}
        >
          {t("PROJECT")}:{' '}
          <span
            onClick={props.project ? openRenameModal : undefined}
            style={{ cursor: props.project ? 'pointer' : 'default' }}
          >
            {getProjectName()}
          </span>
          {renderUnsavedIndicator()}
        </Antd.Typography>
        {renderErrorAlert()}
        <Antd.Button
          data-tour="deploy-button"
          type="primary"
          size="large"
          icon={<PlaySquareOutlined />}
          onClick={handleDeploy}
          style={{ marginLeft: 'auto' }}
        >
          {t('DEPLOY')}
        </Antd.Button>
      </Antd.Flex>
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
    </Antd.Flex>
  );
}