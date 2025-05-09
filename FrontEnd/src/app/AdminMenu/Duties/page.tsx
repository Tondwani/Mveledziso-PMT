"use client";

import { Table, Tag, Space } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React from 'react';

type Status = 'Completed' | 'InProgress' | 'NotStarted';

export default function DutiesPage() {
  const duties = [
    {
      id: '1',
      title: 'Implement authentication',
      userId: 'user1',
      projectDutyId: 'project1',
      status: 'InProgress',
      priority: 'High',
      dueDate: '2023-03-15',
      creationTime: '2023-01-10T08:30:00',
    },
    {
      id: '2',
      title: 'Design dashboard UI',
      userId: 'user2',
      projectDutyId: 'project2',
      status: 'Completed',
      priority: 'Medium',
      dueDate: '2023-02-28',
      creationTime: '2023-01-05T10:15:00',
    },
    {
      id: '3',
      title: 'Write API documentation',
      userId: 'user3',
      projectDutyId: 'project3',
      status: 'NotStarted',
      priority: 'Low',
      dueDate: '2023-04-10',
      creationTime: '2023-02-01T14:20:00',
    },
  ];

  const statusMap: Record<Status, { color: string; icon?: React.ReactNode }> = {
    Completed: { color: 'green', icon: <CheckCircleOutlined /> },
    InProgress: { color: 'blue', icon: <ClockCircleOutlined /> },
    NotStarted: { color: 'orange' },
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const typedStatus = status as Status;
        return (
          <Tag color={statusMap[typedStatus].color} icon={statusMap[typedStatus].icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Created',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>View</a>
          <a>Edit</a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Duties</h1>
      <Table 
        columns={columns} 
        dataSource={duties} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}
