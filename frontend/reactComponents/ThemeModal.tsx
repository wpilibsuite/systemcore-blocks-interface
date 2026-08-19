/**
 * @fileoverview Theme selection modal component.
 */

import * as React from 'react';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import { BgColorsOutlined } from '@ant-design/icons';

import ReadOnlyBlocklyPreview from './ReadOnlyBlocklyPreview';
import { SAMPLE_PREVIEW_MODULE_CONTENT_TEXT } from './PreviewSampleContent';

interface ThemeOption {
    key: string;
    name: string;
    description: string;
}

export interface ThemeModalProps {
    open: boolean;
    onClose: () => void;
    currentTheme: string;
    currentRenderer: string;
    onThemeChange: (themeKey: string) => void;
}

const ThemeModal: React.FC<ThemeModalProps> = ({
    open,
    onClose,
    currentTheme,
    currentRenderer,
    onThemeChange,
}) => {
    const { t } = I18Next.useTranslation();
    const [selectedTheme, setSelectedTheme] = React.useState(currentTheme);

    const THEME_OPTIONS: ThemeOption[] = [
        {
            key: 'light',
            name: t('THEME_MODAL.LIGHT'),
            description: t('THEME_MODAL.LIGHT_DESCRIPTION'),
        },
        {
            key: 'dark',
            name: t('THEME_MODAL.DARK'),
            description: t('THEME_MODAL.DARK_DESCRIPTION'),
        },
        {
            key: 'tritanopia',
            name: t('THEME_MODAL.TRITANOPIA'),
            description: t('THEME_MODAL.TRITANOPIA_DESCRIPTION'),
        },
        {
            key: 'tritanopia-dark',
            name: t('THEME_MODAL.TRITANOPIA_DARK'),
            description: t('THEME_MODAL.TRITANOPIA_DARK_DESCRIPTION'),
        },
        {
            key: 'deuteranopia',
            name: t('THEME_MODAL.DEUTERANOPIA'),
            description: t('THEME_MODAL.DEUTERANOPIA_DESCRIPTION'),
        },
        {
            key: 'deuteranopia-dark',
            name: t('THEME_MODAL.DEUTERANOPIA_DARK'),
            description: t('THEME_MODAL.DEUTERANOPIA_DARK_DESCRIPTION'),
        },
    ];

    React.useEffect(() => {
        setSelectedTheme(currentTheme);
    }, [currentTheme, open]);

    const handleApply = () => {
        onThemeChange(selectedTheme);
        onClose();
    };

    const handleCancel = () => {
        setSelectedTheme(currentTheme);
        onClose();
    };

    return (
        <Antd.Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BgColorsOutlined />
                    {t('THEME_MODAL.SELECTION')}
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
                    disabled={selectedTheme === currentTheme}
                >
                    {t('THEME_MODAL.APPLY')}
                </Antd.Button>,
            ]}
            width={600}
            destroyOnHidden
        >
            <div style={{ padding: '16px 0' }}>
                <Antd.Typography.Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                    {t('THEME_MODAL.CHOOSE_DESCRIPTION')}
                </Antd.Typography.Text>

                <Antd.Select
                    value={selectedTheme}
                    onChange={(value) => setSelectedTheme(value)}
                    style={{ width: '100%' }}
                    options={THEME_OPTIONS.map((theme) => ({
                        value: theme.key,
                        label: theme.name,
                    }))}
                />

                <Antd.Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                    {THEME_OPTIONS.find((theme) => theme.key === selectedTheme)?.description}
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
                        <ReadOnlyBlocklyPreview
                            moduleContentText={SAMPLE_PREVIEW_MODULE_CONTENT_TEXT}
                            theme={selectedTheme}
                            renderer={currentRenderer}
                            interactive={false}
                        />
                    )}
                </div>
            </div>
        </Antd.Modal>
    );
};

export default ThemeModal;

export const antdThemeFromString = (theme: string): Antd.ThemeConfig => {
    let compact = false;

    if (theme == 'compact-dark') {
        compact = true;
    }
    else if (theme == 'compact') {
        compact = true;
    }
    const isDarkTheme = theme.endsWith('-dark') || theme === 'dark';

    if (isDarkTheme) {
        return {
            algorithm: compact ? [Antd.theme.darkAlgorithm, Antd.theme.compactAlgorithm] : Antd.theme.darkAlgorithm,
            components: {
                Layout: {
                    headerBg: '#000000',
                    siderBg: '#000000',
                    triggerBg: '#000000',
                },
                Menu: {
                    darkItemBg: '#000000',
                    darkSubMenuItemBg: '#000000',
                }
            }
        }
    }
    else  {
        return {
            algorithm: compact ? [Antd.theme.defaultAlgorithm, Antd.theme.compactAlgorithm] : Antd.theme.defaultAlgorithm,
            components: {
                Layout: {
                    headerBg: '#ffffff',
                    siderBg: '#ffffff',
                    triggerBg: '#ffffff',
                    triggerColor: '#000000',
                },
                Menu: {
                    darkItemDisabledColor: '#cccccc',
                    darkItemBg: '#ffffff',
                    darkSubMenuItemBg: '#ffffff',
                    darkItemColor: '#666666',
                    darkItemSelectedColor: '#000000',
                    darkItemHoverColor: '#000000',
                }
            }
        }
    }
    return antdThemeFromString('light'); // Default to light theme if unknown
}
