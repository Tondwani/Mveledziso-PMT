"use client";

import { Table, Tag, Space, Card, Typography, Button, Modal, Form, DatePicker, Select, Avatar, List } from 'antd';
import { FilterOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  userId: number;
  userName: string;
  entityType: string;
  entityId: string;
  creationTime: string;
}

export default function ActivityLogPage() {
  // Static data matching your ABP service structure
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: 'log1',
      action: 'Created',
      details: 'Created new project "Website Redesign"',
      userId: 1,
      userName: 'john.doe',
      entityType: 'Project',
      entityId: 'project1',
      creationTime: '2023-06-15T09:30:00'
    },
    {
      id: 'log2',
      action: 'Updated',
      details: 'Updated project timeline for "Mobile App"',
      userId: 2,
      userName: 'jane.smith',
      entityType: 'Project',
      entityId: 'project2',
      creationTime: '2023-06-14T14:20:00'
    },
    {
      id: 'log3',
      action: 'Deleted',
      details: 'Deleted milestone "Design Approval"',
      userId: 3,
      userName: 'mike.johnson',
      entityType: 'Milestone',
      entityId: 'milestone1',
      creationTime: '2023-06-14T11:15:00'
    },
    {
      id: 'log4',
      action: 'Assigned',
      details: 'Assigned duty "Implement authentication" to Jane Smith',
      userId: 1,
      userName: 'john.doe',
      entityType: 'Duty',
      entityId: 'duty1',
      creationTime: '2023-06-13T16:45:00'
    },
    {
      id: 'log5',
      action: 'Completed',
      details: 'Marked duty "API documentation" as completed',
      userId: 2,
      userName: 'jane.smith',
      entityType: 'Duty',
      entityId: 'duty2',
      creationTime: '2023-06-12T10:30:00'
    }
  ]);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    userId: null as number | null,
    dateRange: null as [Dayjs, Dayjs] | null
  });

  const filteredLogs = activityLogs.filter(log => {
    const matchesAction = filters.action ? log.action === filters.action : true;
    const matchesEntityType = filters.entityType ? log.entityType === filters.entityType : true;
    const matchesUser = filters.userId ? log.userId === filters.userId : true;
    const matchesDate = filters.dateRange 
      ? new Date(log.creationTime) >= filters.dateRange[0].toDate() 
        && new Date(log.creationTime) <= filters.dateRange[1].toDate()
      : true;
    
    return matchesAction && matchesEntityType && matchesUser && matchesDate;
  });

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
      render: (_: unknown, record: ActivityLog) => (
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
      render: (_: unknown, record: ActivityLog) => (
        <Button 
          type="text" 
          icon={<InfoCircleOutlined />} 
          onClick={() => setSelectedLog(record)}
        />
      ),
    },
  ];

  const handleApplyFilters = (values: typeof filters) => {
    setFilters(values);
    setIsFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      userId: null,
      dateRange: null
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Activity Log</Title>
      
      <Card 
        title="System Activities"
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
        <Table 
          columns={columns} 
          dataSource={filteredLogs} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Filter Modal */}
      <Modal
        title="Filter Activities"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={filters}
          onFinish={handleApplyFilters}
        >
          <Form.Item label="Action Type" name="action">
            <Select placeholder="Select action type" allowClear>
              {actionTypes.map(action => (
                <Select.Option key={action} value={action}>
                  {action}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Entity Type" name="entityType">
            <Select placeholder="Select entity type" allowClear>
              {entityTypes.map(type => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="User" name="userId">
            <Select placeholder="Select user" allowClear>
              {users.map(user => (
                <Select.Option key={user.id} value={user.id}>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {user.name}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Date Range" name="dateRange">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Apply Filters
              </Button>
              <Button onClick={handleResetFilters}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Activity Detail Modal */}
      <Modal
        title="Activity Details"
        open={!!selectedLog}
        onCancel={() => setSelectedLog(null)}
        footer={null}
        width={600}
      >
        {selectedLog && (
          <List itemLayout="horizontal">
            <List.Item>
              <List.Item.Meta
                title="Action"
                description={
                  <Tag color={
                    selectedLog.action === 'Created' ? 'green' :
                    selectedLog.action === 'Updated' ? 'blue' :
                    selectedLog.action === 'Deleted' ? 'red' : 'purple'
                  }>
                    {selectedLog.action}
                  </Tag>
                }
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="User"
                description={
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <span>{selectedLog.userName}</span>
                  </Space>
                }
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Entity"
                description={
                  <Space>
                    <Tag>{selectedLog.entityType}</Tag>
                    <Text type="secondary">ID: {selectedLog.entityId}</Text>
                  </Space>
                }
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Timestamp"
                description={new Date(selectedLog.creationTime).toLocaleString()}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title="Details"
                description={selectedLog.details}
              />
            </List.Item>
          </List>
        )}
      </Modal>
    </div>
  );
}