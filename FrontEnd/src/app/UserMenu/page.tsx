"use client";

import StatCards from "@/components/dashboard/ganntChart";
import { Typography } from "antd";
import { useAuthState } from "@/provider/CurrentUserProvider";

const { Title } = Typography;

const MveledzisoPage = () => {
  const { currentUser } = useAuthState();
  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3}>Welcome!! {currentUser?.name}</Title>
      <StatCards />
    </div>
  );
};

export default MveledzisoPage;