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
import * as React from 'react';
import * as Antd from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

declare const __APP_VERSION__: string;
const __APP_NAME__ = "SystemCore Blocks";

interface AboutDialogProps {
    open: boolean;
    onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({
    open,
    onClose,
}) => {
    const { t } = useTranslation();
    const [attributions, setAttributions] = React.useState<string>(t('ABOUT.LOADING_ATTRIBUTIONS'));
    const [dependencies, setDependencies] = React.useState<string>(t('ABOUT.LOADING_DEPENDENCIES'));

    React.useEffect(() => {
        if (open) {
            loadAttributions();
            loadDependencies();
        }
    }, [open]);
    interface LicenseInfo{
        name: string;
        version: string;
        authors: string;
        url: string;
        license: string;
    }

    const loadAttributions = async () => {
        try {
            const response = await fetch('licenseInfos.json');
            if (response.ok) {
                const licenses : LicenseInfo[] = await response.json();
                let text = ''

                licenses.forEach((licenseData) => {
                    text += `${t('ABOUT.NAME')}: ${licenseData.name}\n`;
                    text += `${t('ABOUT.VERSION')}: ${licenseData.version}\n`;
                    text += `${t('ABOUT.AUTHORS')}: ${licenseData.authors}\n`;
                    text += `${t('ABOUT.URL')}: ${licenseData.url}\n`;
                    text += `${t('ABOUT.LICENSE')}: ${licenseData.license}\n`;
                    text += `\n`;
                });

                setAttributions(text);
            } else {
                setAttributions(t('ABOUT.ATTRIBUTIONS_NOT_FOUND'));
            }
        } catch (error) {
            console.error('Error loading attributions:', error);
            setAttributions(t('ABOUT.ERROR_LOADING_ATTRIBUTIONS'));
        }
    };

    const loadDependencies = async () => {
        try {
            // Try to load package.json to get dependency versions
            const response = await fetch('/package.json');
            if (response.ok) {
                const packageData = await response.json();
                const deps = packageData.dependencies || {};

                let depText = '';

                Object.entries(deps).forEach(([name, version]) => {
                    let versionText = version as string
                    versionText = versionText.startsWith('^') ||
                        versionText.startsWith('~') ? versionText.slice(1) : versionText;
                    depText += `${name}: ${versionText}\n`;
                });
                setDependencies(depText);
            } else {
                setDependencies(t('ABOUT.DEPENDENCIES_NOT_AVAILABLE'));
            }
        } catch (error) {
            console.error('Error loading dependencies:', error);
            setDependencies(t('ABOUT.ERROR_LOADING_DEPENDENCIES'));
        }
    };

    return (
        <Antd.Modal
            title={
                <Antd.Space>
                    <InfoCircleOutlined />
                    {t('ABOUT.TITLE')}
                </Antd.Space>
            }
            open={open}
            footer={[<Antd.Button key="submit" onClick={onClose}>{t('ABOUT.OK')}</Antd.Button>]}
            onCancel={onClose}
            onOk={onClose}
            width={600}
            centered
        >
            <Antd.Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                    <Antd.Typography.Title level={4}>{__APP_NAME__}</Antd.Typography.Title>
                    <Antd.Typography.Text>{t('ABOUT.VERSION')}: {__APP_VERSION__}</Antd.Typography.Text>
                </div>

                <Antd.Divider style={{ margin: '8px 0' }} />

                <Antd.Tabs
                    items={[
                        {
                            key: 'attributions',
                            label: t('ABOUT.TAB_ATTRIBUTIONS'),
                            children: (
                                <Antd.Input.TextArea
                                    value={attributions}
                                    readOnly
                                    rows={12}
                                    style={{
                                        resize: 'none',
                                        fontFamily: 'monospace',
                                        fontSize: '12px'
                                    }}
                                />
                            )
                        },
                        {
                            key: 'dependencies',
                            label: t('ABOUT.TAB_DEPENDENCIES'),
                            children: (
                                <Antd.Input.TextArea
                                    value={dependencies}
                                    readOnly
                                    rows={12}
                                    style={{
                                        resize: 'none',
                                        fontFamily: 'monospace',
                                        fontSize: '12px'
                                    }}
                                />
                            )
                        }
                    ]}
                />

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Antd.Typography.Text type="secondary">
                        {t('ABOUT.COPYRIGHT')}
                    </Antd.Typography.Text>
                </div>
            </Antd.Space>
        </Antd.Modal>
    );
};

export default AboutDialog;