"use client";

import { Table, Tag, Space, Button, Card, Typography, Modal, Form, Input, Select, Avatar, message, Alert, Spin, Tooltip } from 'antd';
import { TeamOutlined, UserOutlined, PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTeamState, useTeamActions } from '../../../provider/TeamManagement';
import { useTeamMemberState, useTeamMemberActions } from '../../../provider/TeamMemberManagement';
import { TeamRole } from '../../../enums/TeamRole';
import { ITeam, IGetTeamsInput } from '../../../provider/TeamManagement/context';
import { IUserTeam, IAssignTeamRoleDto, IUpdateTeamRoleDto } from '../../../provider/TeamMemberManagement/context';
import { AxiosError } from 'axios';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import type { ColumnsType } from 'antd/es/table';
import { getAxiosInstance } from '../../../utils/axiosInstance';

const { Title } = Typography;
const { Search } = Input;

// Form interfaces
interface TeamFormValues {
  name: string;
  description?: string;
}

interface UpdateTeamFormValues {
  id: string;
  name: string;
  description?: string;
}

interface MemberFormValues {
  teamMemberId: string;
  role: TeamRole;
}

interface RoleFormValues {
  role: TeamRole;
}

export default function TeamsPage() {
  // States
  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);
  const [isUpdateTeamModalVisible, setIsUpdateTeamModalVisible] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<ITeam | null>(null);
  const [editRoleModalVisible, setEditRoleModalVisible] = useState(false);
  const [currentUserTeam, setCurrentUserTeam] = useState<IUserTeam | null>(null);
  const [form] = Form.useForm<TeamFormValues>();
  const [updateTeamForm] = Form.useForm<UpdateTeamFormValues>();
  const [roleForm] = Form.useForm<RoleFormValues>();
  const [filters, setFilters] = useState<IGetTeamsInput>({
    filter: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [localTeamMembers, setLocalTeamMembers] = useState<IUserTeam[]>([]);
  const [teamMemberCounts, setTeamMemberCounts] = useState<Record<string, number>>({});

  // Get our provider states and actions
  const { teams, isPending, isError, errorMessage } = useTeamState();
  const teamActions = useTeamActions();
  const { teamMembers } = useTeamMemberState();
  const { getUserTeams, assignTeamRole, updateTeamRole, getTeamMembers } = useTeamMemberActions();

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await teamActions.getTeams(filters);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error loading teams:', axiosError);
      }
    };
    loadInitialData();
  }, []); // Only load once on mount

  // Load team member counts for all teams
  useEffect(() => {
    const loadAllTeamMemberCounts = async () => {
      if (!teams || teams.length === 0) return;
      
      const countsObj: Record<string, number> = {};
      
      try {
        const api = getAxiosInstance();
        
        // Create an array of promises to fetch team members for each team
        const fetchPromises = teams.map(async (team) => {
          try {
            const response = await api.get('/api/services/app/UserTeam/GetList', {
              params: { teamId: team.id }
            });
            
            if (response.data && response.data.result && response.data.result.items) {
              countsObj[team.id] = response.data.result.items.length;
            } else {
              countsObj[team.id] = 0;
            }
          } catch (error) {
            console.error(`Error loading members for team ${team.id}:`, error);
            countsObj[team.id] = 0;
          }
        });
        
        // Wait for all fetch operations to complete
        await Promise.all(fetchPromises);
        
        // Update state with all counts
        setTeamMemberCounts(countsObj);
        console.error('Team member counts loaded:', countsObj);
        
        // Force refresh UI
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error loading team member counts:', error);
      }
    };
    
    loadAllTeamMemberCounts();
  }, [teams]); // Reload whenever teams changes

  // Load available team members when member modal opens
  useEffect(() => {
    const loadAvailableMembers = async () => {
      if (!isMemberModalVisible) return;
      try {
        console.error('Loading team members...'); // Debug log
        const result = await getTeamMembers({
          maxResultCount: 100,
          skipCount: 0
        });
        console.error('Loaded team members:', result); // Debug log
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error loading available members:', axiosError);
        message.error('Failed to load available members. Please try again.');
      }
    };
    loadAvailableMembers();
  }, [isMemberModalVisible, getTeamMembers]);

  // Load team members when current team changes
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!currentTeam?.id) return;
      try {
        console.error('Loading team members for team ID:', currentTeam.id);
        
        // Direct API call to get team members by team ID
        const api = getAxiosInstance();
        const response = await api.get('/api/services/app/UserTeam/GetList', {
          params: { teamId: currentTeam.id }
        });
        
        console.error('Team members response:', response.data);
        
        if (response.data && response.data.result && response.data.result.items) {
          // Store the team members in local state
          const teamMembers = response.data.result.items;
          console.error('Team members loaded for team:', teamMembers.length);
          
          // Update local state with team members
          setLocalTeamMembers(teamMembers);
          
          // Force a refresh for the UI
          setRefreshKey(prev => prev + 1);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error loading team members:', axiosError);
      }
    };
    loadTeamMembers();
  }, [currentTeam?.id]);

  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    return teams?.filter(team => {
      const searchTerm = filters.filter?.toLowerCase() || '';
      return (
        team.name.toLowerCase().includes(searchTerm) ||
        team.description?.toLowerCase().includes(searchTerm)
      );
    }) || [];
  }, [teams, filters.filter]);

  // Debounced search handler
  const handleSearch = useCallback((value: string) => {
    setFilters(prev => ({
      ...prev,
      filter: value
    }));
  }, []);

  // Show error message when error state changes
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
    }
  }, [isError, errorMessage]);

  const handleCreateTeam = async (values: TeamFormValues) => {
    try {
      await teamActions.createTeam(values);
      setIsTeamModalVisible(false);
      form.resetFields();
      await teamActions.getTeams(filters); // Refresh the list
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(axiosError.message || 'Failed to create team');
    }
  };

  const handleUpdateTeam = async (values: UpdateTeamFormValues) => {
    try {
      await teamActions.updateTeam(values);
      setIsUpdateTeamModalVisible(false);
      updateTeamForm.resetFields();
      await teamActions.getTeams(filters); // Refresh the list
      message.success('Team updated successfully');
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(axiosError.message || 'Failed to update team');
    }
  };

  const handleDeleteTeam = (team: ITeam) => {
    Modal.confirm({
      title: 'Delete Team',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete the team "${team.name}"? This action cannot be undone.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const api = getAxiosInstance();
          await api.delete(`/api/services/app/Team/Delete?id=${team.id}`);
          await teamActions.getTeams(filters); // Refresh the list
          message.success('Team deleted successfully');
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('Error deleting team:', error);
          message.error(axiosError.message || 'Failed to delete team');
        }
      },
    });
  };

  const handleOpenUpdateTeamModal = (team: ITeam) => {
    setCurrentTeam(team);
    updateTeamForm.setFieldsValue({
      id: team.id,
      name: team.name,
      description: team.description
    });
    setIsUpdateTeamModalVisible(true);
  };

  const handleEditRole = async (userTeam: IUserTeam) => {
    setCurrentUserTeam(userTeam);
    roleForm.setFieldsValue({ role: userTeam.role });
    setEditRoleModalVisible(true);
  };

  const handleUpdateRole = async (values: RoleFormValues) => {
    if (!currentUserTeam) return;
    
    try {
      const input: IUpdateTeamRoleDto = { role: values.role };
      await updateTeamRole(currentUserTeam.id, input);
      setEditRoleModalVisible(false);
      
      if (currentTeam) {
        await getUserTeams(currentTeam.id); // Refresh member list
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(axiosError.message || 'Failed to update role');
    }
  };

  const handleAddMember = async (values: MemberFormValues) => {
    if (!currentTeam) return;
    
    try {
      // Find the selected team member
      const selectedMember = teamMembers.find(m => m.id === values.teamMemberId);
      if (!selectedMember) {
        message.error('Selected member not found');
        return;
      }

      // Log the selected member for debugging
      console.error('Selected member:', selectedMember);

      const input: IAssignTeamRoleDto = {
        teamMemberId: selectedMember.userId.toString(), // Send the numeric userId as expected by backend
        teamId: currentTeam.id,
        role: values.role
      };

      // Log the input data being sent
      console.error('Sending data to API:', input);
      
      const result = await assignTeamRole(input);
      console.error('API response:', result);
      
      // Update local team members with new team member
      if (result) {
        // Add the new team member to local state
        setLocalTeamMembers(prev => [...prev, result]);
        
        // Also reload the full list to ensure we have complete data
        const api = getAxiosInstance();
        const response = await api.get('/api/services/app/UserTeam/GetList', {
          params: { teamId: currentTeam.id }
        });
        
        if (response.data && response.data.result && response.data.result.items) {
          const updatedMembers = response.data.result.items;
          setLocalTeamMembers(updatedMembers);
          
          // Update team member count for this team
          setTeamMemberCounts(prev => ({
            ...prev,
            [currentTeam.id]: updatedMembers.length
          }));
        }
        
        // Force refresh the UI
        setRefreshKey(prev => prev + 1);
      }
  
      // Refresh the component (force re-render)
      if (currentTeam) {
        // Instead of using getUserTeams with wrong parameters, we'll just reload the team members
        const availableResponse = await getTeamMembers({
          maxResultCount: 100,
          skipCount: 0
        });
        console.error('Available team members refreshed:', availableResponse.items.length);
        
        // Force a re-render of the component
        setRefreshKey(prev => prev + 1);
      }
      
      message.success('Member added successfully');
    } catch (error) {
      const axiosError = error as AxiosError<{error?: {message: string}}>;
      console.error('Error adding member:', error);
      console.error('Error response:', axiosError.response?.data);
      
      // More descriptive error message
      const errorMessage = axiosError.response?.data?.error?.message 
        || 'Failed to add member';
      message.error(errorMessage);
    }
  };

  const handleOpenMemberModal = (team: ITeam) => {
    setCurrentTeam(team);
    setIsMemberModalVisible(true);
  };

  const teamColumns: ColumnsType<ITeam> = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ITeam) => (
        <Space>
          <TeamOutlined />
          <a onClick={() => handleOpenMemberModal(record)}>{text}</a>
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Members',
      key: 'members',
      render: (_: unknown, record: ITeam) => {
        // Use our cached member counts instead of filtering userTeams
        const count = teamMemberCounts[record.id] || 0;
        return <Tag color="blue">{count} members</Tag>;
      },
      responsive: ['md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Created',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleDateString(),
      responsive: ['lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
      render: (_: unknown, record: ITeam) => (
        <Space size="middle">
          <Button size="small" onClick={() => {
            setCurrentTeam(record);
            setIsMemberModalVisible(true);
          }}>
            Manage Members
          </Button>
          <Tooltip title="Edit Team">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleOpenUpdateTeamModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Team">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteTeam(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const memberColumns: ColumnsType<IUserTeam> = [
    {
      title: 'Member',
      dataIndex: 'teamMemberId',
      key: 'teamMemberId',
      render: (teamMemberId: string) => {
        const member = teamMembers.find(m => m.id === teamMemberId);
        return (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
            <span>{member ? `${member.firstName} ${member.lastName}` : 'Unknown'}</span>
        </Space>
        );
      },
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: TeamRole) => {
        const roleColors = {
          [TeamRole.Member]: 'blue',
          [TeamRole.TeamLead]: 'gold',
          [TeamRole.ProductManager]: 'purple',
          [TeamRole.Developer]: 'cyan',
          [TeamRole.QAEngineer]: 'lime',
          [TeamRole.BusinessAnalyst]: 'magenta',
          [TeamRole.UXDesigner]: 'volcano',
          [TeamRole.DevOpsEngineer]: 'geekblue',
          [TeamRole.SoftwareDeveloper]: 'orange',
          [TeamRole.ProductOwner]: 'red',
          [TeamRole.Stakeholder]: 'green',
          [TeamRole.TechnicalArchitect]: 'gray',
          [TeamRole.ReleaseManager]: 'brown'
        };
        return <Tag color={roleColors[role]}>{TeamRole[role]}</Tag>;
      },
      responsive: ['sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
      render: (_: unknown, record: IUserTeam) => (
        <Space size="middle">
          <Tooltip title="Edit Role">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditRole(record)}
            />
          </Tooltip>
          <Tooltip title="Remove Member">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => {
                Modal.confirm({
                  title: 'Remove Member',
                  icon: <ExclamationCircleOutlined />,
                  content: 'Are you sure you want to remove this member from the team?',
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: async () => {
                    try {
                      console.error('Removing team member with ID:', record.id);
                      const api = getAxiosInstance();
                      await api.delete(`/api/services/app/UserTeam/Delete?id=${record.id}`);
                      
                      // Remove from local state
                      setLocalTeamMembers(prev => prev.filter(member => member.id !== record.id));
                      
                      // Update the member count for this team
                      if (currentTeam) {
                        setTeamMemberCounts(prev => ({
                          ...prev,
                          [currentTeam.id]: (prev[currentTeam.id] || 0) - 1
                        }));
                      }
                      
                      // Force refresh UI
                      setRefreshKey(prev => prev + 1);
                      
                      message.success('Team member removed successfully');
                    } catch (error) {
                      const axiosError = error as AxiosError;
                      console.error('Error removing member:', error);
                      message.error(axiosError.message || 'Failed to remove member');
                    }
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>Team Management</Title>
          <Space>
            <Search
              placeholder="Search teams..."
              onChange={e => handleSearch(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsTeamModalVisible(true)}>
              New Team
            </Button>
          </Space>
        </div>

        <Table 
          columns={teamColumns} 
          dataSource={filteredTeams} 
          rowKey="id"
          loading={isPending}
          pagination={{
            total: teams?.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Create Team Modal */}
      <Modal
        title="Create New Team"
        open={isTeamModalVisible}
        onCancel={() => setIsTeamModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateTeam} layout="vertical">
          <Form.Item 
            name="name"
            label="Team Name" 
            rules={[{ required: true, message: 'Please enter team name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter team description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Team
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Team Modal */}
      <Modal
        title="Update Team"
        open={isUpdateTeamModalVisible}
        onCancel={() => setIsUpdateTeamModalVisible(false)}
        footer={null}
      >
        <Form form={updateTeamForm} onFinish={handleUpdateTeam} layout="vertical">
          <Form.Item
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="name"
            label="Team Name" 
            rules={[{ required: true, message: 'Please enter team name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter team description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Team
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Team Members Modal */}
      <Modal
        title={`${currentTeam?.name || 'Team'} Members`}
        open={isMemberModalVisible}
        onCancel={() => setIsMemberModalVisible(false)}
        footer={null}
        width={800}
      >
        {isPending ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '10px' }}>Loading available team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <Alert
            type="warning"
            message="No Available Members"
            description={
              <div>
                <p>There are no team members available to add. Team members must be registered in the system first.</p>
                <p>Current state: {JSON.stringify({ isPending, teamMembers: teamMembers.length }, null, 2)}</p>
              </div>
            }
            style={{ marginBottom: '16px' }}
          />
        ) : (
          <Form layout="inline" onFinish={handleAddMember} style={{ marginBottom: '16px' }}>
            <Form.Item 
              name="teamMemberId"
              rules={[{ required: true, message: 'Please select a member' }]}
            >
              <Select 
                placeholder="Select member" 
                style={{ width: 300 }}
                loading={isPending}
                showSearch
                optionFilterProp="children"
              >
                {teamMembers
                  .filter(member => !localTeamMembers.some(ut => ut.teamMemberId === member.id && ut.teamId === currentTeam?.id))
                  .map(member => (
                    <Select.Option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} ({member.email})
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item 
              name="role" 
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select placeholder="Select role" style={{ width: 150 }}>
                {Object.entries(TeamRole)
                  .filter(([key]) => !isNaN(Number(key)))
                  .map(([key, value]) => (
                    <Select.Option key={key} value={Number(key)}>
                      {value}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Add Member
              </Button>
            </Form.Item>
          </Form>
        )}
        
        <Table 
          columns={memberColumns} 
          dataSource={localTeamMembers}
          rowKey="id"
          loading={isPending}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          key={`member-table-${refreshKey}`}
        />
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        title="Edit Team Role"
        open={editRoleModalVisible}
        onCancel={() => setEditRoleModalVisible(false)}
        footer={null}
      >
        <Form form={roleForm} onFinish={handleUpdateRole} layout="vertical">
          <Form.Item
            name="role"
            label="Select Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              {Object.entries(TeamRole)
                .filter(([key]) => !isNaN(Number(key)))
                .map(([key, value]) => (
                  <Select.Option key={key} value={Number(key)}>
                    {value}
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Role
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 