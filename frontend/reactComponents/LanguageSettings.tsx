// Copyright (c) FIRST and other WPILib contributors.

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
