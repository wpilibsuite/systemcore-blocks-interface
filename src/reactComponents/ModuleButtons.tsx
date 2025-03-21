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
                <Antd.Button className="smallButton"
                    icon={<ProjectAddOutlined />}
                    size="small"
                    onClick={props.handleNewProjectClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="New Mechanism">
                <Antd.Button className="smallButton"
                    icon={<MechanismAddOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleNewMechanismClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="New OpMode">
                <Antd.Button className="smallButton"
                    icon={<OpModeAddOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleNewOpModeClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="Save">
                <Antd.Button className="smallButton"
                    icon={<SaveOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleSaveClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
        </Antd.Space>
        <Antd.Space>
            <Antd.Tooltip title={props.renameTooltip}
                placement="topRight"
            >
                <Antd.Button className="smallButton"
                    icon={<EditOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleRenameClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title={props.copyTooltip}>
                <Antd.Button className="smallButton"
                    icon={<CopyOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleCopyClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title={props.deleteTooltip}>
                <Antd.Button className="smallButton"
                    icon={<DeleteOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleDeleteClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
            <Antd.Tooltip title="Upload Project">
                <Antd.Upload
                    {...props.uploadProps}
                    showUploadList={false}
                >
                    <Antd.Button className="smallButton"
                        icon={<UploadOutlined />}
                        size="small"
                    >
                    </Antd.Button>
                </Antd.Upload>
            </Antd.Tooltip>
            <Antd.Tooltip title="Download Project">
                <Antd.Button className="smallButton"
                    icon={<DownloadOutlined />}
                    size="small"
                    disabled={!props.currentModulePath}
                    onClick={props.handleDownloadClicked}
                >
                </Antd.Button>
            </Antd.Tooltip>
        </Antd.Space>
    </Antd.Flex>
    );
}