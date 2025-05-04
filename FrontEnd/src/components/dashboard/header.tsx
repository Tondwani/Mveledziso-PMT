"use client";

import { Layout, Dropdown, Menu, Avatar, Badge } from "antd";
import { BellOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React from "react";
import { useRouter } from 'next/navigation'; 
import type { MenuInfo } from 'rc-menu/lib/interface'; 

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const router = useRouter(); 

  const notificationItems = [
    { key: "1", label: "New comment on Milestone Alpha" },
    { key: "2", label: "Project X deadline updated" },
  ];



  const handleMenuClick = (e: MenuInfo) => {
    if (e.key === "profile") { 
      router.push('UserMenu/profile'); 
    }
   
    if (e.key === "settings") {
      router.push('UserMenu/settings'); 
        console.log("Settings clicked");
        
    }
     if (e.key === "logout") {
        router.push('/login'); 
        console.log("Logout clicked");
    }
  };

  const userMenu = (
    <Menu
      onClick={handleMenuClick} 
      items={[
        { key: "profile", label: "Profile" }, 
        { key: "settings", label: "Settings" }, 
        { key: "logout", label: "Logout" }, 
      ]}
    />
  );

  return (
    <Header
      style={{
        background: "#fff",
        padding: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 64,
        lineHeight: "64px",
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          cursor: "pointer",
          fontSize: "18px",
          width: 64,
          height: 64,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "color 0.3s",
          color: '#000',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#1890ff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#000')}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      <div style={{ flexGrow: 1, paddingLeft: 24, fontSize: 18, fontWeight: 'bold' }}>
      </div>

      <div style={{ display: "flex", alignItems: "center", paddingRight: 24, gap: 20 }}>
        <Dropdown overlay={<Menu items={notificationItems} />} placement="bottomRight" arrow>
          <Badge count={notificationItems.length}>
            <BellOutlined style={{ fontSize: 20, color: "#000", cursor: "pointer" }} />
          </Badge>
        </Dropdown>

        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;