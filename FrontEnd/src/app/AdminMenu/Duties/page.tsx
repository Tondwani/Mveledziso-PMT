"use client";

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Tabs, 
  message, 
  Typography, 
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Dropdown,
  Spin
} from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { Key } from 'react';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckOutlined, 
  ClockCircleOutlined, 
  HighlightOutlined, 
  ExclamationCircleOutlined,
  SyncOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useProjectState, useProjectActions } from '../../../provider/ProjectManagement';
import { useUserDutyState, useUserDutyActions } from '../../../provider/DutyManagement';
import { useTeamMemberState, useTeamMemberActions } from '../../../provider/TeamMemberManagement';
import { IProjectDuty, IGetProjectDutiesInput } from '../../../provider/ProjectManagement/context';
import { IUserDuty, IGetUserDutyInput } from '../../../provider/DutyManagement/context';
import { ITeamMember } from '../../../provider/TeamMemberManagement/context';
import { DutyStatus } from '../../../enums/DutyStatus';
import { PriorityLevel } from '../../../enums/PriorityLevel';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import { ICreateUserDutyDto } from '@/provider/DutyManagement/context';
import axios from 'axios';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// Helper function to convert enums to human-readable format
const formatDutyStatus = (status: DutyStatus): { text: string; color: string } => {
  switch (status) {
    case DutyStatus.ToDo:
      return { text: 'To Do', color: 'default' };
    case DutyStatus.InProgress:
      return { text: 'In Progress', color: 'processing' };
    case DutyStatus.Review:
      return { text: 'Review', color: 'warning' };
    case DutyStatus.Done:
      return { text: 'Done', color: 'success' };
    default:
      return { text: 'Unknown', color: 'default' };
  }
};

const formatPriorityLevel = (priority: PriorityLevel): { text: string; color: string } => {
  switch (priority) {
    case PriorityLevel.Low:
      return { text: 'Low', color: 'green' };
    case PriorityLevel.Medium:
      return { text: 'Medium', color: 'blue' };
    case PriorityLevel.High:
      return { text: 'High', color: 'orange' };
    case PriorityLevel.Urgent:
      return { text: 'Urgent', color: 'red' };
    default:
      return { text: 'Unknown', color: 'default' };
  }
};

// Extended interface to include project and team member data
interface IExtendedUserDuty extends IUserDuty {
  projectDuty?: IProjectDuty;
  teamMember?: ITeamMember;
}

// Add these interfaces at the top of your file, after the imports
interface IProjectDutyExtended extends IProjectDuty {
  deadline?: string;
  projectName?: string;
}

interface IGetProjectDutiesInputExtended extends IGetProjectDutiesInput {
  skipCount?: number;
  maxResultCount?: number;
}

