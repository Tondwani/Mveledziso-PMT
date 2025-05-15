"use client";

import { Card, Typography, Spin, Select, Tooltip, Empty } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { Chart } from "react-google-charts";
import { useProjectState, useProjectActions } from "@/provider/ProjectManagement";
import { DutyStatus } from "@/enums/DutyStatus";

const { Title } = Typography;
const { Option } = Select;

type GanttColumnSpec = { type: string; label: string };

type GanttDataRow = [
  string,         
  string,         
  string,         
  Date,           
  Date,           
  null | number,  
  number,        
  null | string   
];
type GanttChartData = [GanttColumnSpec[], ...GanttDataRow[]];

const statusConfig = {
  [DutyStatus.ToDo]: { text: 'To Do', color: '#FF6B6B' },
  [DutyStatus.InProgress]: { text: 'In Progress', color: '#4ECDC4' },
  [DutyStatus.Review]: { text: 'Review', color: '#FFD166' },
  [DutyStatus.Done]: { text: 'Done', color: '#06D6A0' },
} as const;

type StatusKey = keyof typeof statusConfig;

export default function GanttChartComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const { projectDuties } = useProjectState();
  const { getProjectDuties } = useProjectActions();

  const tasks = useMemo(() => {
    return projectDuties
      .filter(duty => !selectedProject || duty.projectId === selectedProject)
      .map(duty => {
        const status = duty.status || DutyStatus.ToDo;
        const statusInfo = statusConfig[status as StatusKey] || { text: 'To Do', color: '#D9D9D9' };

        const progress = status === DutyStatus.Done ? 100 : 
                       status === DutyStatus.InProgress ? 50 : 
                       status === DutyStatus.Review ? 75 : 0;

        const currentDate = new Date();
        const startDate = duty.deadline ? new Date(duty.deadline) : currentDate;
        const endDate = isNaN(startDate.getTime()) 
          ? new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000) 
          : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        return {
          id: duty.id,
          name: duty.title,
          start: startDate,
          end: endDate,
          status: statusInfo.text,
          statusValue: status,
          projectName: duty.projectName,
          progress,
          color: statusInfo.color
        };
      });
  }, [projectDuties, selectedProject]);

  const statusGroups = useMemo(() => {
    const groups: Record<string, { count: number; color: string }> = {};
    tasks.forEach(task => {
      if (!groups[task.status]) {
        groups[task.status] = { count: 0, color: task.color };
      }
      groups[task.status].count++;
    });
    return Object.entries(groups).map(([status, { count, color }]) => ({
      status,
      count,
      color
    }));
  }, [tasks]);

  useEffect(() => {
    const fetchDuties = async () => {
      setIsLoading(true);
      try {
        await getProjectDuties({});
      } catch (error) {
        console.error('Error fetching project duties:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDuties();
  }, []);

  const chartData = useMemo(() => {
    const data: GanttChartData = [
      [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' }
      ],
    ];

    tasks.forEach(task => {
      const start = task.start instanceof Date && !isNaN(task.start.getTime()) 
        ? task.start 
        : new Date();
      const end = task.end instanceof Date && !isNaN(task.end.getTime()) 
        ? task.end 
        : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

      data.push([
        task.id,
        task.name,
        task.status,
        start,
        end,
        null,
        task.progress,
        null,
      ]);
    });

    return data;
  }, [tasks]);

  const chartOptions = {
    height: 400,
    gantt: {
      palette: tasks.map(task => ({
        color: task.color,
        dark: task.color,
        light: task.color
      })),
      trackHeight: 30,
      barHeight: 20
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        description={
          <span>No tasks found. Create a task to see it here.</span>
        }
      />
    );
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Project Timeline</Title>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Select
              placeholder="Select Project"
              style={{ width: 200 }}
              allowClear
              onChange={setSelectedProject}
              value={selectedProject || undefined}
            >
              {Array.from(
                new Map(
                  projectDuties.map(duty => [
                    duty.projectId, 
                    { id: duty.projectId, name: duty.projectName || 'Unnamed Project' }
                  ])
                ).values()
              ).map((project) => (
                <Option key={project.id} value={project.id}>
                  {project.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      }
      extra={
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {statusGroups.map((group, index) => (
            <Tooltip key={`${group.status}-${index}`} title={`${group.status} (${group.count})`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: group.color,
                  borderRadius: 2 
                }} />
                <span>{group.status} ({group.count})</span>
              </div>
            </Tooltip>
          ))}
        </div>
      }
    >
      <Chart
        chartType="Gantt"
        width="100%"
        height="400px"
        data={chartData}
        options={chartOptions}
        loader={<Spin />}
      />
    </Card>
  );
}