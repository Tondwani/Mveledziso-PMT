"use client";

import { Table, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useUserDutyState, useUserDutyActions } from '@/provider/DutyManagement';
import { useAuthState } from '@/provider/CurrentUserProvider';
import { 
  IUserDuty, 
  ICreateUserDutyDto, 
  DutyStatus,
  DutyPriority 
} from '@/provider/DutyManagement/context';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Column } = Table;

export default function DutiesPage() {
  const { currentUser } = useAuthState();
  const { userDuties, isPending } = useUserDutyState();
  const { getUserDuties, createUserDuty, updateUserDuty, deleteUserDuty } = useUserDutyActions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentUser) {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const nextTwoMonths = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
      console.log("CurrentUserId", currentUser.id)
      getUserDuties({
        teamMemberId: String(currentUser.id),
        fromDate: lastMonth,
        toDate: nextTwoMonths
      }).catch(err => {
        console.error('Failed to fetch duties:', err);
        message.error('Failed to fetch duties');
      });
    }
  }, []);

  const statusMap: Record<DutyStatus, { color: string; icon?: React.ReactNode }> = {
    Completed: { color: 'green', icon: <CheckCircleOutlined /> },
    InProgress: { color: 'blue', icon: <ClockCircleOutlined /> },
    NotStarted: { color: 'orange' },
  };

  const handleCreateDuty = async (values: {
    title: string;
    status: DutyStatus;
    priority: DutyPriority;
    dueDate: Dayjs;
    projectDutyId?: string;
  }) => {
    if (!currentUser?.id) {
      message.error('User not found');
      return;
    }

    try {
      const newDuty: ICreateUserDutyDto = {
        title: values.title,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate.toISOString(),
        teamMemberId: String(currentUser.id),
        projectDutyId: values.projectDutyId || ''
      };
      
      await createUserDuty(newDuty);
      message.success('Duty created successfully');
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error('Failed to create duty:', err);
      message.error('Failed to create duty');
    }
  };

  const handleUpdateStatus = async (duty: IUserDuty, newStatus: DutyStatus) => {
    try {
      await updateUserDuty({
        ...duty,
        status: newStatus
      });
      message.success('Status updated successfully');
    } catch (err) {
      console.error('Failed to update status:', err);
      message.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUserDuty(id);
      message.success('Duty deleted successfully');
    } catch (err) {
      console.error('Failed to delete duty:', err);
      message.error('Failed to delete duty');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Duties</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Duty
        </Button>
      </div>

      <Table 
        dataSource={userDuties} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        loading={isPending}
      >
        <Column title="Title" dataIndex="title" key="title" />
        <Column 
          title="Status" 
          dataIndex="status" 
          key="status"
          render={(status: DutyStatus, record: IUserDuty) => (
            <Select
              value={status}
              style={{ width: 120 }}
              onChange={(newStatus) => handleUpdateStatus(record, newStatus as DutyStatus)}
            >
              {Object.keys(statusMap).map(status => (
                <Select.Option key={status} value={status}>
                  <Tag color={statusMap[status as DutyStatus].color} icon={statusMap[status as DutyStatus].icon}>
                    {status}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          )}
        />
        <Column 
          title="Priority" 
          dataIndex="priority" 
          key="priority"
          render={(priority: DutyPriority) => {
            const color = priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green';
            return <Tag color={color}>{priority}</Tag>;
          }}
        />
        <Column 
          title="Due Date" 
          dataIndex="dueDate" 
          key="dueDate"
          render={(date: string) => dayjs(date).format('YYYY-MM-DD')}
        />
        <Column 
          title="Created" 
          dataIndex="creationTime" 
          key="creationTime"
          render={(date: string) => dayjs(date).format('YYYY-MM-DD')}
        />
        <Column 
          title="Action" 
          key="action"
          render={(_: unknown, record: IUserDuty) => (
            <Space size="middle">
              <Button type="link" onClick={() => {/* TODO: Implement view logic */}}>View</Button>
              <Button type="link" onClick={() => {/* TODO: Implement edit logic */}}>Edit</Button>
              <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title="Create New Duty"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateDuty}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              {Object.keys(statusMap).map(status => (
                <Select.Option key={status} value={status}>{status}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select the priority!' }]}
          >
            <Select>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Low">Low</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select the due date!' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