// Create a wrapper component that uses searchParams
const DutiesContent = () => {
  // States
  const [activeTab, setActiveTab] = useState<string>('1');
  const [projectDutyForm] = Form.useForm();
  const [userDutyForm] = Form.useForm();
  const [isProjectDutyModalVisible, setIsProjectDutyModalVisible] = useState<boolean>(false);
  const [isUserDutyModalVisible, setIsUserDutyModalVisible] = useState<boolean>(false);
  const [editingProjectDuty, setEditingProjectDuty] = useState<IProjectDuty | null>(null);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  // const [selectedUserDutyId, setSelectedUserDutyId] = useState<string | null>(null);
  const [extendedUserDuties, setExtendedUserDuties] = useState<IExtendedUserDuty[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Providers
  const { projectDuties, isPending: projectIsPending } = useProjectState();
  const totalDutiesCount = projectDuties.length; // Calculate total count from array length
  const { projects } = useProjectState();
  const { userDuties, isPending: userDutiesIsPending, totalCount: userDutiesTotalCount } = useUserDutyState();
  const { teamMembers } = useTeamMemberState();
  
  const { 
    getProjectDuties, 
    createProjectDuty, 
    updateProjectDuty, 
    updateDutyStatus,
    getProjects
  } = useProjectActions();
  
  const { 
    getUserDuties, 
    createUserDuty, 
    deleteUserDuty 
  } = useUserDutyActions();
  
  const { 
    getTeamMembers
  } = useTeamMemberActions();
  
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  // Add loading states
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);

  // Memoize callback functions
  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      await getProjects({});
    } catch (error) {
      console.error('Failed to load projects:', error);
      message.error('Failed to load projects');
    } finally {
      setIsLoadingProjects(false);
    }
  }, [getProjects]);

  const loadTeamMembers = useCallback(async () => {
    setIsLoadingTeamMembers(true);
    try {
      await getTeamMembers({ maxResultCount: 100 });
    } catch (error) {
      console.error('Failed to load team members:', error);
      message.error('Failed to load team members');
    } finally {
      setIsLoadingTeamMembers(false);
    }
  }, [getTeamMembers]);

  const loadProjectDuties = useCallback(async (input: IGetProjectDutiesInputExtended) => {
    try {
      await getProjectDuties(input as IGetProjectDutiesInput);
      setPagination(prev => ({
        ...prev,
        total: totalDutiesCount
      }));
    } catch (error) {
      console.error('Failed to load project duties:', error);
      message.error('Failed to load project duties');
    }
  }, [getProjectDuties, totalDutiesCount]);

  const loadUserDuties = useCallback(async (input: IGetUserDutyInput) => {
    try {
      await getUserDuties(input);
      setPagination(prev => ({
        ...prev,
        total: userDutiesTotalCount
      }));
    } catch (error) {
      console.error('Failed to load user duties:', error);
      message.error('Failed to load user duties');
    }
  }, [getUserDuties, userDutiesTotalCount]);

  const enrichUserDuties = useCallback(() => {
    if (!userDuties.length || !projectDuties.length || !teamMembers.length) {
      return;
    }
    
    // Create lookup maps for faster access
    const projectDutyMap = new Map(projectDuties.map(duty => [duty.id, duty]));
    const teamMemberMap = new Map(teamMembers.map(member => [member.id, member]));
    
    const enriched = userDuties.map(userDuty => ({
      ...userDuty,
      projectDuty: projectDutyMap.get(userDuty.projectDutyId),
      teamMember: teamMemberMap.get(userDuty.teamMemberId)
    }));
    
    setExtendedUserDuties(enriched);
  }, [userDuties, projectDuties, teamMembers]);

  // Effect hooks for data loading
  useEffect(() => {
    loadProjects();
    loadTeamMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array

  useEffect(() => {
    if (activeTab === '1') {
      loadProjectDuties({
        skipCount: (pagination.current - 1) * pagination.pageSize,
        maxResultCount: pagination.pageSize
      });
    } else if (activeTab === '2') {
      loadUserDuties({
        skipCount: (pagination.current - 1) * pagination.pageSize,
        maxResultCount: pagination.pageSize
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); 

  useEffect(() => {
    if (userDuties && projects && teamMembers) {
      enrichUserDuties();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDuties]); // Only depend on userDuties

  // Project Duty Handlers
  const showProjectDutyModal = (duty?: IProjectDuty) => {
    if (duty) {
      setEditingProjectDuty(duty);
      projectDutyForm.setFieldsValue({
        ...duty,
        deadline: duty.deadline ? dayjs(duty.deadline) : undefined
      });
    } else {
      setEditingProjectDuty(null);
      projectDutyForm.resetFields();
      if (projectId) {
        projectDutyForm.setFieldsValue({ projectId });
      }
    }
    setIsProjectDutyModalVisible(true);
  };

  const handleProjectDutyCancel = () => {
    projectDutyForm.resetFields();
    setIsProjectDutyModalVisible(false);
    setEditingProjectDuty(null);
  };

  const handleProjectDutySubmit = async () => {
    try {
      const values = await projectDutyForm.validateFields();
      
      // Prepare the data
      const dutyData = {
        ...values,
        deadline: values.deadline ? values.deadline.format() : undefined
      };
      
      if (editingProjectDuty) {
        // Update existing duty
        await updateProjectDuty({
          id: editingProjectDuty.id,
          ...dutyData
        });
        message.success('Project duty updated successfully');
      } else {
        // Create new duty
        await createProjectDuty(dutyData);
        message.success('Project duty created successfully');
      }
      
      // Reset and reload
      setIsProjectDutyModalVisible(false);
      projectDutyForm.resetFields();
      loadProjectDuties({
        skipCount: (pagination.current - 1) * pagination.pageSize,
        maxResultCount: pagination.pageSize
      });
      
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleDutyStatusChange = async (dutyId: string, newStatus: DutyStatus) => {
    try {
      await updateDutyStatus(dutyId, newStatus);
      message.success('Status updated successfully');
      loadProjectDuties({
        skipCount: (pagination.current - 1) * pagination.pageSize,
        maxResultCount: pagination.pageSize
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      message.error('Failed to update status');
    }
  };

  // User Duty Handlers
  const showUserDutyModal = (projectDutyId?: string) => {
    userDutyForm.resetFields();
    if (projectDutyId) {
      userDutyForm.setFieldsValue({ projectDutyId });
    }
    setIsUserDutyModalVisible(true);
  };

  const handleUserDutyCancel = () => {
    userDutyForm.resetFields();
    setIsUserDutyModalVisible(false);
  };

  const handleUserDutySubmit = async () => {
    console.log('Assignment button clicked');
    setIsAssigning(true);
    
    try {
      console.log('Validating form fields...');
      const values = await userDutyForm.validateFields();
      console.log('Form validation successful:', values);
      
      // Make sure we have values
      if (!values.teamMemberId || !values.projectDutyId) {
        message.error('Please select both a duty and a team member');
        setIsAssigning(false);
        return;
      }
      
      // Format the values as proper strings
      const submissionData: ICreateUserDutyDto = {
        teamMemberId: String(values.teamMemberId).trim(),
        projectDutyId: String(values.projectDutyId).trim()
      };
      
      console.log('Submission data:', submissionData);
      
      // Check if the values are valid GUIDs
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!guidRegex.test(submissionData.teamMemberId)) {
        console.error('Invalid TeamMemberId format:', submissionData.teamMemberId);
        message.error('Invalid Team Member ID format. Please select a valid team member.');
        setIsAssigning(false);
        return;
      }
      
      if (!guidRegex.test(submissionData.projectDutyId)) {
        console.error('Invalid ProjectDutyId format:', submissionData.projectDutyId);
        message.error('Invalid Project Duty ID format. Please select a valid duty.');
        setIsAssigning(false);
        return;
      }
      
      console.log('Calling createUserDuty API...');
      message.loading({ content: 'Assigning duty...', key: 'assignDuty' });
      
      try {
        // Get auth token from session storage for direct API call
        const token = sessionStorage.getItem("auth_token");
        
        // Try direct axios call for debugging
        console.log('Attempting direct API call...');
        try {
          const directResponse = await axios.post(
            'https://localhost:44311/api/services/app/UserDuty/Create',
            {
              teamMemberId: submissionData.teamMemberId,
              projectDutyId: submissionData.projectDutyId
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": token ? `Bearer ${token}` : undefined
              },
              withCredentials: true
            }
          );
          console.log('Direct API call successful:', directResponse);
          message.success({ content: 'Direct API: User duty assigned successfully', key: 'assignDuty' });
          
          // Reset and reload
          setIsUserDutyModalVisible(false);
          userDutyForm.resetFields();
          if (activeTab === '2') {
            loadUserDuties({
              skipCount: (pagination.current - 1) * pagination.pageSize,
              maxResultCount: pagination.pageSize
            });
          }
          return; // Skip the normal flow
        } catch (directError) {
          console.error('Direct API call failed:', directError);
          // Continue with normal flow
        }
        
        // Normal flow using the context function
        await createUserDuty(submissionData);
        console.log('API call successful');
        message.success({ content: 'User duty assigned successfully', key: 'assignDuty' });
        
        // Reset and reload
        setIsUserDutyModalVisible(false);
        userDutyForm.resetFields();
        if (activeTab === '2') {
          loadUserDuties({
            skipCount: (pagination.current - 1) * pagination.pageSize,
            maxResultCount: pagination.pageSize
          });
        }
      } catch (apiError) {
        console.error('API call failed:', apiError);
        if (apiError instanceof Error) {
          message.error({ content: `API Error: ${apiError.message}`, key: 'assignDuty' });
        } else {
          message.error({ content: 'Failed to assign duty - API error', key: 'assignDuty' });
        }
        throw apiError; // Re-throw to be caught by the outer catch
      }
      
    } catch (error) {
      console.error('Form validation or submission failed:', error);
      if (error instanceof Error) {
        message.error(`Error: ${error.message}`);
      } else {
        message.error('Failed to assign duty');
      }
    } finally {
      console.log('Assignment process completed');
      setIsAssigning(false);
    }
  };

  const handleDeleteUserDuty = async (id: string) => {
    try {
      await deleteUserDuty(id);
      message.success('User duty deleted successfully');
      loadUserDuties({
        skipCount: (pagination.current - 1) * pagination.pageSize,
        maxResultCount: pagination.pageSize
      });
    } catch (error) {
      console.error('Failed to delete user duty:', error);
      message.error('Failed to delete user duty');
    }
  };

  // Table Columns
  const projectDutyColumns: ColumnType<IProjectDutyExtended>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DutyStatus) => {
        const { text, color } = formatDutyStatus(status);
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'To Do', value: DutyStatus.ToDo },
        { text: 'In Progress', value: DutyStatus.InProgress },
        { text: 'Done', value: DutyStatus.Done }
      ],
      onFilter: (value: boolean | Key, record: IProjectDutyExtended) => String(record.status) === String(value)
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: PriorityLevel) => {
        const { text, color } = formatPriorityLevel(priority);
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Low', value: PriorityLevel.Low as unknown as PriorityLevel },
        { text: 'Medium', value: PriorityLevel.Medium as unknown as PriorityLevel },
        { text: 'High', value: PriorityLevel.High as unknown as PriorityLevel },
        { text: 'Urgent', value: PriorityLevel.Urgent as unknown as PriorityLevel }
      ],
      onFilter: (value: boolean | Key, record: IProjectDutyExtended) => String(record.priority) === String(value)
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : 'No deadline'
    },
    {
      title: 'Created',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IProjectDutyExtended) => (
        <Space>
          <Tooltip title="Edit Duty">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showProjectDutyModal(record)} 
            />
          </Tooltip>
          <Tooltip title="Assign to Team Member">
            <Button 
              type="text" 
              icon={<HighlightOutlined />} 
              onClick={() => showUserDutyModal(record.id)} 
            />
          </Tooltip>
          <Dropdown 
            menu={{ 
              items: [
                {
                  key: 'todo',
                  label: 'To Do',
                  icon: <ClockCircleOutlined />,
                  disabled: record.status === DutyStatus.ToDo,
                  onClick: () => handleDutyStatusChange(record.id, DutyStatus.ToDo)
                },
                {
                  key: 'inprogress',
                  label: 'In Progress',
                  icon: <SyncOutlined spin />,
                  disabled: record.status === DutyStatus.InProgress,
                  onClick: () => handleDutyStatusChange(record.id, DutyStatus.InProgress)
                },
                {
                  key: 'review',
                  label: 'Review',
                  icon: <HighlightOutlined />,
                  disabled: record.status === DutyStatus.Review,
                  onClick: () => handleDutyStatusChange(record.id, DutyStatus.Review)
                },
                {
                  key: 'done',
                  label: 'Done',
                  icon: <CheckOutlined />,
                  disabled: record.status === DutyStatus.Done,
                  onClick: () => handleDutyStatusChange(record.id, DutyStatus.Done)
                }
              ]
            }} 
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ] as const;

  const userDutyColumns: ColumnType<IExtendedUserDuty>[] = [
    {
      title: 'Title',
      key: 'title',
      render: (_: unknown, record: IExtendedUserDuty) => 
        record.projectDuty ? <strong>{record.projectDuty.title}</strong> : 'Unknown'
    },
    {
      title: 'Description',
      key: 'description',
      render: (_: unknown, record: IExtendedUserDuty) => record.projectDuty?.description,
      ellipsis: true
    },
    {
      title: 'Project',
      key: 'project',
      render: (_: unknown, record: IExtendedUserDuty) => record.projectDuty?.projectName
    },
    {
      title: 'Assigned To',
      key: 'teamMember',
      render: (_: unknown, record: IExtendedUserDuty) => 
        record.teamMember ? `${record.teamMember.firstName} ${record.teamMember.lastName}` : 'Unknown'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, record: IExtendedUserDuty) => {
        if (!record.projectDuty) return null;
        const { text, color } = formatDutyStatus(record.projectDuty.status);
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Priority',
      key: 'priority',
      render: (_: unknown, record: IExtendedUserDuty) => {
        if (!record.projectDuty) return null;
        const { text, color } = formatPriorityLevel(record.projectDuty.priority as unknown as PriorityLevel);
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Deadline',
      key: 'deadline',
      render: (_: unknown, record: IExtendedUserDuty) => 
        record.projectDuty?.deadline ? dayjs(record.projectDuty.deadline).format('YYYY-MM-DD') : 'No deadline'
    },
    {
      title: 'Assigned Date',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IExtendedUserDuty) => (
        <Space>
          <Popconfirm
            title="Remove Assignment"
            description="Are you sure you want to remove this assignment?"
            onConfirm={() => handleDeleteUserDuty(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ] as const;

  // Update the Table loading prop to consider all loading states
  const isLoading = isLoadingProjects || isLoadingTeamMembers || projectIsPending || userDutiesIsPending;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}> Duties</Title>
        <Space>
          <Button 
            onClick={() => {
              loadProjectDuties({
                skipCount: (pagination.current - 1) * pagination.pageSize,
                maxResultCount: pagination.pageSize
              });
              loadUserDuties({
                skipCount: (pagination.current - 1) * pagination.pageSize,
                maxResultCount: pagination.pageSize
              });
            }} 
            icon={<SyncOutlined />}>
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showProjectDutyModal()}>
            Create Duty
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Project Duties" key="1">
          <Card>
            <Table
              columns={projectDutyColumns}
              dataSource={projectDuties as unknown as IProjectDutyExtended[]}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: (page, pageSize) => {
                  setPagination({
                    current: page,
                    pageSize: pageSize || 10,
                    total: pagination.total
                  });
                }
              }}
            />
          </Card>
        </TabPane>
        <TabPane tab="Assigned Duties" key="2">
          <Card>
            <Table
              columns={userDutyColumns}
              dataSource={extendedUserDuties}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: (page, pageSize) => {
                  setPagination({
                    current: page,
                    pageSize: pageSize || 10,
                    total: pagination.total
                  });
                }
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Project Duty Modal */}
      <Modal
        title={editingProjectDuty ? "Edit Duty" : "Create Duty"}
        open={isProjectDutyModalVisible}
        onCancel={handleProjectDutyCancel}
        footer={[
          <Button key="back" onClick={handleProjectDutyCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleProjectDutySubmit}>
            {editingProjectDuty ? "Update" : "Create"}
          </Button>
        ]}
      >
        <Form form={projectDutyForm} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
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
            name="projectId"
            label="Project"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select>
              {projects.map(project => (
                <Option key={project.id} value={project.id}>{project.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue={DutyStatus.ToDo}
              >
                <Select>
                  <Option value={DutyStatus.ToDo}>To Do</Option>
                  <Option value={DutyStatus.InProgress}>In Progress</Option>
                  <Option value={DutyStatus.Review}>Review</Option>
                  <Option value={DutyStatus.Done}>Done</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                initialValue={PriorityLevel.Medium}
              >
                <Select>
                  <Option value={PriorityLevel.Low}>Low</Option>
                  <Option value={PriorityLevel.Medium}>Medium</Option>
                  <Option value={PriorityLevel.High}>High</Option>
                  <Option value={PriorityLevel.Urgent}>Urgent</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="deadline"
            label="Deadline"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* User Duty Modal */}
      <Modal
        title="Assign Duty to Team Member"
        open={isUserDutyModalVisible}
        onCancel={handleUserDutyCancel}
        footer={[
          <Button key="back" onClick={handleUserDutyCancel} disabled={isAssigning}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleUserDutySubmit}
            loading={isAssigning}
            style={{ backgroundColor: isAssigning ? '#1890ff' : undefined }}
          >
            {isAssigning ? 'Assigning...' : 'Assign'}
          </Button>
        ]}
      >
        <Form 
          form={userDutyForm} 
          layout="vertical"
          onValuesChange={(_, values) => {
            console.log('Form values changed:', values);
          }}
        >
          <Form.Item
            name="projectDutyId"
            label="Duty"
            rules={[{ required: true, message: 'Please select a duty' }]}
            normalize={(value) => {
              // Ensure value is a properly formatted string
              return value ? String(value).trim() : '';
            }}
          >
            <Select disabled={!!userDutyForm.getFieldValue('projectDutyId')}>
              {projectDuties.map(duty => (
                <Option key={duty.id} value={duty.id}>
                  {duty.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="teamMemberId"
            label="Team Member"
            rules={[{ required: true, message: 'Please select a team member' }]}
            normalize={(value) => {
              // Ensure value is a properly formatted string
              return value ? String(value).trim() : '';
            }}
          >
            <Select>
              {teamMembers.map(member => (
                <Option key={member.id} value={member.id}>
                  {`${member.firstName} ${member.lastName}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Main component with Suspense boundary
const DutiesPage = () => {
  return (
    <Suspense fallback={
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
        <p>Loading duties...</p>
      </div>
    }>
      <DutiesContent />
    </Suspense>
  );
};

export default DutiesPage;