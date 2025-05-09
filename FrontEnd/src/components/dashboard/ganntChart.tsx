"use client";

import { Card, Typography } from "antd";
import React from "react";

const { Title, Text } = Typography;

type GanttChartProps = object

const GanttChart: React.FC<GanttChartProps> = () => {

  return (
    <Card style={{ marginTop: 24, minHeight: 400 }}>
      <Title level={4}>Gantt Chart Visualization</Title>
      <Text>
        This is a placeholder for the Gantt chart.
      </Text>
      <div style={{ height: 300, border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        Gantt Chart Area
      </div>
    </Card>
  );
};

export default GanttChart;