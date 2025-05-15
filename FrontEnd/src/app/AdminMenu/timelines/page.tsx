"use client";

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, DatePicker, Select, Space, Typography, message, Tooltip, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CalendarOutlined, ScheduleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTimelineActions } from '../../../provider/TimelineManagement';
import { ITimeline, ITimelinePhase } from '../../../provider/TimelineManagement/context';
import dayjs from 'dayjs';
import { useProjectState } from '../../../provider/ProjectManagement';

import { getAxiosInstance } from '../../../utils/axiosInstance';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface TimelineFormValues {
  name: string;
  projectId: string;
}

interface PhaseFormValues {
  name: string;
  timelineId: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  status: string;
}

interface TimelineFormValues {
  name: string;
  projectId: string;
}

export default function TimelinesPage() {
  // State Management
  const { createTimeline, updateTimeline, deleteTimeline } = useTimelineActions();
  const { projects } = useProjectState();
  const [isPending, setIsPending] = useState(false); // Loading state for form submissions
  const [manualTimelines, setManualTimelines] = useState<ITimeline[]>([]);
  const timelines = manualTimelines; // Alias for compatibility
  
  // Local State
  const [timelineModalVisible, setTimelineModalVisible] = useState(false);
  const [phaseModalVisible, setPhaseModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<ITimeline | null>(null);
  const [editingPhase, setEditingPhase] = useState<ITimelinePhase | null>(null);
  const [viewingItem, setViewingItem] = useState<ITimeline | ITimelinePhase | null>(null);
  const [loading, setLoading] = useState(true);
  

  const [phaseForm] = Form.useForm<PhaseFormValues>();
  const [timelineForm] = Form.useForm<TimelineFormValues>();

  // Direct API call to fetch timelines
  const fetchTimelinesDirect = async () => {
    try {
      setLoading(true);
      
      // Try using fetch API directly first
      try {
        const token = sessionStorage.getItem("auth_token");
        
        const fetchResponse = await fetch('https://localhost:44311/api/services/app/Timeline/GetAll?maxResultCount=100&skipCount=0', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          credentials: 'include',
        });
        
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          if (data?.result?.items?.length > 0) {
            setManualTimelines(data.result.items);
            return;
          }
        }
      } catch (fetchError) {
        console.error('Fetch API error:', fetchError);
      }
      
      // Fallback to axios if fetch fails
      try {
        const apiClient = getAxiosInstance();
        const response = await apiClient.get('/api/services/app/Timeline/GetAll', {
          params: { maxResultCount: 100, skipCount: 0 },
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          httpsAgent: new (await import('https')).Agent({
            rejectUnauthorized: false
          })
        });
        
        if (response.data?.result?.items?.length > 0) {
          setManualTimelines(response.data.result.items);
        }
      } catch (error) {
        console.error('Error fetching timelines:', error);
        message.error('Failed to load timelines');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchTimelinesDirect();
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Manual refresh button handler
  const handleManualRefresh = async () => {
    try {
      setLoading(true);
      await fetchTimelinesDirect();
      message.success('Data refreshed successfully');
    } catch (error) {
      console.error('Refresh error:', error);
      message.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeline = async (values: TimelineFormValues) => {
    try {
      setIsPending(true);
      const response = await createTimeline(values);
      if (response) {
        message.success('Timeline created successfully');
        setTimelineModalVisible(false);
        timelineForm.resetFields();
        await fetchTimelinesDirect();
      } else {
        throw new Error('Failed to create timeline');
      }
    } catch (error) {
      console.error('Failed to create timeline:', error);
      message.error(error instanceof Error ? error.message : 'Failed to create timeline');
    } finally {
      setIsPending(false);
    }
  };

  const handleCreatePhase = async (values: PhaseFormValues) => {
    try {
      setIsPending(true);
      // Phase creation logic will be implemented here
      // This is a placeholder for future implementation
      console.log('Creating phase with values:', values);
      message.success('Phase created successfully');
      setPhaseModalVisible(false);
      phaseForm.resetFields();
    } catch (error) {
      console.error('Failed to create phase:', error);
      message.error('Failed to create phase');
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdateTimeline = async (values: TimelineFormValues) => {
    if (!editingTimeline) return;
    try {
      setIsPending(true);
      const response = await updateTimeline({ id: editingTimeline.id, ...values });
      if (response) {
        message.success('Timeline updated successfully');
        setTimelineModalVisible(false);
        setEditingTimeline(null);
        timelineForm.resetFields();
        await fetchTimelinesDirect();
      } else {
        throw new Error('Failed to update timeline');
      }
    } catch (error) {
      console.error('Failed to update timeline:', error);
      message.error(error instanceof Error ? error.message : 'Failed to update timeline');
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdatePhase = async (values: PhaseFormValues) => {
    if (!editingPhase) return;
    try {
      setIsPending(true);
      // Phase update logic will be implemented here
      // This is a placeholder for future implementation
      console.log('Updating phase with values:', values);
      message.success('Phase updated successfully');
      setPhaseModalVisible(false);
      phaseForm.resetFields();
    } catch (error) {
      console.error('Failed to update phase:', error);
      message.error('Failed to update phase');
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    try {
      setIsPending(true);
      await deleteTimeline(id);
      message.success('Timeline deleted successfully');
      await fetchTimelinesDirect();
    } catch (error) {
      console.error('Failed to delete timeline:', error);
      message.error(error instanceof Error ? error.message : 'Failed to delete timeline');
    } finally {
      setIsPending(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <ScheduleOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Project',
      dataIndex: 'projectId',
      key: 'projectId',
      render: (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        return <Tag color="blue">{project?.name || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModificationTime',
      key: 'lastModificationTime',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: ITimeline) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setViewingItem(record);
                setViewModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingTimeline(record);
                timelineForm.setFieldsValue({
                  name: record.name,
                  projectId: record.projectId
                });
                setTimelineModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Timeline"
            description="Are you sure you want to delete this timeline? All associated phases will be deleted."
            onConfirm={() => handleDeleteTimeline(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Timeline Management</Title>
        <Button 
          type="primary" 
          onClick={handleManualRefresh} 
          loading={loading}
          icon={<ReloadOutlined />}
        >
          Refresh
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space style={{ float: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingTimeline(null);
                setTimelineModalVisible(true);
              }}
            >
              Add Timeline
            </Button>
            <Button
              icon={<CalendarOutlined />}
              onClick={() => {
                setEditingPhase(null);
                setPhaseModalVisible(true);
              }}
              disabled={!manualTimelines || manualTimelines.length === 0}
            >
              Add Phase
            </Button>
          </Space>
        </div>

        <Table
          dataSource={manualTimelines}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`
          }}
        />
      </Card>

      {/* Timeline Modal */}
      <Modal
        title={editingTimeline ? "Edit Timeline" : "Create Timeline"}
        open={timelineModalVisible}
        onCancel={() => {
          setTimelineModalVisible(false);
          setEditingTimeline(null);
          timelineForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={timelineForm}
          layout="vertical"
          onFinish={editingTimeline ? handleUpdateTimeline : handleCreateTimeline}
          initialValues={editingTimeline || { projectId: projects[0]?.id }}
        >
          <Form.Item
            name="name"
            label="Timeline Name"
            rules={[{ required: true, message: 'Please enter timeline name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="projectId"
            label="Project"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select
              placeholder="Select a project"
              loading={isPending}
              disabled={isPending}
            >
              {projects?.map(project => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setTimelineModalVisible(false);
                setEditingTimeline(null);
                timelineForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isPending}>
                {editingTimeline ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Phase Modal */}
      <Modal
        title={editingPhase ? "Edit Phase" : "Create Phase"}
        open={phaseModalVisible}
        onCancel={() => {
          setPhaseModalVisible(false);
          setEditingPhase(null);
          phaseForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={phaseForm}
          layout="vertical"
          onFinish={editingPhase ? handleUpdatePhase : handleCreatePhase}
          initialValues={editingPhase ? {
            ...editingPhase,
            dateRange: [dayjs(editingPhase.startDate), dayjs(editingPhase.endDate)]
          } : {}}
        >
          <Form.Item
            name="name"
            label="Phase Name"
            rules={[{ required: true, message: 'Please enter phase name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="timelineId"
            label="Timeline"
            rules={[{ required: true, message: 'Please select a timeline' }]}
          >
            <Select
              placeholder="Select a timeline"
              loading={isPending}
              disabled={isPending}
            >
              {timelines?.map((timeline: ITimeline) => (
                <Select.Option key={timeline.id} value={timeline.id}>
                  {timeline.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="NotStarted">Not Started</Select.Option>
              <Select.Option value="InProgress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setPhaseModalVisible(false);
                setEditingPhase(null);
                phaseForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isPending}>
                {editingPhase ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setViewingItem(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setViewModalVisible(false);
            setViewingItem(null);
          }}>
            Close
          </Button>
        ]}
      >
        {viewingItem && (
          <div>
            <p><strong>Name:</strong> {viewingItem.name}</p>
            {'startDate' in viewingItem ? (
              <>
                <p><strong>Start Date:</strong> {new Date(viewingItem.startDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(viewingItem.endDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {viewingItem.status}</p>
              </>
            ) : (
              <p><strong>Created:</strong> {new Date(viewingItem.creationTime).toLocaleString()}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}