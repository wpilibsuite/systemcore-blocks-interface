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
 * @fileoverview Language settings tab of the settings dialog.
 */

import * as React from 'react';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';

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

export interface LanguageSettingsProps {
    language: string;
    onLanguageChange: (language: string) => void;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ language, onLanguageChange }) => {
    const { t, i18n } = I18Next.useTranslation();

    return (
        <div style={{ padding: '16px 0', display: 'flex', gap: 8 }}>
            <Antd.Select
                value={language}
                onChange={onLanguageChange}
                style={{ flex: 1 }}
                options={LANGUAGE_OPTIONS.map((lang) => ({
                    value: lang.code,
                    label: t(lang.nameKey),
                }))}
            />
            {/* Changes the language right away, so the rest of the dialog is shown in it. */}
            <Antd.Button
                onClick={() => i18n.changeLanguage(language)}
                disabled={language === i18n.language}
            >
                {t('APPLY')}
            </Antd.Button>
        </div>
    );
};

export default LanguageSettings;
