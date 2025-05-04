
"use client";
import React, { useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Card,
  Typography,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
} from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  projectDutyId?: string;
  projectDutyName?: string;
  creationTime: string;
  lastModifiedTime: string;
  fileContent?: Blob;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      fileName: 'Project Requirements.pdf',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      projectDutyId: 'project1',
      projectDutyName: 'Website Redesign',
      creationTime: '2023-01-10T08:30:00',
      lastModifiedTime: '2023-01-15T10:20:00',
    },
    {
      id: '2',
      fileName: 'User Manual.docx',
      fileType: 'DOCX',
      fileSize: '1.2 MB',
      projectDutyId: 'project2',
      projectDutyName: 'Mobile App',
      creationTime: '2023-02-05T14:15:00',
      lastModifiedTime: '2023-02-10T09:30:00',
    },
    {
      id: '3',
      fileName: 'Meeting Notes.txt',
      fileType: 'TXT',
      fileSize: '0.1 MB',
      creationTime: '2023-03-01T10:00:00',
      lastModifiedTime: '2023-03-01T10:00:00',
    },
  ]);

  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>();
  const [dateRange, setDateRange] = useState<[string, string]>();

  const handleFileUpload = (file: File) => {
    const newDoc: Document = {
      id: (documents.length + 1).toString(),
      fileName: file.name,
      fileType: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      creationTime: new Date().toISOString(),
      lastModifiedTime: new Date().toISOString(),
      fileContent: new Blob([file], { type: file.type }),
    };

    const newList = [...documents, newDoc];
    setDocuments(newList);
    setFilteredDocuments(newList);
    message.success(`${file.name} uploaded successfully`);
    return false; // Prevent automatic upload
  };

  const handleDownload = (record: Document) => {
    if (record.fileContent) {
      const url = URL.createObjectURL(record.fileContent);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', record.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      message.info(`Simulating download for: ${record.fileName}`);
    }
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <Space>
          <FileTextOutlined />
          <a>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'fileType',
      key: 'fileType',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: 'Project/Duty',
      dataIndex: 'projectDutyName',
      key: 'projectDutyName',
      render: (name?: string) => (name ? <Tag color="blue">{name}</Tag> : '-'),
    },
    {
      title: 'Uploaded',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModifiedTime',
      key: 'lastModifiedTime',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Document) => (
        <Space size="middle">
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
          >
            Download
          </Button>
          <a>View</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    let results = [...documents];

    if (searchKeyword) {
      results = results.filter((doc) =>
        doc.fileName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (selectedProject) {
      results = results.filter((doc) => doc.projectDutyId === selectedProject);
    }

    if (dateRange) {
      const [start, end] = dateRange;
      results = results.filter((doc) => {
        const docDate = new Date(doc.creationTime);
        return docDate >= new Date(start) && docDate <= new Date(end);
      });
    }

    setFilteredDocuments(results);
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedProject(undefined);
    setDateRange(undefined);
    setFilteredDocuments(documents);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Documents</Title>

      <Card
        title="Document Management"
        extra={
          <Upload
            multiple
            showUploadList={false}
            beforeUpload={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx,.csv,.json"
          >
            <Button icon={<UploadOutlined />} type="primary">
              Upload Document
            </Button>
          </Upload>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space size="large">
            <Search
              placeholder="Search documents"
              enterButton={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />

            <Select
              placeholder="Filter by project"
              style={{ width: 200 }}
              value={selectedProject}
              onChange={(value) => setSelectedProject(value)}
              allowClear
              onClear={handleSearch}
            >
              <Select.Option value="project1">Website Redesign</Select.Option>
              <Select.Option value="project2">Mobile App</Select.Option>
            </Select>

            <RangePicker
              placeholder={['Start Date', 'End Date']}
              onChange={(dates) => {
                if (dates) {
                  setDateRange([
                    dates[0]?.format('YYYY-MM-DD') || '',
                    dates[1]?.format('YYYY-MM-DD') || '',
                  ]);
                } else {
                  setDateRange(undefined);
                }
              }}
              onOk={handleSearch}
            />

            <Button onClick={handleReset}>Reset Filters</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDocuments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}