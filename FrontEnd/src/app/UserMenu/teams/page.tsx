"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Table, 
  Typography, 
  Tag, 
  Space, 
  Card, 
  Button, 
  Spin, 
  Input,
  Avatar,
  Empty,
  message,
  Modal
} from 'antd';
import { 
  TeamOutlined, 
  UserOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useAuthState } from '@/provider/CurrentUserProvider';
import { ITeam } from '@/provider/TeamManagement/context';
import { TeamRole } from '@/enums/TeamRole';
import type { ColumnsType } from 'antd/es/table';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import { getAxiosInstance } from '@/utils/axiosInstance';
import { AxiosError } from 'axios';

const { Title} = Typography;
const { Search } = Input;

// Interfaces
interface IUserTeam {
  id: string;
  teamId: string;
  teamMemberId: string;
  role: number;
  member?: {
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string;
  };
  creationTime?: string;
}

export default function UserTeamsPage() {
  // States
  const [loading, setLoading] = useState(true);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<ITeam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [myTeams, setMyTeams] = useState<ITeam[]>([]);
  const [localTeamMembers, setLocalTeamMembers] = useState<IUserTeam[]>([]);
  const [teamMemberCounts, setTeamMemberCounts] = useState<Record<string, number>>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentUser } = useAuthState();

  // Load the current user's teams
  const loadUserTeams = useCallback(async () => {
    if (!currentUser?.id) {
      console.log('No current user ID found');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log('Current user ID:', currentUser.id);
    try {
      const api = getAxiosInstance();
      

      console.log('currentUser object:', currentUser);
    
      let teamMemberId = currentUser.id.toString();
      
      if (currentUser.name === 'NomusaM' || currentUser.userName === 'NomusaM') {
        teamMemberId = '0196aa12-8a82-7a02-978c-eac7f6e75598';
        console.log('Using hardcoded teamMemberId for Nomusa:', teamMemberId);
      }
      
      if (typeof teamMemberId !== 'string') {
        console.error('Invalid teamMemberId type:', typeof teamMemberId);
        teamMemberId = String(teamMemberId);
      }
      
      console.log('Final teamMemberId being used:', teamMemberId);
      
      console.log('Fetching user teams for team member ID:', teamMemberId);
      const userTeamsResponse = await api.get('/api/services/app/UserTeam/GetList', {
        params: { teamMemberId: teamMemberId }
      });
      
      console.log('User teams response:', userTeamsResponse.data);
      
      if (!userTeamsResponse.data?.result?.items?.length) {
        console.log('No teams found for this user');
        setMyTeams([]);
        setLoading(false);
        return;
      }
      
      const userTeams = userTeamsResponse.data.result.items;
      console.log('User teams found:', userTeams.length);
      
      const teams = await Promise.all(
        userTeams.map(async (userTeam: { teamId: string; role: number }) => {
          try {
            console.log('Fetching details for team ID:', userTeam.teamId);
            const teamResponse = await api.get('/api/services/app/Team/Get', {
              params: { id: userTeam.teamId }
            });
            
            console.log('Team details response:', teamResponse.data);
            const team = teamResponse.data.result;
            team.userRole = TeamRole[userTeam.role]; 
            return team;
          } catch (err) {
            console.error(`Error fetching details for team ${userTeam.teamId}:`, err);
            return null;
          }
        })
      );
      
      const validTeams = teams.filter(Boolean) as ITeam[];
      setMyTeams(validTeams);

      const countsObj: Record<string, number> = {};
      
      const fetchPromises = validTeams.map(async (team) => {
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
    } catch (error) {
      console.error('Failed to load teams:', error);
      message.error('Could not load your teams. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load team members when a team is selected
  const loadTeamMembers = useCallback(async (teamId: string) => {
    if (!teamId) return;
    
    try {
      console.log('Loading team members for team ID:', teamId);
      
      const api = getAxiosInstance();
      const response = await api.get('/api/services/app/UserTeam/GetList', {
        params: { teamId }
      });
      
      if (response.data && response.data.result && response.data.result.items) {
        const teamMembers = response.data.result.items;
        
        const membersWithDetails = await Promise.all(
          teamMembers.map(async (member: { teamMemberId: string; id: string; role: TeamRole }) => {
            try {
              const userResponse = await api.get('/api/services/app/User/Get', {
                params: { id: member.teamMemberId }
              });
              
              return {
                ...member,
                member: userResponse.data.result
              };
            } catch (err) {
              console.error('Error fetching user details:', err);
              return member;
            }
          })
        );
        
        setLocalTeamMembers(membersWithDetails);
        
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error loading team members:', axiosError);
      message.error('Failed to load team members');
    }
  }, []);

  // Handle opening the member modal
  const handleOpenMemberModal = (team: ITeam) => {
    setCurrentTeam(team);
    loadTeamMembers(team.id);
    setIsMemberModalVisible(true);
  };

  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm) return myTeams;
    
    const term = searchTerm.toLowerCase();
    return myTeams.filter(team => 
      team.name.toLowerCase().includes(term) ||
      (team.description && team.description.toLowerCase().includes(term))
    );
  }, [myTeams, searchTerm]);

  // Initial data load
  useEffect(() => {
    loadUserTeams();
  }, [loadUserTeams]);

  // Define columns for the teams table
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
      title: 'Your Role',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role: string) => {
        const roleColors: Record<string, string> = {
          'TeamLead': 'gold',
          'ProductManager': 'purple',
          'Member': 'blue',
          'Developer': 'cyan',
          'QAEngineer': 'lime',
          'BusinessAnalyst': 'magenta',
          'UXDesigner': 'volcano',
          'DevOpsEngineer': 'geekblue',
          'SoftwareDeveloper': 'orange',
          'ProductOwner': 'red',
          'Stakeholder': 'green',
          'TechnicalArchitect': 'gray',
          'ReleaseManager': 'brown'
        };
        return <Tag color={roleColors[role] || 'blue'}>{role}</Tag>;
      },
      responsive: ['sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Members',
      key: 'members',
      render: (_: unknown, record: ITeam) => {
        // Use our cached member counts
        const count = teamMemberCounts[record.id] || 0;
        return <Tag color="blue">{count} members</Tag>;
      },
      responsive: ['md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
      render: (_: unknown, record: ITeam) => (
        <Button size="small" onClick={() => handleOpenMemberModal(record)}>
          View Members
        </Button>
      ),
    },
  ];

  // Define columns for the member table
  const memberColumns: ColumnsType<IUserTeam> = [
    {
      title: 'Member',
      dataIndex: 'teamMemberId',
      key: 'teamMemberId',
      render: (_: string, record: IUserTeam) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} src={record.member?.profilePictureUrl} />
          <span>
            {record.member ? `${record.member.firstName} ${record.member.lastName}` : 'Unknown User'}
            {record.member?.email && (
              <div className="text-gray-500 text-xs">{record.member.email}</div>
            )}
          </span>
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string | number) => {
        // Convert role to number
        const roleNumber = typeof role === 'string' ? Number(role) : role;
        
        // Get the role name from TeamRole enum
        const roleName = TeamRole[roleNumber as TeamRole];
        
        // Get the color based on role name
        const roleColors = {
          Member: 'blue',
          TeamLead: 'gold',
          ProductManager: 'purple',
          Developer: 'cyan',
          QAEngineer: 'lime',
          BusinessAnalyst: 'magenta',
          UXDesigner: 'volcano',
          DevOpsEngineer: 'geekblue',
          SoftwareDeveloper: 'orange',
          ProductOwner: 'red',
          Stakeholder: 'green',
          TechnicalArchitect: 'gray',
          ReleaseManager: 'brown'
        } as const;
        
        // Fallback to 'Member' if role name is not found
        const color = roleColors[roleName as keyof typeof roleColors] || 'blue';
        
        return <Tag color={color}>{roleName}</Tag>;
      },
      responsive: ['sm', 'md', 'lg', 'xl'] as Breakpoint[],
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>
            <TeamOutlined className="mr-2" /> My Teams
          </Title>
          <Space>
            <Search
              placeholder="Search teams..."
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadUserTeams}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </div>

        {filteredTeams.length > 0 ? (
          <Table 
            columns={teamColumns} 
            dataSource={filteredTeams} 
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} teams`,
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <div>
                  <p>You are not currently a member of any teams</p>
                  {currentUser && <p>Logged in as: {currentUser.userName} (ID: {currentUser.id})</p>}
                  <Button onClick={loadUserTeams} type="primary" style={{ marginTop: '16px' }}>
                    Refresh
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </Card>

      {/* Team Members Modal */}
      <Modal
        title={`${currentTeam?.name || 'Team'} Members`}
        open={isMemberModalVisible}
        onCancel={() => setIsMemberModalVisible(false)}
        footer={null}
        width={700}
      >
        <Spin spinning={loading && localTeamMembers.length === 0} tip="Loading team members...">
          {localTeamMembers.length > 0 ? (
            <Table 
              columns={memberColumns}
              dataSource={localTeamMembers}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
              }}
              key={`member-table-${refreshKey}`}
            />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description="No members found in this team"
            />
          )}
        </Spin>
      </Modal>
    </div>
  );
}