"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  Space, 
  Button, 
  Tag, 
  Typography, 
  Upload, 
  message, 
  Input, 
  DatePicker, 
  Row, 
  Col, 
  Modal, 
  Form, 
  Spin, 
  Alert, 
  Empty 
} from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { 
  UploadOutlined, 
  FileOutlined, 
  DeleteOutlined, 
  DownloadOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import { 
  useDocumentState, 
  useDocumentActions 
} from '../../../provider/DocumentManagement';
import { 
  IDocument, 
  IGetDocumentInput 
} from '../../../provider/DocumentManagement/context';
import { AxiosError } from 'axios';
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

  const loadDocuments = useCallback(async (customFilters?: Partial<IGetDocumentInput>) => {
    try {
      const effectiveFilters = { ...filters, ...customFilters };
      console.log('Loading documents with filters:', effectiveFilters);
      const result = await getDocuments(effectiveFilters);
      console.log('Documents loaded successfully. Count:', result.items.length);
      return result;
    } catch (error) {
      const axiosError = error as AxiosError & { message: string };
      console.error('Error loading documents:', axiosError);
      
      // Only show error message if it's not a manual cancellation
      if (axiosError.message !== 'canceled') {
        message.error(axiosError.message || 'Failed to load documents');
      }
      
      // Re-throw the error to be handled by the caller if needed
      throw error;
    }
  }, [filters, getDocuments]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Initial load with default pagination
        await loadDocuments({
          skipCount: 0,
          maxResultCount: 10,
          // Add any additional filters here if needed
        });
      } catch (error) {
        console.error('Failed to load documents:', error);
      }
    };

    loadInitialData();
  }, [loadDocuments]);

  useEffect(() => {
    console.log('Documents state:', { documents, totalCount, isPending, isError, errorMessage });
  }, [documents, totalCount, isPending, isError, errorMessage]);

  const handleUpload = async (file: File) => {
    try {
      console.log('Uploading file:', file.name);
      
      // Check file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error('File size must be less than 10MB');
        return Upload.LIST_IGNORE; // Prevent the file from being added to the upload list
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const isAllowedByExtension = [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'
      ].includes(fileExtension);
      
      if (!allowedTypes.includes(file.type) && !isAllowedByExtension) {
        message.error('Only PDF, Word, Excel, and text files are allowed');
        return Upload.LIST_IGNORE; // Prevent the file from being added to the upload list
      }
      
      // Show loading message
      const uploadKey = `upload_${Date.now()}`;
      message.loading({ content: `Uploading ${file.name}...`, key: uploadKey, duration: 0 });

      try {
        // Upload the file directly
        const uploadedDoc = await uploadDocument(file);
        
        if (uploadedDoc) {
          message.success({ 
            content: `${file.name} uploaded successfully`,
            key: uploadKey,
            duration: 2
          });
          // Refresh the documents list
          await loadDocuments();
          return false; // Prevent default upload behavior
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        message.error({ 
          content: `Upload failed: ${axiosError.message || 'Unknown error'}`,
          key: uploadKey,
          duration: 3
        });
        return Upload.LIST_IGNORE;
      }
    } catch (error) {
      console.error('Unexpected error in handleUpload:', error);
      message.error({
        content: 'An unexpected error occurred during upload',
        key: 'upload_error',
        duration: 5
      });
      return Upload.LIST_IGNORE;
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

  const handleEdit = async (values: IDocument) => {
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

  // Pagination handler
  const handlePageChange = (page: number, pageSize: number) => {
    setFilters(prev => ({
      ...prev,
      skipCount: (page - 1) * pageSize,
      maxResultCount: pageSize,
    }));
  };

  // Page size change handler
  const handlePageSizeChange = (_: number, size: number) => {
    setFilters(prev => ({
      ...prev,
      skipCount: 0,
      maxResultCount: size,
    }));
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

  const handleRetry = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    loadDocuments();
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
      render: (text) => (
        <Space>
          <FileOutlined style={{ color: '#1890ff' }} />
          <Typography.Text ellipsis={{ tooltip: text }} style={{ maxWidth: 200 }}>
            {text}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 120,
      render: (fileType) => (
        <Tag color="blue" style={{ textTransform: 'uppercase' }}>
          {fileType?.replace('application/', '') || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
      render: (size) => {
        if (!size) return 'N/A';
        const sizeInKB = Math.round(size / 1024);
        return `${sizeInKB} KB`;
      },
    },
    {
      title: 'Uploaded',
      dataIndex: 'creationTime',
      key: 'creationTime',
      width: 180,
      render: (date) => (
        <span>{date ? new Date(date).toLocaleString() : 'N/A'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              console.log('Viewing document:', record);
              setSelectedDocument(record);
              setIsViewModalVisible(true);
            }}
            title="View"
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.fileUrl, record.fileName)}
            title="Download"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const skipCount = filters.skipCount ?? 0;
  const maxResultCount = filters.maxResultCount ?? 10;

  // Show loading state for initial load
  if (isPending && !documents.length) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Documents</Title>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Loading documents..." />
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if there was an error loading documents
  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Documents</Title>
        <Card>
          <Alert
            message="Error Loading Documents"
            description={errorMessage || 'An error occurred while loading documents. Please try again.'}
            type="error"
            showIcon
            action={
              <Button 
                type="primary" 
                onClick={handleRetry} 
                loading={isPending}
              >
                Retry
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Documents</Title>

      <Card
        title="Document Management"
        extra={
          <Upload
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            beforeUpload={handleUpload}
            showUploadList={false}
            multiple={false}
            disabled={isPending}
          >
            <Button
              icon={<UploadOutlined />}
              type="primary"
              loading={isPending}
              disabled={isPending}
            >
              {isPending ? 'Uploading...' : 'Upload Document'}
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
          pagination={{
            current: Math.floor(skipCount / maxResultCount) + 1,
            pageSize: maxResultCount,
            total: totalCount,
            showSizeChanger: true,
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={isPending}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  isError ? (
                    <span style={{ color: '#ff4d4f' }}>Failed to load documents. Please try again.</span>
                  ) : (
                    'No documents found'
                  )
                }
              >
                {isError && (
                  <Button 
                    type="primary" 
                    onClick={handleRetry} 
                    loading={isPending}
                  >
                    Retry
                  </Button>
                )}
              </Empty>
            ),
          }}
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