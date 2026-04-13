/**
 * @fileoverview Theme selection modal component.
 */

import * as React from 'react';
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';

import {
    BgColorsOutlined,
    CheckOutlined,
    MoonOutlined,
    SunOutlined,
} from '@ant-design/icons';

export interface ThemeOption {
    key: string;
    name: string;
    icon: React.ReactNode;
    description: string;
}

export interface ThemeModalProps {
    open: boolean;
    onClose: () => void;
    currentTheme: string;
    onThemeChange: (themeKey: string) => void;
}

const ThemeModal: React.FC<ThemeModalProps> = ({
    open,
    onClose,
    currentTheme,
    onThemeChange,
}) => {
    const { t } = I18Next.useTranslation();
    const [selectedTheme, setSelectedTheme] = React.useState(currentTheme);

    const THEME_OPTIONS: ThemeOption[] = [
        {
            key: 'light',
            name: t('THEME_MODAL.LIGHT'),
            icon: <SunOutlined />,
            description: t('THEME_MODAL.LIGHT_DESCRIPTION'),
        },
        {
            key: 'dark',
            name: t('THEME_MODAL.DARK'),
            icon: <MoonOutlined />,
            description: t('THEME_MODAL.DARK_DESCRIPTION'),
        },
        {
            key: 'tritanopia',
            name: t('THEME_MODAL.TRITANOPIA'),
            icon: <SunOutlined />,
            description: t('THEME_MODAL.TRITANOPIA_DESCRIPTION'),
        },
        {
            key: 'tritanopia-dark',
            name: t('THEME_MODAL.TRITANOPIA_DARK'),
            icon: <MoonOutlined />,
            description: t('THEME_MODAL.TRITANOPIA_DARK_DESCRIPTION'),
        },
        {
            key: 'deuteranopia',
            name: t('THEME_MODAL.DEUTERANOPIA'),
            icon: <SunOutlined />,
            description: t('THEME_MODAL.DEUTERANOPIA_DESCRIPTION'),
        },
        {
            key: 'deuteranopia-dark',
            name: t('THEME_MODAL.DEUTERANOPIA_DARK'),
            icon: <MoonOutlined />,
            description: t('THEME_MODAL.DEUTERANOPIA_DARK_DESCRIPTION'),
        },
    ];

    React.useEffect(() => {
        setSelectedTheme(currentTheme);
    }, [currentTheme]);

    const handleThemeSelect = (themeKey: string) => {
        setSelectedTheme(themeKey);
    };

    const handleApplyTheme = () => {
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
                    onClick={handleApplyTheme}
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

                <Antd.Row gutter={[16, 16]}>
                    {THEME_OPTIONS.map((theme) => (
                        <Antd.Col span={12} key={theme.key}>
                            <Antd.ConfigProvider theme={antdThemeFromString(theme.key)}>
                                <Antd.Card
                                    hoverable
                                    className={`theme-option-card ${selectedTheme === theme.key ? 'selected' : ''}`}
                                    onClick={() => handleThemeSelect(theme.key)}
                                    style={{
                                        border: selectedTheme === theme.key ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {selectedTheme === theme.key && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                // background: '#1890ff',
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <CheckOutlined style={{ fontSize: 12 }} />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <div
                                            style={{
                                                fontSize: 24,
                                                color: selectedTheme === theme.key ? '#1890ff' : undefined,
                                            }}
                                        >
                                            {theme.icon}
                                        </div>
                                        <Antd.Typography.Title level={5} style={{ margin: 0 }}>
                                            {theme.name}
                                        </Antd.Typography.Title>
                                    </div>

                                    <Antd.Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {theme.description}
                                    </Antd.Typography.Text>

                                    {/* Theme preview */}
                                    <div style={{ marginTop: 12 }}>
                                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                            <Antd.Button size="small" type="primary">
                                                {t('THEME_MODAL.PRIMARY_BUTTON')}
                                            </Antd.Button>
                                        </div>
                                    </div>
                                </Antd.Card>
                            </Antd.ConfigProvider>

                        </Antd.Col>
                    ))}
                </Antd.Row>

                <Antd.Divider />

                <Antd.Alert
                    title={t('THEME_MODAL.PREVIEW')}
                    description={t('THEME_MODAL.PREVIEW_DESCRIPTION')}
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                />
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
