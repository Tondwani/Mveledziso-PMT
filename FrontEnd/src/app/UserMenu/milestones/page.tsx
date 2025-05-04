"use client";

import { Table, Tag, Space, Button, Card, Typography, Modal, Form, Input, DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { FlagOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Title } = Typography;
const { TextArea } = Input;

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  timelineId: string;
  timelineName: string;
  creationTime: string;
}

interface Timeline {
  id: string;
  name: string;
}

interface FormValues {
  title: string;
  description: string;
  timelineId: string;
  dueDate: Dayjs;
}

export default function MilestonesPage() {
  // Static data matching your ABP service structure
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Design Approval',
      description: 'Finalize and approve all design mockups',
      dueDate: '2023-03-15',
      isCompleted: true,
      timelineId: 'timeline1',
      timelineName: 'Website Redesign',
      creationTime: '2023-01-10T08:30:00'
    },
    {
      id: '2',
      title: 'Beta Launch',
      description: 'Release beta version to testers',
      dueDate: '2023-04-01',
      isCompleted: false,
      timelineId: 'timeline1',
      timelineName: 'Website Redesign',
      creationTime: '2023-01-15T14:20:00'
    },
    {
      id: '3',
      title: 'User Testing Complete',
      description: 'Complete all user testing sessions',
      dueDate: '2023-05-10',
      isCompleted: false,
      timelineId: 'timeline2',
      timelineName: 'Mobile App',
      creationTime: '2023-02-05T09:15:00'
    }
  ]);

  const [timelines] = useState<Timeline[]>([
    { id: 'timeline1', name: 'Website Redesign' },
    { id: 'timeline2', name: 'Mobile App' }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTimelineFilter, setCurrentTimelineFilter] = useState<string | undefined>();
  const [completionFilter, setCompletionFilter] = useState<boolean | undefined>();

  const filteredMilestones = milestones.filter(m => {
    const matchesTimeline = currentTimelineFilter ? m.timelineId === currentTimelineFilter : true;
    const matchesCompletion = completionFilter !== undefined ? m.isCompleted === completionFilter : true;
    return matchesTimeline && matchesCompletion;
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <FlagOutlined />
          <a>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Timeline',
      dataIndex: 'timelineName',
      key: 'timelineName',
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'isCompleted',
      key: 'status',
      render: (isCompleted: boolean) => (
        <Tag color={isCompleted ? 'green' : 'orange'} icon={isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {isCompleted ? 'Completed' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>View</a>
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const handleCreate = (values: FormValues) => {
    const newMilestone: Milestone = {
      id: `new-${milestones.length + 1}`,
      title: values.title,
      description: values.description,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
      isCompleted: false,
      timelineId: values.timelineId,
      timelineName: timelines.find(t => t.id === values.timelineId)?.name || '',
      creationTime: new Date().toISOString()
    };
    setMilestones([...milestones, newMilestone]);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Milestones</Title>
      
      <Card 
        title="Milestone Management"
        extra={
          <Space>
            <Select
              placeholder="Filter by timeline"
              style={{ width: 200 }}
              onChange={(value) => setCurrentTimelineFilter(value)}
              allowClear
            >
              {timelines.map(timeline => (
                <Select.Option key={timeline.id} value={timeline.id}>
                  {timeline.name}
                </Select.Option>
              ))}
            </Select>
            
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              onChange={(value) => setCompletionFilter(value)}
              allowClear
            >
              <Select.Option value={true}>Completed</Select.Option>
              <Select.Option value={false}>Pending</Select.Option>
            </Select>
            
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              New Milestone
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredMilestones} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Create New Milestone"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreate}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item label="Timeline" name="timelineId" rules={[{ required: true }]}>
            <Select>
              {timelines.map(timeline => (
                <Select.Option key={timeline.id} value={timeline.id}>
                  {timeline.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Due Date" name="dueDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Milestone
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}