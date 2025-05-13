"use client";

import StatCards from "@/components/dashboard/statCards";
import { Typography } from "antd";

const { Title } = Typography;

const MveledzisoPage = () => {
  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3}>Welcome!! Phanda nga Tshumelo</Title>
      <StatCards />
    </div>
  );
};

export default MveledzisoPage;