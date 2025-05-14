// import React, { useState, useRef, useEffect } from 'react';
// import { Input, Button, Card, Typography, Spin, List, Avatar } from 'antd';
// import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
// import styles from './styles.module.css';
// import { useMCPPostgresQuery } from '@/utils/mcpClient';

// const { Title, Text, Paragraph } = Typography;

// interface ChatMessage {
//   id: string;
//   content: string;
//   sender: 'user' | 'assistant';
//   timestamp: Date;
// }

// interface QueryResult {
//   [key: string]: string | number | boolean | Date | null | undefined;
// }

// const DatabaseAssistant: React.FC = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     {
//       id: '1',
//       content: 'Hello! I can help you query your database. What information would you like to see?',
//       sender: 'assistant',
//       timestamp: new Date(),
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [currentQuery, setCurrentQuery] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isQuerying, setIsQuerying] = useState(false);

//   // Sample queries that the user might want to ask
//   const sampleQueries = [
//     'Show me all projects',
//     'List all team members',
//     'Show me documents created in the last month',
//     'Count tasks by status',
//     'Find overdue tasks'
//   ];

//   // Map natural language queries to SQL
//   const mapQueryToSQL = (query: string): string => {
//     const lowerQuery = query.toLowerCase();
    
//     if (lowerQuery.includes('all projects') || lowerQuery.includes('list projects')) {
//       return 'SELECT id, name, description, status, creation_time FROM "Projects" LIMIT 10';
//     }
    
//     if (lowerQuery.includes('team members') || lowerQuery.includes('list members')) {
//       return 'SELECT id, first_name, last_name, email, role FROM "Persons" LIMIT 10';
//     }
    
//     if (lowerQuery.includes('documents') && lowerQuery.includes('last month')) {
//       return `SELECT file_name, file_url, creation_time FROM "Documents" 
//               WHERE creation_time >= NOW() - INTERVAL '1 month' LIMIT 10`;
//     }
    
//     if (lowerQuery.includes('tasks by status') || lowerQuery.includes('count tasks')) {
//       return 'SELECT status, COUNT(*) as count FROM "ProjectDuties" GROUP BY status';
//     }
    
//     if (lowerQuery.includes('overdue') || lowerQuery.includes('late tasks')) {
//       return `SELECT title, deadline FROM "ProjectDuties" 
//               WHERE deadline < CURRENT_DATE AND status != 3 LIMIT 10`;
//     }
    
//     // Default query if no match
//     return 'SELECT COUNT(*) as count FROM "Projects"';
//   };

//   // Helper function to safely format date values
//   const safeFormatDate = (dateValue: string | number | boolean | Date | null | undefined): string => {
//     if (!dateValue) return 'Not specified';
//     try {
//       return new Date(dateValue as string | number | Date).toLocaleDateString();
//     } catch (error) {
//       return String(dateValue);
//     }
//   };

//   // Format database results as natural text
//   const formatResultsAsText = (query: string, results: QueryResult[]): string => {
//     const lowerQuery = query.toLowerCase();
    
//     if (results.length === 0) {
//       return "I didn't find any results for that query.";
//     }
    
//     if (lowerQuery.includes('all projects') || lowerQuery.includes('list projects')) {
//       return `I found ${results.length} projects. Here are some details:\n\n` + 
//         results.map(p => `• ${p.name}: ${p.description || 'No description'} (Status: ${p.status})`).join('\n');
//     }
    
//     if (lowerQuery.includes('team members') || lowerQuery.includes('list members')) {
//       return `I found ${results.length} team members. Here are some details:\n\n` + 
//         results.map(m => `• ${m.first_name} ${m.last_name} (${m.email}), Role: ${m.role}`).join('\n');
//     }
    
//     if (lowerQuery.includes('documents') && lowerQuery.includes('last month')) {
//       return `I found ${results.length} documents created in the last month:\n\n` + 
//         results.map(d => `• ${d.file_name} (Created: ${safeFormatDate(d.creation_time)})`).join('\n');
//     }
    
//     if (lowerQuery.includes('tasks by status') || lowerQuery.includes('count tasks')) {
//       return 'Here is the breakdown of tasks by status:\n\n' + 
//         results.map(r => `• Status ${r.status}: ${r.count} tasks`).join('\n');
//     }
    
