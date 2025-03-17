import React from 'react';
import * as Antd from 'antd';

type StringFunctionVoid = (input: string) => void;

interface HeaderProps {
    alertErrorMessage : string;
    setAlertErrorMessage : StringFunctionVoid;
}

export default function Header(props : HeaderProps) {
    return (
       <Antd.Flex vertical style={{background: '#000'}}>
          <Antd.Typography.Paragraph
            strong={true}
            style={{color: '#aaf' }}
          >
            WPILib Blocks
          </Antd.Typography.Paragraph>
          {props.alertErrorMessage !== '' && (<Antd.Alert
            type="error"
            message={props.alertErrorMessage}
            closable
            afterClose={() => props.setAlertErrorMessage('')}
          />)}
        </Antd.Flex>
    )
}