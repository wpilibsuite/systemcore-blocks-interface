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
import { TabType } from "./Tabs";
import * as Antd from "antd";
import * as I18Next from "react-i18next";
import * as React from "react";
import * as commonStorage from "../storage/common_storage";
import { EditOutlined, DeleteOutlined, CopyOutlined, SelectOutlined } from '@ant-design/icons';
import ProjectNameComponent from "./ProjectNameComponent";

type ProjectManageModalProps = {
    isOpen: boolean;
    noProjects: boolean;
    onCancel: () => void;
    setProject: (project: commonStorage.Project | null) => void;
    setAlertErrorMessage: (message: string) => void;
    storage: commonStorage.Storage | null;
    moduleType: TabType;
}

export default function ProjectManageModal(props: ProjectManageModalProps) {
    const { t } = I18Next.useTranslation();
    const [modules, setModules] = React.useState<commonStorage.Project[]>([]);
    const [newItemName, setNewItemName] = React.useState('');
    const [currentRecord, setCurrentRecord] = React.useState<commonStorage.Project | null>(null);
    const [renameModalOpen, setRenameModalOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [copyModalOpen, setCopyModalOpen] = React.useState(false);

    const loadModules = async (storage: commonStorage.Storage) => {
        let projects = await storage.listModules();

        // Sort modules alphabetically by title
        projects.sort((a, b) => a.className.localeCompare(b.className));
        setModules(projects);
        if( (projects.length > 0) && props.noProjects) {
            props.setProject(projects[0]); // Set the first project as the current project
            props.onCancel(); // Close the modal after selecting
        }
    };

    React.useEffect(() => {
        if (props.storage) {
            loadModules(props.storage);
        }
    }, [props.storage, props.isOpen]);

    const handleRename = async (origModule: commonStorage.Project, newName: string) => {
        if (props.storage) {
            try {
                await props.storage.renameModule(commonStorage.MODULE_TYPE_PROJECT,
                    origModule.className, origModule.className, newName);
                await loadModules(props.storage);
            } catch (error) {
                console.error('Error renaming module:', error);
                props.setAlertErrorMessage('Failed to rename module');
            }
        }
        setRenameModalOpen(false);
    };

    const handleCopy = async (origModule: commonStorage.Project, newName: string) => {
        if (props.storage) {
            try {
                await props.storage.copyModule(commonStorage.MODULE_TYPE_PROJECT,
                    origModule.className, origModule.className, newName);
                await loadModules(props.storage);
            } catch (error) {
                console.error('Error copying module:', error);
                props.setAlertErrorMessage('Failed to copy module');
            }
        }
        setCopyModalOpen(false);
    };

    const handleAddNewItem = async () => {
        let trimmedName = newItemName.trim();
        if (trimmedName) {
            if (props.storage) {
                const newProjectName = commonStorage.classNameToModuleName(trimmedName);
                const newProjectPath = commonStorage.makeProjectPath(newProjectName);

                const projectContent = commonStorage.newProjectContent(newProjectName);
                try {
                    await props.storage.createModule(
                        commonStorage.MODULE_TYPE_PROJECT, newProjectPath, projectContent);
                } catch (e) {
                    console.log('Failed to create a new project. Caught the following error...');
                    console.log(e);
                    props.setAlertErrorMessage('Failed to create a new project.');
                }
            }
            setNewItemName("");
            await loadModules(props.storage!);
        }
    };

    const columns: Antd.TableProps<commonStorage.Project>['columns'] = [
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
            width: 160,
            render: (_, record: commonStorage.Project) => (
                <Antd.Space size="small">
                     <Antd.Tooltip title={t("Select")}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<SelectOutlined />}
                            onClick={(e) => {
                                props.setProject(record);
                                props.onCancel(); // Close the modal after selecting
                            }}
                        />
                    </Antd.Tooltip>
                    <Antd.Tooltip title={t("Rename")}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                setCurrentRecord(record);
                                setName(record.className);
                                setRenameModalOpen(true);
                            }}
                        />
                    </Antd.Tooltip>
                    <Antd.Tooltip title={t("Copy")}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={(e) => {
                                setCurrentRecord(record);
                                setName(record.className + 'Copy');
                                setCopyModalOpen(true);
                            }}
                        />
                    </Antd.Tooltip>
                    <Antd.Tooltip title={t("Delete")}>
                        <Antd.Popconfirm
                            title={`Delete ${record.className}?`}
                            description="This action cannot be undone."
                            onConfirm={async () => {
                                const newModules = modules.filter(m => m.modulePath !== record.modulePath);
                                setModules(newModules);
                                let foundAnotherProject = false;
                                for (const project of modules) {
                                    if (project.modulePath !== record.modulePath) {
                                        props.setProject(project);
                                        foundAnotherProject = true;
                                        break;
                                    }
                                }
                                if (!foundAnotherProject) {
                                    props.setProject(null);
                                }
                                try {
                                    await props.storage!.deleteModule(commonStorage.MODULE_TYPE_PROJECT, record.modulePath);
                                } catch (e) {
                                    console.log('Failed to delete the project. Caught the following error...');
                                    console.log(e);
                                    props.setAlertErrorMessage('Failed to delete the project.');
                                }
                            }}
                            okText={t("Delete")}
                            cancelText={t("Cancel")}
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
                </Antd.Space>
            ),
        },
    ];

    return (
        <>
            <Antd.Modal
                title={`Rename Project: ${currentRecord ? currentRecord.className : ''}`}
                open={renameModalOpen}
                onCancel={() => setRenameModalOpen(false)}
                onOk={() => {
                    if (currentRecord) {
                        handleRename(currentRecord, name);
                    }
                }}
                okText={t("Rename")}
                cancelText={t("Cancel")}
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
                        projects={modules}
                        setProjects={setModules}
                    />
                )}
            </Antd.Modal>
            <Antd.Modal
                title={`Copy Project: ${currentRecord ? currentRecord.className : ''}`}
                open={copyModalOpen}
                onCancel={() => setCopyModalOpen(false)}
                onOk={() => {
                    if (currentRecord) {
                        handleCopy(currentRecord, name);
                    }
                }}
                okText={t("Copy")}
                cancelText={t("Cancel")}
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
                        projects={modules}
                        setProjects={setModules}
                    />
                )}
            </Antd.Modal>

            <Antd.Modal
                title={t("Project Management")}
                open={props.isOpen}
                onCancel={props.onCancel}
                footer={[
                    <Antd.Button key="close" onClick={props.onCancel}>
                        {t("Close")}
                    </Antd.Button>
                ]}
                width={800}
            >
                {props.noProjects && (
                    <Antd.Alert
                        message="No projects found"
                        description="Please create a new project to get started."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}
                <div style={{
                    marginBottom: 16,
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '12px'
                }}>
                    <ProjectNameComponent
                        newItemName={newItemName}
                        setNewItemName={setNewItemName}
                        onAddNewItem={handleAddNewItem}
                        projects={modules}
                        setProjects={setModules}
                    />
                </div>
                {!props.noProjects && (
                    <Antd.Table<commonStorage.Project>
                        columns={columns}
                        dataSource={modules}
                        rowKey="modulePath"
                        size="small"
                        pagination={modules.length > 5 ? {
                            pageSize: 5,
                            showSizeChanger: false,
                            showQuickJumper: false,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                        } : false}
                        bordered
                        locale={{
                            emptyText: 'No projects found'
                        }}
                        onRow={(record) => ({
                            onDoubleClick: () => {
                                props.setProject(record);
                                props.onCancel(); // Close the modal after selecting
                            }
                        })}
                    />)}
            </Antd.Modal>
        </>
    );
}