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
 * @fileoverview Block style (renderer) settings tab of the settings dialog.
 */

import * as React from 'react';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';

import ReadOnlyBlocklyPreview from './ReadOnlyBlocklyPreview';
import { SAMPLE_PREVIEW_MODULE_CONTENT_TEXT } from './PreviewSampleContent';
import { FIRST_BLOCKS_STYLE_RENDERER_NAME } from '../themes/first_blocks_style';

interface RendererOption {
    key: string;
    name: string;
    description: string;
}

export interface RendererSettingsProps {
    renderer: string;
    theme: string;
    onRendererChange: (renderer: string) => void;
}

const RendererSettings: React.FC<RendererSettingsProps> = ({
    renderer,
    theme,
    onRendererChange,
}) => {
    const { t } = I18Next.useTranslation();

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
        {
            key: FIRST_BLOCKS_STYLE_RENDERER_NAME,
            name: t('RENDERER_MODAL.FIRST_BLOCKS_STYLE'),
            description: t('RENDERER_MODAL.FIRST_BLOCKS_STYLE_DESCRIPTION'),
        },
    ];

    return (
        <div style={{ padding: '16px 0' }}>
            <Antd.Typography.Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                {t('RENDERER_MODAL.CHOOSE_DESCRIPTION')}
            </Antd.Typography.Text>

            <Antd.Select
                value={renderer}
                onChange={onRendererChange}
                style={{ width: '100%' }}
                options={RENDERER_OPTIONS.map((option) => ({
                    value: option.key,
                    label: option.name,
                }))}
            />

            <Antd.Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                {RENDERER_OPTIONS.find((option) => option.key === renderer)?.description}
            </Antd.Typography.Text>

            <div
                style={{
                    marginTop: 16,
                    height: 300,
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                }}
            >
                <ReadOnlyBlocklyPreview
                    moduleContentText={SAMPLE_PREVIEW_MODULE_CONTENT_TEXT}
                    theme={theme}
                    renderer={renderer}
                    interactive={false}
                />
            </div>
        </div>
    );
};

export default RendererSettings;
