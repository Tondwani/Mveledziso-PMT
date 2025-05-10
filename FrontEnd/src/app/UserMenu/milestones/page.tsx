"use client";

import { Table, Tag, Space, Button, Card, Typography, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import type { Dayjs } from 'dayjs';
import { FlagOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useMilestoneState, useMilestoneActions } from '../../../provider/MilestoneManagement';
import { IMilestone, MilestoneStatus, ICreateMilestoneDto } from '../../../provider/MilestoneManagement/context';
import { useTimelineState, useTimelineActions } from '../../../provider/TimelineManagement';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

interface FormValues {
  title: string;
  description: string;
  timelineId: string;
  dueDate: Dayjs;
  status: MilestoneStatus;
}

interface Timeline {
  id: string;
  name: string;
}

export default function MilestonesPage() {
  // State Management
  const { milestones, isPending, isError, message: stateMessage } = useMilestoneState();
  const { createMilestone, updateMilestone, deleteMilestone, getMilestones } = useMilestoneActions();
  const { timelines } = useTimelineState();
  const { getTimelines } = useTimelineActions();

  // Local State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTimelineFilter, setCurrentTimelineFilter] = useState<string | undefined>();
  const [currentStatusFilter, setCurrentStatusFilter] = useState<MilestoneStatus | undefined>();
  const [editingMilestone, setEditingMilestone] = useState<IMilestone | null>(null);
  const [form] = Form.useForm();

  // Load Data
  useEffect(() => {
    getTimelines({});
    getMilestones({});
  }, []);

  // Error Handling
  useEffect(() => {
    if (isError && stateMessage) {
      message.error(stateMessage);
    }
  }, [isError, stateMessage]);

  const filteredMilestones = milestones?.filter(m => {
    const matchesTimeline = currentTimelineFilter ? m.timelineId === currentTimelineFilter : true;
    const matchesStatus = currentStatusFilter ? m.status === currentStatusFilter : true;
    return matchesTimeline && matchesStatus;
  }) || [];

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <FlagOutlined />
          <a>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Timeline',
      dataIndex: 'timeline',
      key: 'timeline',
      render: (timeline: Timeline) => <Tag color="blue">{timeline?.name || 'N/A'}</Tag>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: MilestoneStatus) => {
        const statusConfig = {
          [MilestoneStatus.NotStarted]: { color: 'default', icon: <ClockCircleOutlined /> },
          [MilestoneStatus.InProgress]: { color: 'processing', icon: <ClockCircleOutlined /> },
          [MilestoneStatus.Completed]: { color: 'success', icon: <CheckCircleOutlined /> },
          [MilestoneStatus.Delayed]: { color: 'error', icon: <ClockCircleOutlined /> },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: IMilestone) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>View</a>
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  const handleCreate = async (values: FormValues) => {
    try {
      const newMilestone: ICreateMilestoneDto = {
        title: values.title,
        description: values.description,
        timelineId: values.timelineId,
        dueDate: values.dueDate.toDate(),
        status: values.status
      };
      await createMilestone(newMilestone);
      message.success('Milestone created successfully');
      setIsModalVisible(false);
      form.resetFields();
      getMilestones({});
    } catch (err) {
      console.error('Failed to create milestone:', err);
      message.error('Failed to create milestone');
    }
  };

  const handleView = (milestone: IMilestone) => {
    // Implement view logic
    console.log('View milestone:', milestone);
  };

  const handleEdit = (milestone: IMilestone) => {
    setEditingMilestone(milestone);
    form.setFieldsValue({
      title: milestone.title,
      description: milestone.description,
      timelineId: milestone.timelineId,
      dueDate: dayjs(milestone.dueDate),
      status: milestone.status
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (editingMilestone) {
        await updateMilestone({
          id: editingMilestone.id,
          ...values,
          dueDate: values.dueDate.toDate()
        });
        message.success('Milestone updated successfully');
      } else {
        await handleCreate(values);
      }
      setIsModalVisible(false);
      setEditingMilestone(null);
      form.resetFields();
      getMilestones({});
    } catch (err) {
      console.error('Failed to save milestone:', err);
      message.error(`Failed to ${editingMilestone ? 'update' : 'create'} milestone`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMilestone(id);
      message.success('Milestone deleted successfully');
      getMilestones({});
    } catch (err) {
      console.error('Failed to delete milestone:', err);
      message.error('Failed to delete milestone');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Milestones</Title>
      
      <Card 
        title="Milestone Management"
        extra={
          <Space>
            <Select
              placeholder="Filter by timeline"
              style={{ width: 200 }}
              onChange={(value) => setCurrentTimelineFilter(value)}
              allowClear
            >
              {timelines?.map(timeline => (
                <Select.Option key={timeline.id} value={timeline.id}>
                  {timeline.name}
                </Select.Option>
              ))}
            </Select>
            
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              onChange={(value) => setCurrentStatusFilter(value)}
              allowClear
            >
              {Object.values(MilestoneStatus).map(status => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                setEditingMilestone(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              New Milestone
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredMilestones} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isPending}
        />
      </Card>

      <Modal
        title={editingMilestone ? "Edit Milestone" : "Create New Milestone"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingMilestone(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter milestone title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="timelineId"
            label="Timeline"
            rules={[{ required: true, message: 'Please select a timeline' }]}
          >
            <Select>
              {timelines?.map(timeline => (
                <Select.Option key={timeline.id} value={timeline.id}>
                  {timeline.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              {Object.values(MilestoneStatus).map(status => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingMilestone(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isPending}>
                {editingMilestone ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}