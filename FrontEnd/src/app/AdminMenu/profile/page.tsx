"use client";
import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  Avatar,
  Row,
  Col,
  Divider,
  Spin, 
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
const { Title } = Typography;

interface ProfileValues {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  title?: string;
}

interface SimpleProfileFormProps {
  initialValues?: ProfileValues; 
  onSubmit: (values: ProfileValues) => void; 
  isLoading?: boolean; 
}

const Profile = ({
  initialValues,
  onSubmit,
  isLoading = false, 
}: SimpleProfileFormProps) => {
  const [form] = Form.useForm();

  return (
    <div style={{ padding: "0 24px 24px 24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>Profile Settings</Title>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card style={{ borderRadius: 8 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                size={100}
                style={{ backgroundColor: "#1890ff", fontSize: 36 }}
                icon={!initialValues?.name ? <UserOutlined /> : undefined}
              >
                {initialValues?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ marginTop: 12, fontSize: 18, fontWeight: 500 }}>
                {initialValues?.name} {initialValues?.surname}
              </div>
            </div>
            <Spin spinning={isLoading} tip="Loading profile...">
              <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={initialValues} 
              >
                <Form.Item label="First Name" name="name" rules={[{ required: true, message: "Please enter your first name!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Surname" name="surname" rules={[{ required: true, message: "Please enter your surname!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Email Address" name="email" rules={[{ required: true, message: "Please enter your email!", type: 'email' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Phone Number" name="phone">
                  <Input />
                </Form.Item>
                <Form.Item label="Password" name="Password" rules={[{ required: true, message: "Please enter your Password"}]}>
                  <Input.Password />
                </Form.Item>
                <Divider />
                <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile as React.FC;
