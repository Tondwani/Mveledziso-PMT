"use client";

import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Space, Divider, Tag, List } from 'antd';
import { WarningOutlined, CheckCircleOutlined, ClockCircleOutlined} from '@ant-design/icons';
const { GoogleGenerativeAI } = await import('@google/generative-ai');

// Initialize the Google Generative AI with your API key
const GEMINI_API_KEY = 'AIzaSyAqCcHNoVJWZ3mODBIRs5uiBkedHKVfacY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const { Title, Text } = Typography;
const { TextArea } = Input;

interface RiskPrediction {
  riskLevel: 'High' | 'Medium' | 'Low';
  description: string;
  probability: string;
  impact: string;
  mitigationStrategies: string[];
}

export default function ProjectRiskPredictor() {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<RiskPrediction[]>([]);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  // Function to analyze project risks using Gemini API
  const analyzeProjectRisks = async (values: {
    projectName: string;
    description: string;
    teamSize: string;
    timeline: string;
    budget: string;
    challenges: string;
  }) => {
    setLoading(true);
    setError('');
    
    try {
      // Use the newer model directly
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // or "gemini-1.5-pro"
      });
      
      console.log('Using model: gemini-1.5-flash');

      const prompt = `Analyze the following project details and provide risk predictions.
      Be specific and provide actionable insights.
      Format the response as a valid JSON array of objects with the following structure:
      [{
        "riskLevel": "High|Medium|Low",
        "description": "Brief description of the risk",
        "probability": "X%",
        "impact": "Impact level (Low/Medium/High)",
        "mitigationStrategies": ["strategy 1", "strategy 2", "strategy 3"]
      }]

      Project Details:
      - Project: ${values.projectName}
      - Description: ${values.description}
      - Team Size: ${values.teamSize}
      - Timeline: ${values.timeline} weeks
      - Budget: $${values.budget}
      - Known Challenges: ${values.challenges || 'None provided'}
      
      Provide 3-5 potential risks with their mitigation strategies.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse the response
      try {
        // Try to extract JSON from markdown code block if present
        const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : text;
        const parsedResponse = JSON.parse(jsonString);
        
        if (!Array.isArray(parsedResponse)) {
          throw new Error('Invalid response format from AI');
        }
        
        setPredictions(parsedResponse);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI response. The AI might have returned an unexpected format.');
      }
    } catch (err) {
      console.error('Error analyzing project risks:', err);
      let errorMessage = 'Failed to analyze project risks. ';
      
      if (err instanceof Error) {
        errorMessage += err.message;
        if (err.message.includes('API key not valid')) {
          errorMessage += ' Please check your API key in the Google AI Studio.';
        } else if (err.message.includes('quota')) {
          errorMessage += ' You might have exceeded your API quota. Please check your Google Cloud Console.';
        } else if (err.message.includes('model')) {
          errorMessage += ' There was an issue with the model. Try "gemini-1.5-pro" if "gemini-1.5-flash" doesn\'t work.';
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'blue';
    }
  };

  return (
    <Card 
      title={
        <Space>
          <WarningOutlined />
          <span>Project Risk Predictor</span>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={analyzeProjectRisks}
        disabled={loading}
        initialValues={{
          projectName: '',
          description: '',
          teamSize: '',
          timeline: '',
          budget: '',
          challenges: ''
        }}
      >
        {/* <Form.Item
          label="API Key Status"
        >
          <Alert 
            message="Using provided Gemini API key" 
            type="success" 
            showIcon 
            icon={<KeyOutlined />}
            style={{ marginBottom: 16 }}
          />
        </Form.Item> */}

        <Form.Item
          label="Project Name"
          name="projectName"
          rules={[{ required: true, message: 'Please input project name' }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item
          label="Project Description"
          name="description"
          rules={[{ required: true, message: 'Please provide project description' }]}
        >
          <TextArea rows={4} placeholder="Describe the project in detail" />
        </Form.Item>

        <Form.Item
          label="Team Size"
          name="teamSize"
          rules={[{ required: true, message: 'Please input team size' }]}
        >
          <Input type="number" min={1} placeholder="Number of team members" />
        </Form.Item>

        <Form.Item
          label="Project Timeline (weeks)"
          name="timeline"
          rules={[{ required: true, message: 'Please input project timeline' }]}
        >
          <Input type="number" min={1} placeholder="Estimated weeks to complete" />
        </Form.Item>

        <Form.Item
          label="Budget"
          name="budget"
          rules={[{ required: true, message: 'Please input project budget' }]}
        >
          <Input prefix="$" type="number" placeholder="Project budget" />
        </Form.Item>

        <Form.Item
          label="Known Challenges"
          name="challenges"
        >
          <TextArea rows={3} placeholder="List any known challenges or constraints" />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<WarningOutlined />}
          >
            Analyze Project Risks
          </Button>
        </Form.Item>
      </Form>

      {error && (
        <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} />
      )}

      {predictions.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>
            <ClockCircleOutlined /> Risk Predictions
          </Title>
          
          {predictions.map((prediction, index) => (
            <Card 
              key={index} 
              style={{ marginBottom: 16, borderLeft: `4px solid ${getRiskColor(prediction.riskLevel)}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <Tag color={getRiskColor(prediction.riskLevel)}>
                    {prediction.riskLevel} Risk
                  </Tag>
                  <Text strong>{prediction.description}</Text>
                </div>
                <div>
                  <Text type="secondary">Probability: {prediction.probability}</Text>
                </div>
              </div>
              
              <Text type="secondary">Impact: {prediction.impact}</Text>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <Text strong>Mitigation Strategies:</Text>
                <List
                  size="small"
                  dataSource={prediction.mitigationStrategies}
                  renderItem={item => (
                    <List.Item>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
