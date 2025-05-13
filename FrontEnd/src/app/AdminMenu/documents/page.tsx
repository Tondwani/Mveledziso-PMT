"use client";

import React, { useEffect, useState } from 'react';
import { Table, Card, Space, Button, Tag, Typography, Upload, message, Input, DatePicker, Row, Col, Modal, Form } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useDocumentState, useDocumentActions } from '../../../provider/DocumentManagement';
import { IDocument, IGetDocumentInput, IUpdateDocumentDto } from '../../../provider/DocumentManagement/context';
import { AxiosError } from 'axios';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function DocumentsPage() {
  const { documents, totalCount, isPending, isError, errorMessage } = useDocumentState();
  const { getDocuments, uploadDocument, deleteDocument, updateDocument } = useDocumentActions();
  const [filters, setFilters] = useState<IGetDocumentInput>({
    skipCount: 0,
    maxResultCount: 10,
    keyword: '',
    fromDate: undefined,
    toDate: undefined
  });

  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('Current filters:', filters);
    loadDocuments();
  }, [filters]);

  useEffect(() => {
    console.log('Documents state:', { documents, totalCount, isPending, isError, errorMessage });
  }, [documents, totalCount, isPending, isError, errorMessage]);

  const loadDocuments = async () => {
    try {
      console.log('Loading documents with filters:', filters);
      const result = await getDocuments(filters);
      console.log('Documents loaded:', result);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error loading documents:', axiosError);
      message.error(axiosError.message || 'Failed to load documents');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      console.log('Uploading file:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadDocument(file);
      console.log('Upload result:', result);
      message.success('Document uploaded successfully');
      loadDocuments();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Upload error:', axiosError);
      message.error(axiosError.message || 'Failed to upload document');
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete Document',
      content: 'Are you sure you want to delete this document?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          console.log('Deleting document:', id);
          await deleteDocument(id);
          message.success('Document deleted successfully');
          loadDocuments();
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('Delete error:', axiosError);
          message.error(axiosError.message || 'Failed to delete document');
        }
      }
    });
  };

  const handleEdit = async (values: IUpdateDocumentDto) => {
    if (!selectedDocument) return;

    try {
      console.log('Updating document:', { id: selectedDocument.id, values });
      await updateDocument(selectedDocument.id, values);
      message.success('Document updated successfully');
      setIsEditModalVisible(false);
      loadDocuments();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Update error:', axiosError);
      message.error(axiosError.message || 'Failed to update document');
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    console.log('Downloading document:', { fileUrl, fileName });
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
    setFilters(prev => ({
      ...prev,
      keyword: value,
      skipCount: 0
    }));
  };

  const handleDateRangeChange = (dates: RangePickerProps['value']) => {
    console.log('Date range changed:', dates);
    setFilters(prev => ({
      ...prev,
      fromDate: dates?.[0]?.toISOString(),
      toDate: dates?.[1]?.toISOString(),
      skipCount: 0
    }));
  };

  const handleReset = () => {
    console.log('Resetting filters');
    setFilters({
      skipCount: 0,
      maxResultCount: 10,
      keyword: '',
      fromDate: undefined,
      toDate: undefined
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns: ColumnsType<IDocument> = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <Space>
          <FileOutlined />
          {text}
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => formatFileSize(size),
      responsive: ['sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Type',
      dataIndex: 'fileType',
      key: 'fileType',
      render: (type: string) => <Tag>{type?.toUpperCase() || 'N/A'}</Tag>,
      responsive: ['md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Uploaded',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (date: string) => new Date(date).toLocaleString(),
      responsive: ['lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right' as const,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
      render: (_: unknown, record: IDocument) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => {
              console.log('Viewing document:', record);
              setSelectedDocument(record);
              setIsViewModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => {
              console.log('Editing document:', record);
              setSelectedDocument(record);
              form.setFieldsValue(record);
              setIsEditModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            icon={<DownloadOutlined />} 
            onClick={() => handleDownload(record.fileUrl, record.fileName)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const skipCount = filters.skipCount ?? 0;
  const maxResultCount = filters.maxResultCount ?? 10;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Documents</Title>
      
      <Card
        title="Document Management"
        extra={
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx,.csv,.json"
          >
            <Button icon={<UploadOutlined />} type="primary">
              Upload Document
            </Button>
          </Upload>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Input.Search
              placeholder="Search documents"
              onSearch={handleSearch}
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <RangePicker
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Button onClick={handleReset} style={{ width: '100%' }}>Reset Filters</Button>
          </Col>
        </Row>

        {isError && (
          <div style={{ marginTop: 16, marginBottom: 16, color: '#ff4d4f' }}>
            {errorMessage}
          </div>
        )}
        
        <Table
          columns={columns}
          dataSource={documents}
          rowKey="id"
          loading={isPending}
          pagination={{
            total: totalCount,
            pageSize: maxResultCount,
            current: Math.floor(skipCount / maxResultCount) + 1,
            onChange: (page) => {
              setFilters(prev => ({
                ...prev,
                skipCount: (page - 1) * (prev.maxResultCount ?? 10)
              }));
            }
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* View Modal */}
      <Modal
        title="View Document"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
      >
        {selectedDocument && (
          <div>
            <p><strong>File Name:</strong> {selectedDocument.fileName}</p>
            <p><strong>File Type:</strong> {selectedDocument.fileType || 'N/A'}</p>
            <p><strong>File Size:</strong> {selectedDocument.fileSize ? formatFileSize(selectedDocument.fileSize) : 'N/A'}</p>
            <p><strong>Upload Date:</strong> {new Date(selectedDocument.creationTime).toLocaleString()}</p>
            <p><strong>File URL:</strong> <a href={selectedDocument.fileUrl} target="_blank" rel="noopener noreferrer">View File</a></p>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Document"
        open={isEditModalVisible}
        onOk={form.submit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="fileName"
            label="File Name"
            rules={[{ required: true, message: 'Please input the file name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}