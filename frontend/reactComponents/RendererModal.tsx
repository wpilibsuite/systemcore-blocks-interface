/**
 * @license
 * Copyright 2026 Porpoiseful LLC
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
 * @fileoverview Block style (renderer) selection modal component.
 */

import * as React from 'react';
import * as Antd from 'antd';
import * as Blockly from 'blockly/core';
import * as I18Next from 'react-i18next';
import { BuildOutlined } from '@ant-design/icons';

import BlocklyComponent from './BlocklyComponent';

interface RendererOption {
    key: string;
    name: string;
    description: string;
}

export interface RendererModalProps {
    open: boolean;
    onClose: () => void;
    currentRenderer: string;
    currentTheme: string;
    onRendererChange: (renderer: string) => void;
}

/** Module path used for the isolated preview workspace. It isn't a real module. */
const PREVIEW_MODULE_PATH = '__renderer_preview__';

/** A small sample block layout used to preview each renderer's visual style. */
const PREVIEW_WORKSPACE_STATE = {
    blocks: {
        languageVersion: 0,
        blocks: [
            {
                type: 'controls_if',
                x: 20,
                y: 20,
                inputs: {
                    IF0: {
                        block: {
                            type: 'logic_compare',
                            fields: { OP: 'EQ' },
                            inputs: {
                                A: { block: { type: 'math_number', fields: { NUM: 1 } } },
                                B: { block: { type: 'math_number', fields: { NUM: 1 } } },
                            },
                        },
                    },
                    DO0: {
                        block: {
                            type: 'text_print',
                            inputs: {
                                TEXT: { block: { type: 'text', fields: { TEXT: 'Hello' } } },
                            },
                        },
                    },
                },
                next: {
                    block: {
                        type: 'controls_repeat_ext',
                        inputs: {
                            TIMES: { block: { type: 'math_number', fields: { NUM: 10 } } },
                            DO: {
                                block: {
                                    type: 'text_print',
                                    inputs: {
                                        TEXT: { block: { type: 'text', fields: { TEXT: 'Hi' } } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ],
    },
};

const RendererModal: React.FC<RendererModalProps> = ({
    open,
    onClose,
    currentRenderer,
    currentTheme,
    onRendererChange,
}) => {
    const { t } = I18Next.useTranslation();
    const [selectedRenderer, setSelectedRenderer] = React.useState(currentRenderer);

    const RENDERER_OPTIONS: RendererOption[] = [
        {
            key: 'zelos',
            name: t('RENDERER_MODAL.ZELOS'),
            description: t('RENDERER_MODAL.ZELOS_DESCRIPTION'),
        },
        {
            key: 'geras',
            name: t('RENDERER_MODAL.GERAS'),
            description: t('RENDERER_MODAL.GERAS_DESCRIPTION'),
        },
        {
            key: 'thrasos',
            name: t('RENDERER_MODAL.THRASOS'),
            description: t('RENDERER_MODAL.THRASOS_DESCRIPTION'),
        },
    ];

    React.useEffect(() => {
        setSelectedRenderer(currentRenderer);
    }, [currentRenderer, open]);

    /** Loads the sample blocks into the preview workspace once it (re)initializes. */
    const handlePreviewWorkspaceCreated = (_modulePath: string, workspace: Blockly.WorkspaceSvg): void => {
        Blockly.serialization.workspaces.load(PREVIEW_WORKSPACE_STATE, workspace);
    };

    const handleApply = () => {
        onRendererChange(selectedRenderer);
        onClose();
    };

    const handleCancel = () => {
        setSelectedRenderer(currentRenderer);
        onClose();
    };

    return (
        <Antd.Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BuildOutlined />
                    {t('RENDERER_MODAL.SELECTION')}
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={[
                <Antd.Button key="cancel" onClick={handleCancel}>
                    {t('CANCEL')}
                </Antd.Button>,
                <Antd.Button
                    key="apply"
                    type="primary"
                    onClick={handleApply}
                    disabled={selectedRenderer === currentRenderer}
                >
                    {t('RENDERER_MODAL.APPLY')}
                </Antd.Button>,
            ]}
            width={600}
            destroyOnHidden
        >
            <div style={{ padding: '16px 0' }}>
                <Antd.Typography.Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                    {t('RENDERER_MODAL.CHOOSE_DESCRIPTION')}
                </Antd.Typography.Text>

                <Antd.Select
                    value={selectedRenderer}
                    onChange={(value) => setSelectedRenderer(value)}
                    style={{ width: '100%' }}
                    options={RENDERER_OPTIONS.map((renderer) => ({
                        value: renderer.key,
                        label: renderer.name,
                    }))}
                />

                <Antd.Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                    {RENDERER_OPTIONS.find((renderer) => renderer.key === selectedRenderer)?.description}
                </Antd.Typography.Text>

                <div
                    style={{
                        marginTop: 16,
                        height: 300,
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                    }}
                >
                    {open && (
                        <BlocklyComponent
                            modulePath={PREVIEW_MODULE_PATH}
                            theme={currentTheme}
                            renderer={selectedRenderer}
                            readOnly
                            onBlocklyComponentCreated={() => {}}
                            onWorkspaceCreated={handlePreviewWorkspaceCreated}
                        />
                    )}
                </div>
            </div>
        </Antd.Modal>
    );
};

export default RendererModal;
