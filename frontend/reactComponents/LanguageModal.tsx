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
 * @fileoverview Language selection modal component.
 */

import * as React from 'react';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';

interface LanguageOption {
    code: string;
    nameKey: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
    { code: 'en', nameKey: 'ENGLISH' },
    { code: 'es', nameKey: 'SPANISH' },
    { code: 'fr', nameKey: 'FRENCH' },
    { code: 'he', nameKey: 'HEBREW' },
];

export interface LanguageModalProps {
    open: boolean;
    onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ open, onClose }) => {
    const { t, i18n } = I18Next.useTranslation();
    const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.language);

    React.useEffect(() => {
        setSelectedLanguage(i18n.language);
    }, [i18n.language, open]);

    const handleApply = () => {
        i18n.changeLanguage(selectedLanguage);
        onClose();
    };

    const handleCancel = () => {
        setSelectedLanguage(i18n.language);
        onClose();
    };

    return (
        <Antd.Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <GlobalOutlined />
                    {t('SELECT_LANGUAGE')}
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
                    disabled={selectedLanguage === i18n.language}
                >
                    {t('OK')}
                </Antd.Button>,
            ]}
            destroyOnHidden
        >
            <div style={{ padding: '16px 0' }}>
                <Antd.Select
                    value={selectedLanguage}
                    onChange={(value) => setSelectedLanguage(value)}
                    style={{ width: '100%' }}
                    options={LANGUAGE_OPTIONS.map((lang) => ({
                        value: lang.code,
                        label: t(lang.nameKey),
                    }))}
                />
            </div>
        </Antd.Modal>
    );
};

export default LanguageModal;
