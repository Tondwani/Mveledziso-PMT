"use client";

import { Card, Typography, Table, Tag, Space, Button, Modal, Form, Input, Row, Col, message, Popconfirm, Empty } from 'antd';
import { ProjectOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useContext, useState, useEffect } from 'react';
import { TimelineStateContext, TimelineActionContext, ITimeline, ITimelinePhase, TimelinePhaseStatus } from '@/provider/TimelineManagement/context';

const { Title } = Typography;

// Component for Timeline Details Card
const TimelineDetailsCard = ({ timeline }: { timeline: ITimeline }) => (
  <Card className="mb-4">
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Title level={5}>Timeline Name</Title>
        <p>{timeline.name}</p>
      </Col>
      <Col xs={24} sm={12}>
        <Title level={5}>Project ID</Title>
        <p>{timeline.projectId}</p>
      </Col>
      <Col xs={24}>
        <Title level={5}>Created At</Title>
        <p>{new Date(timeline.creationTime).toLocaleDateString()}</p>
      </Col>
    </Row>
  </Card>
);

// Component for Timeline Phase Card
const TimelinePhaseCard = ({ phase }: { phase: ITimelinePhase }) => {
  const getStatusColor = (status: TimelinePhaseStatus) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'InProgress': return 'blue';
      case 'NotStarted': return 'gray';
      default: return 'default';
    }
  };

  return (
    <Card className="mb-4" size="small">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <strong>Phase:</strong> {phase.name}
        </Col>
        <Col xs={24} sm={8}>
          <strong>Status:</strong> <Tag color={getStatusColor(phase.status)}>{phase.status}</Tag>
        </Col>
        <Col xs={24} sm={8}>
          <Space>
            <strong>Duration:</strong>
            {`${new Date(phase.startDate).toLocaleDateString()} - ${new Date(phase.endDate).toLocaleDateString()}`}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

interface CreateTimelineValues {
  name: string;
  projectId: string;
}

// Main Timeline Page Component
export default function TimelinesPage() {
  const state = useContext(TimelineStateContext);
  const actions = useContext(TimelineActionContext);
  
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
  const [form] = Form.useForm<CreateTimelineValues>();

  // Load initial data
  const loadTimelines = async () => {
    try {
      // Get all timelines - filtering by user should be handled on the backend
      await actions.getTimelines({});
    } catch {
      message.error('Failed to load timelines');
    }
  };

  // Load timelines on mount
  useEffect(() => {
    loadTimelines();
  }, []);

  // Handle Timeline Creation
  const handleCreateTimeline = async (values: CreateTimelineValues) => {
    try {
      await actions.createTimeline({
        name: values.name,
        projectId: values.projectId
      });
      setIsCreateModalVisible(false);
      form.resetFields();
      message.success('Timeline created successfully');
      loadTimelines();
    } catch {
      message.error('Failed to create timeline');
    }
  };

  // Handle Timeline Selection
  const handleTimelineSelect = async (timelineId: string) => {
    try {
      setSelectedTimeline(timelineId);
      await Promise.all([
        actions.getTimeline(timelineId),
        actions.getTimelinePhases({ timelineId })
      ]);
    } catch {
      message.error('Failed to load timeline details');
      setSelectedTimeline(null);
    }
  };

  // Handle Timeline Deletion
  const handleDeleteTimeline = async (id: string) => {
    try {
      await actions.deleteTimeline(id);
      message.success('Timeline deleted successfully');
      if (selectedTimeline === id) {
        setSelectedTimeline(null);
      }
      loadTimelines();
    } catch {
      message.error('Failed to delete timeline');
    }
  };

  // Timeline Table Columns
  const columns = [
    {
      title: 'Project',
      dataIndex: 'name', // Using name as projectName
      key: 'name',
      render: (text: string) => (
        <Space>
          <ProjectOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Phases',
      key: 'phases',
      render: (_: unknown, record: ITimeline) => {
        const completedPhases = state.timelinePhases.filter(p => 
          p.timelineId === record.id && p.status === 'Completed'
        ).length;
        const totalPhases = state.timelinePhases.filter(p => 
          p.timelineId === record.id
        ).length;
        return (
          <span>
            {completedPhases} / {totalPhases} completed
          </span>
        );
      },
    },
    {
      title: 'Milestones',
      key: 'milestones',
      render: () => (
        <span>
          0 / 0 completed
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
      render: (_: unknown, record: ITimeline) => {
        const phases = state.timelinePhases.filter(p => p.timelineId === record.id);
        const allPhasesCompleted = phases.length > 0 && phases.every(p => p.status === 'Completed');
        return (
          <Tag color={allPhasesCompleted ? 'green' : 'blue'} icon={allPhasesCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
            {allPhasesCompleted ? 'Completed' : 'In Progress'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: ITimeline) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleTimelineSelect(record.id)}
          >
            View Details
          </Button>
          <Popconfirm
            title="Delete Timeline"
            description="Are you sure you want to delete this timeline?"
            onConfirm={() => handleDeleteTimeline(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card>
            <Space className="w-full justify-between mb-4">
              <Title level={2}>Timelines</Title>
              <Button 
                type="primary" 
                onClick={() => setIsCreateModalVisible(true)}
              >
                Create Timeline
              </Button>
            </Space>

            <Table 
              columns={columns}
              dataSource={state.timelines}
              rowKey="id"
              loading={state.isPending}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>

        {selectedTimeline && (
          <Col xs={24}>
            <Card 
              title="Timeline Details"
              extra={
                <Button type="link" onClick={() => setSelectedTimeline(null)}>
                  Close
                </Button>
              }
            >
              {state.timeline && <TimelineDetailsCard timeline={state.timeline} />}
              
              <Title level={4}>Phases</Title>
              <div className="timeline-phases">
                {state.timelinePhases.map((phase) => (
                  <TimelinePhaseCard key={phase.id} phase={phase} />
                ))}
                {state.timelinePhases.length === 0 && (
                  <Empty description="No phases found" />
                )}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      <Modal
        title="Create New Timeline"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTimeline}
        >
          <Form.Item
            name="name"
            label="Timeline Name"
            rules={[{ required: true, message: 'Please enter timeline name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="projectId"
            label="Project ID"
            rules={[{ required: true, message: 'Please enter project ID' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={state.isPending}>
                Create
              </Button>
              <Button onClick={() => {
                setIsCreateModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .timeline-phases {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 16px;
        }
        
        @media (max-width: 768px) {
          .ant-table {
            overflow-x: auto;
          }
          
          .timeline-phases {
            padding-right: 0;
          }
        }
      `}</style>
    </div>
  );
}