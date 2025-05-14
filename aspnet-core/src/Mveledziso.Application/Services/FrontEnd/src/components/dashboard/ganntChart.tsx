"use client";

import { Card, Typography, Spin, Empty, Timeline, Tag, Progress, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { useProjectActions } from "@/provider/ProjectManagement";
import { useTeamActions } from "@/provider/TeamManagement";
import { useAuthState } from "@/provider/CurrentUserProvider";
import { DutyStatus } from "@/provider/ProjectManagement/context";
import { 
  ProjectOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface ProjectTimeline {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  teamId: string;
  teamName?: string;
  duties: DutyTimeline[];
}

interface DutyTimeline {
  id: string;
  title: string;
  status: DutyStatus;
  deadline?: string;
  progress: number;
}

const getStatusColor = (status: DutyStatus) => {
  switch (status) {
    case DutyStatus.Done:
      return 'success';
    case DutyStatus.Review:
      return 'processing';
    case DutyStatus.InProgress:
      return 'warning';
    case DutyStatus.ToDo:
    default:
      return 'default';
  }
};

const getStatusText = (status: DutyStatus) => {
  switch (status) {
    case DutyStatus.Done:
      return 'Done';
    case DutyStatus.Review:
      return 'Review';
    case DutyStatus.InProgress:
      return 'In Progress';
    case DutyStatus.ToDo:
    default:
      return 'To Do';
  }
};

const calculateProgressFromStatus = (status: DutyStatus): number => {
  switch (status) {
    case DutyStatus.Done:
      return 100;
    case DutyStatus.Review:
      return 80;
    case DutyStatus.InProgress:
      return 50;
    case DutyStatus.ToDo:
    default:
      return 0;
  }
};

const GanttChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projectTimelines, setProjectTimelines] = useState<ProjectTimeline[]>([]);
  const { currentUser } = useAuthState();
  const { getUserTeams } = useTeamActions();
  const { getProjectsByTeam, getDutiesByProject } = useProjectActions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!currentUser?.id) return;

        // Get user's teams
        const userTeamsResult = await getUserTeams({
          teamMemberId: currentUser.id.toString(),
          skipCount: 0,
          maxResultCount: 100
        });

        const timelines: ProjectTimeline[] = [];
        
        // Process each team's projects
        for (const userTeam of userTeamsResult.items) {
          const projects = await getProjectsByTeam(userTeam.teamId);
          
          // Process projects
          for (const project of projects) {
            // Get project duties
            const duties = await getDutiesByProject(project.id);
            
            // Map duties to timeline format
            const dutyTimelines: DutyTimeline[] = duties.map(duty => ({
              id: duty.id,
              title: duty.title,
              status: duty.status,
              deadline: duty.deadline,
              progress: calculateProgressFromStatus(duty.status)
            }));
            
            // Add project to timelines
            timelines.push({
              id: project.id,
              name: project.name,
              startDate: project.startDate,
              endDate: project.endDate,
              progress: project.progress || 0,
              teamId: userTeam.teamId,
              duties: dutyTimelines
            });
          }
        }

        setProjectTimelines(timelines);
        setLoading(false);
      } catch (error) {
        console.error('Error loading timeline data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, getUserTeams, getProjectsByTeam, getDutiesByProject]);

  return (
    <Card style={{ marginTop: 24, minHeight: 400 }}>
      <Title level={4}>Project Timeline</Title>
      
      {loading ? (
        <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      ) : projectTimelines.length > 0 ? (
        <Collapse defaultActiveKey={[projectTimelines[0]?.id]}>
          {projectTimelines.map(project => (
            <Panel 
              key={project.id} 
              header={
                <div className="flex items-center justify-between" style={{ width: '100%' }}>
                  <div className="flex items-center">
                    <ProjectOutlined className="mr-2" />
                    <Text strong>{project.name}</Text>
                  </div>
                  <div className="flex items-center">
                    <Tag icon={<ClockCircleOutlined />}>
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </Tag>
                    <Progress 
                      percent={Math.round(project.progress * 100)} 
                      size="small" 
                      style={{ width: 120, marginLeft: 16 }}
                    />
                  </div>
                </div>
              }
            >
              <Timeline
                mode="left"
                items={project.duties.map(duty => ({
                  children: (
                    <div>
                      <div className="flex items-center justify-between">
                        <Text strong>{duty.title}</Text>
                        <Tag color={getStatusColor(duty.status)}>
                          {getStatusText(duty.status)}
                        </Tag>
                      </div>
                      {duty.deadline && (
                        <div className="mt-1">
                          <Text type="secondary">
                            <ClockCircleOutlined className="mr-1" />
                            Deadline: {formatDate(duty.deadline)}
                          </Text>
                        </div>
                      )}
                      <Progress percent={duty.progress} size="small" />
                    </div>
                  ),
                  color: getStatusColor(duty.status) === 'default' ? 'gray' : getStatusColor(duty.status),
                  dot: duty.status === DutyStatus.Done ? <CheckCircleOutlined /> : undefined
                }))}
              />
            </Panel>
          ))}
        </Collapse>
      ) : (
        <Empty
          description="No projects or tasks found"
          style={{ marginTop: 40 }}
        />
      )}
    </Card>
  );
};

export default GanttChart;