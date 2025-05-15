// import { useEffect, useState } from 'react';
// import { Card, Table, Tag, Space, Typography, Alert, Button, Modal, Spin } from 'antd';
// import { 
//   FileTextOutlined, 
//   RobotOutlined, 
//   TagsOutlined, 
//   AlertOutlined,
//   CheckCircleOutlined
// } from '@ant-design/icons';


// const { Text, Paragraph } = Typography;

// interface DocumentAnalysis {
//   id: string;
//   fileName: string;
//   fileUrl: string;
//   topics: string[];
//   sentiment: 'positive' | 'neutral' | 'negative';
//   relatedTasks: string[];
//   actionItems: string[];
//   keyInsights: string[];
//   confidence: number;
// }

// interface IDocument {
//   id: string;
//   fileName: string;
//   fileUrl: string;
//   fileSize?: number;
//   fileType?: string;
//   creationTime: string;
// }

// const DocumentAnalyzer = () => {
//   const { documents } = useDocumentState();
//   const [analysis, setAnalysis] = useState<DocumentAnalysis[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState<DocumentAnalysis | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const analyzeDocument = async (document: IDocument): Promise<DocumentAnalysis> => {
//     try {
//       // In a real implementation, this would call an AI service
//       // For demo, we'll simulate AI analysis
//       const simulateAIAnalysis = () => {
//         const topics = ['Project Management', 'Documentation', 'Technical'];
//         const sentiments = ['positive', 'neutral', 'negative'] as const;
//         const actionItems = [
//           'Review document structure',
//           'Update technical specifications',
//           'Share with team members'
//         ];
//         const insights = [
//           'Document follows best practices',
//           'Contains comprehensive technical details',
//           'Requires minor updates'
//         ];

//         return {
//           id: document.id,
//           fileName: document.fileName,
//           fileUrl: document.fileUrl,
//           topics: topics.slice(0, Math.floor(Math.random() * 3) + 1),
//           sentiment: sentiments[Math.floor(Math.random() * 3)],
//           relatedTasks: ['Task 1', 'Task 2'],
//           actionItems: actionItems.slice(0, Math.floor(Math.random() * 3) + 1),
//           keyInsights: insights.slice(0, Math.floor(Math.random() * 3) + 1),
//           confidence: Math.round(Math.random() * 30 + 70) // 70-100%
//         };
//       };

//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       return simulateAIAnalysis();
//     } catch (error) {
//       console.error('Error analyzing document:', error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const analyzeDocuments = async () => {
//       if (!documents?.length) return;
      
//       setLoading(true);
//       try {
//         const results = await Promise.all(documents.map(analyzeDocument));
//         setAnalysis(results);
//       } catch (error) {
//         console.error('Error analyzing documents:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     analyzeDocuments();
//   }, [documents]);

//   const getSentimentColor = (sentiment: string): string => {
//     switch (sentiment) {
//       case 'positive': return 'green';
//       case 'negative': return 'red';
//       default: return 'blue';
//     }
//   };

//   const columns = [
//     {
//       title: 'Document',
//       dataIndex: 'fileName',
//       key: 'fileName',
//       render: (text: string) => (
//         <Space>
//           <FileTextOutlined />
//           <Text strong>{text}</Text>
//         </Space>
//       )
//     },
//     {
//       title: 'Topics',
//       dataIndex: 'topics',
//       key: 'topics',
//       render: (topics: string[]) => (
//         <Space size={[0, 8]} wrap>
//           {topics.map(topic => (
//             <Tag icon={<TagsOutlined />} color="blue" key={topic}>
//               {topic}
//             </Tag>
//           ))}
//         </Space>
//       )
//     },
//     {
//       title: 'Sentiment',
//       dataIndex: 'sentiment',
//       key: 'sentiment',
//       render: (sentiment: string) => (
//         <Tag color={getSentimentColor(sentiment)}>
//           {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
//         </Tag>
//       )
//     },
//     {
//       title: 'Confidence',
//       dataIndex: 'confidence',
//       key: 'confidence',
//       render: (confidence: number) => (
//         <Tag color={confidence > 80 ? 'green' : 'orange'}>
//           {confidence}%
//         </Tag>
//       )
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_: unknown, record: DocumentAnalysis) => (
//         <Button 
//           type="link" 
//           onClick={() => {
//             setSelectedDoc(record);
//             setModalVisible(true);
//           }}
//         >
//           View Analysis
//         </Button>
//       )
//     }
//   ];

//   return (
//     <>
//       <Card
//         title={
//           <Space>
//             <RobotOutlined style={{ color: '#1890ff' }} />
//             <Text strong>AI Document Analysis</Text>
//           </Space>
//         }
//         extra={
//           <Tag icon={<CheckCircleOutlined />} color="green">
//             {analysis.length} Documents Analyzed
//           </Tag>
//         }
//       >
//         <Spin spinning={loading}>
//           <Table 
//             dataSource={analysis}
//             columns={columns}
//             rowKey="id"
//           />
//         </Spin>
//       </Card>

//       <Modal
//         title={
//           <Space>
//             <FileTextOutlined />
//             <Text>Document Analysis Details</Text>
//           </Space>
//         }
//         open={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={null}
//         width={700}
//       >
//         {selectedDoc && (
//           <Space direction="vertical" style={{ width: '100%' }}>
//             <Alert
//               message="AI Analysis Results"
//               description={`Confidence Level: ${selectedDoc.confidence}%`}
//               type="info"
//               showIcon
//             />

//             <Card title="Key Insights" size="small">
//               {selectedDoc.keyInsights.map((insight, index) => (
//                 <Paragraph key={index}>• {insight}</Paragraph>
//               ))}
//             </Card>

//             <Card title="Action Items" size="small">
//               {selectedDoc.actionItems.map((item, index) => (
//                 <Alert
//                   key={index}
//                   message={item}
//                   type="warning"
//                   showIcon
//                   icon={<AlertOutlined />}
//                   style={{ marginBottom: 8 }}
//                 />
//               ))}
//             </Card>

//             <Card title="Related Information" size="small">
//               <Space direction="vertical" style={{ width: '100%' }}>
//                 <Text strong>Topics:</Text>
//                 <Space wrap>
//                   {selectedDoc.topics.map(topic => (
//                     <Tag icon={<TagsOutlined />} color="blue" key={topic}>
//                       {topic}
//                     </Tag>
//                   ))}
//                 </Space>

//                 <Text strong>Related Tasks:</Text>
//                 <Space wrap>
//                   {selectedDoc.relatedTasks.map(task => (
//                     <Tag color="cyan" key={task}>{task}</Tag>
//                   ))}
//                 </Space>
//               </Space>
//             </Card>
//           </Space>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default DocumentAnalyzer; 