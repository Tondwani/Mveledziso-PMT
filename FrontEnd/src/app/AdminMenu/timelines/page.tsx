"use client";

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, DatePicker, Select, Space, Typography, message, Tooltip, Popconfirm, Tag } from 'antd';
import type { Dayjs } from 'dayjs';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import { useTimelineState, useTimelineActions } from '../../../provider/TimelineManagement';
import { ITimeline, ITimelinePhase, TimelinePhaseStatus, ICreateTimelinePhaseDto } from '../../../provider/TimelineManagement/context';
import dayjs from 'dayjs';
import { useProjectState } from '../../../provider/ProjectManagement';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface TimelineFormValues {
  name: string;
  projectId: string;
}

interface PhaseFormValues {
  name: string;
  timelineId: string;
  dateRange: [Dayjs, Dayjs];
  status: TimelinePhaseStatus;
}

interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
  message?: string;
}

export default function TimelinesPage() {
  // State Management
  const { timelines, isPending, isError, errorMessage } = useTimelineState();
  const { 
    createTimeline, 
    updateTimeline, 
    deleteTimeline, 
    getTimelines,
    createTimelinePhase,
    updateTimelinePhase,
    // deleteTimelinePhase,
    getTimelinePhases 
  } = useTimelineActions();
  const { projects } = useProjectState();

  // Local State
  const [timelineModalVisible, setTimelineModalVisible] = useState(false);
  const [phaseModalVisible, setPhaseModalVisible] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<ITimeline | null>(null);
  const [editingPhase, setEditingPhase] = useState<ITimelinePhase | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<ITimeline | ITimelinePhase | null>(null);
  const [loading, setLoading] = useState(true);
  const [localTimelinePhases, setLocalTimelinePhases] = useState<ITimelinePhase[]>([]);
  
  const [timelineForm] = Form.useForm();
  const [phaseForm] = Form.useForm();

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Starting to load timelines and phases...');
        
        // Load all timelines with pagination
        const timelineResponse = await getTimelines({
          maxResultCount: 10,
          skipCount: 0,
          isDeleted: false
        });
        console.log('Timelines response:', timelineResponse);
        
        if (timelineResponse?.items?.length > 0) {
          console.log(`Found ${timelineResponse.items.length} timelines`);
          
          // Load phases for each timeline
          const allPhases: ITimelinePhase[] = [];
          
          for (const timeline of timelineResponse.items) {
            try {
              console.log(`Loading phases for timeline: ${timeline.name} (${timeline.id})`);
              const phases = await getTimelinePhases({ 
                timelineId: timeline.id,
                maxResultCount: 100,
                skipCount: 0
              });
              if (phases) {
                allPhases.push(...phases);
              }
              console.log(`Loaded ${phases?.length || 0} phases for timeline ${timeline.name}:`, phases);
            } catch (phaseError) {
              console.error(`Failed to load phases for timeline ${timeline.name}:`, phaseError);
              message.error(`Failed to load phases for timeline ${timeline.name}`);
            }
          }

          setLocalTimelinePhases(allPhases);
          console.log('All phases loaded:', allPhases);
        } else {
          console.log('No timelines found in the response');
          setLocalTimelinePhases([]);
        }
      } catch (error: unknown) {
        console.error('Error loading data:', error);
        let errorMessage = 'Failed to load timelines and phases';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as ApiError;
          errorMessage = apiError.response?.data?.error?.message || apiError.message || errorMessage;
        }
        
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getTimelines, getTimelinePhases]);

  // Error Handling
  useEffect(() => {
    if (isError && errorMessage) {
      message.error(errorMessage);
    }
  }, [isError, errorMessage]);

  const handleCreateTimeline = async (values: TimelineFormValues) => {
    try {
      await createTimeline(values);
      message.success('Timeline created successfully');
      setTimelineModalVisible(false);
      timelineForm.resetFields();
      getTimelines({});
    } catch (error) {
      console.error('Failed to create timeline:', error);
      message.error('Failed to create timeline');
    }
  };

  const handleCreatePhase = async (values: PhaseFormValues) => {
    try {
      const phaseData: ICreateTimelinePhaseDto = {
        name: values.name,
        timelineId: values.timelineId,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        status: values.status
      };
      await createTimelinePhase(phaseData);
      message.success('Phase created successfully');
      setPhaseModalVisible(false);
      phaseForm.resetFields();
      getTimelinePhases({ timelineId: values.timelineId });
    } catch (error) {
      console.error('Failed to create phase:', error);
      message.error('Failed to create phase');
    }
  };

  const handleUpdateTimeline = async (values: TimelineFormValues) => {
    if (!editingTimeline) return;
    try {
      await updateTimeline({ id: editingTimeline.id, ...values });
      message.success('Timeline updated successfully');
      setTimelineModalVisible(false);
      timelineForm.resetFields();
      getTimelines({});
    } catch (error) {
      console.error('Failed to update timeline:', error);
      message.error('Failed to update timeline');
    }
  };

  const handleUpdatePhase = async (values: PhaseFormValues) => {
    if (!editingPhase) return;
    try {
      const phaseData = {
        id: editingPhase.id,
        name: values.name,
        timelineId: values.timelineId,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        status: values.status
      };
      await updateTimelinePhase(phaseData);
      message.success('Phase updated successfully');
      setPhaseModalVisible(false);
      phaseForm.resetFields();
      getTimelinePhases({ timelineId: values.timelineId });
    } catch (error) {
      console.error('Failed to update phase:', error);
      message.error('Failed to update phase');
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    try {
      await deleteTimeline(id);
      message.success('Timeline deleted successfully');
      getTimelines({});
    } catch (error) {
      console.error('Failed to delete timeline:', error);
      message.error('Failed to delete timeline');
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
      title: 'Phases',
      key: 'phases',
      render: (_: unknown, record: ITimeline) => {
        const timelinePhases = localTimelinePhases.filter(p => p.timelineId === record.id);
        const completed = timelinePhases.filter(p => p.status === 'Completed').length;
        const total = timelinePhases.length;
        
        return (
          <Space>
            <Tag color="default">{total} Total</Tag>
            <Tag color="success">{completed} Completed</Tag>
          </Space>
        );
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
      <Title level={2}>Timeline Management</Title>

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
              disabled={!timelines || timelines.length === 0}
            >
              Add Phase
            </Button>
          </Space>
        </div>

        <Table
          dataSource={timelines}
          columns={columns}
          rowKey="id"
          loading={loading || isPending}
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
          initialValues={editingTimeline || {}}
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
              {timelines?.map(timeline => (
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