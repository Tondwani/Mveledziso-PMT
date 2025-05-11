"use client";
import { Layout, Dropdown, Avatar, Badge, Space, Typography } from "antd";
import { BellOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useNotificationState, useNotificationActions } from "../../provider/NotificationManagement";

const { Header } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { notifications, unreadCount } = useNotificationState();
  const { getNotifications, markAsRead } = useNotificationActions();
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    getNotifications({
      maxResultCount: 5,
      skipCount: 0,
      isRead: false
    });
  }, [getNotifications]);

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
    await getNotifications({
      maxResultCount: 5,
      skipCount: 0,
      isRead: false
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const notificationItems = notifications.map(notification => ({
    key: notification.id,
    label: (
      <Space direction="vertical" size={0} style={{ width: '100%' }}>
        <Text strong>{notification.message}</Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {formatDate(notification.creationTime)}
        </Text>
      </Space>
    ),
    onClick: async () => await handleNotificationClick(notification.id)
  }));

  const handleViewAllNotifications = async () => {
    await router.push('/notifications');
  };

  if (notificationItems.length > 0) {
    notificationItems.push({
      key: 'viewAll',
      label: <Text strong style={{ color: '#1890ff' }}>View all notifications</Text>,
      onClick: handleViewAllNotifications
    });
  }

  const handleMenuClick = (e: MenuInfo) => {
    if (e.key === "profile") { 
      router.push('UserMenu/profile'); 
    }
    if (e.key === "settings") {
      router.push('UserMenu/settings'); 
    }
    if (e.key === "logout") {
      router.push('/login'); 
    }
  };

  const userMenu = {
    items: [
      { key: "profile", label: "Profile" }, 
      { key: "settings", label: "Settings" }, 
      { key: "logout", label: "Logout" }, 
    ],
    onClick: handleMenuClick
  };

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
        <Dropdown 
          menu={{ items: notificationItems }} 
          placement="bottomRight" 
          arrow
          trigger={['click']}
        >
          <Badge count={unreadCount}>
            <BellOutlined style={{ fontSize: isMobile ? "18px" : "20px", color: "#000", cursor: "pointer" }} />
          </Badge>
        </Dropdown>
        <Dropdown menu={userMenu} placement="bottomRight">
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