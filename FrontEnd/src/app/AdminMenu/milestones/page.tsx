"use client";

import { Table, Tag, Space, Button, Card, Typography, Modal, Form, Input, DatePicker, Select, message, Tooltip, Popconfirm, Switch } from 'antd';
import type { Dayjs } from 'dayjs';
import { 
  FlagOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useMilestoneState, useMilestoneActions } from '../../../provider/MilestoneManagement';
import { IMilestone, ICreateMilestoneDto } from '../../../provider/MilestoneManagement/context';
import { useTimelineState, useTimelineActions } from '../../../provider/TimelineManagement';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

interface FormValues {
  title: string;
  description: string;
  timelineId: string;
  dueDate: Dayjs;
  isCompleted: boolean;
}

export default function MilestonesPage() {
  // State Management
  const milestoneState = useMilestoneState();
  const milestoneActions = useMilestoneActions();
  const timelineState = useTimelineState();
  const timelineActions = useTimelineActions();

  const { milestones, isPending, isError, message: stateMessage } = milestoneState;
  const { createMilestone, updateMilestone, deleteMilestone, getMilestones } = milestoneActions;
  const { timelines } = timelineState;
  const { getTimelines } = timelineActions;

  // Verify providers are initialized
  useEffect(() => {
    console.log('Provider state:', {
      milestoneState: !!milestoneState,
      milestoneActions: !!milestoneActions,
      timelineState: !!timelineState,
      timelineActions: !!timelineActions
    });
  }, [milestoneState, milestoneActions, timelineState, timelineActions]);

  // Local State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTimelineFilter, ] = useState<string | undefined>();
  const [currentCompletionFilter, setCurrentCompletionFilter] = useState<boolean | undefined>();
  const [editingMilestone, setEditingMilestone] = useState<IMilestone | null>(null);
  const [form] = Form.useForm();

  // View Modal State
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingMilestone, setViewingMilestone] = useState<IMilestone | null>(null);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Starting to load data...');
        
        if (!getTimelines || !getMilestones) {
          console.error('Required actions not available');
          message.error('Application not properly initialized');
          return;
        }

        // Load timelines
        console.log('Loading timelines...');
        await getTimelines({});
        console.log('Timelines loaded:', timelineState.timelines);
        
        // Load milestones with pagination
        console.log('Loading milestones...');
        const result = await getMilestones({
          maxResultCount: 10,
          skipCount: 0
        });
        
        console.log('Loaded milestones:', result);
      } catch (error) {
        console.error('Error loading data:', error);
        if (error instanceof Error) {
          message.error(`Failed to load data: ${error.message}`);
        } else {
          message.error('Failed to load data. Please try refreshing the page.');
        }
      }
    };

    loadData();
  }, []);

  // Error Handling
  useEffect(() => {
    if (isError && stateMessage) {
      console.error('Error state detected:', { isError, message: stateMessage });
      message.error(stateMessage);
    }
  }, [isError, stateMessage]);

  // Data change monitoring
  useEffect(() => {
    console.log('State changed:', {
      isPending,
      isError,
      milestonesCount: milestones?.length,
      milestones,
      timelinesCount: timelines?.length,
      timelines
    });
  }, [milestones, isPending, isError, timelines]);

  const filteredMilestones = React.useMemo(() => {
    console.log('Filtering milestones:', {
      all: milestones,
      timelineFilter: currentTimelineFilter,
      completionFilter: currentCompletionFilter
    });

    if (!milestones) return [];

    return milestones.filter(m => {
      const matchesTimeline = currentTimelineFilter ? m.timelineId === currentTimelineFilter : true;
      const matchesCompletion = currentCompletionFilter !== undefined ? m.isCompleted === currentCompletionFilter : true;
      return matchesTimeline && matchesCompletion;
    });
  }, [milestones, currentTimelineFilter, currentCompletionFilter]);

  useEffect(() => {
    console.log('Filtered milestones updated:', {
      count: filteredMilestones.length,
      milestones: filteredMilestones
    });
  }, [filteredMilestones]);

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
      dataIndex: 'timelineName',
      key: 'timelineName',
      render: (name: string) => <Tag color="blue">{name || 'N/A'}</Tag>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'isCompleted',
      key: 'isCompleted',
      render: (isCompleted: boolean) => (
        <Tag color={isCompleted ? 'success' : 'processing'} icon={isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {isCompleted ? 'Completed' : 'In Progress'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: IMilestone) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Milestone"
              description="Are you sure you want to delete this milestone?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleCreate = async (values: FormValues) => {
    try {
      console.log('Creating milestone with values:', values);
      const newMilestone: ICreateMilestoneDto = {
        title: values.title,
        description: values.description,
        timelineId: values.timelineId,
        dueDate: values.dueDate.toDate(),
        isCompleted: values.isCompleted
      };
      await createMilestone(newMilestone);
      message.success('Milestone created successfully');
      setIsModalVisible(false);
      form.resetFields();
      
      // Reload milestones
      await getMilestones({
        maxResultCount: 10,
        skipCount: 0
      });
    } catch (err) {
      console.error('Failed to create milestone:', err);
      message.error('Failed to create milestone');
    }
  };

  const handleView = (milestone: IMilestone) => {
    console.log('Viewing milestone:', milestone);
    setViewingMilestone(milestone);
    setIsViewModalVisible(true);
  };

  const handleEdit = (milestone: IMilestone) => {
    console.log('Editing milestone:', milestone);
    setEditingMilestone(milestone);
    form.setFieldsValue({
      title: milestone.title,
      description: milestone.description,
      timelineId: milestone.timelineId,
      dueDate: dayjs(milestone.dueDate),
      isCompleted: milestone.isCompleted
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (editingMilestone) {
        console.log('Updating milestone:', { id: editingMilestone.id, ...values });
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
      
      // Reload milestones
      await getMilestones({
        maxResultCount: 10,
        skipCount: 0
      });
    } catch (err) {
      console.error('Failed to save milestone:', err);
      message.error(`Failed to ${editingMilestone ? 'update' : 'create'} milestone`);
    }
  };

  const handleDelete = async (milestone: IMilestone) => {
    try {
      console.log('Deleting milestone:', milestone.id);
      await deleteMilestone(milestone.id);
      message.success('Milestone deleted successfully');
      
      // Reload milestones
      await getMilestones({
        maxResultCount: 10,
        skipCount: 0
      });
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
            {/* <Select
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
            </Select> */}
            
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              onChange={(value) => setCurrentCompletionFilter(value)}
              allowClear
            >
              <Select.Option value={true}>Completed</Select.Option>
              <Select.Option value={false}>In Progress</Select.Option>
            </Select>
            
            <Tooltip title="Add New Milestone">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => {
                  setEditingMilestone(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              />
            </Tooltip>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredMilestones} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            total: milestones?.length || 0,
            showTotal: (total) => `Total ${total} milestones`
          }}
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
          initialValues={{ isCompleted: false }}
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
            name="isCompleted"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Completed" unCheckedChildren="In Progress" />
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

      <Modal
        title="Milestone Details"
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setViewingMilestone(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalVisible(false);
            setViewingMilestone(null);
          }}>
            Close
          </Button>
        ]}
      >
        {viewingMilestone && (
          <div>
            <p><strong>Title:</strong> {viewingMilestone.title}</p>
            <p><strong>Description:</strong> {viewingMilestone.description}</p>
            <p><strong>Timeline:</strong> {viewingMilestone.timelineName}</p>
            <p><strong>Due Date:</strong> {new Date(viewingMilestone.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {viewingMilestone.isCompleted ? 'Completed' : 'In Progress'}</p>
            <p><strong>Created:</strong> {new Date(viewingMilestone.creationTime).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}