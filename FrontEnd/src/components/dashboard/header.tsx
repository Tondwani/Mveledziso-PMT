"use client";
import { Layout, Dropdown, Menu, Avatar, Badge } from "antd";
import { BellOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import type { MenuInfo } from 'rc-menu/lib/interface'; 
const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Handle responsive layout
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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
        height: isMobile ? "56px" : "64px",
        lineHeight: isMobile ? "56px" : "64px",
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
        position: "sticky",
        top: 0,
        zIndex: 99,
        width: "100%",
        overflow: "hidden"
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          cursor: "pointer",
          fontSize: isMobile ? "16px" : "18px",
          width: isMobile ? "48px" : "64px",
          height: isMobile ? "56px" : "64px",
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

      <div 
        style={{ 
          flexGrow: 1, 
          paddingLeft: isMobile ? "12px" : "24px", 
          fontSize: isMobile ? "16px" : "18px", 
          fontWeight: 'bold',
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap" 
        }}
      >
      </div>

      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          paddingRight: isMobile ? "12px" : "24px", 
          gap: isMobile ? "12px" : "20px" 
        }}
      >
        <Dropdown overlay={<Menu items={notificationItems} />} placement="bottomRight" arrow>
          <Badge count={notificationItems.length}>
            <BellOutlined style={{ fontSize: isMobile ? "18px" : "20px", color: "#000", cursor: "pointer" }} />
          </Badge>
        </Dropdown>
        <Dropdown overlay={userMenu} placement="bottomRight">
        <Avatar 
            icon={<UserOutlined />}
            size={isMobile ? "small" : "default"}
            style={{ cursor: "pointer" }} 
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;