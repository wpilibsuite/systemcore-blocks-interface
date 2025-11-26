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
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageProject from '../storage/project';
import ProjectNameComponent from './ProjectNameComponent';
import ManageTable from './ManageTable';

/** Props for the ProjectManageModal component. */
interface ProjectManageModalProps {
  isOpen: boolean;
  noProjects: boolean;
  onCancel: () => void;
  currentProject: storageProject.Project | null;
  setCurrentProject: (project: storageProject.Project | null) => void;
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
}

type ProjectRecord = {
  name: string,
};

/** Modal width in pixels. */
const MODAL_WIDTH = 800;

/** Default copy suffix for project names. */
const COPY_SUFFIX = 'Copy';

/** Alert margin bottom in pixels. */
const ALERT_MARGIN_BOTTOM = 16;

/** Border radius for styled containers. */
const CONTAINER_BORDER_RADIUS = '6px';

/** Container padding in pixels. */
const CONTAINER_PADDING = '12px';

/**
 * Modal component for managing projects.
 * Provides functionality to create, rename, copy, delete, and select projects.
 */
export default function ProjectManageModal(props: ProjectManageModalProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const [allProjectNames, setAllProjectNames] = React.useState<string[]>([]);
  const [allProjectRecords, setAllProjectRecords] = React.useState<ProjectRecord[]>([]);
  const [newItemName, setNewItemName] = React.useState('');
  const [currentRecord, setCurrentRecord] = React.useState<ProjectRecord | null>(null);
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);

  /** Loads project names from storage and sorts them alphabetically. */
  const loadProjectNames = async (storage: commonStorage.Storage): Promise<void> => {
    const projectNames = await storageProject.listProjectNames(storage);
    projectNames.sort();
    setAllProjectNames(projectNames);

    const projectRecords: ProjectRecord[] = [];
    projectNames.forEach(projectName => {
      projectRecords.push({
        name: projectName,
      });
    });
    setAllProjectRecords(projectRecords);

    if (projectNames.length > 0 && props.noProjects) {
      // Set the first project as the current project
      const project = await storageProject.fetchProject(storage, projectNames[0]);
      props.setCurrentProject(project);
      props.onCancel(); // Close the modal after selecting
    }
  };

  /** Handles renaming a project. */
  const handleRename = async (origProjectName: string, newProjectName: string): Promise<void> => {
    if (!props.storage) {
      return;
    }

    try {
      await storageProject.renameProject(
          props.storage,
          origProjectName,
          newProjectName
      );
      await loadProjectNames(props.storage);
    } catch (error) {
      console.error('Error renaming project:', error);
      props.setAlertErrorMessage(t('FAILED_TO_RENAME_PROJECT'));
    }

    setRenameModalOpen(false);
  };

  /** Handles copying a project. */
  const handleCopy = async (origProjectName: string, newProjectName: string): Promise<void> => {
    if (!props.storage) {
      return;
    }

    try {
      await storageProject.copyProject(
          props.storage,
          origProjectName,
          newProjectName
      );
      await loadProjectNames(props.storage);
    } catch (error) {
      console.error('Error copying project:', error);
      props.setAlertErrorMessage(t('FAILED_TO_COPY_PROJECT'));
    }

    setCopyModalOpen(false);
  };

  /** Handles adding a new project. */
  const handleAddNewItem = async (): Promise<void> => {
    const newProjectName = newItemName.trim();
    if (!newProjectName || !props.storage) {
      return;
    }

    try {
      await storageProject.createProject(
          props.storage,
          newProjectName
      );
    } catch (e) {
      console.error('Failed to create a new project:', e);
      props.setAlertErrorMessage(t('FAILED_TO_CREATE_PROJECT'));
    }

    setNewItemName('');
    await loadProjectNames(props.storage);
    handleSelectProject({ name: newProjectName });
  };

  /** Handles project deletion with proper cleanup. */
  const handleDeleteProject = async (projectToDelete: ProjectRecord): Promise<void> => {
    if (!props.storage) {
      return;
    }

    const updatedProjectNames = allProjectNames.filter(projectName => projectName !== projectToDelete.name);
    setAllProjectNames(updatedProjectNames);
    const updatedProjectRecords = allProjectRecords.filter((r) => r.name !== projectToDelete.name);
    setAllProjectRecords(updatedProjectRecords);

    let projectToSelect: storageProject.Project | null = null;
    if (props.currentProject && props.currentProject.projectName === projectToDelete.name) {
      // Find another project to set as current
      for (const projectName of allProjectNames) {
        if (projectName !== projectToDelete.name) {
          projectToSelect = await storageProject.fetchProject(props.storage, projectName);
          break;
        }
      }
    }

    try {
      await storageProject.deleteProject(props.storage, projectToDelete.name);
    } catch (e) {
      console.error('Failed to delete the project:', e);
      props.setAlertErrorMessage(t('FAILED_TO_DELETE_PROJECT'));
    }

    if (projectToSelect) {
      props.setCurrentProject(projectToSelect);
    }
  };

  /** Handles project selection. */
  const handleSelectProject = async (projectRecord: ProjectRecord): Promise<void> => {
    if (!props.storage) {
      return;
    }

    const project = await storageProject.fetchProject(props.storage, projectRecord.name);
    props.setCurrentProject(project);
    props.onCancel();
  };

  /** Opens the rename modal for a specific project. */
  const openRenameModal = (record: ProjectRecord): void => {
    setCurrentRecord(record);
    setName(record.name);
    setRenameModalOpen(true);
  };

  /** Opens the copy modal for a specific project. */
  const openCopyModal = (record: ProjectRecord): void => {
    setCurrentRecord(record);
    setName(record.name + COPY_SUFFIX);
    setCopyModalOpen(true);
  };

  /** Gets the rename modal title. */
  const getRenameModalTitle = (): string => {
    return `${t('RENAME_PROJECT')}: ${currentRecord ? currentRecord.name : ''}`;
  };

  /** Gets the copy modal title. */
  const getCopyModalTitle = (): string => {
    return `${t('COPY_PROJECT')}: ${currentRecord ? currentRecord.name : ''}`;
  };

  /** Creates the container style object. */
  const getContainerStyle = (): React.CSSProperties => ({
    marginBottom: ALERT_MARGIN_BOTTOM,
    border: `1px solid ${token.colorBorder}`,
    borderRadius: CONTAINER_BORDER_RADIUS,
    padding: CONTAINER_PADDING,
  });

  /** Creates the alert style object. */
  const getAlertStyle = (): React.CSSProperties => ({
    marginBottom: ALERT_MARGIN_BOTTOM,
  });

  // Load project names when storage becomes available or modal opens
  React.useEffect(() => {
    if (props.storage) {
      loadProjectNames(props.storage);
    }
  }, [props.storage, props.isOpen]);

  return (
    <>
      <Antd.Modal
        title={getRenameModalTitle()}
        open={renameModalOpen}
        onCancel={() => setRenameModalOpen(false)}
        onOk={() => {
          if (currentRecord) {
            handleRename(currentRecord.name, name);
          }
        }}
        okText={t('RENAME')}
        cancelText={t('CANCEL')}
      >
        {currentRecord && (
          <ProjectNameComponent
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleRename(currentRecord.name, name);
              }
            }}
            projectNames={allProjectNames}
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={getCopyModalTitle()}
        open={copyModalOpen}
        onCancel={() => setCopyModalOpen(false)}
        onOk={() => {
          if (currentRecord) {
            handleCopy(currentRecord.name, name);
          }
        }}
        okText={t('COPY')}
        cancelText={t('CANCEL')}
      >
        {currentRecord && (
          <ProjectNameComponent
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleCopy(currentRecord.name, name);
              }
            }}
            projectNames={allProjectNames}
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={t('PROJECT_MANAGEMENT')}
        open={props.isOpen}
        onCancel={props.onCancel}
        footer={null}
        width={MODAL_WIDTH}
      >
        {props.noProjects && (
          <Antd.Alert
            message={t('NO_PROJECTS_FOUND')}
            description={t('CREATE_PROJECT_TO_START')}
            type="info"
            showIcon
            style={getAlertStyle()}
          />
        )}
        {!props.noProjects && (
          <ManageTable
            textOnEmpty={t('NO_PROJECTS_FOUND')}
            records={allProjectRecords}
            showDelete={allProjectRecords.length > 1}
            deleteDialogTitle="DELETE_PROJECT_CONFIRM"
            onSelect={(record) => handleSelectProject(record)}
            onRename={(record) => openRenameModal(record)}
            onCopy={(record) => openCopyModal(record)}
            onDelete={(record) => handleDeleteProject(record)}
          />
        )}
        <br />
        <h4 style={{margin: '0 0 8px 0'}}>
            {t('CREATE_NEW', { type: t('PROJECT') })}
        </h4>
        <div style={getContainerStyle()}>
          <ProjectNameComponent
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onAddNewItem={handleAddNewItem}
            projectNames={allProjectNames}
          />
        </div>
      </Antd.Modal>
    </>
  );
}
