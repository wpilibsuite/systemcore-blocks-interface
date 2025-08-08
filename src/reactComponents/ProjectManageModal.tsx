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
import {EditOutlined, DeleteOutlined, CopyOutlined, SelectOutlined} from '@ant-design/icons';
import ProjectNameComponent from './ProjectNameComponent';

/** Props for the ProjectManageModal component. */
interface ProjectManageModalProps {
  isOpen: boolean;
  noProjects: boolean;
  onCancel: () => void;
  setProject: (project: commonStorage.Project | null) => void;
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
}

/** Default page size for table pagination. */
const DEFAULT_PAGE_SIZE = 5;

/** Modal width in pixels. */
const MODAL_WIDTH = 800;

/** Actions column width in pixels. */
const ACTIONS_COLUMN_WIDTH = 160;

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
  const [allProjects, setAllProjects] = React.useState<commonStorage.Project[]>([]);
  const [newItemName, setNewItemName] = React.useState('');
  const [currentRecord, setCurrentRecord] = React.useState<commonStorage.Project | null>(null);
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);

  /** Loads projects from storage and sorts them alphabetically. */
  const loadProjects = async (storage: commonStorage.Storage): Promise<void> => {
    const projects = await storage.listProjects();

    // Sort projects alphabetically by name
    projects.sort((a, b) => a.projectName.localeCompare(b.projectName));
    setAllProjects(projects);
    
    if (projects.length > 0 && props.noProjects) {
      props.setProject(projects[0]); // Set the first project as the current project
      props.onCancel(); // Close the modal after selecting
    }
  };

  /** Handles renaming a project. */
  const handleRename = async (origProject: commonStorage.Project, newUserVisibleName: string): Promise<void> => {
    if (!props.storage) {
      return;
    }

    try {
      await commonStorage.renameProject(
          props.storage,
          origProject,
          newUserVisibleName
      );
      await loadProjects(props.storage);
    } catch (error) {
      console.error('Error renaming project:', error);
      props.setAlertErrorMessage('Failed to rename project');
    }
    
    setRenameModalOpen(false);
  };

  /** Handles copying a project. */
  const handleCopy = async (origProject: commonStorage.Project, newUserVisibleName: string): Promise<void> => {
    if (!props.storage) {
      return;
    }

    try {
      await commonStorage.copyProject(
          props.storage,
          origProject,
          newUserVisibleName
      );
      await loadProjects(props.storage);
    } catch (error) {
      console.error('Error copying project:', error);
      props.setAlertErrorMessage('Failed to copy project');
    }
    
    setCopyModalOpen(false);
  };

  /** Handles adding a new project. */
  const handleAddNewItem = async (): Promise<void> => {
    const newUserVisibleName = newItemName.trim();
    if (!newUserVisibleName || !props.storage) {
      return;
    }

    try {
      await commonStorage.createProject(
          props.storage,
          newUserVisibleName
      );
    } catch (e) {
      console.error('Failed to create a new project:', e);
      props.setAlertErrorMessage('Failed to create a new project.');
    }

    setNewItemName('');
    await loadProjects(props.storage);
  };

  /** Handles project deletion with proper cleanup. */
  const handleDeleteProject = async (record: commonStorage.Project): Promise<void> => {
    if (!props.storage) {
      return;
    }

    const newProjects = allProjects.filter((m) => m.projectName !== record.projectName);
    setAllProjects(newProjects);

    // Find another project to set as current
    let foundAnotherProject = false;
    for (const project of allProjects) {
      if (project.projectName !== record.projectName) {
        props.setProject(project);
        foundAnotherProject = true;
        break;
      }
    }

    if (!foundAnotherProject) {
      props.setProject(null);
    }

    try {
      await commonStorage.deleteProject(props.storage, record);
    } catch (e) {
      console.error('Failed to delete the project:', e);
      props.setAlertErrorMessage('Failed to delete the project.');
    }
  };

  /** Handles project selection. */
  const handleSelectProject = (record: commonStorage.Project): void => {
    props.setProject(record);
    props.onCancel();
  };

  /** Opens the rename modal for a specific project. */
  const openRenameModal = (record: commonStorage.Project): void => {
    setCurrentRecord(record);
    setName(record.projectName);
    setRenameModalOpen(true);
  };

  /** Opens the copy modal for a specific project. */
  const openCopyModal = (record: commonStorage.Project): void => {
    setCurrentRecord(record);
    setName(record.projectName + COPY_SUFFIX);
    setCopyModalOpen(true);
  };

  /** Gets the rename modal title. */
  const getRenameModalTitle = (): string => {
    return `Rename Project: ${currentRecord ? currentRecord.projectName : ''}`;
  };

  /** Gets the copy modal title. */
  const getCopyModalTitle = (): string => {
    return `Copy Project: ${currentRecord ? currentRecord.projectName : ''}`;
  };

  /** Creates the container style object. */
  const getContainerStyle = (): React.CSSProperties => ({
    marginBottom: ALERT_MARGIN_BOTTOM,
    border: '1px solid #d9d9d9',
    borderRadius: CONTAINER_BORDER_RADIUS,
    padding: CONTAINER_PADDING,
  });

  /** Creates the alert style object. */
  const getAlertStyle = (): React.CSSProperties => ({
    marginBottom: ALERT_MARGIN_BOTTOM,
  });

  /** Table column configuration. */
  const columns: Antd.TableProps<commonStorage.Project>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis: {
        showTitle: false,
      },
      render: (className: string) => (
        <Antd.Tooltip title={className}>
          {className}
        </Antd.Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: ACTIONS_COLUMN_WIDTH,
      render: (_, record: commonStorage.Project) => (
        <Antd.Space size="small">
          <Antd.Tooltip title={t('Select')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<SelectOutlined />}
              onClick={() => handleSelectProject(record)}
            />
          </Antd.Tooltip>
          <Antd.Tooltip title={t('Rename')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openRenameModal(record)}
            />
          </Antd.Tooltip>
          <Antd.Tooltip title={t('Copy')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => openCopyModal(record)}
            />
          </Antd.Tooltip>
          {allProjects.length > 1 && (
            <Antd.Tooltip title={t('Delete')}>
              <Antd.Popconfirm
                title={`Delete ${record.projectName}?`}
                description="This action cannot be undone."
                onConfirm={() => handleDeleteProject(record)}
                okText={t('Delete')}
                cancelText={t('Cancel')}
                okType="danger"
              >
                <Antd.Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                />
              </Antd.Popconfirm>
            </Antd.Tooltip>
          )}
        </Antd.Space>
      ),
    },
  ];

  // Load projects when storage becomes available or modal opens
  React.useEffect(() => {
    if (props.storage) {
      loadProjects(props.storage);
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
            handleRename(currentRecord, name);
          }
        }}
        okText={t('Rename')}
        cancelText={t('Cancel')}
      >
        {currentRecord && (
          <ProjectNameComponent
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleRename(currentRecord, name);
              }
            }}
            projects={allProjects}
            setProjects={setAllProjects}
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={getCopyModalTitle()}
        open={copyModalOpen}
        onCancel={() => setCopyModalOpen(false)}
        onOk={() => {
          if (currentRecord) {
            handleCopy(currentRecord, name);
          }
        }}
        okText={t('Copy')}
        cancelText={t('Cancel')}
      >
        {currentRecord && (
          <ProjectNameComponent
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleCopy(currentRecord, name);
              }
            }}
            projects={allProjects}
            setProjects={setAllProjects}
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={t('Project Management')}
        open={props.isOpen}
        onCancel={props.onCancel}
        footer={[
          <Antd.Button key="close" onClick={props.onCancel}>
            {t('Close')}
          </Antd.Button>,
        ]}
        width={MODAL_WIDTH}
      >
        {props.noProjects && (
          <Antd.Alert
            message="No projects found"
            description="Please create a new project to get started."
            type="info"
            showIcon
            style={getAlertStyle()}
          />
        )}
        <div style={getContainerStyle()}>
          <ProjectNameComponent
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onAddNewItem={handleAddNewItem}
            projects={allProjects}
            setProjects={setAllProjects}
          />
        </div>
        {!props.noProjects && (
          <Antd.Table<commonStorage.Project>
            columns={columns}
            dataSource={allProjects}
            rowKey="projectName"
            size="small"
            pagination={allProjects.length > DEFAULT_PAGE_SIZE ? {
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            } : false}
            bordered
            locale={{
              emptyText: 'No projects found',
            }}
            onRow={(record) => ({
              onDoubleClick: () => handleSelectProject(record),
            })}
          />
        )}
      </Antd.Modal>
    </>
  );
}