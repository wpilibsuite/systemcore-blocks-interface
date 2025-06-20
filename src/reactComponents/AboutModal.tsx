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

declare const __APP_VERSION__: string;
declare const __APP_NAME__: string;

interface AboutDialogProps {
    visible: boolean;
    onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({
    visible,
    onClose,
}) => {
    const [attributions, setAttributions] = React.useState<string>('Loading attributions...');
    const [dependencies, setDependencies] = React.useState<string>('Loading dependencies...');
    const attributionsFile = '/attributions.txt'; // Path to the attributions file

    React.useEffect(() => {
        if (visible) {
            loadAttributions();
            loadDependencies();
        }
    }, [visible, attributionsFile]);
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
                    text += `Name: ${licenseData.name}\n`;
                    text += `Version: ${licenseData.version}\n`;
                    text += `Authors: ${licenseData.authors}\n`;
                    text += `URL: ${licenseData.url}\n`;
                    text += `License: ${licenseData.license}\n`;
                    text += `\n`;
                });

                setAttributions(text);
            } else {
                setAttributions('Attributions file not found.');
            }
        } catch (error) {
            console.error('Error loading attributions:', error);
            setAttributions('Error loading attributions.');
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
                setDependencies('Dependencies information not available.');
            }
        } catch (error) {
            console.error('Error loading dependencies:', error);
            setDependencies('Error loading dependencies.');
        }
    };

    return (
        <Antd.Modal
            title={
                <Antd.Space>
                    <InfoCircleOutlined />
                    About
                </Antd.Space>
            }
            open={visible}
            footer={[<Antd.Button key="submit" onClick={onClose}>OK</Antd.Button>]}
            onCancel={onClose}
            onOk={onClose}
            width={600}
            centered
        >
            <Antd.Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                    <Antd.Typography.Title level={4}>{__APP_NAME__}</Antd.Typography.Title>
                    <Antd.Typography.Text>Version: {__APP_VERSION__}</Antd.Typography.Text>
                </div>

                <Antd.Divider style={{ margin: '8px 0' }} />

                <Antd.Tabs
                    items={[
                        {
                            key: 'attributions',
                            label: 'Third-Party Attributions',
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
                            label: 'Dependencies',
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
                        © 2025 FIRST. All rights reserved.
                    </Antd.Typography.Text>
                </div>
            </Antd.Space>
        </Antd.Modal>
    );
};

export default AboutDialog;