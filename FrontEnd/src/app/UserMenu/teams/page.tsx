"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Table, 
  Typography, 
  Tag, 
  Space, 
  Card, 
  Button, 
  Spin, 
  Tooltip,
  Input,
  Avatar,
  Empty,
  message
} from 'antd';
import { 
  TeamOutlined, 
  SearchOutlined,
  InfoCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useAuthState } from '@/provider/CurrentUserProvider';
import { useTeamActions } from '@/provider/TeamManagement';
import { useTeamMemberActions } from '@/provider/TeamMemberManagement';
import type { ColumnsType } from 'antd/es/table';
import type { ITeam, IUserTeam } from '@/provider/TeamManagement/context';
import { TeamRole } from '@/enums/TeamRole';

const { Title, Text } = Typography;
const { Search } = Input;

// Extended team interface to include user's role in the team
interface ExtendedTeam extends ITeam {
  userRole?: string;
  memberCount?: number;
}

// Interface for team member user team type
interface TeamMemberUserTeam {
  id: string;
  teamId: string;
  teamMemberId: string;
  role: string | number | TeamRole;
}

export default function UserTeamsPage() {
  const [loading, setLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<ExtendedTeam[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { currentUser } = useAuthState();
  const { getUserTeams, getTeam } = useTeamActions();
  const { getUserTeams: getMemberTeams } = useTeamMemberActions();

  // Force a refresh of the component
  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setErrorMsg(null);
  };

  // Function to handle team data loading
  const loadTeamDetails = async (teamId: string): Promise<ExtendedTeam | null> => {
    try {
      // Get team details
      const team = await getTeam(teamId);
      
      // Get members count - using proper API format for GetList
      const teamMembersResult = await getUserTeams({
        teamId: teamId,
        skipCount: 0,
        maxResultCount: 1000 // Large enough to get all members
      });
      
      const memberCount = teamMembersResult.items.length;
      
      return {
        ...team,
        memberCount
      };
    } catch (err) {
      console.error(`Error fetching details for team ${teamId}:`, err);
      return null;
    }
  };

  const loadUserTeams = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      if (!currentUser?.id) {
        setMyTeams([]);
        setLoading(false);
        return;
      }
      
      // Get the string version of the user ID
      const userId = typeof currentUser.id === 'number' 
        ? currentUser.id.toString() 
        : currentUser.id;
      
      // First attempt - using TeamManagement provider
      try {
        const result = await getUserTeams({
          teamMemberId: userId,
          skipCount: 0, 
          maxResultCount: 100 // Set reasonable limits
        });
        
        if (result.items && result.items.length > 0) {
          // Process each team to get details
          const teamPromises = result.items.map(async (userTeam: IUserTeam) => {
            const team = await loadTeamDetails(userTeam.teamId);
            if (team) {
              // Format role to string
              let roleString: string;
              if (typeof userTeam.role === 'number') {
                roleString = TeamRole[userTeam.role] || String(userTeam.role);
              } else if (typeof userTeam.role === 'string') {
                roleString = userTeam.role;
              } else {
                roleString = String(userTeam.role);
              }
              
              return {
                ...team,
                userRole: roleString
              };
            }
            return null;
          });
          
          const teams = await Promise.all(teamPromises);
          setMyTeams(teams.filter(Boolean) as ExtendedTeam[]);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn("Primary team loading method failed, trying fallback", error);
      }
      
      // Fallback - using TeamMemberManagement provider
      try {
        const memberTeams = await getMemberTeams(userId);
        
        if (memberTeams && memberTeams.length > 0) {
          // Process each team to get details
          const teamPromises = memberTeams.map(async (userTeam: TeamMemberUserTeam) => {
            const team = await loadTeamDetails(userTeam.teamId);
            if (team) {
              // Determine the role string
              const roleValue = userTeam.role;
              let roleString: string;
              
              if (typeof roleValue === 'string') {
                roleString = roleValue;
              } else if (typeof roleValue === 'number') {
                roleString = TeamRole[roleValue] || String(roleValue);
              } else {
                roleString = String(roleValue);
              }
              
              return {
                ...team,
                userRole: roleString
              };
            }
            return null;
          });
          
          const teams = await Promise.all(teamPromises);
          setMyTeams(teams.filter(Boolean) as ExtendedTeam[]);
        } else {
          setMyTeams([]);
        }
      } catch (error) {
        console.error("Both team loading methods failed", error);
        setErrorMsg("Could not load your teams. Please try again later.");
        message.error("Could not load your teams. Please try again later.");
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
      setErrorMsg("Could not load your teams. Please try again later.");
      message.error('Could not load your teams. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, getUserTeams, getTeam, getMemberTeams]);
  
  // Load teams on initial render and when refresh key changes
  useEffect(() => {
    loadUserTeams();
  }, [loadUserTeams, refreshKey]);
  
  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm) return myTeams;
    
    const term = searchTerm.toLowerCase();
    return myTeams.filter(team => 
      team.name.toLowerCase().includes(term) ||
      (team.description && team.description.toLowerCase().includes(term))
    );
  }, [myTeams, searchTerm]);
  
  // Define columns for the table
  const columns: ColumnsType<ExtendedTeam> = [
    {
      title: 'Team',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => text || '-'
    },
    {
      title: 'Your Role',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role) => <Tag color="blue">{role}</Tag>
    },
    {
      title: 'Members',
      dataIndex: 'memberCount',
      key: 'memberCount',
      render: (count) => count || 0
    },
    {
      title: 'Projects',
      dataIndex: 'projectCount',
      key: 'projectCount',
      render: (count) => count || 0
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="View Team Details">
            <Button 
              type="primary" 
              size="small" 
              icon={<InfoCircleOutlined />}
            >
              Details
            </Button>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="m-0">
            <TeamOutlined className="mr-2" /> My Teams
          </Title>
          <Space>
            <Search 
              placeholder="Search teams..." 
              allowClear 
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={forceRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          {errorMsg && !loading && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
              {errorMsg}
            </div>
          )}
          
          {!loading && filteredTeams.length > 0 ? (
            <Table 
              columns={columns}
              dataSource={filteredTeams}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} items`,
              }}
            />
          ) : (
            !loading && !errorMsg && (
              <div className="py-12 flex justify-center">
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={
                    <Text strong>
                      You are not currently a member of any teams
                    </Text>
                  }
                />
              </div>
            )
          )}
        </Spin>
      </Card>
    </div>
  );
}