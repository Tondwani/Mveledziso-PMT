"use client";

import { Table, Tag, Space, Card, Typography, Button, Modal, Form, Input, DatePicker, Select, Progress } from 'antd';
import { FolderOutlined, TeamOutlined, CalendarOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useProjectState, useProjectActions } from '../../../provider/ProjectManagement';
import { 
  IProject, 
  ICreateProjectDto,
  ICreateProjectDutyDto,
  DutyStatus,
  Priority,
  IGetProjectsInput,
  IGetProjectDutiesInput
} from '../../../provider/ProjectManagement/context';

const { Title, Text } = Typography;
const { TextArea } = Input;

// UI Status mapping
const ProjectUIStatus = {
  NotStarted: 'NotStarted',
  InProgress: 'InProgress',
  Completed: 'Completed',
  OnHold: 'OnHold'
} as const;

type ProjectStatusType = keyof typeof ProjectUIStatus;

// UI mappings for status and priority
const STATUS_MAP = {
  [DutyStatus.ToDo]: { color: 'default', text: 'Pending' },
  [DutyStatus.InProgress]: { color: 'processing', text: 'In Progress' },
  [DutyStatus.Done]: { color: 'success', text: 'Completed' },
  [DutyStatus.Review]: { color: 'error', text: 'Blocked' }
};

const PRIORITY_MAP: Record<Priority, { color: string; text: string }> = {
  [Priority.low]: { color: 'green', text: 'Low' },
  [Priority.Medium]: { color: 'blue', text: 'Medium' },
  [Priority.High]: { color: 'orange', text: 'High' },
  [Priority.Urgent]: { color: 'red', text: 'Critical' }
};

// Form interfaces
interface ProjectFormValues {
  name: string;
  description?: string;
  teamId: string;
  startDate: string;
  endDate: string;
}

interface DutyFormValues {
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string;
}

