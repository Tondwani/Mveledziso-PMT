// "use client";

// import { Card, List, Avatar, Input, Button, Form, Typography, Popconfirm } from 'antd';
// import { UserOutlined, SendOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import React, { useState } from 'react';

// const { TextArea } = Input;
// const { Text } = Typography;

// interface Comment {
//   id: string;
//   content: string;
//   userId: number;
//   userName: string;
//   creationTime: string;
//   isCurrentUser: boolean;
// }

// interface CommentProps {
//   entityType: string;
//   entityId: string;
//   initialComments?: Comment[];
//   currentUserId?: number;
// }

// const CommentComponent: React.FC<CommentProps> = ({ 
//   entityType, 
//   entityId, 
//   initialComments = [], 
//   currentUserId 
// }) => {
//   const [comments, setComments] = useState<Comment[]>(initialComments);
//   const [content, setContent] = useState('');
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editContent, setEditContent] = useState('');

//   const handleSubmit = () => {
//     if (!content.trim()) return;
    
//     const newComment: Comment = {
//       id: `comment-${Date.now()}`,
//       content,
//       userId: currentUserId || 0,
//       userName: 'Current User',
//       creationTime: new Date().toISOString(),
//       isCurrentUser: true
//     };
    
//     setComments([newComment, ...comments]);
//     setContent('');
    
//     // Here you would call your CommentAppService.CreateAsync
//     // await commentAppService.createAsync({
//     //   content,
//     //   entityType,
//     //   entityId
//     // });
//   };

//   const handleEdit = (comment: Comment) => {
//     setEditingCommentId(comment.id);
//     setEditContent(comment.content);
//   };

//   const handleUpdate = () => {
//     if (!editingCommentId || !editContent.trim()) return;
    
//     setComments(comments.map(comment => 
//       comment.id === editingCommentId 
//         ? { ...comment, content: editContent } 
//         : comment
//     ));
    
//     setEditingCommentId(null);
//     setEditContent('');
    
//     // Here you would call your CommentAppService.UpdateAsync
//     // await commentAppService.updateAsync(editingCommentId, {
//     //   content: editContent
//     // });
//   };

//   const handleDelete = (commentId: string) => {
//     setComments(comments.filter(comment => comment.id !== commentId));
    
//     // Here you would call your CommentAppService.DeleteAsync
//     // await commentAppService.deleteAsync(commentId);
//   };

//   return (
//     <Card title="Comments" bordered={false}>
//       <Form onFinish={handleSubmit}>
//         <Form.Item>
//           <TextArea
//             rows={4}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Add a comment..."
//           />
//         </Form.Item>
//         <Form.Item>
//           <Button 
//             type="primary" 
//             htmlType="submit" 
//             icon={<SendOutlined />}
//           >
//             Post Comment
//           </Button>
//         </Form.Item>
//       </Form>

//       <List
//         itemLayout="horizontal"
//         dataSource={comments}
//         renderItem={(comment) => (
//           <List.Item
//             actions={
//               comment.isCurrentUser ? [
//                 <Button 
//                   key="edit" 
//                   type="text" 
//                   icon={<EditOutlined />} 
//                   onClick={() => handleEdit(comment)}
//                 />,
//                 <Popconfirm
//                   key="delete"
//                   title="Delete this comment?"
//                   onConfirm={() => handleDelete(comment.id)}
//                 >
//                   <Button type="text" danger icon={<DeleteOutlined />} />
//                 </Popconfirm>
//               ] : []
//             }
//           >
//             <List.Item.Meta
//               avatar={<Avatar icon={<UserOutlined />} />}
//               title={<Text strong>{comment.userName}</Text>}
//               description={
//                 editingCommentId === comment.id ? (
//                   <div style={{ marginTop: 8 }}>
//                     <TextArea
//                       rows={3}
//                       value={editContent}
//                       onChange={(e) => setEditContent(e.target.value)}
//                     />
//                     <div style={{ marginTop: 8 }}>
//                       <Button 
//                         type="primary" 
//                         size="small" 
//                         onClick={handleUpdate}
//                         style={{ marginRight: 8 }}
//                       >
//                         Update
//                       </Button>
//                       <Button 
//                         size="small" 
//                         onClick={() => setEditingCommentId(null)}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <Text>{comment.content}</Text>
//                     <div style={{ marginTop: 4 }}>
//                       <Text type="secondary">
//                         {new Date(comment.creationTime).toLocaleString()}
//                       </Text>
//                     </div>
//                   </>
//                 )
//               }
//             />
//           </List.Item>
//         )}
//       />
//     </Card>
//   );
// };

// export default CommentComponent;