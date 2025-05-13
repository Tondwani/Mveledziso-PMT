"use client";

import { Layout as AntLayout } from "antd";
import Sidebar from "@/components/dashboard/sidebar";
import AppHeader from "@/components/dashboard/header";
import { useState } from "react";

const { Content } = AntLayout;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <AntLayout
        className="site-layout"
        style={{ marginLeft: collapsed ? 80 : 220, transition: "all 0.2s ease" }}
      >
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 0,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 48px - 64px)",
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}