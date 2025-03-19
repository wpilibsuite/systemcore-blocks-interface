import React from 'react';
import * as Antd from 'antd';
import {
    AppstoreAddOutlined as MechanismAddOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    FileAddOutlined as OpModeAddOutlined,
    FolderAddOutlined as ProjectAddOutlined,
    SaveOutlined,
    UploadOutlined,
} from '@ant-design/icons';

type voidFunc = () => void;

interface ModuleButtonProps {
    currentModulePath : string;
    handleNewProjectClicked : voidFunc;
    handleNewMechanismClicked : voidFunc;
    handleNewOpModeClicked : voidFunc;
    handleSaveClicked : voidFunc;
    handleRenameClicked : voidFunc;
    handleCopyClicked : voidFunc;
    handleDeleteClicked : voidFunc;
    handleDownloadClicked : voidFunc;

    uploadProps : Antd.UploadProps;

    renameTooltip : string;
    copyTooltip : string;
    deleteTooltip : string;    
}

export default function ModuleButtons(props : ModuleButtonProps){
    return(
        <Antd.Flex vertical gap="small">
        <Antd.Space>
            <Antd.Tooltip title="New Project"
                placement="bottomRight"
            >
                <Antd.Button
                    icon={<ProjectAddOutlined />}
                    size="small"
                    onClick={props.handleNewProjectClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="New Mechanism">
                <Antd.Button
                    icon={<MechanismAddOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleNewMechanismClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="New OpMode">
                <Antd.Button
                    icon={<OpModeAddOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleNewOpModeClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="Save">
                <Antd.Button
                    icon={<SaveOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleSaveClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
        </Antd.Space>
        <Antd.Space>
            <Antd.Tooltip title={props.renameTooltip}
                placement="topRight"
            >
                <Antd.Button
                    icon={<EditOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleRenameClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title={props.copyTooltip}>
                <Antd.Button
                    icon={<CopyOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleCopyClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title={props.deleteTooltip}>
                <Antd.Button
                    icon={<DeleteOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleDeleteClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="Upload Project">
                <Antd.Upload
                    {...props.uploadProps}
                    showUploadList={false}
                >
                    <Antd.Button
                        icon={<UploadOutlined />}
                        size="small"
                        style={{ color: 'white' }}
                    >
                    </Antd.Button>
                </Antd.Upload>
            </Antd.Tooltip>
            <Antd.Tooltip title="Download Project">
                <Antd.Button
                    icon={<DownloadOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleDownloadClicked}
                    style={{ color: 'white' }}
                >
                </Antd.Button>
            </Antd.Tooltip>
        </Antd.Space>
    </Antd.Flex>
    );
}