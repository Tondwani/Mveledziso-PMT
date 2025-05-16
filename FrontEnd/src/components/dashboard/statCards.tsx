import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  FileDoneOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Area, Column, Pie, Line } from '@ant-design/plots';
import { useProjectActions } from "@/provider/ProjectManagement";
import { useTeamActions } from "@/provider/TeamManagement";
import { useTeamMemberActions } from "@/provider/TeamMemberManagement";
import { DutyStatus } from "@/provider/ProjectManagement/context";

const { Title } = Typography;

interface StatData {
  totalProjects: number;
  completedProjects: number;
  totalDuties: number;
  completedDuties: number;
  totalTeams: number;
  totalTeamMembers: number;
}

interface ProjectTrend {
  month: string;
  value: number;
  category: string;
}

interface DutyDistribution {
  type: string;
  value: number;
}

interface TeamPerformance {
  team: string;
  performance: number;
}

interface ProjectTimeline {
  month: string;
  [projectName: string]: number | string;
}

const StatCards = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatData>({
    totalProjects: 0,
    completedProjects: 0,
    totalDuties: 0,
    completedDuties: 0,
    totalTeams: 0,
    totalTeamMembers: 0,
  });

  const [projectTrendData, setProjectTrendData] = useState<ProjectTrend[]>([]);
  const [dutyDistributionData, setDutyDistributionData] = useState<DutyDistribution[]>([]);
  const [teamPerformanceData, setTeamPerformanceData] = useState<TeamPerformance[]>([]);
  const [projectTimelineData, setProjectTimelineData] = useState<ProjectTimeline[]>([]);

  // Get actions from providers
  const { getProjects, getProjectDuties } = useProjectActions();
  const { getTeams } = useTeamActions();
  const { getTeamMembers } = useTeamMemberActions();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projects = await getProjects({});
        const completedProjects = projects.filter(p => {
          const endDate = new Date(p.endDate);
          return endDate < new Date();
        });

        // Fetch duties
        const duties = await getProjectDuties({});
        const completedDuties = duties.filter(d => d.status === DutyStatus.Done);

        // Fetch teams and team members
        const teams = await getTeams({});
        const teamMembers = await getTeamMembers({});

        // Update stats
        setStats({
          totalProjects: projects.length,
          completedProjects: completedProjects.length,
          totalDuties: duties.length,
          completedDuties: completedDuties.length,
          totalTeams: teams.length,
          totalTeamMembers: teamMembers.items.length,
        });

        // Calculate duty distribution
        const dutyDistribution = [
          { type: 'To Do', value: duties.filter(d => d.status === DutyStatus.ToDo).length },
          { type: 'In Progress', value: duties.filter(d => d.status === DutyStatus.InProgress).length },
          { type: 'Under Review', value: duties.filter(d => d.status === DutyStatus.Review).length },
          { type: 'Completed', value: duties.filter(d => d.status === DutyStatus.Done).length },
        ];
        setDutyDistributionData(dutyDistribution);

        // Calculate project trends (last 6 months)
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toLocaleString('default', { month: 'short' });
        }).reverse();

        const trends: ProjectTrend[] = [];
        last6Months.forEach(month => {
          const activeCount = projects.filter(p => {
            const projectDate = new Date(p.startDate);
            return projectDate.toLocaleString('default', { month: 'short' }) === month;
          }).length;

          const completedCount = completedProjects.filter(p => {
            const projectDate = new Date(p.endDate);
            return projectDate.toLocaleString('default', { month: 'short' }) === month;
          }).length;

          trends.push(
            { month, value: activeCount, category: 'Active' },
            { month, value: completedCount, category: 'Completed' }
          );
        });
        setProjectTrendData(trends);

        // Calculate team performance
        const teamPerf = teams.map(team => ({
          team: team.name,
          performance: Math.round((team.projectCount || 0) / projects.length * 100)
        }));
        setTeamPerformanceData(teamPerf);

        // Calculate project timeline data
        const timelineData = last6Months.flatMap(month => {
          const monthProjects = projects.slice(0, 3).map(project => ({
            month,
            [project.name]: Math.round(Math.random() * 100) // This should be replaced with actual progress data
          }));
          return monthProjects;
        });
        setProjectTimelineData(timelineData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart Configurations
  const areaConfig = {
    data: projectTrendData,
    xField: 'month',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500,
      },
    },
  };

  const pieConfig = {
    data: dutyDistributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1500,
      },
    },
  };

  const columnConfig = {
    data: teamPerformanceData,
    xField: 'team',
    yField: 'performance',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500,
      },
    },
  };

  const lineConfig = {
    data: projectTimelineData,
    xField: 'month',
    yField: Object.keys(projectTimelineData[0] || {}).filter(key => key !== 'month'),
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500,
      },
    },
  };

  const cards = [
    {
      title: "Projects Overview",
      icon: <ProjectOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      content: (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Statistic
            title="Total Projects"
            value={stats.totalProjects}
            loading={loading}
          />
          {/* <Progress
            type="circle"
            percent={Math.round((stats.completedProjects / stats.totalProjects) * 100) || 0}
            width={80}
            strokeColor="#1890ff"
          /> */}
        </div>
      ),
      color: "#e6f7ff",
    },
    {
      title: "Duties Status",
      icon: <FileDoneOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      content: (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Statistic
            title="Total Duties"
            value={stats.totalDuties}
            loading={loading}
          />
          {/* <Progress
            type="circle"
            percent={Math.round((stats.completedDuties / stats.totalDuties) * 100) || 0}
            width={80}
            strokeColor="#52c41a"
          /> */}
        </div>
      ),
      color: "#f6ffed",
    },
    {
      title: "Team Overview",
      icon: <TeamOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      content: (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Statistic
            title="Total Teams"
            value={stats.totalTeams}
            loading={loading}
          />
          {/* <Statistic
            title="Team Members"
            value={stats.totalTeamMembers}
            loading={loading}
          /> */}
        </div>
      ),
      color: "#f9f0ff",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: "24px", color: "#1890ff" }}>
        Dashboard Overview
      </Title>
      
      <Row gutter={[24, 24]}>
        {cards.map((card, index) => (
          <Col xs={24} sm={24} md={8} key={index}>
            <Card
              style={{
                background: card.color,
                borderRadius: "15px",
                height: "100%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              bordered={false}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                {card.icon}
                <span style={{ marginLeft: "12px", fontSize: "18px", fontWeight: 500 }}>
                  {card.title}
                </span>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <LoadingOutlined style={{ fontSize: 24 }} />
                </div>
              ) : (
                card.content
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <Card
            title="Project Trends"
            style={{
              borderRadius: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            bordered={false}
          >
            <Area {...areaConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Duty Distribution"
            style={{
              borderRadius: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            bordered={false}
          >
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} md={12}>
          <Card
            title="Team Performance"
            style={{
              borderRadius: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            bordered={false}
          >
            <Column {...columnConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="Project Progress Timeline"
            style={{
              borderRadius: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            bordered={false}
          >
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatCards;