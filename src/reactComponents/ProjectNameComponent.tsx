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
import * as Antd from "antd";
import * as I18Next from "react-i18next";
import * as React from "react";
import * as commonStorage from "../storage/common_storage";

type ProjectNameComponentProps = {
    newItemName: string;
    setNewItemName: (name: string) => void;
    onAddNewItem: () => void;
    projects: commonStorage.Project[] | null;
    setProjects: (projects: commonStorage.Project[]) => void;
};

export default function ProjectNameComponent(props: ProjectNameComponentProps) {
    const { t } = I18Next.useTranslation();
    const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
    const [alertErrorVisible, setAlertErrorVisible] = React.useState(false);

    const handleAddNewItem = () => {
        let trimmedName = props.newItemName.trim();
        if (trimmedName && props.projects) {
            if (!commonStorage.isValidClassName(trimmedName)) {
                setAlertErrorMessage(trimmedName + ' is not a valid project name. Please enter a different name.');
                setAlertErrorVisible(true);
                return;
            }
            if (props.projects.some(project => project.className === trimmedName)) {
                setAlertErrorMessage('There is already a project named ' + trimmedName + '. Please enter a different name.');
                setAlertErrorVisible(true);
                return;
            }
            props.onAddNewItem();
        }
    };

    return (
        <>
            <Antd.Typography.Paragraph>{t("class_rule_description")}</Antd.Typography.Paragraph>
            <Antd.Typography.Paragraph>{t("example_project")}</Antd.Typography.Paragraph>
            <Antd.Space.Compact style={{ width: '100%' }}>
                <Antd.Input
                    style={{ width: '100%' }}
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
                    {t("New")}
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