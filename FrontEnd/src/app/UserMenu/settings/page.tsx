"use client";
import React from 'react';
import {
  Tabs, Form, Input, Button, Switch, Divider, Space, Card, Select, Alert, Row, Col
} from 'antd';
import {
  LockOutlined, BellOutlined, SlackOutlined, GoogleOutlined,
  ApiOutlined, MailOutlined, GlobalOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const NotificationSettings = () => (
  <Form layout="vertical" style={{ width: '100%' }}>
    <h3>Email Notifications</h3>
    <Form.Item>
      <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
      <span style={{ marginLeft: 8 }}>Task assignments</span>
    </Form.Item>
    <Form.Item>
      <Switch checkedChildren="On" unCheckedChildren="Off" />
      <span style={{ marginLeft: 8 }}>Due date reminders</span>
    </Form.Item>
    <Divider />
    <h3>Desktop Notifications</h3>
    <Form.Item>
      <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
      <span style={{ marginLeft: 8 }}>Enable browser notifications</span>
    </Form.Item>
  </Form>
);

const SecuritySettings = () => (
  <div style={{ width: '100%' }}>
    <Form layout="vertical">
      <h3>Reset Password</h3>
      <Form.Item label="Email" name="email">
        <Input prefix={<MailOutlined />} placeholder="your@email.com" />
      </Form.Item>
      <Button type="primary" icon={<MailOutlined />}>
        Send Reset Link
      </Button>
    </Form>

    <Divider />

    <Form layout="vertical">
      <h3>Change Password</h3>
      <Form.Item label="Current Password" name="currentPassword">
        <Input.Password placeholder="Current password" />
      </Form.Item>
      <Form.Item label="New Password" name="newPassword">
        <Input.Password placeholder="New password" />
      </Form.Item>
      <Form.Item label="Confirm Password" name="confirmPassword">
        <Input.Password placeholder="Confirm new password" />
      </Form.Item>
      <Button type="primary">Update Password</Button>
    </Form>

    <Divider />

    <div>
      <h3>Account Activation</h3>
      <Alert
        message="Your account is verified"
        type="success"
        icon={<CheckCircleOutlined />}
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Button icon={<MailOutlined />}>
        Resend Activation Email
      </Button>
    </div>

    <Divider />

    <h3>Two-Factor Authentication</h3>
    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
    <p style={{ color: 'rgba(0,0,0,0.45)', marginTop: 8 }}>
      Add an extra layer of security to your account
    </p>
  </div>
);

const LanguageSettings = () => (
  <Form layout="vertical" style={{ width: '100%' }}>
    <h3>Application Language</h3>
    <Form.Item name="language">
      <Select defaultValue="en" style={{ width: '100%' }}>
        <Select.Option value="en">English</Select.Option>
        <Select.Option value="es">Español</Select.Option>
        <Select.Option value="fr">Français</Select.Option>
        <Select.Option value="de">Deutsch</Select.Option>
        <Select.Option value="zh">中文</Select.Option>
      </Select>
    </Form.Item>
    <Button type="primary">Save Language</Button>

    <Divider />

    <h3>Date & Time Format</h3>
    <Form.Item name="dateFormat">
      <Select defaultValue="en-US" style={{ width: '100%' }}>
        <Select.Option value="en-US">English (MM/DD/YYYY)</Select.Option>
        <Select.Option value="en-GB">English (DD/MM/YYYY)</Select.Option>
        <Select.Option value="fr-FR">French (DD/MM/YYYY)</Select.Option>
        <Select.Option value="de-DE">German (DD.MM.YYYY)</Select.Option>
      </Select>
    </Form.Item>
  </Form>
);

const IntegrationSettings = () => (
  <div style={{ width: '100%' }}>
    <h3>Connected Apps</h3>
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button icon={<SlackOutlined />} block style={{ textAlign: 'left' }}>
        Connect Slack
      </Button>
      <Button icon={<GoogleOutlined />} block style={{ textAlign: 'left' }}>
        Connect Google Calendar
      </Button>
    </Space>

    <Divider />

    <h3>API Access</h3>
    <Input.Search
      placeholder="Generate new API key"
      enterButton="Generate"
      disabled
      style={{ marginBottom: 16 }}
    />
    <p style={{ color: 'rgba(0,0,0,0.45)' }}>
      Use this key to authenticate with our API
    </p>
  </div>
);

const SettingsPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div style={{ padding: 16 }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card title="Account Settings" bordered={false}>
            <Tabs
              tabPosition={isMobile ? 'top' : 'left'}
              items={[
                {
                  key: 'notifications',
                  label: (
                    <span>
                      <BellOutlined style={{ marginRight: 8 }} />
                      Notifications
                    </span>
                  ),
                  children: <NotificationSettings />,
                },
                {
                  key: 'security',
                  label: (
                    <span>
                      <LockOutlined style={{ marginRight: 8 }} />
                      Security
                    </span>
                  ),
                  children: <SecuritySettings />,
                },
                {
                  key: 'language',
                  label: (
                    <span>
                      <GlobalOutlined style={{ marginRight: 8 }} />
                      Language
                    </span>
                  ),
                  children: <LanguageSettings />,
                },
                {
                  key: 'integrations',
                  label: (
                    <span>
                      <ApiOutlined style={{ marginRight: 8 }} />
                      Integrations
                    </span>
                  ),
                  children: <IntegrationSettings />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
