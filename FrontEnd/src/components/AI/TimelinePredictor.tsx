// import { useEffect, useState } from 'react';
// import { Card, Timeline, Alert, Space, Typography, Tag, Progress, Tooltip } from 'antd';
// import { 
//   ClockCircleOutlined, 
//   WarningOutlined, 
//   CheckCircleOutlined,
//   CalendarOutlined
// } from '@ant-design/icons';
// import { useTimeline } from '@/provider/TimelineManagement';
// import { useProjectDuties } from '@/provider/ProjectDutiesManagement';
// import { DutyStatus } from '@/enums/DutyStatus';

// const { Text } = Typography;

// interface PhasePrediction {
//   id: string;
//   name: string;
//   startDate: Date;
//   endDate: Date;
//   probability: number;
//   suggestedBuffer: number;
//   risk: 'low' | 'medium' | 'high';
//   delayProbability: number;
//   completionRate: number;
//   duties: any[];
// }

// const TimelinePredictor = () => {
//   const { timeline, phases } = useTimeline();
//   const { projectDuties } = useProjectDuties();
//   const [predictions, setPredictions] = useState<PhasePrediction[]>([]);

//   const predictPhase = (phase: any): PhasePrediction => {
//     // Get duties for this phase
//     const phaseDuties = projectDuties.filter(duty => {
//       const dutyDate = new Date(duty.deadline || duty.creationTime);
//       return dutyDate >= new Date(phase.startDate) && 
//              dutyDate <= new Date(phase.endDate);
//     });

//     // Calculate historical delay probability
//     const calculateDelayProbability = (): number => {
//       const completedDuties = phaseDuties.filter(d => d.status === DutyStatus.Done);
//       if (!completedDuties.length) return 0.5; // Default if no historical data

//       const delayedDuties = completedDuties.filter(d => {
//         const completionDate = new Date(d.completionTime || new Date());
//         const deadline = new Date(d.deadline);
//         return completionDate > deadline;
//       });

//       return delayedDuties.length / completedDuties.length;
//     };

//     // Calculate completion rate
//     const calculateCompletionRate = (): number => {
//       if (!phaseDuties.length) return 0;
//       const completed = phaseDuties.filter(d => d.status === DutyStatus.Done).length;
//       return (completed / phaseDuties.length) * 100;
//     };

//     // Calculate risk factors
//     const calculateRiskScore = (): number => {
//       const delayProb = calculateDelayProbability();
//       const complexity = Math.min(1, phaseDuties.length / 10); // Normalized complexity
//       const timeConstraint = Math.min(1, 14 / getDaysRemaining(phase)); // Time pressure

//       return (delayProb * 0.4) + (complexity * 0.3) + (timeConstraint * 0.3);
//     };

//     // Get days remaining
//     const getDaysRemaining = (phase: any): number => {
//       const today = new Date();
//       const endDate = new Date(phase.endDate);
//       return Math.max(1, (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//     };

//     // Calculate risk level
//     const getRiskLevel = (riskScore: number): 'low' | 'medium' | 'high' => {
//       if (riskScore > 0.7) return 'high';
//       if (riskScore > 0.4) return 'medium';
//       return 'low';
//     };

//     const riskScore = calculateRiskScore();
//     const delayProbability = calculateDelayProbability();

//     return {
//       id: phase.id,
//       name: phase.name,
//       startDate: new Date(phase.startDate),
//       endDate: new Date(phase.endDate),
//       probability: Math.round((1 - riskScore) * 100),
//       suggestedBuffer: Math.ceil(riskScore * 14), // Days of buffer
//       risk: getRiskLevel(riskScore),
//       delayProbability: Math.round(delayProbability * 100),
//       completionRate: Math.round(calculateCompletionRate()),
//       duties: phaseDuties
//     };
//   };

//   useEffect(() => {
//     if (phases && projectDuties) {
//       const phasePredictions = phases
//         .map(predictPhase)
//         .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
//       setPredictions(phasePredictions);
//     }
//   }, [phases, projectDuties]);

//   const getTimelineColor = (risk: 'low' | 'medium' | 'high'): string => {
//     switch (risk) {
//       case 'high': return 'red';
//       case 'medium': return 'orange';
//       case 'low': return 'green';
//       default: return 'blue';
//     }
//   };

//   return (
//     <Card title={
//       <Space>
//         <CalendarOutlined style={{ color: '#1890ff' }} />
//         <Text strong>AI Timeline Predictions</Text>
//       </Space>
//     }>
//       <Timeline>
//         {predictions.map(phase => (
//           <Timeline.Item 
//             key={phase.id}
//             color={getTimelineColor(phase.risk)}
//             dot={phase.risk === 'high' ? <WarningOutlined /> : undefined}
//           >
//             <Space direction="vertical" style={{ width: '100%' }}>
//               <Space align="center" justify="space-between" style={{ width: '100%' }}>
//                 <Text strong>{phase.name}</Text>
//                 <Tag color={getTimelineColor(phase.risk)}>
//                   {phase.probability}% Confidence
//                 </Tag>
//               </Space>

//               <Space size="small">
//                 <Tag icon={<ClockCircleOutlined />} color="blue">
//                   Buffer: {phase.suggestedBuffer} days
//                 </Tag>
//                 <Tooltip title="Probability of delay based on historical data">
//                   <Tag icon={<WarningOutlined />} color="orange">
//                     Delay Risk: {phase.delayProbability}%
//                   </Tag>
//                 </Tooltip>
//                 <Tag icon={<CheckCircleOutlined />} color="cyan">
//                   Progress: {phase.completionRate}%
//                 </Tag>
//               </Space>

//               <Progress 
//                 percent={phase.completionRate}
//                 size="small"
//                 status={phase.risk === 'high' ? 'exception' : 'active'}
//               />

//               <Alert
//                 message={
//                   phase.risk === 'high' 
//                     ? `High Risk: Consider adding ${phase.suggestedBuffer} days buffer`
//                     : phase.risk === 'medium'
//                     ? `Medium Risk: Monitor closely, ${phase.suggestedBuffer} days buffer recommended`
//                     : `Low Risk: On track, ${phase.suggestedBuffer} days buffer suggested`
//                 }
//                 type={phase.risk === 'high' ? 'error' : phase.risk === 'medium' ? 'warning' : 'success'}
//                 showIcon
//                 style={{ width: '100%' }}
//               />
//             </Space>
//           </Timeline.Item>
//         ))}
//       </Timeline>
//     </Card>
//   );
// };

// export default TimelinePredictor; 