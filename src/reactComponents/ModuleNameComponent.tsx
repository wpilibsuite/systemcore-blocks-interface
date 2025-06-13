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

type Module = {
    path: string;
    title: string;
    type: TabType;
}

type ModuleNameComponentProps = {
    tabType: TabType;
    newItemName: string;
    setNewItemName: (name: string) => void;
    onAddNewItem: () => void;
    project: commonStorage.Project | null;
    availableItems: Module[];
    handleSelectItem: (item: Module) => void;
    storage: commonStorage.Storage | null;
};

export default function ModuleNameComponent(props: ModuleNameComponentProps) {
    const { t } = I18Next.useTranslation();
    const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
    const [alertErrorVisible, setAlertErrorVisible] = React.useState(false);

    const handleAddNewItem = () => {
        if (props.newItemName.trim()) {
            // Check if there's an exact match in available items
            const matchingItem = props.availableItems.find(item =>
                item.title.toLowerCase() === props.newItemName.trim().toLowerCase()
            );

            if (matchingItem) {
                // Move the matching item to selected
                props.handleSelectItem(matchingItem);
                props.setNewItemName("");
                setAlertErrorVisible(false);
                setAlertErrorMessage('');
            } else {
                if (props.project) {
                    const { ok, error } = commonStorage.isClassNameOk(props.project, props.newItemName.trim());                    
                    if (ok) {
                        setAlertErrorVisible(false);
                        setAlertErrorMessage('');
                        // Create new item logic here if needed
                        props.onAddNewItem();
                    }else {
                        setAlertErrorMessage(error);
                        setAlertErrorVisible(true);
                    }
                } else {
                        props.onAddNewItem();
                }
            }
        }
    };

    return (
        <>
            <Antd.Typography.Paragraph>{t("class_rule_description")}</Antd.Typography.Paragraph>
            <Antd.Typography.Paragraph>{(props.tabType == TabType.MECHANISM) ? t("example_mechanism") : t("example_opmode")}</Antd.Typography.Paragraph>
            <Antd.Space.Compact style={{ width: '100%' }}>
                <Antd.Input
                    style={{ width: 'calc(100% - 80px)' }}
                    placeholder={t("addTabDialog.newItemPlaceholder")}
                    value={props.newItemName}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Force first character to be uppercase
                        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
                        props.setNewItemName(capitalizedValue);
                        // Clear error when user starts typing
                        if (alertErrorVisible) {
                            setAlertErrorVisible(false);
                            setAlertErrorMessage('');
                        }
                    }}
                    onPressEnter={handleAddNewItem}
                />
                <Antd.Button
                    type="primary"
                    onClick={handleAddNewItem}
                >
                    {t("Add")}
                </Antd.Button>
            </Antd.Space.Compact>
            {alertErrorVisible && (
                <Antd.Alert
                    type="error"
                    message={alertErrorMessage}
                    closable
                    afterClose={() => setAlertErrorVisible(false)}
                    style={{ marginTop: 8 }}
                />
            )}
        </>
    );
}