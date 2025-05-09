"use client";

import { Table, Tag, Space, Card, Typography, Button, Modal, Form, Input, DatePicker, Select, Progress } from 'antd';
import { FolderOutlined, TeamOutlined, CalendarOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Project {
  id: string; // Added the id property that was missing in the interface
  name: string;
  description: string;
  teamId: string;
  teamName: string;
  startDate: string;
  endDate: string;
  isCollaborationEnabled: boolean;
  status: 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';
  progress: number;
  creationTime: string;
}

interface ProjectDuty {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Blocked';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  projectId: string;
  projectName: string;
  creationTime: string;
}

export default function ProjectsPage() {
  // Static data matching your ABP service structure
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'project1',
      name: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      teamId: 'team1',
      teamName: 'Development Team',
      startDate: '2023-06-01',
      endDate: '2023-08-15',
      isCollaborationEnabled: true,
      status: 'InProgress',
      progress: 45,
      creationTime: '2023-05-20T09:30:00'
    },
    {
      id: 'project2',
      name: 'Mobile App Development',
      description: 'Build cross-platform mobile application for iOS and Android',
      teamId: 'team1',
      teamName: 'Development Team',
      startDate: '2023-07-01',
      endDate: '2023-10-31',
      isCollaborationEnabled: true,
      status: 'NotStarted',
      progress: 5,
      creationTime: '2023-06-15T14:20:00'
    },
    {
      id: 'project3',
      name: 'Marketing Campaign',
      description: 'Q4 product marketing campaign',
      teamId: 'team2',
      teamName: 'Marketing Team',
      startDate: '2023-09-01',
      endDate: '2023-12-15',
      isCollaborationEnabled: false,
      status: 'NotStarted',
      progress: 0,
      creationTime: '2023-06-10T11:15:00'
    }
  ]);

  const [duties, setDuties] = useState<ProjectDuty[]>([
    {
      id: 'duty1',
      title: 'Design Homepage',
      description: 'Create new homepage design with updated branding',
      status: 'Completed',
      priority: 'High',
      dueDate: '2023-06-15',
      projectId: 'project1',
      projectName: 'Website Redesign',
      creationTime: '2023-05-22T10:30:00'
    },
    {
      id: 'duty2',
      title: 'Implement Authentication',
      description: 'Setup user authentication system',
      status: 'InProgress',
      priority: 'Critical',
      dueDate: '2023-06-30',
      projectId: 'project1',
      projectName: 'Website Redesign',
      creationTime: '2023-05-25T14:15:00'
    },
    {
      id: 'duty3',
      title: 'API Documentation',
      description: 'Document all API endpoints',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '2023-07-10',
      projectId: 'project1',
      projectName: 'Website Redesign',
      creationTime: '2023-06-01T09:45:00'
    }
  ]);

  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isDutyModalVisible, setIsDutyModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const projectColumns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <Space>
          <FolderOutlined />
          <a onClick={() => setCurrentProject(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (text: string) => <Tag icon={<TeamOutlined />}>{text}</Tag>,
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (_: unknown, record: Project) => (
        <Space>
          <CalendarOutlined />
          <Text type="secondary">
            {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Project['status']) => {
        const statusMap = {
          NotStarted: { color: 'default', text: 'Not Started' },
          InProgress: { color: 'processing', text: 'In Progress' },
          Completed: { color: 'success', text: 'Completed' },
          OnHold: { color: 'warning', text: 'On Hold' }
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'} 
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Project) => (
        <Space size="middle">
          <Button size="small" onClick={() => setCurrentProject(record)}>
            View Details
          </Button>
        </Space>
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
      render: (status: ProjectDuty['status']) => {
        const statusMap = {
          Pending: { color: 'default', text: 'Pending' },
          InProgress: { color: 'processing', text: 'In Progress' },
          Completed: { color: 'success', text: 'Completed' },
          Blocked: { color: 'error', text: 'Blocked' }
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: ProjectDuty['priority']) => {
        const priorityMap = {
          Low: { color: 'green', text: 'Low' },
          Medium: { color: 'blue', text: 'Medium' },
          High: { color: 'orange', text: 'High' },
          Critical: { color: 'red', text: 'Critical' }
        };
        return <Tag color={priorityMap[priority].color}>{priorityMap[priority].text}</Tag>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  const handleCreateProject = (values: Omit<Project, 'id' | 'creationTime' | 'progress' | 'status'>) => {
    const newProject: Project = {
      id: `project${projects.length + 1}`,
      ...values,
      status: 'NotStarted',
      progress: 0,
      creationTime: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
    setIsProjectModalVisible(false);
  };

  const handleCreateDuty = (values: Omit<ProjectDuty, 'id' | 'creationTime'>) => {
    if (!currentProject) return;
    
    const newDuty: ProjectDuty = {
      id: `duty${duties.length + 1}`,
      ...values,
      projectId: currentProject.id,
      projectName: currentProject.name,
      creationTime: new Date().toISOString()
    };
    setDuties([...duties, newDuty]);
    setIsDutyModalVisible(false);
  };

  const currentProjectDuties = currentProject 
    ? duties.filter(duty => duty.projectId === currentProject.id)
    : [];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Projects</Title>
      
      <Card 
        title="Project Management"
        extra={
          <Space>
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              onChange={(value) => setStatusFilter(value)}
              allowClear
            >
              <Select.Option value="NotStarted">Not Started</Select.Option>
              <Select.Option value="InProgress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="OnHold">On Hold</Select.Option>
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
                  <p>{currentProject.teamName}</p>
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
                  percent={currentProject.progress} 
                  status={currentProject.progress === 100 ? 'success' : 'active'} 
                />
              </div>
            </Card>
            
            <Card title="Project Duties">
              <Table 
                columns={dutyColumns} 
                dataSource={currentProjectDuties} 
                rowKey="id"
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
        width={600}
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
          
          <Form.Item 
            label="Timeline" 
            required
          >
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
          
          <Form.Item 
            label="Collaboration" 
            name="isCollaborationEnabled" 
            valuePropName="checked"
          >
            <Select>
              <Select.Option value={true}>Enabled</Select.Option>
              <Select.Option value={false}>Disabled</Select.Option>
            </Select>
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
              <Select.Option value="Low">Low</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Critical">Critical</Select.Option>
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
}