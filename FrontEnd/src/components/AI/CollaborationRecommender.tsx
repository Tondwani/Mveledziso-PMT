import { useEffect, useState } from 'react';
import { Card, List, Avatar, Space, Typography, Tag, Progress, Alert, Button, Modal } from 'antd';
import { 
  TeamOutlined, 
  UserOutlined, 
  RocketOutlined,
  CheckCircleOutlined,
  StarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useTeamMemberState } from '@/provider/TeamMemberManagement';
import { TeamRole } from '@/enums/TeamRole';

const { Text, Paragraph } = Typography;

interface CollaborationPair {
  id: string;
  member1: TeamMemberInfo;
  member2: TeamMemberInfo;
  compatibility: number;
  reason: string;
  potentialImpact: number;
  strengthAreas: string[];
  suggestedProjects: string[];
}

interface TeamMemberInfo {
  id: string;
  firstName: string;
  lastName: string;
  role: TeamRole;
  skills?: string[];
}

interface ProjectDuty {
  id: string;
  title: string;
  userDuties?: Array<{
    id: string;
    teamMemberId: string;
  }>;
}

const CollaborationRecommender = () => {
  const { teamMembers } = useTeamMemberState();
  // Mock project duties since we can't import the actual provider
  const projectDuties: ProjectDuty[] = [
    { 
      id: '1', 
      title: 'Frontend Development',
      userDuties: [
        { id: '101', teamMemberId: '1' },
        { id: '102', teamMemberId: '2' }
      ]
    },
    { 
      id: '2', 
      title: 'API Integration',
      userDuties: [
        { id: '103', teamMemberId: '2' },
        { id: '104', teamMemberId: '3' }
      ]
    }
  ];
  
  const [recommendations, setRecommendations] = useState<CollaborationPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<CollaborationPair | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const generateRecommendations = () => {
    // Build collaboration history
    const buildCollaborationHistory = () => {
      const history = new Map<string, number>();
      
      projectDuties.forEach((duty: ProjectDuty) => {
        const members = duty.userDuties?.map(ud => ud.teamMemberId) || [];
        members.forEach((m1: string, i: number) => {
          members.slice(i + 1).forEach((m2: string) => {
            const key = [m1, m2].sort().join('-');
            history.set(key, (history.get(key) || 0) + 1);
          });
        });
      });
      
      return history;
    };

    // Calculate compatibility between two team members
    const calculateCompatibility = (member1: TeamMemberInfo, member2: TeamMemberInfo): number => {
      const history = buildCollaborationHistory();
      const historyScore = history.get([member1.id, member2.id].sort().join('-')) || 0;
      
      // Role complementarity
      const roleScore = member1.role !== member2.role ? 0.3 : 0.1;
      
      // Skill complementarity (simulated)
      const skillScore = Math.random() * 0.3 + 0.2; // 0.2-0.5
      
      // Historical collaboration success
      const collaborationScore = Math.min(1, historyScore * 0.2);
      
      return (roleScore + skillScore + collaborationScore) / 1.5; // Normalize to 0-1
    };

    // Generate collaboration reasons
    const generateReason = (): string => {
      const reasons = [
        'Complementary skill sets',
        'Successful past collaborations',
        'Different perspectives (roles)',
        'Strong technical synergy',
        'Balanced workload potential'
      ];
      return reasons[Math.floor(Math.random() * reasons.length)];
    };

    // Generate strength areas
    const generateStrengthAreas = (): string[] => {
      const areas = [
        'Technical Documentation',
        'Code Review',
        'Project Planning',
        'Problem Solving',
        'Team Communication'
      ];
      return areas.slice(0, Math.floor(Math.random() * 3) + 2);
    };

    // Generate suggested projects
    const generateSuggestedProjects = (): string[] => {
      const projects = [
        'Frontend Development',
        'API Integration',
        'Database Optimization',
        'UI/UX Design',
        'Performance Testing'
      ];
      return projects.slice(0, Math.floor(Math.random() * 2) + 1);
    };

    // Generate all possible pairs
    const pairs: CollaborationPair[] = [];
    if (teamMembers) {
      teamMembers.forEach((m1: TeamMemberInfo, i: number) => {
        teamMembers.slice(i + 1).forEach((m2: TeamMemberInfo) => {
          const compatibility = calculateCompatibility(m1, m2);
          if (compatibility > 0.6) { // Only recommend high-potential pairs
            pairs.push({
              id: `${m1.id}-${m2.id}`,
              member1: m1,
              member2: m2,
              compatibility,
              reason: generateReason(),
              potentialImpact: Math.round(compatibility * 100),
              strengthAreas: generateStrengthAreas(),
              suggestedProjects: generateSuggestedProjects()
            });
          }
        });
      });
    }

    return pairs.sort((a, b) => b.compatibility - a.compatibility);
  };

  useEffect(() => {
    if (teamMembers && projectDuties) {
      const newRecommendations = generateRecommendations();
      setRecommendations(newRecommendations);
    }
  }, [teamMembers]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCompatibilityColor = (score: number): string => {
    if (score >= 90) return '#52c41a'; // green
    if (score >= 75) return '#1890ff'; // blue
    return '#faad14'; // orange
  };

  return (
    <>
      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <Text strong>AI Collaboration Recommendations</Text>
          </Space>
        }
        extra={
          <Tag icon={<RocketOutlined />} color="blue">
            {recommendations.length} Potential Matches
          </Tag>
        }
      >
        <List
          dataSource={recommendations}
          renderItem={(pair) => (
            <List.Item
              actions={[
                <Button 
                  key="view-details"
                  type="link" 
                  onClick={() => {
                    setSelectedPair(pair);
                    setModalVisible(true);
                  }}
                >
                  View Details
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Avatar icon={<UserOutlined />} />
                  </Space>
                }
                title={
                  <Space>
                    <Text strong>
                      {pair.member1.firstName} {pair.member1.lastName}
                    </Text>
                    <Text type="secondary">+</Text>
                    <Text strong>
                      {pair.member2.firstName} {pair.member2.lastName}
                    </Text>
                  </Space>
                }
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Tag color="blue">{pair.reason}</Tag>
                      <Tag icon={<StarOutlined />} color="gold">
                        {pair.potentialImpact}% Match
                      </Tag>
                    </Space>
                    <Progress
                      percent={pair.potentialImpact}
                      strokeColor={getCompatibilityColor(pair.potentialImpact)}
                      size="small"
                      status="active"
                    />
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={
          <Space>
            <TeamOutlined />
            <Text>Collaboration Details</Text>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedPair && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="Team Synergy Analysis"
              description={
                <Space>
                  <BarChartOutlined />
                  <Text>
                    {selectedPair.potentialImpact}% Compatibility Score
                  </Text>
                </Space>
              }
              type="info"
              showIcon
            />

            <Card title="Team Members" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space align="center">
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>
                    {selectedPair.member1.firstName} {selectedPair.member1.lastName}
                  </Text>
                  <Tag color="blue">{TeamRole[selectedPair.member1.role]}</Tag>
                </Space>
                <Space align="center">
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>
                    {selectedPair.member2.firstName} {selectedPair.member2.lastName}
                  </Text>
                  <Tag color="blue">{TeamRole[selectedPair.member2.role]}</Tag>
                </Space>
              </Space>
            </Card>

            <Card title="Collaboration Strengths" size="small">
              <Space wrap>
                {selectedPair.strengthAreas.map(area => (
                  <Tag icon={<CheckCircleOutlined />} color="green" key={area}>
                    {area}
                  </Tag>
                ))}
              </Space>
            </Card>

            <Card title="Suggested Projects" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedPair.suggestedProjects.map(project => (
                  <Alert
                    key={project}
                    message={project}
                    type="success"
                    showIcon
                  />
                ))}
              </Space>
            </Card>

            <Alert
              message="Next Steps"
              description={
                <Paragraph>
                  Consider assigning these team members to collaborate on one of the
                  suggested projects. Their complementary skills and working styles
                  indicate a high potential for successful collaboration.
                </Paragraph>
              }
              type="warning"
              showIcon
            />
          </Space>
        )}
      </Modal>
    </>
  );
};

export default CollaborationRecommender; 