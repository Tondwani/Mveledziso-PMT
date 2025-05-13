"use client";

import { Card, Typography, Timeline as AntTimeline, Tag, Empty } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { ProjectActionContext, IProject, ITimelinePhase } from '@/provider/ProjectManagement/context';
import { useAuthState } from '@/provider/CurrentUserProvider';

const { Title, Text } = Typography;

interface TimelinePhase extends ITimelinePhase {
  status: 'Completed' | 'InProgress' | 'NotStarted';
}

interface TimelineMilestone {
  id: string;
  name: string;
  date: string;
  status: 'Completed' | 'Pending';
}

interface ProjectTimeline {
  id: string;
  projectId: string;
  projectName: string;
  phases: TimelinePhase[];
  milestones: TimelineMilestone[];
}

type TimelineItem = {
  children: React.ReactNode;
  color?: string;
  dot?: React.ReactNode;
  startDate?: string;
  date?: string;
};

export default function TeamMemberTimelinePage() {
  const projectActions = useContext(ProjectActionContext);
  const { currentUser } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [timelines, setTimelines] = useState<ProjectTimeline[]>([]);

  const determinePhaseStatus = (phase: ITimelinePhase): TimelinePhase['status'] => {
    const now = new Date();
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);

    if (now < startDate) return 'NotStarted';
    if (now > endDate) return 'Completed';
    return 'InProgress';
  };

  useEffect(() => {
    const loadTimelines = async () => {
      try {
        if (currentUser?.id) {
          // Get projects the team member is involved in
          const projects = await projectActions.getProjects({
            filter: `assignedUserId eq ${currentUser.id}`
          });
          
          // Get project details with timelines
          const projectDetails = await Promise.all(
            projects.map(p => projectActions.getProjectWithDetails(p.id))
          );
          
          // Extract timelines and map phases with status
          const projectTimelines = projectDetails
            .filter((p): p is IProject & { timeline: NonNullable<IProject['timeline']> } => 
              p.timeline !== undefined && p.timeline !== null
            )
            .map(p => ({
              id: p.timeline.id,
              projectId: p.id,
              projectName: p.name,
              phases: p.timeline.phases.map(phase => ({
                ...phase,
                status: determinePhaseStatus(phase)
              })),
              milestones: p.timeline.milestones.map(m => ({
                ...m,
                status: m.isCompleted ? 'Completed' as const : 'Pending' as const
              }))
            }));
          
          setTimelines(projectTimelines);
        }
      } catch (error) {
        console.error('Failed to load timelines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimelines();
  }, [currentUser?.id, projectActions]);

  const renderTimeline = (phases: TimelinePhase[], milestones: TimelineMilestone[]) => {
    const items: TimelineItem[] = [
      ...phases.map(phase => ({
        children: (
          <div>
            <Text strong>{phase.name}</Text>
            <div>{new Date(phase.startDate).toLocaleDateString()} to {new Date(phase.endDate).toLocaleDateString()}</div>
            <Tag 
              color={phase.status === 'Completed' ? 'success' : 'processing'} 
              icon={phase.status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
              {phase.status}
            </Tag>
          </div>
        ),
        color: phase.status === 'Completed' ? 'green' : 'blue',
        startDate: phase.startDate
      })),
      ...milestones.map(milestone => ({
        children: (
          <div>
            <Text strong>Milestone: {milestone.name}</Text>
            <div>Target: {new Date(milestone.date).toLocaleDateString()}</div>
            <Tag 
              color={milestone.status === 'Completed' ? 'success' : 'processing'}
              icon={milestone.status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
              {milestone.status}
            </Tag>
          </div>
        ),
        dot: milestone.status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
        date: milestone.date
      }))
    ];

    // Sort by start date
    items.sort((a, b) => {
      const dateA = a.startDate || a.date || '';
      const dateB = b.startDate || b.date || '';
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return <AntTimeline mode="left" items={items} />;
  };

  return (
    <div className="p-6">
      <Title level={2}>Project Timelines</Title>
      {loading ? (
        <div className="text-center py-8">Loading timelines...</div>
      ) : timelines.length > 0 ? (
        timelines.map(timeline => (
          <Card 
            key={timeline.id} 
            title={timeline.projectName}
            className="mb-4"
          >
            {renderTimeline(timeline.phases, timeline.milestones)}
          </Card>
        ))
      ) : (
        <Empty description="No timelines available" />
      )}
    </div>
  );
}