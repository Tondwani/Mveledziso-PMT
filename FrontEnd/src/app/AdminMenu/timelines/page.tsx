"use client";

import { Table, Tag, Space, Card, Typography, Timeline as AntTimeline, Button, Modal, Form, Input, DatePicker } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;

interface TimelinePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'InProgress' | 'NotStarted';
}

interface TimelineMilestone {
  id: string;
  name: string;
  date: string;
  status: 'Completed' | 'Pending';
}

interface ProjectTimeline {
  id: string;
  projectId: string;
  projectName: string;
  phases: TimelinePhase[];
  milestones: TimelineMilestone[];
  creationTime: string;
}

type TimelineItem = {
  children: React.ReactNode;
  color?: string;
  dot?: React.ReactNode;
  startDate?: string;
  date?: string;
};

export default function TimelinePage() {
  const [timelines, setTimelines] = useState<ProjectTimeline[]>([
    {
      id: '1',
      projectId: 'project1',
      projectName: 'Website Redesign',
      phases: [
        {
          id: 'phase1',
          name: 'Planning',
          startDate: '2023-01-10',
          endDate: '2023-01-20',
          status: 'Completed'
        },
        {
          id: 'phase2',
          name: 'Development',
          startDate: '2023-01-21',
          endDate: '2023-03-15',
          status: 'Completed'
        }
      ],
      milestones: [
        {
          id: 'milestone1',
          name: 'Design Approval',
          date: '2023-01-15',
          status: 'Completed'
        }
      ],
      creationTime: '2023-01-05T09:00:00'
    },
    {
      id: '2',
      projectId: 'project2',
      projectName: 'Mobile App',
      phases: [
        {
          id: 'phase3',
          name: 'Research',
          startDate: '2023-02-01',
          endDate: '2023-02-10',
          status: 'Completed'
        },
        {
          id: 'phase4',
          name: 'Prototyping',
          startDate: '2023-02-11',
          endDate: '2023-02-28',
          status: 'InProgress'
        }
      ],
      milestones: [
        {
          id: 'milestone2',
          name: 'User Testing',
          date: '2023-02-20',
          status: 'Pending'
        }
      ],
      creationTime: '2023-01-25T14:30:00'
    }
  ]);

  const [isPhaseModalVisible, setIsPhaseModalVisible] = useState(false);
  const [currentTimeline, setCurrentTimeline] = useState<ProjectTimeline | null>(null);

  const columns = [
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Phases',
      key: 'phases',
      render: (_: unknown, record: ProjectTimeline) => (
        <span>
          {record.phases.filter(p => p.status === 'Completed').length} / {record.phases.length} completed
        </span>
      ),
    },
    {
      title: 'Milestones',
      key: 'milestones',
      render: (_: unknown, record: ProjectTimeline) => (
        <span>
          {record.milestones.filter(m => m.status === 'Completed').length} / {record.milestones.length} completed
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, record: ProjectTimeline) => {
        const allPhasesCompleted = record.phases.every(p => p.status === 'Completed');
        return (
          <Tag color={allPhasesCompleted ? 'green' : 'blue'}>
            {allPhasesCompleted ? 'Completed' : 'In Progress'}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: ProjectTimeline) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            onClick={() => {
              setCurrentTimeline(record);
              setIsPhaseModalVisible(true);
            }}
          >
            Add Phase
          </Button>
          <a>View Details</a>
        </Space>
      ),
    },
  ];

  const renderTimeline = (phases: TimelinePhase[], milestones: TimelineMilestone[]) => {
    const items: TimelineItem[] = [
      ...phases.map(phase => ({
        children: (
          <div>
            <strong>{phase.name}</strong>
            <div>{phase.startDate} to {phase.endDate}</div>
            <Tag 
              color={phase.status === 'Completed' ? 'green' : 'blue'} 
              icon={phase.status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
              {phase.status}
            </Tag>
          </div>
        ),
        color: phase.status === 'Completed' ? 'green' : 'blue',
        startDate: phase.startDate
      })),
      ...milestones.map(milestone => ({
        children: (
          <div>
            <strong>Milestone: {milestone.name}</strong>
            <div>Target: {milestone.date}</div>
            <Tag 
              color={milestone.status === 'Completed' ? 'green' : 'orange'}
              icon={milestone.status === 'Completed' ? <CheckCircleOutlined /> : undefined}
            >
              {milestone.status}
            </Tag>
          </div>
        ),
        dot: milestone.status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
        date: milestone.date
      }))
    ];

    // Sort by start date
    items.sort((a, b) => {
      const dateA = a.startDate || a.date || '';
      const dateB = b.startDate || b.date || '';
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return <AntTimeline mode="left" items={items} />;
  };

  const handleAddPhase = (values: { name: string; startDate: Dayjs; endDate: Dayjs }) => {
    if (!currentTimeline) return;

    const newPhase: TimelinePhase = {
      id: `phase${Date.now()}`,
      name: values.name,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      status: 'NotStarted'
    };

    const updatedTimelines = timelines.map(timeline => 
      timeline.id === currentTimeline.id
        ? { ...timeline, phases: [...timeline.phases, newPhase] }
        : timeline
    );

    setTimelines(updatedTimelines);
    setIsPhaseModalVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Project Timelines</Title>
      
      <Table 
        columns={columns} 
        dataSource={timelines} 
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <Card title={`Timeline Details: ${record.projectName}`}>
              {renderTimeline(record.phases, record.milestones)}
            </Card>
          ),
          rowExpandable: (record) => record.phases.length > 0 || record.milestones.length > 0,
        }}
      />

      {/* Add Phase Modal */}
      <Modal
        title={`Add Phase to ${currentTimeline?.projectName || 'Timeline'}`}
        open={isPhaseModalVisible}
        onCancel={() => setIsPhaseModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddPhase}>
          <Form.Item 
            label="Phase Name" 
            name="name" 
            rules={[{ required: true, message: 'Please input phase name!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item 
            label="Start Date" 
            name="startDate" 
            rules={[{ required: true, message: 'Please select start date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item 
            label="End Date" 
            name="endDate" 
            rules={[
              { required: true, message: 'Please select end date!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('End date must be after start date!'));
                },
              }),
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Phase
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}