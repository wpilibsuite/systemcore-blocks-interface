/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';

import {EditOutlined, DeleteOutlined, CopyOutlined, SelectOutlined} from '@ant-design/icons';

interface ManageTableRecord {
    name: string,
}

interface ManageTableProps {
    textOnEmpty: string,
    records: ManageTableRecord[],
    showDelete: boolean,
    deleteDialogTitle: string,
    onSelect: (record: ManageTableRecord) => void,
    onRename: (record: ManageTableRecord) => void,
    onCopy:   (record: ManageTableRecord) => void,
    onDelete: (record: ManageTableRecord) => void,
}

/** Default page size for table pagination. */
const DEFAULT_PAGE_SIZE = 5;

/** Actions column width in pixels. */
const ACTIONS_COLUMN_WIDTH = 160;

export default function ManageTable(props: ManageTableProps): React.JSX.Element {
    const { t } = I18Next.useTranslation();

    /** Table column configuration. */
    const columns: Antd.TableProps<ManageTableRecord>['columns'] = [
        {
            title: t('NAME'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: {
                showTitle: false,
            },
            render: (name: string) => (
                <Antd.Tooltip title={name}>
                    {name}
                </Antd.Tooltip>
            ),
        },
        {
            title: t('ACTIONS'),
            key: 'actions',
            width: ACTIONS_COLUMN_WIDTH,
            render: (_, record: ManageTableRecord) => (
                <Antd.Space size="small">
                    <Antd.Tooltip title={t('Select')}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<SelectOutlined />}
                            onClick={() => props.onSelect(record)}
                        />
                    </Antd.Tooltip>
                    <Antd.Tooltip title={t('Rename')}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => props.onRename(record)}
                        />
                    </Antd.Tooltip>
                    <Antd.Tooltip title={t('Copy')}>
                        <Antd.Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => props.onCopy(record)}
                        />
                    </Antd.Tooltip>
                    {props.showDelete && (
                        <Antd.Tooltip title={t('Delete')}>
                            <Antd.Popconfirm
                                title={t(props.deleteDialogTitle, { projectName: record.name })}
                                description={t('DELETE_CANNOT_BE_UNDONE')}
                                onConfirm={() => props.onDelete(record)}
                                okText={t('Delete')}
                                cancelText={t('Cancel')}
                                okType="danger"
                            >
                                <Antd.Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    danger
                                />
                            </Antd.Popconfirm>
                        </Antd.Tooltip>
                    )}
                </Antd.Space>
            ),
        },
    ];


    return (
        <Antd.Table<ManageTableRecord>
            columns={columns}
            dataSource={props.records}
            rowKey="name"
            size="small"
            pagination={props.records.length > DEFAULT_PAGE_SIZE ? {
                pageSize: DEFAULT_PAGE_SIZE,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) =>
                    t('PAGINATION_ITEMS', { range0: range[0], range1: range[1], total }),
            } : false}
            bordered
            locale={{
                emptyText: props.textOnEmpty,
            }}
            onRow={(record) => ({
                onDoubleClick: () => props.onSelect(record),
            })}
        />
    );
}