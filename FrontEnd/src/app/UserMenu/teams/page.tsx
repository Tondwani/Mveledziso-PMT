"use client";

import { Card, Typography, Tag, Space, Avatar, List, Empty } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useContext, useState, useEffect } from 'react';
import { TeamMemberActionContext, IUserTeam, ITeamMember } from '@/provider/TeamMemberManagement/context';
import { TeamActionContext } from '@/provider/TeamManagement/context';
import { useAuthState } from '@/provider/CurrentUserProvider';

const { Title } = Typography;

interface TeamWithMembers extends IUserTeam {
  members: ITeamMember[];
  name: string;
}

export default function TeamMemberTeamsPage() {
  const teamMemberActions = useContext(TeamMemberActionContext);
  const teamActions = useContext(TeamActionContext);
  const { currentUser } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<TeamWithMembers[]>([]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        if (currentUser?.id && teamActions) {
          // Get user's teams
          const userTeams = await teamMemberActions.getUserTeams(currentUser.id.toString());
          
          // Get team details
          const teamDetailsPromises = userTeams.map(ut => 
            teamActions.getTeam(ut.teamId)
          );
          const teamDetails = await Promise.all(teamDetailsPromises);

          // Get team members
          const teamMembersPromises = userTeams.map(ut => 
            teamMemberActions.getTeamMembersByTeam(ut.teamId)
          );
          const teamMembers = await Promise.all(teamMembersPromises);
          
          setMyTeams(userTeams.map((ut, index) => ({
            ...ut,
            name: teamDetails[index].name,
            members: teamMembers[index]
          })));
        }
      } catch (error) {
        console.error('Failed to load teams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, [currentUser?.id, teamMemberActions, teamActions]);

  return (
    <div className="p-6">
      <Title level={2}>My Teams</Title>
      {loading ? (
        <div className="text-center py-8">Loading teams...</div>
      ) : myTeams.length > 0 ? (
        myTeams.map(team => (
          <Card key={team.id} className="mb-4">
            <Space className="mb-4">
              <TeamOutlined className="text-xl" />
              <Title level={4} style={{ margin: 0 }}>{team.name}</Title>
              <Tag color="purple">{team.role}</Tag>
            </Space>

            <List
              itemLayout="horizontal"
              dataSource={team.members}
              renderItem={(member: ITeamMember) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${member.firstName} ${member.lastName}`}
                    description={member.role}
                  />
                </List.Item>
              )}
            />
          </Card>
        ))
      ) : (
        <Empty description="You are not part of any teams" />
      )}
    </div>
  );
}