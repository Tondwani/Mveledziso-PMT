"use client";

import { Table, Tag, Space, Card, Typography, Button, Modal, Form, DatePicker, Select, Avatar, message } from 'antd';
import { FilterOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useActivityLogState, useActivityLogActions } from '../../../provider/ActivitylogManagement';
import { IActivityLog, IGetActivityLogsInput } from '../../../provider/ActivitylogManagement/context';
import { AxiosError } from 'axios';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface FilterFormValues {
  action?: string;
  entityType?: string;
  userId?: number;
  dateRange?: [string, string];
}

export default function ActivityLogPage() {
  // State and Actions from Context
  const { activityLogs, isPending } = useActivityLogState();
  const { getActivityLogs } = useActivityLogActions();

  // Local State
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<IActivityLog | null>(null);
  const [filters, setFilters] = useState<IGetActivityLogsInput>({
    action: '',
    entityType: '',
    userId: undefined,
    startDate: undefined,
    endDate: undefined,
    skipCount: 0,
    maxResultCount: 10
  });
  const [error, setError] = useState<string | null>(null);

  // Load activity logs on mount and when filters change
  useEffect(() => {
    const loadActivityLogs = async () => {
      try {
        setError(null);
        const input: IGetActivityLogsInput = {
          ...filters,
          skipCount: filters.skipCount ?? 0,
          maxResultCount: 10
        };
        await getActivityLogs(input);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
        const axiosError = err as AxiosError<{ error: { message: string } }>;
        const errorMessage = axiosError.response?.data?.error?.message || 
                           axiosError.message || 
                           'Failed to fetch activity logs. Please try again later.';
        setError(errorMessage);
        message.error(errorMessage);
      }
    };

    loadActivityLogs();
  }, [
    filters.action,
    filters.entityType,
    filters.userId,
    filters.startDate,
    filters.endDate,
    (filters.skipCount ?? 0)
  ]);

  // Derived data
  const actionTypes = [...new Set(activityLogs.map(log => log.action))];
  const entityTypes = [...new Set(activityLogs.map(log => log.entityType))];
  const users = [...new Set(activityLogs.map(log => ({ id: log.userId, name: log.userName })))];

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        let color = '';
        switch(action) {
          case 'Created': color = 'green'; break;
          case 'Updated': color = 'blue'; break;
          case 'Deleted': color = 'red'; break;
          case 'Completed': color = 'purple'; break;
          default: color = 'orange';
        }
        return <Tag color={color}>{action}</Tag>;
      },
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (userName: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{userName}</span>
        </Space>
      ),
    },
    {
      title: 'Entity',
      key: 'entity',
      render: (_: unknown, record: IActivityLog) => (
        <Space>
          <Tag>{record.entityType}</Tag>
          <Text type="secondary">ID: {record.entityId}</Text>
        </Space>
      ),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (details: string) => (
        <Text ellipsis={{ tooltip: details }} style={{ maxWidth: 200 }}>
          {details}
        </Text>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: IActivityLog) => (
        <Button 
          type="text" 
          icon={<InfoCircleOutlined />} 
          onClick={() => setSelectedLog(record)}
        />
      ),
    },
  ];

  const handleApplyFilters = (values: FilterFormValues) => {
    const { dateRange, ...otherValues } = values;
    setFilters(prev => ({
      ...prev,
      ...otherValues,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
      skipCount: 0 // Reset pagination when filters change
    }));
    setIsFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      userId: undefined,
      startDate: undefined,
      endDate: undefined,
      skipCount: 0,
      maxResultCount: 10
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Activity Log</Title>
      
      <Card 
        title="System Activities"
        variant="outlined"
        extra={
          <Space>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setIsFilterModalVisible(true)}
            >
              Filters
            </Button>
          </Space>
        }
      >
        {error && (
          <div style={{ marginBottom: 16, color: '#ff4d4f' }}>
            {error}
          </div>
        )}
        <Table 
          columns={columns} 
          dataSource={activityLogs}
          rowKey="id"
          loading={isPending}
          pagination={{
            total: activityLogs.length,
            pageSize: filters.maxResultCount || 10,
            current: Math.floor((filters.skipCount ?? 0) / (filters.maxResultCount || 10)) + 1,
            onChange: (page) => {
              setFilters(prev => ({
                ...prev,
                skipCount: (page - 1) * (prev.maxResultCount || 10)
              }));
            }
          }}
        />
      </Card>

      {/* Filter Modal */}
      <Modal
        title="Filter Activity Logs"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form<FilterFormValues>
          onFinish={handleApplyFilters}
          initialValues={{
            action: filters.action,
            entityType: filters.entityType,
            userId: filters.userId,
            dateRange: filters.startDate && filters.endDate ? [filters.startDate, filters.endDate] : undefined
          }}
        >
          <Form.Item name="action" label="Action">
            <Select allowClear>
              {actionTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="entityType" label="Entity Type">
            <Select allowClear>
              {entityTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="userId" label="User">
            <Select allowClear>
              {users.map(user => (
                <Select.Option key={user.id} value={user.id}>{user.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="Date Range">
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Apply</Button>
              <Button onClick={handleResetFilters}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal
        title="Activity Details"
        open={!!selectedLog}
        onCancel={() => setSelectedLog(null)}
        footer={<Button onClick={() => setSelectedLog(null)}>Close</Button>}
      >
        {selectedLog && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Action:</Text>
            <Text>{selectedLog.action}</Text>
            <Text strong>Details:</Text>
            <Text>{selectedLog.details}</Text>
            <Text strong>User:</Text>
            <Text>{selectedLog.userName}</Text>
            <Text strong>Entity Type:</Text>
            <Text>{selectedLog.entityType}</Text>
            <Text strong>Entity ID:</Text>
            <Text>{selectedLog.entityId}</Text>
            <Text strong>Time:</Text>
            <Text>{new Date(selectedLog.creationTime).toLocaleString()}</Text>
                  </Space>
        )}
      </Modal>
    </div>
  );
}