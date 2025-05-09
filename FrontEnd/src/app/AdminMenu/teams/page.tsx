"use client";

import { Table, Tag, Space, Button, Card, Typography, Modal, Form, Input, Select, Avatar } from 'antd';
import { TeamOutlined, UserOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Title } = Typography;
const { Search } = Input;

interface Team {
  id: string;
  name: string;
  description: string;
  creationTime: string;
  projectCount: number;
}

interface UserTeam {
  id: string;
  userId: number;
  userName: string;
  teamId: string;
  teamName: string;
  role: string;
}

export default function TeamsPage() {
  // Static data matching your ABP service structure
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 'team1',
      name: 'Development Team',
      description: 'Frontend and backend developers',
      creationTime: '2023-01-10T08:30:00',
      projectCount: 5
    },
    {
      id: 'team2',
      name: 'Design Team',
      description: 'UI/UX designers',
      creationTime: '2023-02-15T10:20:00',
      projectCount: 3
    },
    {
      id: 'team3',
      name: 'Marketing Team',
      description: 'Digital marketing specialists',
      creationTime: '2023-03-05T14:15:00',
      projectCount: 2
    }
  ]);

  const [userTeams, setUserTeams] = useState<UserTeam[]>([
    {
      id: 'ut1',
      userId: 1,
      userName: 'john.doe',
      teamId: 'team1',
      teamName: 'Development Team',
      role: 'Team Lead'
    },
    {
      id: 'ut2',
      userId: 2,
      userName: 'jane.smith',
      teamId: 'team1',
      teamName: 'Development Team',
      role: 'Developer'
    },
    {
      id: 'ut3',
      userId: 3,
      userName: 'mike.johnson',
      teamId: 'team2',
      teamName: 'Design Team',
      role: 'Design Lead'
    }
  ]);

  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const teamColumns = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Team) => (
        <Space>
          <TeamOutlined />
          <a onClick={() => setCurrentTeam(record)}>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Projects',
      dataIndex: 'projectCount',
      key: 'projectCount',
      render: (count: number) => <Tag color="blue">{count} projects</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Team) => (
        <Space size="middle">
          <Button size="small" onClick={() => {
            setCurrentTeam(record);
            setIsMemberModalVisible(true);
          }}>
            View Members
          </Button>
          <Button size="small">Edit</Button>
          <Button size="small" danger>Delete</Button>
        </Space>
      ),
    },
  ];

  const memberColumns = [
    {
      title: 'Member',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="purple">{role}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button size="small">Edit Role</Button>
          <Button size="small" danger>Remove</Button>
        </Space>
      ),
    },
  ];

  const handleCreateTeam = (values: Omit<Team, 'id' | 'creationTime' | 'projectCount'>) => {
    const newTeam: Team = {
      id: `team${teams.length + 1}`,
      ...values,
      creationTime: new Date().toISOString(),
      projectCount: 0
    };
    setTeams([...teams, newTeam]);
    setIsTeamModalVisible(false);
  };

  const handleAddMember = (values: { userId: number, role: string }) => {
    if (!currentTeam) return;
    
    const newUserTeam: UserTeam = {
      id: `ut${userTeams.length + 1}`,
      userId: values.userId,
      userName: `user${values.userId}`,
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      role: values.role
    };
    setUserTeams([...userTeams, newUserTeam]);
    setIsMemberModalVisible(false);
  };

  const currentTeamMembers = currentTeam 
    ? userTeams.filter(ut => ut.teamId === currentTeam.id)
    : [];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Teams</Title>
      
      <Card 
        title="Team Management"
        extra={
          <Space>
            <Search
              placeholder="Search teams"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsTeamModalVisible(true)}
            >
              New Team
            </Button>
          </Space>
        }
      >
        <Table 
          columns={teamColumns} 
          dataSource={filteredTeams} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create Team Modal */}
      <Modal
        title="Create New Team"
        open={isTeamModalVisible}
        onCancel={() => setIsTeamModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateTeam}>
          <Form.Item 
            label="Team Name" 
            name="name" 
            rules={[{ required: true, message: 'Please input team name!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Team
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Team Members Modal */}
      <Modal
        title={currentTeam ? `${currentTeam.name} Members` : 'Team Members'}
        open={isMemberModalVisible}
        onCancel={() => setIsMemberModalVisible(false)}
        width={800}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Form layout="inline" onFinish={handleAddMember}>
            <Form.Item 
              name="userId" 
              rules={[{ required: true, message: 'Please select user!' }]}
            >
              <Select placeholder="Select user" style={{ width: 200 }}>
                <Select.Option value={1}>John Doe</Select.Option>
                <Select.Option value={2}>Jane Smith</Select.Option>
                <Select.Option value={3}>Mike Johnson</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="role" 
              rules={[{ required: true, message: 'Please select role!' }]}
            >
              <Select placeholder="Select role" style={{ width: 150 }}>
                <Select.Option value="Team Lead">Team Lead</Select.Option>
                <Select.Option value="Developer">Developer</Select.Option>
                <Select.Option value="Designer">Designer</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Add Member
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <Table 
          columns={memberColumns} 
          dataSource={currentTeamMembers} 
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
}