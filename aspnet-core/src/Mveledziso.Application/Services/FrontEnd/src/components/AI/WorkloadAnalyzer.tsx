import { useEffect, useState } from 'react';
import { Card, Progress, Alert, Space, Avatar, List, Typography, Tooltip, Tag } from 'antd';
import { UserOutlined, WarningOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTeamMemberState } from '@/provider/TeamMemberManagement';
import { PriorityLevel } from '@/enums/PriorityLevel';

const { Text } = Typography;

interface WorkloadAnalysis {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  workloadScore: number;
  overloaded: boolean;
  recommendation: string;
  activeTaskCount: number;
  urgentTaskCount: number;
  upcomingDeadlines: number;
  status: 'success' | 'normal' | 'exception' | 'active';
}

interface TeamMemberInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProjectDuty {
  id: string;
  priority: PriorityLevel;
  deadline?: string;
  userDuties?: Array<{
    teamMemberId: string;
  }>;
}

const WorkloadAnalyzer = () => {
  const { teamMembers } = useTeamMemberState();
  
  // Mock project duties since we can't import the actual provider
  const projectDuties: ProjectDuty[] = [
    {
      id: '1',
      priority: PriorityLevel.Urgent,
      deadline: '2025-05-25',
      userDuties: [
        { teamMemberId: '1' },
        { teamMemberId: '2' }
      ]
    },
    {
      id: '2',
      priority: PriorityLevel.High,
      deadline: '2025-06-15',
      userDuties: [
        { teamMemberId: '2' }
      ]
    },
    {
      id: '3',
      priority: PriorityLevel.Medium,
      deadline: '2025-07-10',
      userDuties: [
        { teamMemberId: '3' }
      ]
    }
  ];
  
  const [workloadData, setWorkloadData] = useState<WorkloadAnalysis[]>([]);

  const analyzeWorkload = (teamMember: TeamMemberInfo): WorkloadAnalysis => {
    // Get tasks assigned to this team member
    const assignedTasks = projectDuties.filter((duty: ProjectDuty) => 
      duty.userDuties?.some((ud) => ud.teamMemberId === teamMember.id)
    );

    // Count active tasks
    const activeTaskCount = assignedTasks.length;

    // Count urgent tasks
    const urgentTaskCount = assignedTasks.filter((t: ProjectDuty) => 
      t.priority === PriorityLevel.Urgent
    ).length;

    // Count tasks with upcoming deadlines (next 7 days)
    const upcomingDeadlines = assignedTasks.filter((t: ProjectDuty) => {
      if (!t.deadline) return false;
      const daysToDeadline = (new Date(t.deadline).getTime() - new Date().getTime()) 
        / (1000 * 60 * 60 * 24);
      return daysToDeadline <= 7 && daysToDeadline > 0;
    }).length;

    // Calculate workload score (0-100)
    const workloadScore = Math.min(100, (
      (activeTaskCount * 10) + 
      (urgentTaskCount * 15) + 
      (upcomingDeadlines * 12)
    ));

    // Determine if overloaded
    const overloaded = workloadScore > 80;

    // Generate recommendation
    const getRecommendation = (score: number): string => {
      if (score > 80) return "Critical: Immediate workload redistribution recommended";
      if (score > 60) return "Warning: Consider redistributing some tasks";
      if (score > 40) return "Moderate: Workload is manageable but monitor";
      return "Good: Can take on more tasks";
    };

    // Determine status for Progress component
    const getStatus = (score: number): 'success' | 'normal' | 'exception' | 'active' => {
      if (score > 80) return 'exception';
      if (score > 60) return 'normal';
      if (score > 40) return 'active';
      return 'success';
    };

    return {
      id: teamMember.id,
      firstName: teamMember.firstName,
      lastName: teamMember.lastName,
      email: teamMember.email,
      workloadScore,
      overloaded,
      recommendation: getRecommendation(workloadScore),
      activeTaskCount,
      urgentTaskCount,
      upcomingDeadlines,
      status: getStatus(workloadScore)
    };
  };

  useEffect(() => {
    if (teamMembers && projectDuties) {
      const analyzed = teamMembers
        .map((tm: TeamMemberInfo) => analyzeWorkload(tm))
        .sort((a: WorkloadAnalysis, b: WorkloadAnalysis) => b.workloadScore - a.workloadScore);
      setWorkloadData(analyzed);
    }
  }, [teamMembers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card title={
      <Space>
        <LoadingOutlined spin style={{ color: '#1890ff' }} />
        <Text strong>AI Workload Analysis</Text>
      </Space>
    }>
      <List
        dataSource={workloadData}
        renderItem={(member) => (
          <List.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>{`${member.firstName} ${member.lastName}`}</Text>
                </Space>
                <Space>
                  {member.overloaded && (
                    <Tooltip title="Overloaded">
                      <WarningOutlined style={{ color: '#ff4d4f' }} />
                    </Tooltip>
                  )}
                  {!member.overloaded && member.workloadScore < 40 && (
                    <Tooltip title="Available for more tasks">
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    </Tooltip>
                  )}
                </Space>
              </Space>
              
              <Progress
                percent={member.workloadScore}
                status={member.status}
                size="small"
              />
              
              <Space size="small">
                <Tag color="blue">Active: {member.activeTaskCount}</Tag>
                <Tag color="red">Urgent: {member.urgentTaskCount}</Tag>
                <Tag color="orange">Due Soon: {member.upcomingDeadlines}</Tag>
              </Space>
              
              <Alert
                message={member.recommendation}
                type={member.overloaded ? "warning" : "info"}
                showIcon
                style={{ width: '100%' }}
              />
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default WorkloadAnalyzer; 