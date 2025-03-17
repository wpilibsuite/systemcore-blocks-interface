import React from 'react';
import * as Antd from 'antd';

export default function Footer() {
    return (
        <Antd.Flex vertical style={{ background: '#000' }}>
            <Antd.Typography.Paragraph
                strong={true}
                style={{ color: '#aaf' }}
            >
                Footer
            </Antd.Typography.Paragraph>
        </Antd.Flex>
    )
}