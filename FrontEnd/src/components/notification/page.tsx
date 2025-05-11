"use client";
import React, { useEffect, useState } from "react";
import { List, Badge, Typography, Space, Button, Spin } from "antd";
import { useNotificationState, useNotificationActions, INotification } from "../../provider/NotificationManagement";
import { formatDistanceToNow } from "date-fns";

const { Text, Title } = Typography;

const NotificationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { notifications, totalCount, isPending } = useNotificationState();
  const { getNotifications, markAsRead, markAllAsRead } = useNotificationActions();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      await getNotifications({
        skipCount: (page - 1) * pageSize,
        maxResultCount: pageSize,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const renderNotificationItem = (notification: INotification) => {
    const timeAgo = formatDistanceToNow(new Date(notification.creationTime), { addSuffix: true });

    return (
      <List.Item
        key={notification.id}
        actions={[
          !notification.isRead && (
            <Button type="link" onClick={() => handleMarkAsRead(notification.id)}>
              Mark as read
            </Button>
          ),
        ]}
      >
        <List.Item.Meta
          title={
            <Space>
              {!notification.isRead && <Badge status="processing" />}
              <Text>{notification.message}</Text>
            </Space>
          }
          description={
            <Space direction="vertical" size={0}>
              <Text type="secondary">From: {notification.senderUserName}</Text>
              <Text type="secondary">{timeAgo}</Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={4}>Notifications</Title>
          <Button onClick={handleMarkAllAsRead}>Mark all as read</Button>
        </div>

        <Spin spinning={loading || isPending}>
          <List
            dataSource={notifications}
            renderItem={renderNotificationItem}
            pagination={{
              current: page,
              pageSize,
              total: totalCount,
              onChange: setPage,
            }}
          />
        </Spin>
      </Space>
    </div>
  );
};

export default NotificationPage;