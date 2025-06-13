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

    const [mostRecentModulePath, setMostRecentModulePath] = React.useState<string>('');
    const [modules, setModules] = React.useState<commonStorage.Project[]>([]);
    const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
    const [fileModalOpen, setFileModalOpen] = React.useState<boolean>(false);
    const [moduleType, setModuleType] = React.useState<TabType>(TabType.MECHANISM);

    React.useEffect(() => {
        if (!props.storage) {
            return;
        }
        fetchMostRecentModulePath();
        initializeModules();
    }, [props.storage]);

    React.useEffect(() => {
        //TODO: this needs to be different somehow
        if (modules) {
            props.setProject(modules[0]);
        }
    }, [modules]);

    React.useEffect(() => {
        if (props.project) {
            setMenuItems(getMenuItems(props.project));
        }
    }, [props.project]);

    const fetchMostRecentModulePath = async () => {
        if (!props.storage) {
            return;
        }
        try {
            const value = await props.storage.fetchEntry('mostRecentModulePath', '');
            setMostRecentModulePath(value);
        } catch (e) {
            console.log('Failed to fetch mostRecentModulePath. Caught the following error...');
            console.log(e);
        }
    };
    const initializeModules = async () => {
        const array = await fetchListOfModules();
        if (array.length === 0) {
            //TODO: make new project
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

    const handleSelect: Antd.MenuProps['onSelect'] = ({ key }) => {
        let newModule = props.project ? commonStorage.findModuleInProject(props.project, key) : null;
        if (newModule) {
            props.gotoTab(newModule.modulePath);
        }
        else {
            if(key === 'manageMechanisms'){
                if (!fileModalOpen || moduleType !== TabType.MECHANISM) {
                    setFileModalOpen(true);
                    setModuleType(TabType.MECHANISM);
                }
            }else if(key === 'manageOpmodes'){
                if (!fileModalOpen || moduleType !== TabType.OPMODE) {
                    setFileModalOpen(true);
                    setModuleType(TabType.OPMODE);
                }
            }else if(key === 'manageProjects'){ 
                if (!fileModalOpen || moduleType !== TabType.PROJECT) {
                    setFileModalOpen(true);
                    setModuleType(TabType.PROJECT);
                }
            }
            else{
                // TODO: It wasn't a module, so do the other thing...
                console.log(`Selected key that wasn't module: ${key}`);
            }
        }
    };

    return (
        <>
            <FileManageModal
                isOpen={fileModalOpen}
                onCancel={() => setFileModalOpen(false)}
                project={props.project}
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
                onSelect={handleSelect}
            />
        </>
    );
}
