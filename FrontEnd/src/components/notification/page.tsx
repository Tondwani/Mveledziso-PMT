"use client";

import React, { useEffect } from 'react';
import { Badge, Typography, Button, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useNotificationState, useNotificationActions } from "../../provider/NotificationManagement";

const { Text } = Typography;

interface NotificationComponentProps {
  isMobile: boolean;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ isMobile }) => {
  const router = useRouter();
  const { notifications, unreadCount } = useNotificationState();
  const { getNotifications, markAsRead } = useNotificationActions();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        const result = await getNotifications({
          maxResultCount: 10,
          skipCount: 0
        });
        console.log("Fetched notifications:", result);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [getNotifications]);

  // Add logging for render
  console.log("Current notifications:", notifications);
  console.log("Unread count:", unreadCount);

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleViewAllNotifications = async () => {
    await router.push('/notifications');
  };

  return (
    <Dropdown 
      menu={{ 
        items: [],
        style: { 
          minWidth: '350px',
          maxWidth: '400px'
        }
      }}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      trigger={['click']}
      dropdownRender={() => (
        <div style={{ 
          backgroundColor: '#f8fafc', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          minWidth: '350px'
        }}>
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#1890ff',
            color: 'white'
          }}>
            <Text strong style={{ color: 'white', fontSize: '16px' }}>Notifications</Text>
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications && notifications.length > 0 ? (
              <div style={{ padding: '8px 0' }}>
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    style={{ 
                      padding: '12px 20px',
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: notification.isRead ? '#f8fafc' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = notification.isRead ? '#f8fafc' : '#fff';
                    }}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <Text style={{ 
                      fontSize: '14px',
                      flex: 1,
                      marginRight: '8px'
                    }}>
                      {notification.message}
                    </Text>
                    <Text type="secondary" style={{ 
                      fontSize: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatDate(notification.creationTime)}
                    </Text>
                  </div>
                ))}
                <div style={{ 
                  padding: '12px 20px', 
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#fff'
                }}>
                  <Button 
                    type="primary" 
                    block 
                    onClick={handleViewAllNotifications}
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    View all notifications
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '32px 20px', 
                textAlign: 'center',
                backgroundColor: '#fff' 
              }}>
                <Text type="secondary">No new notifications</Text>
              </div>
            )}
          </div>
        </div>
      )}
    >
      <Badge count={unreadCount} offset={[-2, 2]}>
        <BellOutlined style={{ 
          fontSize: isMobile ? "18px" : "20px", 
          color: "#000", 
          cursor: "pointer",
          padding: '4px'
        }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationComponent;