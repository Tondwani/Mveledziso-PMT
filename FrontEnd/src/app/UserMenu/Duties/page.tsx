"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Table, 
  Card, 
  Space, 
  Tag, 
  message, 
  Typography, 
  Tooltip,
  Spin,
  Button,
  Modal,
  Form,
  Select,
  Row,
  Col
} from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table';
import { 
  CheckOutlined, 
  ClockCircleOutlined, 
  HighlightOutlined, 
  ExclamationCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useProjectState, useProjectActions } from '../../../provider/ProjectManagement';
import { useUserDutyState, useUserDutyActions } from '../../../provider/DutyManagement';

import { IProjectDuty } from '../../../provider/ProjectManagement/context';
import { IUserDuty } from '../../../provider/DutyManagement/context';
import { DutyStatus } from '../../../enums/DutyStatus';
import { PriorityLevel } from '../../../enums/PriorityLevel';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;


const formatDutyStatus = (status: DutyStatus): { text: string; color: string } => {
  switch (status) {
    case DutyStatus.ToDo:
      return { text: 'To Do', color: 'default' };
    case DutyStatus.InProgress:
      return { text: 'In Progress', color: 'processing' };
    case DutyStatus.Review:
      return { text: 'Review', color: 'warning' };
    case DutyStatus.Done:
      return { text: 'Done', color: 'success' };
    default:
      return { text: 'Unknown', color: 'default' };
  }
};

const formatPriorityLevel = (priority: PriorityLevel): { text: string; color: string } => {
  switch (priority) {
    case PriorityLevel.Low:
      return { text: 'Low', color: 'green' };
    case PriorityLevel.Medium:
      return { text: 'Medium', color: 'blue' };
    case PriorityLevel.High:
      return { text: 'High', color: 'orange' };
    case PriorityLevel.Urgent:
      return { text: 'Urgent', color: 'red' };
    default:
      return { text: 'Unknown', color: 'default' };
  }
};

interface IExtendedUserDuty extends IUserDuty {
  projectDuty?: IProjectDuty;
}

