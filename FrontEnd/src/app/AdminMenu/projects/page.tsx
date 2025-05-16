"use client";

import { Table, Tag, Space, Card, Typography, Button, Modal, Form, Input, DatePicker, Select, Progress } from 'antd';
import { FolderOutlined, TeamOutlined, CalendarOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useProjectState, useProjectActions } from '../../../provider/ProjectManagement';
import { useTeamActions } from '../../../provider/TeamManagement';
import { useAuthState } from '../../../provider/CurrentUserProvider';
import { useProjectManagerState, useProjectManagerActions } from '../../../provider/ProjectManagerManagement';
import { 
  IProject, 
  ICreateProjectDto,
  ICreateProjectDutyDto,
  DutyStatus,
  Priority,
  IGetProjectsInput,
  IGetProjectDutiesInput
} from '../../../provider/ProjectManagement/context';
import { ITeam } from '../../../provider/TeamManagement/context';


const { Title, Text } = Typography;
const { TextArea } = Input;

const ProjectUIStatus = {
  NotStarted: 'NotStarted',
  InProgress: 'InProgress',
  Completed: 'Completed',
  OnHold: 'OnHold'
} as const;

type ProjectStatusType = keyof typeof ProjectUIStatus;

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

interface FormValues {
  name: string;
  description?: string;
  teamId: string;
  startDate?: { format(format: string): string }; 
  endDate?: { format(format: string): string }; 
}

interface DutyFormValues {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: { format(format: string): string }; 
}

const ProjectsPage = () => {
  const { projects, projectDuties, isPending } = useProjectState();
  const { getProjects, createProject, getProjectDuties, createProjectDuty } = useProjectActions();
  const teamActions = useTeamActions();
  const { currentUser } = useAuthState();
  const { projectManager } = useProjectManagerState(); 
  const { getCurrentProjectManager } = useProjectManagerActions();


  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [isDutyModalVisible, setIsDutyModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatusType>();
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [teamMap, setTeamMap] = useState<Record<string, string>>({});


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const input: IGetProjectsInput = {};
        await getProjects(input);
        const teamsResponse = await teamActions.getTeams({});
        setTeams(teamsResponse);
        
        const mapping: Record<string, string> = {};
        teamsResponse.forEach(team => {
          mapping[team.id] = team.name;
        });
        setTeamMap(mapping);

        if (currentUser?.id) {
          getCurrentProjectManager(currentUser.id);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadProjectDuties = async () => {
      if (currentProject?.id) {
        const input: IGetProjectDutiesInput = { projectId: currentProject.id };
        await getProjectDuties(input);
      }
    };
    loadProjectDuties();
  }, [currentProject?.id, getProjectDuties]);


  const getProjectProgress = React.useCallback((projectId: string): number => {
    const projectDutiesForProject = projectDuties.filter(duty => duty.projectId === projectId);
    const completedDuties = projectDutiesForProject.filter(duty => duty.status === DutyStatus.Done).length;
    return projectDutiesForProject.length > 0 ? (completedDuties / projectDutiesForProject.length) * 100 : 0;
  }, [projectDuties]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? project.progress === 100 : true;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async (values: FormValues) => {
    try {
      console.error('Current user:', currentUser);
      console.error('Current project manager:', projectManager);
      
      console.error('Form values:', values);
      
      if (!currentUser?.id) {
        console.error('No valid user ID found. You must be logged in to create projects.');
        alert('Error: You must be logged in to create projects.');
        return;
      }

      if (!projectManager?.id) {
        console.error('No valid project manager found for current user');
        if (currentUser?.id) {
          await getCurrentProjectManager(currentUser.id);
          if (!projectManager?.id) {
            alert('Error: You do not have project manager permissions.');
            return;
          }
        } else {
          alert('Error: You do not have project manager permissions.');
          return;
        }
      }
      
      const projectData: ICreateProjectDto = {
        name: values.name,
        description: values.description || '',
        teamId: values.teamId,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : '',
        isCollaborationEnabled: true,
        projectManagerId: projectManager.id 
      };
      
      console.error('Creating project with data:', projectData);
      await createProject(projectData);
      setIsProjectModalVisible(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. See console for details.');
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
        dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : undefined
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
      render: (teamId: string) => {
        const teamName = teamMap[teamId] || teamId;
        return <Tag icon={<TeamOutlined />}>{teamName}</Tag>;
      },
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

  // Update the form to use team names in the dropdown
  const renderTeamOptions = () => {
    return teams.map(team => (
      <Select.Option key={team.id} value={team.id}>
        {team.name}
      </Select.Option>
    ));
  };

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
        <Form 
          layout="vertical" 
          onFinish={handleCreateProject}
        >
          <Form.Item 
            name="name" 
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item 
            name="teamId" 
            label="Team"
            rules={[{ required: true, message: 'Please select a team' }]}
          >
            <Select placeholder="Select team">
              {renderTeamOptions()}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="startDate" 
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item 
            name="endDate" 
            label="End Date"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
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
                <Select.Option key={key} value={Number(key)}>
                  {PRIORITY_MAP[Number(key) as Priority]?.text || key}
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