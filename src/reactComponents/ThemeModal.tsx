/**
 * @fileoverview Theme selection modal component.
 */

import * as React from 'react';
import * as Antd from 'antd';
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

const THEME_OPTIONS: ThemeOption[] = [
    {
        key: 'light',
        name: 'Light Theme',
        icon: <SunOutlined />,
        description: 'Clean and bright interface for daytime use',
    },
    {
        key: 'dark',
        name: 'Dark Theme',
        icon: <MoonOutlined />,
        description: 'Easy on the eyes for low-light environments',
    },
    {
        key: 'tritanopia',
        name: 'Tritanopia Theme',
        icon: <SunOutlined />,
        description: 'Designed for those with Tritanopia color blindness',
    },
    {
        key: 'tritanopia-dark',
        name: 'Tritanopia Dark',
        icon: <MoonOutlined />,
        description: 'Dark theme for those with Tritanopia color blindness',
    },
    {
        key: 'deuteranopia',
        name: 'Deuteranopia Theme',
        icon: <SunOutlined />,
        description: 'Designed for those with Deuteranopia color blindness',
    },
    {
        key: 'deuteranopia-dark',
        name: 'Deuteranopia Dark',
        icon: <MoonOutlined />,
        description: 'Dark theme for those with Deuteranopia color blindness',
    },
];

const ThemeModal: React.FC<ThemeModalProps> = ({
    open,
    onClose,
    currentTheme,
    onThemeChange,
}) => {
    const [selectedTheme, setSelectedTheme] = React.useState(currentTheme);

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
                    Theme Selection
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={[
                <Antd.Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Antd.Button>,
                <Antd.Button
                    key="apply"
                    type="primary"
                    onClick={handleApplyTheme}
                    disabled={selectedTheme === currentTheme}
                >
                    Apply Theme
                </Antd.Button>,
            ]}
            width={600}
            destroyOnHidden
        >
            <div style={{ padding: '16px 0' }}>
                <Antd.Typography.Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                    Choose a theme that best suits your preference and working environment.
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
                                                Primary
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
                    message="Theme Preview"
                    description="The selected theme will be applied to the entire application interface."
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
