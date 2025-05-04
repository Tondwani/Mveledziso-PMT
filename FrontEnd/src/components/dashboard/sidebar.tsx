"use client";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import React from "react";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const pathname = usePathname();

  const menuItems: MenuProps["items"] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Mveledziso</Link>,
    },
    {
      key: "/projects",
      icon: <FolderOpenOutlined />,
      label: <Link href="/projects">Projects</Link>,
    },
    {
      key: "/duties",
      icon: <FileTextOutlined />,
      label: <Link href="/duties">Duties</Link>,
    },
    {
      key: "/milestones",
      icon: <FlagOutlined />,
      label: <Link href="/milestones">Milestones</Link>,
    },
    {
      key: "/timelines",
      icon: <CalendarOutlined />,
      label: <Link href="/timelines">Timelines</Link>,
    },
     {
      key: "/documents",
      icon: <FileTextOutlined />,
      label: <Link href="/documents">Documents</Link>,
    },
    {
      key: "/teams",
      icon: <TeamOutlined />,
      label: <Link href="/teams">Teams / Users</Link>,
    },
    {
      key: "/activity-log",
      icon: <HistoryOutlined />,
      label: <Link href="/activity-log">Activity Log</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth={80}
      width={220}
      theme="dark"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }}>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;