
"use client";

import Layout from "@/app/UserMenu/layout";
import { Typography, Button, Select, Space } from "antd";
import { PlusOutlined, FilterOutlined, EllipsisOutlined, TableOutlined, ThunderboltOutlined } from "@ant-design/icons";
import GanttChart from "@/components//dashboard/ganntChart";


const { Title } = Typography;
const { Option } = Select;

const ProjectsPage = () => {
  return (
    <Layout>
      <div style={{ padding: 24, background: '#fff', marginBottom: 24, borderRadius: 8 }}>
        <Title level={3} style={{ margin: 0, marginBottom: 16 }}>Projects</Title>

        <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
          <Space size="middle" style={{ marginBottom: -1 }}>
            <Button type="text" className="tab-button">Dashboard</Button>
            <Button type="text" className="tab-button ant-btn-primary">Tasks</Button>
            <Button type="text" className="tab-button">Task List</Button>
            <Button type="text" className="tab-button">Issues</Button>
            <Button type="text" className="tab-button">Milestones</Button>
            <Button type="text" className="tab-button">Timesheet</Button>
            <Button type="text" className="tab-button">Reports</Button>
            <Button type="text" className="tab-button">Finance</Button>
          </Space>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">All Projects</Option>
            </Select>

             <Button icon={<ThunderboltOutlined />} type="primary">Gantt</Button>
             <Button icon={<TableOutlined />} type="default">Table</Button>
          </Space>

          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Task
            </Button>

            <Button icon={<FilterOutlined />}>Filter</Button>

            <Button icon={<EllipsisOutlined />} />
          </Space>
        </div>
      </div>

      <GanttChart />

    </Layout>
  );
};

export default ProjectsPage;