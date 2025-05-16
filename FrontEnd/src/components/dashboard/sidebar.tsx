"use client";

import { Layout, Menu } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  FlagOutlined,
  QuestionCircleOutlined,
  FolderOpenOutlined,
  // SisternodeOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import React from "react";
import { useAuthState } from "@/provider/CurrentUserProvider";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const pathname = usePathname();
  const { currentUser } = useAuthState();
  
  // Determine the base path based on user role
  const getBasePath = () => {
    const roles = currentUser?.roles || [];
    if (roles.includes("Admin") || roles.includes("ProjectManager")) {
      return "/AdminMenu";
    } else if (roles.includes("TeamMember") || roles.includes("User")) {
      return "/UserMenu";
    }
    return "/UserMenu";
  };

  const basePath = getBasePath();

  // Get user roles
  const userRoles = currentUser?.roles || [];
  const isProjectManager = userRoles.includes("ProjectManager") || userRoles.includes("Admin");
  // const isTeamMember = userRoles.includes("TeamMember") || userRoles.includes("User");

  const menuItems: MenuProps["items"] = [
    ...(isProjectManager ? [{
      key: `${basePath}/projects`,
      icon: <FolderOpenOutlined />,
      label: <Link href={`${basePath}/projects`}>Projects</Link>,
    }] : []),
    {
      key: `${basePath}/Duties`,
      icon: <FileTextOutlined />,
      label: <Link href={`${basePath}/Duties`}>Duties</Link>,
    },
    ...(isProjectManager && basePath === "/AdminMenu" ? [{
      key: `${basePath}/timelines`,
      icon: <CalendarOutlined />,
      label: <Link href={`${basePath}/timelines`}>Timelines</Link>,
    }] : []),
    ...(isProjectManager && basePath === "/AdminMenu" ? [{
      key: `${basePath}/milestones`,
      icon: <FlagOutlined />,
      label: <Link href={`${basePath}/milestones`}>Milestones</Link>,
    }] : []),
    {
      key: `${basePath}/teams`,
      icon: <TeamOutlined />,
      label: <Link href={`${basePath}/teams`}>Teams / Users</Link>,
    },
    ...(isProjectManager && basePath === "/AdminMenu" ? [{
      key: `${basePath}/mveledziso`,
      icon: <FlagOutlined />,
      label: <Link href={`${basePath}/mveledziso`}>Risk Analyzer</Link>,
    }] : []),
    // ...(isTeamMember && basePath === "/UserMenu" ? [{
    //   key: `${basePath}/task-analyzer`,
    //   icon: <SisternodeOutlined />,
    //   label: <Link href={`${basePath}/task-analyzer`}>Task Analyzer</Link>,
    // }] : []),
    {
      key: `${basePath}/help`,
      icon: <QuestionCircleOutlined />,
      label: <Link href={`${basePath}/help`}>Help</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth={80}
      width={220}
      theme="light"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: "#f8fafc",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)"
      }}
      onCollapse={(collapsed) => onCollapse?.(collapsed)}
      trigger={null}
    >
      <div 
        className="logo" 
        style={{ 
          height: 32, 
          margin: 16, 
          background: "#f8fafc",
          borderRadius: 6,
          display: collapsed ? 'none' : 'block'
        }}
      />
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        inlineCollapsed={collapsed}
        style={{
          backgroundColor: "#f8fafc",
          borderRight: "none"
        }}
        className="custom-sidebar-menu"
      />
      <style jsx global>{`
        .custom-sidebar-menu .ant-menu-item-selected {
          background-color: #dbeafe !important;
        }
        .custom-sidebar-menu .ant-menu-item:hover {
          background-color: #eff6ff !important;
        }
        .custom-sidebar-menu .ant-menu-item {
          color: #475569 !important;
        }
        .custom-sidebar-menu .ant-menu-item-selected {
          color: #2563eb !important;
        }
        .custom-sidebar-menu .anticon {
          color: #64748b !important;
        }
        .custom-sidebar-menu .ant-menu-item::after {
          border-right: 3px solid #2563eb !important;
        }
      `}</style>
    </Sider>
  );
};

export default Sidebar;