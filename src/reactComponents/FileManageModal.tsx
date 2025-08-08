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
import {TabType, TabTypeUtils } from '../types/TabType';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import {EditOutlined, DeleteOutlined, CopyOutlined} from '@ant-design/icons';
import ClassNameComponent from './ClassNameComponent';

/** Represents a module in the file management system. */
interface Module {
  path: string;
  title: string;
  type: TabType;
}

/** Props for the FileManageModal component. */
interface FileManageModalProps {
  isOpen: boolean;
  onCancel: () => void;
  project: commonStorage.Project | null;
  setProject: (project: commonStorage.Project | null) => void;
  gotoTab: (path: string) => void;
  setAlertErrorMessage: (message: string) => void;
  storage: commonStorage.Storage | null;
  moduleType: TabType;
}

/** Default page size for table pagination. */
const DEFAULT_PAGE_SIZE = 5;

/** Modal width in pixels. */
const MODAL_WIDTH = 800;

/** Actions column width in pixels. */
const ACTIONS_COLUMN_WIDTH = 120;

/**
 * Modal component for managing files (mechanisms and opmodes) within a project.
 * Provides functionality to create, rename, copy, and delete modules.
 */
export default function FileManageModal(props: FileManageModalProps) {
  const {t} = I18Next.useTranslation();
  const [modules, setModules] = React.useState<Module[]>([]);
  const [newItemName, setNewItemName] = React.useState('');
  const [currentRecord, setCurrentRecord] = React.useState<Module | null>(null);
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);

  const triggerProjectUpdate = (): void => {
    if (props.project) {
      props.setProject({...props.project});
    }
  }
  React.useEffect(() => {
    if (!props.project || props.moduleType === null) {
      setModules([]);
      return;
    }

    let moduleList: Module[] = [];

    if (props.moduleType === TabType.MECHANISM) {
      moduleList = props.project.mechanisms.map((m) => ({
        path: m.modulePath,
        title: m.className,
        type: TabType.MECHANISM,
      }));
    } else if (props.moduleType === TabType.OPMODE) {
      moduleList = props.project.opModes.map((o) => ({
        path: o.modulePath,
        title: o.className,
        type: TabType.OPMODE,
      }));
    }

    // Sort modules alphabetically by title
    moduleList.sort((a, b) => a.title.localeCompare(b.title));
    setModules(moduleList);
  }, [props.project, props.moduleType]);

  /** Handles renaming a module. */
  const handleRename = async (origModule: Module, newClassName: string): Promise<void> => {
    if (!props.storage || !props.project) {
      return;
    }

    try {
      const newModulePath = await commonStorage.renameModuleInProject(
          props.storage,
          props.project,
          newClassName,
          origModule.path
      );

      const newModules = modules.map((module) => {
        if (module.path === origModule.path) {
          return {...module, title: newClassName, path: newModulePath};
        }
        return module;
      });

      setModules(newModules);
      triggerProjectUpdate();
    } catch (error) {
      console.error('Error renaming module:', error);
      props.setAlertErrorMessage('Failed to rename module');
    }

    setRenameModalOpen(false);
  };

  /** Handles copying a module. */
  const handleCopy = async (origModule: Module, newClassName: string): Promise<void> => {
    if (!props.storage || !props.project) {
      return;
    }

    try {
      const newModulePath = await commonStorage.copyModuleInProject(
          props.storage,
          props.project,
          newClassName,
          origModule.path
      );

      const originalModule = modules.find((module) => module.path === origModule.path);
      if (!originalModule) {
        console.error('Original module not found for copying:', origModule.path);
        props.setAlertErrorMessage('Original module not found for copying');
        return;
      }

      const newModules = [...modules];
      newModules.push({
        path: newModulePath,
        title: newClassName,
        type: originalModule.type,
      });

      setModules(newModules);
      triggerProjectUpdate();
    } catch (error) {
      console.error('Error copying module:', error);
      props.setAlertErrorMessage('Failed to copy module');
    }

    setCopyModalOpen(false);
  };

  /** Handles adding a new module. */
  const handleAddNewItem = async (): Promise<void> => {
    const newClassName = newItemName.trim();
    if (!newClassName || !props.storage || !props.project) {
      return;
    }

    const storageType = props.moduleType === TabType.MECHANISM ?
      commonStorage.MODULE_TYPE_MECHANISM :
      commonStorage.MODULE_TYPE_OPMODE;

    await commonStorage.addModuleToProject(
        props.storage,
        props.project,
        storageType,
        newClassName
    );

    const newModule = commonStorage.findModuleByClassName(props.project, newClassName);
    if (newModule) {
      const module: Module = {
        path: newModule.modulePath,
        title: newModule.className,
        type: props.moduleType,
      };
      setModules([...modules, module]);
    }

    setNewItemName('');
    triggerProjectUpdate();};

  /** Handles delete confirmation for a module. */
  const handleDeleteConfirm = async (record: Module): Promise<void> => {
    const newModules = modules.filter((m) => m.path !== record.path);
    setModules(newModules);

    if (props.storage && props.project) {
      await commonStorage.removeModuleFromProject(
          props.storage,
          props.project,
          record.path
      );
      triggerProjectUpdate();
    }
  };

  /** Handles button click events to prevent row selection. */
  const handleButtonClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  /** Handles row double-click to open module in tab. */
  const handleRowDoubleClick = (record: Module): void => {
    props.gotoTab(record.path);
    props.onCancel();
  };

  /** Opens the rename modal for a specific module. */
  const openRenameModal = (record: Module): void => {
    setCurrentRecord(record);
    setName(record.title);
    setRenameModalOpen(true);
  };

  /** Opens the copy modal for a specific module. */
  const openCopyModal = (record: Module): void => {
    setCurrentRecord(record);
    setName(record.title + 'Copy');
    setCopyModalOpen(true);
  };

  /** Table column configuration. */
  const columns: Antd.TableProps<Module>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      ellipsis: {
        showTitle: false,
      },
      render: (title: string) => (
        <Antd.Tooltip title={title}>
          {title}
        </Antd.Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: ACTIONS_COLUMN_WIDTH,
      render: (_, record: Module) => (
        <Antd.Space size="small">
          <Antd.Tooltip title={t('Rename')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                handleButtonClick(e);
                openRenameModal(record);
              }}
            />
          </Antd.Tooltip>
          <Antd.Tooltip title={t('Copy')}>
            <Antd.Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={(e) => {
                handleButtonClick(e);
                openCopyModal(record);
              }}
            />
          </Antd.Tooltip>
          <Antd.Tooltip title={t('Delete')}>
            <Antd.Popconfirm
              title={`Delete ${record.title}?`}
              description="This action cannot be undone."
              onConfirm={() => handleDeleteConfirm(record)}
              okText={t('Delete')}
              cancelText={t('Cancel')}
              okType="danger"
            >
              <Antd.Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={handleButtonClick}
              />
            </Antd.Popconfirm>
          </Antd.Tooltip>
        </Antd.Space>
      ),
    },
  ];

  /** Gets the modal title based on module type. */
  const getModalTitle = (): string => {
    return `${TabTypeUtils.toString(props.moduleType)} Management`;
  };

  /** Gets the rename modal title. */
  const getRenameModalTitle = (): string => {
    if (!currentRecord) {
      return 'Rename';
    }
    return `Rename ${TabTypeUtils.toString(currentRecord.type)}: ${currentRecord.title}`;
  };

  /** Gets the copy modal title. */
  const getCopyModalTitle = (): string => {
    if (!currentRecord) {
      return 'Copy';
    }
    return `Copy ${TabTypeUtils.toString(currentRecord.type)}: ${currentRecord.title}`;
  };

  /** Gets the empty table text based on module type. */
  const getEmptyText = (): string => {
    const moduleTypeString = TabTypeUtils.toString(props.moduleType || TabType.OPMODE);
    return `No ${moduleTypeString.toLowerCase()} files found`;
  };

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
          <ClassNameComponent
            tabType={currentRecord.type}
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleRename(currentRecord, name);
              }
            }}
            project={props.project}
            storage={props.storage}
            buttonLabel=""
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
          <ClassNameComponent
            tabType={currentRecord.type}
            newItemName={name}
            setNewItemName={setName}
            onAddNewItem={() => {
              if (currentRecord) {
                handleCopy(currentRecord, name);
              }
            }}
            project={props.project}
            storage={props.storage}
            buttonLabel=""
          />
        )}
      </Antd.Modal>

      <Antd.Modal
        title={getModalTitle()}
        open={props.isOpen}
        onCancel={props.onCancel}
        footer={[
          <Antd.Button key="close" onClick={props.onCancel}>
            {t('Close')}
          </Antd.Button>,
        ]}
        width={MODAL_WIDTH}
      >
        <div style={{
          marginBottom: 16,
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '12px',
        }}>
          <ClassNameComponent
            tabType={props.moduleType}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onAddNewItem={handleAddNewItem}
            project={props.project}
            storage={props.storage}
            buttonLabel={t('New')}
          />
        </div>
        <Antd.Table<Module>
          columns={columns}
          dataSource={modules}
          rowKey="path"
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
            emptyText: getEmptyText(),
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleRowDoubleClick(record),
          })}
        />
      </Antd.Modal>
    </>
  );
}