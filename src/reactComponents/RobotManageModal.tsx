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
import {TabType} from '../types/TabType';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import {EditOutlined, DeleteOutlined, CopyOutlined, SelectOutlined} from '@ant-design/icons';
import RobotNameComponent from './RobotNameComponent';

/** Props for the RobotManageModal component. */
interface RobotManageModalProps {
  isOpen: boolean;
  noRobots: boolean;
  onCancel: () => void;
  setRobot: (robot: commonStorage.Robot | null) => void;
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  moduleType: TabType;
}

/** Default page size for table pagination. */
const DEFAULT_PAGE_SIZE = 5;

/** Modal width in pixels. */
const MODAL_WIDTH = 800;

/** Actions column width in pixels. */
const ACTIONS_COLUMN_WIDTH = 160;

/** Default copy suffix for robot names. */
const COPY_SUFFIX = 'Copy';

/** Alert margin bottom in pixels. */
const ALERT_MARGIN_BOTTOM = 16;

/** Border radius for styled containers. */
const CONTAINER_BORDER_RADIUS = '6px';

/** Container padding in pixels. */
const CONTAINER_PADDING = '12px';

/**
 * Modal component for managing robots.
 * Provides functionality to create, rename, copy, delete, and select robots.
 */
export default function RobotManageModal(props: RobotManageModalProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [modules, setModules] = React.useState<commonStorage.Robot[]>([]);
  const [newItemName, setNewItemName] = React.useState('');
  const [currentRecord, setCurrentRecord] = React.useState<commonStorage.Robot | null>(null);
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);

  /** Loads modules from storage and sorts them alphabetically. */
  const loadModules = async (storage: commonStorage.Storage): Promise<void> => {
    const robots = await storage.listModules();

    // Sort modules alphabetically by class name
    robots.sort((a, b) => a.className.localeCompare(b.className));
    setModules(robots);
    
    if (robots.length > 0 && props.noRobots) {
      props.setRobot(robots[0]); // Set the first robot as the current robot
      props.onCancel(); // Close the modal after selecting
    }
  };

  /** Handles renaming a robot. */
  const handleRename = async (origModule: commonStorage.Robot, newName: string): Promise<void> => {
    if (!props.storage) {
      return;
    }

    try {
      await props.storage.renameModule(
          commonStorage.MODULE_TYPE_ROBOT,
          origModule.className,
          origModule.className,
          newName
      );
      await loadModules(props.storage);
    } catch (error) {
      console.error('Error renaming module:', error);
      props.setAlertErrorMessage('Failed to rename module');
    }
    
    setRenameModalOpen(false);
  };

  /** Handles copying a robot. */
  const handleCopy = async (origModule: commonStorage.Robot, newName: string): Promise<void> => {
    if (!props.storage) {
      return;
    }

    try {
      await props.storage.copyModule(
          commonStorage.MODULE_TYPE_ROBOT,
          origModule.className,
          origModule.className,
          newName
      );
      await loadModules(props.storage);
    } catch (error) {
      console.error('Error copying module:', error);
      props.setAlertErrorMessage('Failed to copy module');
    }
    
    setCopyModalOpen(false);
  };

  /** Handles adding a new robot. */
  const handleAddNewItem = async (): Promise<void> => {
    const trimmedName = newItemName.trim();
    if (!trimmedName || !props.storage) {
      return;
    }

    const newRobotName = commonStorage.classNameToModuleName(trimmedName);
    const newRobotPath = commonStorage.makeRobotPath(newRobotName);
    const robotContent = commonStorage.newRobotContent(newRobotName);

    try {
      await props.storage.createModule(
          commonStorage.MODULE_TYPE_ROBOT,
          newRobotPath,
          robotContent
      );
    } catch (e) {
      console.error('Failed to create a new robot:', e);
      props.setAlertErrorMessage('Failed to create a new robot.');
    }

    setNewItemName('');
    await loadModules(props.storage);
  };

  /** Handles robot deletion with proper cleanup. */
  const handleDeleteRobot = async (record: commonStorage.Robot): Promise<void> => {
    if (!props.storage) {
      return;
    }

    const newModules = modules.filter((m) => m.modulePath !== record.modulePath);
    setModules(newModules);

    // Find another robot to set as current
    let foundAnotherRobot = false;
    for (const robot of modules) {
      if (robot.modulePath !== record.modulePath) {
        props.setRobot(robot);
        foundAnotherRobot = true;
        break;
      }
    }

    if (!foundAnotherRobot) {
      props.setRobot(null);
    }

    try {
      await props.storage.deleteModule(commonStorage.MODULE_TYPE_ROBOT, record.modulePath);
    } catch (e) {
      console.error('Failed to delete the robot:', e);
      props.setAlertErrorMessage('Failed to delete the robot.');
    }
  };

  /** Handles robot selection. */
  const handleSelectRobot = (record: commonStorage.Robot): void => {
    props.setRobot(record);
    props.onCancel();
  };

  /** Opens the rename modal for a specific robot. */
  const openRenameModal = (record: commonStorage.Robot): void => {
    setCurrentRecord(record);
    setName(record.className);
    setRenameModalOpen(true);
  };

  /** Opens the copy modal for a specific robot. */
  const openCopyModal = (record: commonStorage.Robot): void => {
    setCurrentRecord(record);
    setName(record.className + COPY_SUFFIX);
    setCopyModalOpen(true);
  };

  /** Gets the rename modal title. */
  const getRenameModalTitle = (): string => {
    return `Rename Robot: ${currentRecord ? currentRecord.className : ''}`;
  };

  /** Gets the copy modal title. */
  const getCopyModalTitle = (): string => {
    return `Copy Robot: ${currentRecord ? currentRecord.className : ''}`;
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
  const columns: Antd.TableProps<commonStorage.Robot>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'className',
      key: 'className',
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
      render: (_, record: commonStorage.Robot) => (
        <Antd.Space size="small">
          <Antd.Tooltip title={t('Select')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<SelectOutlined />}
              onClick={() => handleSelectRobot(record)}
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
          {modules.length > 1 && (
            <Antd.Tooltip title={t('Delete')}>
              <Antd.Popconfirm
                title={`Delete ${record.className}?`}
                description="This action cannot be undone."
                onConfirm={() => handleDeleteRobot(record)}
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

  // Load modules when storage becomes available or modal opens
  React.useEffect(() => {
    if (props.storage) {
      loadModules(props.storage);
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
          <RobotNameComponent
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleRename(currentRecord, name);
              }
            }}
            robots={modules}
            setRobots={setModules}
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
          <RobotNameComponent
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleCopy(currentRecord, name);
              }
            }}
            robots={modules}
            setRobots={setModules}
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={t('Robot Management')}
        open={props.isOpen}
        onCancel={props.onCancel}
        footer={[
          <Antd.Button key="close" onClick={props.onCancel}>
            {t('Close')}
          </Antd.Button>,
        ]}
        width={MODAL_WIDTH}
      >
        {props.noRobots && (
          <Antd.Alert
            message="No robots found"
            description="Please create a new robot to get started."
            type="info"
            showIcon
            style={getAlertStyle()}
          />
        )}
        <div style={getContainerStyle()}>
          <RobotNameComponent
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onAddNewItem={handleAddNewItem}
            robots={modules}
            setRobots={setModules}
          />
        </div>
        {!props.noRobots && (
          <Antd.Table<commonStorage.Robot>
            columns={columns}
            dataSource={modules}
            rowKey="modulePath"
            size="small"
            pagination={modules.length > DEFAULT_PAGE_SIZE ? {
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            } : false}
            bordered
            locale={{
              emptyText: 'No robots found',
            }}
            onRow={(record) => ({
              onDoubleClick: () => handleSelectRobot(record),
            })}
          />
        )}
      </Antd.Modal>
    </>
  );
}