const DutiesContent = () => {
  const [extendedUserDuties, setExtendedUserDuties] = useState<IExtendedUserDuty[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DutyStatus | null>(null);
  const [dutyStatusModalVisible, setDutyStatusModalVisible] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<IProjectDuty | null>(null);
  const [statusForm] = Form.useForm();
  

  const { userDuties, isPending: userDutiesIsPending, totalCount: userDutiesTotalCount } = useUserDutyState();
  const { projectDuties } = useProjectState();
  
  const { getUserDuties } = useUserDutyActions();
  const { getProjectDuties, updateDutyStatus } = useProjectActions();

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await getProjectDuties({});

      await getUserDuties({
        skipCount: (pagination.current - 1) * pagination.pageSize,
        maxResultCount: pagination.pageSize
      });
      
      setPagination(prev => ({
        ...prev,
        total: userDutiesTotalCount
      }));
    } catch (error) {
      console.error('Failed to load duties:', error);
      message.error('Failed to load your assigned duties');
    } finally {
      setLoading(false);
    }
  }, [getProjectDuties, getUserDuties, pagination.current, pagination.pageSize, userDutiesTotalCount]);


  const createExtendedDuties = useCallback(() => {
    const extended = userDuties.map(userDuty => {
      const projectDuty = projectDuties.find(pd => pd.id === userDuty.projectDutyId);
      return {
        ...userDuty,
        projectDuty
      };
    });
    
    const filtered = statusFilter 
      ? extended.filter(duty => duty.projectDuty?.status === statusFilter)
      : extended;
      
    setExtendedUserDuties(filtered);
  }, [userDuties, projectDuties, statusFilter]);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (userDuties.length > 0 && projectDuties.length > 0) {
      createExtendedDuties();
    }
  }, [userDuties, projectDuties, createExtendedDuties]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10
    }));
  };
  const handleStatusFilterChange = (value: DutyStatus | null) => {
    setStatusFilter(value);
  };

  const showStatusUpdateModal = (duty: IProjectDuty) => {
    setSelectedDuty(duty);
    statusForm.setFieldsValue({
      status: duty.status
    });
    setDutyStatusModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const values = await statusForm.validateFields();
      if (selectedDuty) {
        await updateDutyStatus(selectedDuty.id, values.status);
        message.success('Duty status updated successfully');
        loadAllData(); 
        setDutyStatusModalVisible(false);
      }
    } catch (error) {
      console.error('Failed to update duty status:', error);
      message.error('Failed to update duty status');
    }
  };

  const columns: ColumnType<IExtendedUserDuty>[] = [
    {
      title: 'Title',
      dataIndex: ['projectDuty', 'title'],
      key: 'title',
      render: (text, record) => (
        <Tooltip title={record.projectDuty?.description || 'No description'}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: 'Project',
      dataIndex: ['projectDuty', 'projectName'],
      key: 'project',
    },
    {
      title: 'Status',
      dataIndex: ['projectDuty', 'status'],
      key: 'status',
      render: (status) => {
        if (!status) return null;
        
        const { text, color } = formatDutyStatus(status);
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'To Do', value: DutyStatus.ToDo },
        { text: 'In Progress', value: DutyStatus.InProgress },
        { text: 'Review', value: DutyStatus.Review },
        { text: 'Done', value: DutyStatus.Done }
      ],
      onFilter: (value, record) => record.projectDuty?.status === value
    },
    {
      title: 'Priority',
      dataIndex: ['projectDuty', 'priority'],
      key: 'priority',
      render: (priority) => {
        if (!priority) return null;
        
        const { text, color } = formatPriorityLevel(priority);
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Low', value: PriorityLevel.Low },
        { text: 'Medium', value: PriorityLevel.Medium },
        { text: 'High', value: PriorityLevel.High },
        { text: 'Urgent', value: PriorityLevel.Urgent }
      ],
      onFilter: (value, record) => record.projectDuty?.priority === value
    },
    {
      title: 'Deadline',
      dataIndex: ['projectDuty', 'deadline'],
      key: 'deadline',
      render: (deadline) => deadline ? dayjs(deadline).format('YYYY-MM-DD') : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.projectDuty && (
            <Button 
              type="primary" 
              size="small" 
              icon={<SyncOutlined />} 
              onClick={() => showStatusUpdateModal(record.projectDuty!)}
            >
              Update Status
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Title level={2}>Duties</Title>
      
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={24}>
          <Card title="Filters" size="small">
            <Form layout="inline">
              <Form.Item label="Status">
                <Select 
                  placeholder="Filter by status" 
                  allowClear 
                  style={{ width: 200 }}
                  onChange={handleStatusFilterChange}
                >
                  <Option value={DutyStatus.ToDo}>To Do</Option>
                  <Option value={DutyStatus.InProgress}>In Progress</Option>
                  <Option value={DutyStatus.Review}>Review</Option>
                  <Option value={DutyStatus.Done}>Done</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={() => loadAllData()}
                  icon={<SyncOutlined />}
                >
                  Refresh
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Spin spinning={loading || userDutiesIsPending}>
          <Table
            columns={columns}
            dataSource={extendedUserDuties}
            rowKey={record => record.id}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
            onChange={handleTableChange}
          />
        </Spin>
      </Card>
      
      {/* Status Update Modal */}
      <Modal
        title="Update Duty Status"
        open={dutyStatusModalVisible}
        onOk={handleStatusUpdate}
        onCancel={() => setDutyStatusModalVisible(false)}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value={DutyStatus.ToDo}>
                <Space>
                  <ClockCircleOutlined />
                  To Do
                </Space>
              </Option>
              <Option value={DutyStatus.InProgress}>
                <Space>
                  <HighlightOutlined />
                  In Progress
                </Space>
              </Option>
              <Option value={DutyStatus.Review}>
                <Space>
                  <ExclamationCircleOutlined />
                  Review
                </Space>
              </Option>
              <Option value={DutyStatus.Done}>
                <Space>
                  <CheckOutlined />
                  Done
                </Space>
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const DutiesPage = () => {
  return (
    <div className="duties-page">
      <DutiesContent />
    </div>
  );
};

export default DutiesPage;
