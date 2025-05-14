// FrontEnd/src/components/comments/CommentSection.tsx
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Card, List, Avatar, Input, Button, Form, Typography, Popconfirm, message } from 'antd';
import { UserOutlined, SendOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { 
  CommentStateContext, 
  CommentActionContext,
  ICreateCommentDto,
  IUpdateCommentDto,
  ICommentListInputDto
} from '@/provider/CommentManagement/context';

const { TextArea } = Input;
const { Text } = Typography;

interface CommentSectionProps {
  entityType: string;  // e.g., 'ProjectDuty', 'Document'
  entityId: string;
  title?: string;      
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  entityType, 
  entityId,
  title = 'Comments'
}) => {
  // Context
  const state = useContext(CommentStateContext);
  const actions = useContext(CommentActionContext);

  // Local state
  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [form] = Form.useForm();

  // Load comments with useCallback to prevent unnecessary recreations
  const loadComments = useCallback(async () => {
    try {
      const input: ICommentListInputDto = {
        entityType,
        entityId,
        skipCount: 0,
        maxResultCount: 50
      };
      await actions.getComments(input);
    } catch {
      message.error('Failed to load comments');
    }
  }, [actions, entityType, entityId]);

  // Load comments on mount or when dependencies change
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const input: ICreateCommentDto = {
        content: content.trim(),
        entityType,
        entityId
      };
      
      await actions.createComment(input);
      setContent('');
      form.resetFields();
      await loadComments(); // Refresh comments
      message.success('Comment posted successfully');
    } catch {
      message.error('Failed to post comment');
    }
  };

  const handleEdit = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleUpdate = async () => {
    if (!editingCommentId || !editContent.trim()) return;

    try {
      const input: IUpdateCommentDto = {
        content: editContent.trim()
      };
      
      await actions.updateComment(editingCommentId, input);
      setEditingCommentId(null);
      setEditContent('');
      await loadComments(); // Refresh comments
      message.success('Comment updated successfully');
    } catch {
      message.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await actions.deleteComment(commentId);
      await loadComments(); // Refresh comments
      message.success('Comment deleted successfully');
    } catch {
      message.error('Failed to delete comment');
    }
  };

  return (
    <Card 
      title={title} 
      bordered={false}
      loading={state.isPending}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="content">
          <TextArea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SendOutlined />}
            loading={state.isPending}
          >
            Post Comment
          </Button>
        </Form.Item>
      </Form>

      <List
        itemLayout="horizontal"
        dataSource={state.comments}
        renderItem={(comment) => (
          <List.Item
            actions={[
              <Button 
                key="edit" 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(comment.id, comment.content)}
              />,
              <Popconfirm
                key="delete"
                title="Delete this comment?"
                onConfirm={() => handleDelete(comment.id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <div>
                  <Text strong>{comment.userName}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({comment.userType})
                  </Text>
                </div>
              }
              description={
                editingCommentId === comment.id ? (
                  <div style={{ marginTop: 8 }}>
                    <TextArea
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Button 
                        type="primary" 
                        size="small" 
                        onClick={handleUpdate}
                        style={{ marginRight: 8 }}
                        loading={state.isPending}
                      >
                        Update
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Text>{comment.content}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">
                        {new Date(comment.creationTime).toLocaleString()}
                      </Text>
                    </div>
                  </>
                )
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CommentSection;