const ProjectsPage = () => {
  // Provider state and actions
  const { projects, projectDuties, isPending } = useProjectState();
  const { getProjects, createProject, getProjectDuties, createProjectDuty } = useProjectActions();

  // Local state
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isDutyModalVisible, setIsDutyModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatusType>();

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      const input: IGetProjectsInput = {};
      await getProjects(input);
    };
    loadProjects();
  }, []);

  // Load duties when current project changes
  useEffect(() => {
    const loadProjectDuties = async () => {
      if (currentProject?.id) {
        const input: IGetProjectDutiesInput = { projectId: currentProject.id };
        await getProjectDuties(input);
      }
    };
    loadProjectDuties();
  }, [currentProject?.id, getProjectDuties]);

  // Memoize project progress calculation
  const getProjectProgress = React.useCallback((projectId: string): number => {
    const projectDutiesForProject = projectDuties.filter(duty => duty.projectId === projectId);
    const completedDuties = projectDutiesForProject.filter(duty => duty.status === DutyStatus.Done).length;
    return projectDutiesForProject.length > 0 ? (completedDuties / projectDutiesForProject.length) * 100 : 0;
  }, [projectDuties]);

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? project.progress === 100 : true;
    return matchesSearch && matchesStatus;
  });

  // Form handlers
  const handleCreateProject = async (values: ProjectFormValues) => {
    try {
      const projectData: ICreateProjectDto = {
        name: values.name,
        description: values.description,
        teamId: values.teamId,
        startDate: values.startDate,
        endDate: values.endDate,
        isCollaborationEnabled: true
      };
      
      await createProject(projectData);
      setIsProjectModalVisible(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleCreateDuty = async (values: DutyFormValues) => {
    if (!currentProject) return;

    try {
      const dutyData: ICreateProjectDutyDto = {
        title: values.title,
        description: values.description,
        projectId: currentProject.id,
        priority: values.priority,
        dueDate: values.dueDate
      };
      
      await createProjectDuty(dutyData);
      setIsDutyModalVisible(false);
    } catch (error) {
      console.error('Failed to create duty:', error);
    }
  };

  // Table columns
  const projectColumns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: IProject) => (
        <Space>
          <FolderOutlined />
          <a onClick={() => setCurrentProject(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Team',
      dataIndex: 'teamId',
      key: 'teamId',
      render: (text: string) => <Tag icon={<TeamOutlined />}>{text}</Tag>,
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (_: unknown, record: IProject) => (
        <Space>
          <CalendarOutlined />
          <Text type="secondary">
            {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: unknown, record: IProject) => (
        <Progress 
          percent={getProjectProgress(record.id)} 
          size="small" 
          status={getProjectProgress(record.id) === 100 ? 'success' : 'active'} 
        />
      ),
    },
  ];

  const dutyColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DutyStatus) => {
        const { color, text } = STATUS_MAP[status];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: Priority) => {
        const { color, text } = PRIORITY_MAP[priority];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Projects</Title>
      
      <Card 
        title="Project Management"
        variant="outlined"
        extra={
          <Space>
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              onChange={(value) => setStatusFilter(value as ProjectStatusType)}
              allowClear
            >
              {Object.entries(ProjectUIStatus).map(([key, value]) => (
                <Select.Option key={key} value={value}>{key}</Select.Option>
              ))}
            </Select>
            
            <Input
              placeholder="Search projects"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsProjectModalVisible(true)}
            >
              New Project
            </Button>
          </Space>
        }
      >
        <Table 
          columns={projectColumns} 
          dataSource={filteredProjects} 
          rowKey="id"
          loading={isPending}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Project Details Modal */}
      <Modal
        title={currentProject?.name || 'Project Details'}
        open={!!currentProject}
        onCancel={() => setCurrentProject(null)}
        width={800}
        footer={null}
      >
        {currentProject && (
          <div style={{ marginBottom: 24 }}>
            <Card 
              title="Project Information"
              variant="outlined"
              extra={
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => setIsDutyModalVisible(true)}
                >
                  Add Duty
                </Button>
              }
            >
              <div style={{ marginBottom: 16 }}>
                <Text strong>Description:</Text>
                <p>{currentProject.description}</p>
              </div>
              
              <Space size="large">
                <div>
                  <Text strong>Team:</Text>
                  <p>{currentProject.teamId}</p>
                </div>
                
                <div>
                  <Text strong>Timeline:</Text>
                  <p>
                    {new Date(currentProject.startDate).toLocaleDateString()} - {new Date(currentProject.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <Text strong>Collaboration:</Text>
                  <p>
                    {currentProject.isCollaborationEnabled ? (
                      <Tag color="green">Enabled</Tag>
                    ) : (
                      <Tag color="orange">Disabled</Tag>
                    )}
                  </p>
                </div>
              </Space>
              
              <div style={{ marginTop: 16 }}>
                <Text strong>Progress:</Text>
                <Progress 
                  percent={getProjectProgress(currentProject.id)} 
                  status={getProjectProgress(currentProject.id) === 100 ? 'success' : 'active'} 
                />
              </div>
            </Card>
            
            <Card 
              title="Project Duties" 
              style={{ marginTop: 16 }}
              variant="outlined"
            >
              <Table 
                columns={dutyColumns} 
                dataSource={projectDuties.filter(duty => duty.projectId === currentProject.id)} 
                rowKey="id"
                loading={isPending}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </div>
        )}
      </Modal>

      {/* Create Project Modal */}
      <Modal
        title="Create New Project"
        open={isProjectModalVisible}
        onCancel={() => setIsProjectModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateProject}>
          <Form.Item 
            label="Project Name" 
            name="name" 
            rules={[{ required: true, message: 'Please input project name!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item 
            label="Team" 
            name="teamId" 
            rules={[{ required: true, message: 'Please select team!' }]}
          >
            <Select>
              <Select.Option value="team1">Development Team</Select.Option>
              <Select.Option value="team2">Marketing Team</Select.Option>
              <Select.Option value="team3">Design Team</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Timeline" required>
            <Space>
              <Form.Item 
                name="startDate" 
                noStyle
                rules={[{ required: true, message: 'Start date is required' }]}
              >
                <DatePicker placeholder="Start Date" />
              </Form.Item>
              <span>-</span>
              <Form.Item 
                name="endDate" 
                noStyle
                rules={[{ required: true, message: 'End date is required' }]}
              >
                <DatePicker placeholder="End Date" />
              </Form.Item>
            </Space>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Project
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Duty Modal */}
      <Modal
        title={`Add Duty to ${currentProject?.name || 'Project'}`}
        open={isDutyModalVisible}
        onCancel={() => setIsDutyModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateDuty}>
          <Form.Item 
            label="Title" 
            name="title" 
            rules={[{ required: true, message: 'Please input duty title!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item label="Description" name="description">
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item 
            label="Priority" 
            name="priority" 
            rules={[{ required: true, message: 'Please select priority!' }]}
          >
            <Select>
              {Object.entries(Priority).map(([key]) => (
                <Select.Option key={key} value={key}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            label="Due Date" 
            name="dueDate" 
            rules={[{ required: true, message: 'Please select due date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Duty
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;