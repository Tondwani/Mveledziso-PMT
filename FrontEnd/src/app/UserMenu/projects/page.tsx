"use client";

import { useContext, useEffect, useState } from 'react';
import { Card, Typography, Table, Tag, Space, Button, Row, Col, Progress, Empty } from 'antd';
import { ProjectOutlined, CalendarOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { ProjectActionContext, IProject, DutyStatus } from '@/provider/ProjectManagement/context';
import { TeamMemberActionContext } from '@/provider/TeamMemberManagement/context';
import { useAuthState } from '@/provider/CurrentUserProvider';

const { Title, Text } = Typography;

export default function TeamMemberProjectsPage() {
  const projectActions = useContext(ProjectActionContext);
  const teamMemberActions = useContext(TeamMemberActionContext);
  const { currentUser } = useAuthState();

  const [loading, setLoading] = useState(true);
  const [myProjects, setMyProjects] = useState<IProject[]>([]);

  // Load team member's projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        if (currentUser?.id) {
          // First get the team member's teams
          const userTeams = await teamMemberActions.getUserTeams(currentUser.id.toString());
          
          // Then get projects for each team
          const projectPromises = userTeams.map(team => 
            projectActions.getProjectsByTeam(team.teamId)
          );
          
          const teamProjects = await Promise.all(projectPromises);
          // Flatten and remove duplicates
          const uniqueProjects = Array.from(
            new Set(teamProjects.flat().map(p => p.id))
          ).map(id => teamProjects.flat().find(p => p.id === id)!);
          
          setMyProjects(uniqueProjects);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [currentUser?.id, teamMemberActions, projectActions]);

  // Calculate project progress
  const calculateProgress = (project: IProject) => {
    if (!project.duties || project.duties.length === 0) return 0;
    const completedDuties = project.duties.filter(d => d.status === DutyStatus.Done).length;
    return Math.round((completedDuties / project.duties.length) * 100);
  };

  // Get project status
  const getProjectStatus = (project: IProject) => {
    const progress = calculateProgress(project);
    if (progress === 100) return { text: 'Completed', color: 'success' };
    if (new Date(project.endDate) < new Date()) return { text: 'Overdue', color: 'error' };
    if (progress > 0) return { text: 'In Progress', color: 'processing' };
    return { text: 'Not Started', color: 'default' };
  };

  const columns = [
    {
      title: 'Project',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <ProjectOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Timeline',
      key: 'timeline',
      render: (_: unknown, project: IProject) => (
        <Space>
          <CalendarOutlined />
          <Text>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</Text>
        </Space>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: unknown, project: IProject) => (
        <Progress percent={calculateProgress(project)} size="small" />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, project: IProject) => {
        const status = getProjectStatus(project);
        return (
          <Tag color={status.color} icon={status.text === 'Completed' ? <CheckCircleOutlined /> : <SyncOutlined spin={status.text === 'In Progress'} />}>
            {status.text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, project: IProject) => (
        <Space>
          <Button type="link" href={`/AdminMenu/projects/${project.id}`}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={2}>My Projects</Title>
          </Col>
          <Col span={24}>
            {loading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : myProjects.length > 0 ? (
              <Table
                dataSource={myProjects}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <Empty
                description="No projects assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Col>
        </Row>
      </Card>

      <style jsx global>{`
        .ant-progress-text {
          font-weight: 600;
        }
        .ant-table-row:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}