// import { useEffect, useState } from 'react';
// import { Card, List, Tag, Space, Typography, Progress, Tooltip } from 'antd';
// import { ClockCircleOutlined, FireOutlined, TeamOutlined } from '@ant-design/icons';
// import { PriorityLevel } from '@/enums/PriorityLevel';
// import { DutyStatus } from '@/enums/DutyStatus';

// const { Text } = Typography;

// interface ScoredTask {
//   id: string;
//   title: string;
//   score: number;
//   urgencyColor: string;
//   deadline?: Date;
//   priority: PriorityLevel;
//   status: DutyStatus;
//   teamMemberCount: number;
//   deadlineScore: number;
//   priorityScore: number;
//   workloadScore: number;
// }

// interface ProjectDuty {
//   id: string;
//   title: string;
//   deadline?: string;
//   priority: PriorityLevel;
//   status: DutyStatus;
//   userDuties?: Array<{ id: string }>;
//   documents?: Array<{ id: string }>;
//   comments?: Array<{ id: string }>;
// }

// const SmartPrioritizer = () => {
//   // Mock data and loading state since we can't import the actual provider
//   const projectDuties: ProjectDuty[] = [
//     {
//       id: '1',
//       title: 'Complete Frontend Design',
//       deadline: '2025-06-15',
//       priority: PriorityLevel.High,
//       status: DutyStatus.InProgress,
//       userDuties: [{ id: '101' }, { id: '102' }],
//       documents: [{ id: '501' }],
//       comments: [{ id: '701' }, { id: '702' }]
//     },
//     {
//       id: '2',
//       title: 'API Integration',
//       deadline: '2025-06-30',
//       priority: PriorityLevel.Medium,
//       status: DutyStatus.ToDo,
//       userDuties: [{ id: '103' }],
//       documents: [],
//       comments: [{ id: '703' }]
//     },
//     {
//       id: '3',
//       title: 'Database Schema Update',
//       deadline: '2025-05-25',
//       priority: PriorityLevel.Urgent,
//       status: DutyStatus.ToDo,
//       userDuties: [{ id: '104' }, { id: '105' }],
//       documents: [{ id: '502' }, { id: '503' }],
//       comments: []
//     }
//   ];
//   const isPending = false;
  
//   const [prioritizedTasks, setPrioritizedTasks] = useState<ScoredTask[]>([]);

//   const getUrgencyColor = (score: number): string => {
//     if (score >= 80) return 'red';
//     if (score >= 60) return 'orange';
//     if (score >= 40) return 'blue';
//     return 'green';
//   };

//   const calculateTaskScore = (task: ProjectDuty): ScoredTask => {
//     // 1. Deadline Factor (0-1)
//     const calculateDeadlineScore = (): number => {
//       if (!task.deadline) return 0.5; // Medium priority if no deadline
      
//       const today = new Date();
//       const deadline = new Date(task.deadline);
//       const daysLeft = (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      
//       // Higher score for closer deadlines
//       return Math.max(0, Math.min(1, 1 - (daysLeft / 30)));
//     };

//     // 2. Priority Weight (0-1)
//     const calculatePriorityScore = (): number => {
//       const weights: Record<PriorityLevel, number> = {
//         [PriorityLevel.Low]: 0.25,
//         [PriorityLevel.Medium]: 0.5,
//         [PriorityLevel.High]: 0.75,
//         [PriorityLevel.Urgent]: 1
//       };
//       return weights[task.priority] || 0.5;
//     };

//     // 3. Workload/Complexity Factor (0-1)
//     const calculateWorkloadScore = (): number => {
//       const hasDocuments = task.documents?.length > 0 ? 0.2 : 0;
//       const hasComments = task.comments?.length > 0 ? 0.2 : 0;
//       const hasMultipleAssignees = (task.userDuties?.length || 0) > 1 ? 0.3 : 0;
//       const isInProgress = task.status === DutyStatus.InProgress ? 0.3 : 0;
      
//       return Math.min(1, hasDocuments + hasComments + hasMultipleAssignees + isInProgress);
//     };

//     // Calculate component scores
//     const deadlineScore = calculateDeadlineScore();
//     const priorityScore = calculatePriorityScore();
//     const workloadScore = calculateWorkloadScore();

//     // Calculate final score (0-100)
//     const finalScore = Math.round(
//       (deadlineScore * 0.4 + 
//        priorityScore * 0.4 + 
//        workloadScore * 0.2) * 100
//     );

//     return {
//       id: task.id,
//       title: task.title,
//       score: finalScore,
//       urgencyColor: getUrgencyColor(finalScore),
//       deadline: task.deadline ? new Date(task.deadline) : undefined,
//       priority: task.priority,
//       status: task.status,
//       teamMemberCount: task.userDuties?.length || 0,
//       deadlineScore: Math.round(deadlineScore * 100),
//       priorityScore: Math.round(priorityScore * 100),
//       workloadScore: Math.round(workloadScore * 100)
//     };
//   };

//   useEffect(() => {
//     if (projectDuties) {
//       const scored = projectDuties
//         .map(calculateTaskScore)
//         .sort((a: ScoredTask, b: ScoredTask) => b.score - a.score);
//       setPrioritizedTasks(scored);
//     }
//   }, [projectDuties]); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <Card 
//       title={
//         <Space>
//           <FireOutlined style={{ color: '#ff4d4f' }} />
//           <Text strong>AI Task Priorities</Text>
//         </Space>
//       }
//       loading={isPending}
//     >
//       <List
//         dataSource={prioritizedTasks}
//         renderItem={(task) => (
//           <List.Item>
//             <Space direction="vertical" style={{ width: '100%' }}>
//               <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
//                 <Space>
//                   <Tag color={task.urgencyColor}>Score: {task.score}</Tag>
//                   <Text strong>{task.title}</Text>
//                 </Space>
//                 <Space>
//                   <Tooltip title="Deadline Impact">
//                     <ClockCircleOutlined style={{ color: '#1890ff' }} />
//                     <Progress 
//                       percent={task.deadlineScore} 
//                       size="small" 
//                       style={{ width: 60 }}
//                       showInfo={false}
//                     />
//                   </Tooltip>
//                   <Tooltip title="Priority Impact">
//                     <FireOutlined style={{ color: '#ff4d4f' }} />
//                     <Progress 
//                       percent={task.priorityScore} 
//                       size="small" 
//                       style={{ width: 60 }}
//                       showInfo={false}
//                     />
//                   </Tooltip>
//                   <Tooltip title="Workload Impact">
//                     <TeamOutlined style={{ color: '#52c41a' }} />
//                     <Progress 
//                       percent={task.workloadScore} 
//                       size="small" 
//                       style={{ width: 60 }}
//                       showInfo={false}
//                     />
//                   </Tooltip>
//                 </Space>
//               </Space>
//               <Space size="small">
//                 {task.deadline && (
//                   <Tag color="blue">
//                     Due: {task.deadline.toLocaleDateString()}
//                   </Tag>
//                 )}
//                 <Tag color="purple">
//                   Team: {task.teamMemberCount} member{task.teamMemberCount !== 1 ? 's' : ''}
//                 </Tag>
//                 <Tag color="cyan">{DutyStatus[task.status]}</Tag>
//               </Space>
//             </Space>
//           </List.Item>
//         )}
//       />
//     </Card>
//   );
// };

// export default SmartPrioritizer;