"use client";

import { Table, Tag, Space, Button, Card, Typography, Modal, Form, Select, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ProjectOutlined, EditOutlined } from '@ant-design/icons';
import { useContext, useState, useEffect } from 'react';
import { ProjectActionContext, IProjectDuty, DutyStatus, Priority } from '@/provider/ProjectManagement/context';
import { useAuthState } from '@/provider/CurrentUserProvider';

const { Title } = Typography;

// Helper function to validate GUID format
const isValidGuid = (value: unknown): boolean => {
  if (!value) return false;
  const guid = String(value).trim();
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return guidRegex.test(guid);
};

export default function TeamMemberDutiesPage() {
  const projectActions = useContext(ProjectActionContext);
  const { currentUser } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [myDuties, setMyDuties] = useState<IProjectDuty[]>([]);
  const [editingDuty, setEditingDuty] = useState<IProjectDuty | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadDuties = async () => {
      try {
        if (currentUser?.id) {
          // Validate the currentUser.id is a valid GUID
          if (!isValidGuid(currentUser.id)) {
            console.error('Invalid user ID format:', currentUser.id);
            message.error('Invalid user ID format');
            return;
          }

          const duties = await projectActions.getProjectDuties({
            filter: `assignedUserId eq ${currentUser.id}`
          });
          setMyDuties(duties);
        }
      } catch (error) {
        console.error('Failed to load duties:', error);
        message.error('Failed to load duties');
      } finally {
        setLoading(false);
      }
    };

    loadDuties();
  }, [currentUser?.id, projectActions]);

  const handleEditDuty = async (values: { status: DutyStatus }) => {
    try {
      if (!editingDuty) return;
      
      // Validate the duty ID is a valid GUID
      if (!isValidGuid(editingDuty.id)) {
        console.error('Invalid duty ID format:', editingDuty.id);
        message.error('Invalid duty ID format');
        return;
      }

      await projectActions.updateDutyStatus(editingDuty.id, values.status);
      
      // Refresh duties
      const updatedDuties = myDuties.map(duty => 
        duty.id === editingDuty.id 
          ? { ...duty, status: values.status }
          : duty
      );
      setMyDuties(updatedDuties);
      setEditingDuty(null);
      message.success('Duty status updated successfully');
    } catch (error) {
      console.error('Failed to update duty:', error);
      message.error('Failed to update duty status');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text: string) => (
        <Space>
          <ProjectOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DutyStatus) => {
        const statusConfig = {
          [DutyStatus.Done]: { color: 'success', icon: <CheckCircleOutlined /> },
          [DutyStatus.InProgress]: { color: 'processing', icon: <ClockCircleOutlined /> },
          [DutyStatus.Review]: { color: 'warning', icon: <ClockCircleOutlined /> },
          [DutyStatus.ToDo]: { color: 'default', icon: <ClockCircleOutlined /> },
        };
        return (
          <Tag color={statusConfig[status].color} icon={statusConfig[status].icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: Priority) => {
        const priorityConfig = {
          [Priority.Urgent]: { color: 'red' },
          [Priority.High]: { color: 'orange' },
          [Priority.Medium]: { color: 'blue' },
          [Priority.low]: { color: 'green' },
        };
        return <Tag color={priorityConfig[priority].color}>{Priority[priority]}</Tag>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'No deadline',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: IProjectDuty) => (
        <Button 
          type="link" 
          icon={<EditOutlined />}
          onClick={() => {
            if (!isValidGuid(record.id)) {
              console.error('Invalid duty ID format:', record.id);
              message.error('Invalid duty ID format');
              return;
            }
            setEditingDuty(record);
            form.setFieldsValue({ status: record.status });
          }}
        >
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Title level={2}>My Duties</Title>
        <Table 
          loading={loading}
          columns={columns} 
          dataSource={myDuties} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Update Duty Status"
        open={!!editingDuty}
        onCancel={() => setEditingDuty(null)}
        footer={null}
      >
        <Form 
          form={form}
          layout="vertical" 
          onFinish={handleEditDuty}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Select.Option value={DutyStatus.ToDo}>To Do</Select.Option>
              <Select.Option value={DutyStatus.InProgress}>In Progress</Select.Option>
              <Select.Option value={DutyStatus.Review}>Review</Select.Option>
              <Select.Option value={DutyStatus.Done}>Done</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setEditingDuty(null)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
