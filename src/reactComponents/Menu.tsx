import * as Antd from 'antd';
import React from 'react';

import * as commonStorage from '../storage/common_storage';
import * as I18Next from "react-i18next";
import { TabType } from "./Tabs";


import {
    SettingOutlined,
    CodeOutlined,
    BlockOutlined,
    FileOutlined,
    FolderOutlined,
    RobotOutlined,
    SaveOutlined
} from '@ant-design/icons';
import FileManageModal from './FileManageModal';
import ProjectManageModal from './ProjectManageModal';

export interface MenuProps {
    setAlertErrorMessage: (message: string) => void;
    storage: commonStorage.Storage | null;
    gotoTab: (tabKey: string) => void;
    project: commonStorage.Project | null;
    setProject: (project: commonStorage.Project | null) => void;
}

type MenuItem = Required<Antd.MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}
function getDivider(): MenuItem {
    return {
        type: 'divider', // Must have
    } as MenuItem;
}

function getMenuItems(project: commonStorage.Project): MenuItem[] {
    let mechanisms: MenuItem[] = [];
    let opmodes: MenuItem[] = [];
    project.mechanisms.forEach((mechanism) => {
        mechanisms.push(getItem(mechanism.className, mechanism.modulePath, <BlockOutlined />));
    });
    if (mechanisms.length) {
        mechanisms.push(getDivider());
    }
    mechanisms.push(getItem('Manage...', 'manageMechanisms'));

    project.opModes.forEach((opmode) => {
        opmodes.push(getItem(opmode.className, opmode.modulePath, <CodeOutlined />));
    });
    if (opmodes.length) {
        opmodes.push(getDivider());
    }
    opmodes.push(getItem('Manage...', 'manageOpmodes'));


    return [
        getItem('Project', '100', <FolderOutlined />, [
            getItem('Save', 'save', <SaveOutlined />),
            getItem('Deploy', 'deploy'),
            getDivider(),
            getItem('Manage...', 'manageProjects')
        ]),
        getItem('Explorer', 'explorer', <FileOutlined />, [
            getItem('Robot', project.modulePath, <RobotOutlined />),
            getItem('Mechanisms', '2', <BlockOutlined />, mechanisms),
            getItem('OpModes', '3', <CodeOutlined />, opmodes),
        ]),
        getItem('Settings', '4', <SettingOutlined />, [
            getItem('WPI toolbox', '42')
        ]),
    ]
}

export function Component(props: MenuProps) {
    const { t } = I18Next.useTranslation();

    const [modules, setModules] = React.useState<commonStorage.Project[]>([]);
    const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
    const [fileModalOpen, setFileModalOpen] = React.useState<boolean>(false);
    const [projectModalOpen, setProjectModalOpen] = React.useState<boolean>(false);
    const [moduleType, setModuleType] = React.useState<TabType>(TabType.MECHANISM);
    const [noProjects, setNoProjects] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!props.storage) {
            return;
        }
        initializeModules();
    }, [props.storage]);

    const fetchMostRecentProject = async () => {
        let found = false;

        if (props.storage) {
            let mostRecentProject = await props.storage.fetchEntry('mostRecentProject', '');
            modules.forEach((module) => {
                if (module.projectName === mostRecentProject) {
                    props.setProject(module);
                    found = true;
                }
            });
            if (!found && modules.length > 0) {
                props.setProject(modules[0]);
            }
        }
    };

    React.useEffect(() => {
        fetchMostRecentProject();
    }, [modules]);

    React.useEffect(() => {            
        const setMostRecentProject = async () => {
            if (props.storage) {
                props.storage.saveEntry('mostRecentProject', props.project?.projectName || '');
            }
        }
        if (props.project) {
            setMostRecentProject();
            setMenuItems(getMenuItems(props.project));
            setNoProjects(false);
        }
    }, [props.project]);

    const initializeModules = async () => {
        const array = await fetchListOfModules();
        if (array.length === 0) {
            setNoProjects(true);
            setProjectModalOpen(true);
        }
    };
    const fetchListOfModules = async (): Promise<commonStorage.Project[]> => {
        return new Promise(async (resolve, reject) => {
            if (!props.storage) {
                reject(new Error());
                return;
            }
            try {
                const array = await props.storage.listModules();
                setModules(array)
                resolve(array);
            } catch (e) {
                console.log('Failed to load the list of modules. Caught the following error...');
                console.log(e);
                props.setAlertErrorMessage(t("fail_list_modules"));
                reject(new Error(t("fail_list_modules")));
            }
        });
    };

    const handleClick: Antd.MenuProps['onClick'] = ({ key }) => {
        let newModule = props.project ? commonStorage.findModuleInProject(props.project, key) : null;
        if (newModule) {
            props.gotoTab(newModule.modulePath);
        }
        else {
            if (key === 'manageMechanisms') {
                setModuleType(TabType.MECHANISM);
                setFileModalOpen(true);
            } else if (key === 'manageOpmodes') {
                setModuleType(TabType.OPMODE);
                setFileModalOpen(true);
            } else if (key === 'manageProjects') {
                setProjectModalOpen(true);
            }
            else {
                // TODO: It wasn't a module, so do the other thing...
                console.log(`Selected key that wasn't module: ${key}`);
            }
        }
    };

    return (
        <>
            <FileManageModal
                isOpen={fileModalOpen}
                onCancel={() => {
                    setFileModalOpen(false);
                }}
                project={props.project}
                storage={props.storage}
                moduleType={moduleType}
                setProject={props.setProject}
                setAlertErrorMessage={props.setAlertErrorMessage}
                gotoTab={props.gotoTab}
            />
            <ProjectManageModal
                noProjects={noProjects}
                isOpen={projectModalOpen}
                onCancel={() => {
                    setProjectModalOpen(false);
                }}
                storage={props.storage}
                moduleType={moduleType}
                setProject={props.setProject}
                setAlertErrorMessage={props.setAlertErrorMessage}
            />
            <Antd.Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                mode="inline"
                items={menuItems}
                onClick={handleClick}
            />
        </>
    );
}
