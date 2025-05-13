"use client";

import { Card, Typography, List, Tag, Space, Empty, Button, Modal, Form, DatePicker, Input, Select, message } from 'antd';
import { FlagOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import { ProjectActionContext, IProject, IMilestone } from '@/provider/ProjectManagement/context';
import { useAuthState } from '@/provider/CurrentUserProvider';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface IProjectOption {
  value: string;
  label: string;
}

interface IMilestoneWithProject extends IMilestone {
  projectId: string;
  projectName?: string;
}

export default function TeamMemberMilestonesPage() {
  const projectActions = useContext(ProjectActionContext);
  const { currentUser } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [myMilestones, setMyMilestones] = useState<IMilestoneWithProject[]>([]);
  const [myProjects, setMyProjects] = useState<IProjectOption[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<IMilestoneWithProject | null>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      if (currentUser?.id) {
        // Get projects the team member is involved in
        const projects = await projectActions.getProjects({
          filter: `assignedUserId eq ${currentUser.id}`
        });
        
        setMyProjects(projects.map(p => ({
          value: p.id,
          label: p.name
        })));

        // Get project details with milestones
        const projectDetails = await Promise.all(
          projects.map(p => projectActions.getProjectWithDetails(p.id))
        );
        
        // Extract milestones
        const milestones = projectDetails
          .filter((p): p is IProject & { timeline: NonNullable<IProject['timeline']> } => 
            p.timeline !== undefined && p.timeline !== null
          )
          .flatMap(p => p.timeline.milestones.map(m => ({
            ...m,
            projectId: p.id,
            projectName: p.name
          })));
        
        setMyMilestones(milestones);
      }
    } catch (error) {
      console.error('Failed to load milestones:', error);
      message.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id, projectActions]);

  const handleSubmit = async () => {
    try {
      message.info('This feature is currently under development. The changes will be reflected in the next update.');
      setIsModalVisible(false);
      setEditingMilestone(null);
      form.resetFields();
    } catch (error) {
      console.error('Failed to save milestone:', error);
      message.error('Failed to save milestone');
    }
  };

  const handleEdit = (milestone: IMilestoneWithProject) => {
    setEditingMilestone(milestone);
    form.setFieldsValue({
      name: milestone.name,
      date: dayjs(milestone.date),
      isCompleted: milestone.isCompleted,
      projectId: milestone.projectId
    });
    setIsModalVisible(true);
  };

  return (
    <div className="p-6">
      <Space className="w-full justify-between mb-4">
        <Title level={2}>Project Milestones</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingMilestone(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Milestone
        </Button>
      </Space>

      {loading ? (
        <div className="text-center py-8">Loading milestones...</div>
      ) : myMilestones.length > 0 ? (
        <List
          dataSource={myMilestones}
          renderItem={(milestone: IMilestoneWithProject) => (
            <Card key={milestone.id} className="mb-4">
              <Space align="start" className="w-full justify-between">
                <Space align="start">
                  <FlagOutlined className="text-xl" />
                  <div>
                    <Title level={4} style={{ margin: 0 }}>{milestone.name}</Title>
                    <Text type="secondary">{milestone.projectName}</Text>
                    <div className="mt-2">
                      <Space>
                        <CalendarOutlined />
                        <Text>{new Date(milestone.date).toLocaleDateString()}</Text>
                        <Tag 
                          color={milestone.isCompleted ? 'success' : 'processing'}
                          icon={milestone.isCompleted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                        >
                          {milestone.isCompleted ? 'Completed' : 'In Progress'}
                        </Tag>
                      </Space>
                    </div>
                  </div>
                </Space>
                <Button 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(milestone)}
                >
                  Edit
                </Button>
              </Space>
            </Card>
          )}
        />
      ) : (
        <Empty description="No milestones found" />
      )}

      <Modal
        title={editingMilestone ? "Edit Milestone" : "Create Milestone"}
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
            name="name"
            label="Milestone Name"
            rules={[{ required: true, message: 'Please enter milestone name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="projectId"
            label="Project"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select options={myProjects} />
          </Form.Item>

          <Form.Item
            name="date"
            label="Target Date"
            rules={[{ required: true, message: 'Please select target date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="isCompleted"
            label="Status"
            initialValue={false}
          >
            <Select>
              <Select.Option value={false}>In Progress</Select.Option>
              <Select.Option value={true}>Completed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingMilestone(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingMilestone ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}