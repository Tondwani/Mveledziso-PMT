"use client";

import { Card, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

export default function TermsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2}>Terms of Service</Title>
      <Title level={4}>Last Updated: April 15, 2025</Title>
      
      <Card style={{ marginTop: 24 }}>
        <Title level={4}>1. Acceptance of Terms</Title>
        <Paragraph>
          By accessing or using the Mveledziso service, you agree to be bound by these Terms of Service.
        </Paragraph>
        
        <Title level={4}>2. Description of Service</Title>
        <Paragraph>
          Mveledziso provides a project management platform that enables teams to collaborate on projects,
          track tasks, and manage timelines.
        </Paragraph>
        
        <Title level={4}>3. User Responsibilities</Title>
        <Paragraph>
          <Text strong>3.1</Text> You are responsible for maintaining the confidentiality of your account.
        </Paragraph>
        <Paragraph>
          <Text strong>3.2</Text> You agree not to use the service for any illegal or unauthorized purpose.
        </Paragraph>
        
        <Title level={4}>4. Intellectual Property</Title>
        <Paragraph>
          The service and its original content, features, and functionality are owned by Mveledziso and are
          protected by international copyright, trademark, and other intellectual property laws.
        </Paragraph>
        
        <Title level={4}>5. Termination</Title>
        <Paragraph>
          We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever.
        </Paragraph>
        
        <Title level={4}>6. Limitation of Liability</Title>
        <Paragraph>
          Mveledziso shall not be liable for any indirect, incidental, special, consequential or punitive damages.
        </Paragraph>
        
        <Title level={4}>7. Governing Law</Title>
        <Paragraph>
          These Terms shall be governed by the laws of the State of Delaware without regard to its conflict of law provisions.
        </Paragraph>
      </Card>
    </div>
  );
}