//     if (lowerQuery.includes('overdue') || lowerQuery.includes('late tasks')) {
//       return `I found ${results.length} overdue tasks:\n\n` + 
//         results.map(t => `• ${t.title} (Deadline: ${safeFormatDate(t.deadline)})`).join('\n');
//     }
    
//     // Generic formatter for other queries
//     return `Here are the results of your query:\n\n${JSON.stringify(results, null, 2)}`;
//   };

//   // Execute custom SQL query
//   const { data, loading, error } = useMCPPostgresQuery<QueryResult[]>(
//     currentQuery ? mapQueryToSQL(currentQuery) : 'SELECT 1'
//   );

//   // Scroll to the bottom of the chat when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Process data when it's available
//   useEffect(() => {
//     if (currentQuery && !loading && (data || error)) {
//       setIsQuerying(false);
      
//       if (error) {
//         setMessages(prev => [
//           ...prev,
//           {
//             id: Date.now().toString(),
//             content: `I encountered an error executing your query: ${error}`,
//             sender: 'assistant',
//             timestamp: new Date(),
//           }
//         ]);
//       } else if (data) {
//         setMessages(prev => [
//           ...prev,
//           {
//             id: Date.now().toString(),
//             content: formatResultsAsText(currentQuery, data),
//             sender: 'assistant',
//             timestamp: new Date(),
//           }
//         ]);
//       }
      
//       // Reset current query after processing
//       setCurrentQuery('');
//     }
//   }, [data, loading, error, currentQuery]);

//   const handleSend = () => {
//     if (!input.trim()) return;
    
//     // Add user message
//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       content: input,
//       sender: 'user',
//       timestamp: new Date(),
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setCurrentQuery(input);
//     setInput('');
//     setIsQuerying(true);
//   };

//   const handleSampleQuery = (query: string) => {
//     // Add user message
//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       content: query,
//       sender: 'user',
//       timestamp: new Date(),
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setCurrentQuery(query);
//     setIsQuerying(true);
//   };

//   return (
//     <Card className={styles.container} title={<Title level={4}>Database Assistant</Title>}>
//       <div className={styles.chatContainer}>
//         <List
//           className={styles.messageList}
//           itemLayout="horizontal"
//           dataSource={messages}
//           renderItem={message => (
//             <List.Item className={message.sender === 'user' ? styles.userMessage : styles.assistantMessage}>
//               <List.Item.Meta
//                 avatar={
//                   message.sender === 'user' ? 
//                     <Avatar icon={<UserOutlined />} className={styles.userAvatar} /> : 
//                     <Avatar icon={<RobotOutlined />} className={styles.assistantAvatar} />
//                 }
//                 title={<Text strong>{message.sender === 'user' ? 'You' : 'Database Assistant'}</Text>}
//                 description={
//                   <Paragraph className={styles.messageContent}>
//                     {message.content.split('\n').map((line, i) => (
//                       <React.Fragment key={i}>
//                         {line}
//                         <br />
//                       </React.Fragment>
//                     ))}
//                   </Paragraph>
//                 }
//               />
//             </List.Item>
//           )}
//         />
//         <div ref={messagesEndRef} />
        
//         {isQuerying && (
//           <div className={styles.loadingContainer}>
//             <Spin size="small" />
//             <Text type="secondary" style={{ marginLeft: 10 }}>Querying database...</Text>
//           </div>
//         )}
//       </div>
      
//       <div className={styles.sampleQueries}>
//         <Text strong>Try asking about:</Text>
//         <div className={styles.queryButtons}>
//           {sampleQueries.map(query => (
//             <Button 
//               key={query} 
//               size="small" 
//               onClick={() => handleSampleQuery(query)}
//               disabled={isQuerying}
//             >
//               {query}
//             </Button>
//           ))}
//         </div>
//       </div>
      
//       <div className={styles.inputContainer}>
//         <Input
//           placeholder="Ask something about your database..."
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onPressEnter={handleSend}
//           disabled={isQuerying}
//           className={styles.input}
//         />
//         <Button
//           type="primary"
//           icon={<SendOutlined />}
//           onClick={handleSend}
//           disabled={!input.trim() || isQuerying}
//           className={styles.sendButton}
//         />
//       </div>
//     </Card>
//   );
// };

// export default DatabaseAssistant; 