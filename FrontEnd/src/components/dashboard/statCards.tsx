"use client";

import { useEffect, useState } from "react";
import { Card, Col, Row, Progress, Statistic, Typography } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  FileDoneOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Area, Column, Pie, Line } from '@ant-design/plots';

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

  // Sample data for charts
  const projectTrendData: ProjectTrend[] = [
    { month: 'Jan', value: 3, category: 'Active' },
    { month: 'Feb', value: 4, category: 'Active' },
    { month: 'Mar', value: 6, category: 'Active' },
    { month: 'Apr', value: 8, category: 'Active' },
    { month: 'May', value: 12, category: 'Active' },
    { month: 'Jan', value: 2, category: 'Completed' },
    { month: 'Feb', value: 3, category: 'Completed' },
    { month: 'Mar', value: 4, category: 'Completed' },
    { month: 'Apr', value: 5, category: 'Completed' },
    { month: 'May', value: 7, category: 'Completed' },
  ];

  const dutyDistributionData: DutyDistribution[] = [
    { type: 'To Do', value: 20 },
    { type: 'In Progress', value: 15 },
    { type: 'Under Review', value: 8 },
    { type: 'Completed', value: 28 },
  ];

  const teamPerformanceData = [
    { team: 'Team A', performance: 85 },
    { team: 'Team B', performance: 78 },
    { team: 'Team C', performance: 92 },
    { team: 'Team D', performance: 76 },
    { team: 'Team E', performance: 89 },
  ];

  const projectTimelineData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    'Project A': Math.floor(Math.random() * 100),
    'Project B': Math.floor(Math.random() * 100),
    'Project C': Math.floor(Math.random() * 100),
  }));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        const data = {
          totalProjects: 12,
          completedProjects: 5,
          totalDuties: 48,
          completedDuties: 28,
          totalTeams: 6,
          totalTeamMembers: 24,
        };
        setStats(data);
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
    yField: ['Project A', 'Project B', 'Project C'],
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
          <Progress
            type="circle"
            percent={Math.round((stats.completedProjects / stats.totalProjects) * 100)}
            width={80}
            strokeColor="#1890ff"
          />
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
          <Progress
            type="circle"
            percent={Math.round((stats.completedDuties / stats.totalDuties) * 100)}
            width={80}
            strokeColor="#52c41a"
          />
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
          <Statistic
            title="Team Members"
            value={stats.totalTeamMembers}
            loading={loading}
          />
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