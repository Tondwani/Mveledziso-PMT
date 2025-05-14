"use client";

import { Card, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

export default function PrivacyPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2}>Privacy Policy</Title>
      <Title level={4}>Last Updated: June 15, 2023</Title>
      
      <Card style={{ marginTop: 24 }}>
        <Paragraph>
          Mveledziso (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the Mveledziso project management platform (the &quot;Service&quot;).
        </Paragraph>
        
        <Title level={4}>1. Information We Collect</Title>
        <Paragraph>
          <Text strong>1.1 Personal Data:</Text> While using our Service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or identify you.
        </Paragraph>
        <Paragraph>
          <Text strong>1.2 Usage Data:</Text> We may collect information how the Service is accessed and used.
        </Paragraph>
        
        <Title level={4}>2. Use of Data</Title>
        <Paragraph>
          Mveledziso uses the collected data for various purposes including to provide and maintain our Service,
          to notify you about changes to our Service, and to provide customer support.
        </Paragraph>
        
        <Title level={4}>3. Data Protection</Title>
        <Paragraph>
          We implement appropriate technical and organizational measures to protect your personal data.
        </Paragraph>
        
        <Title level={4}>4. Cookies</Title>
        <Paragraph>
          We use cookies and similar tracking technologies to track activity on our Service.
        </Paragraph>
        
        <Title level={4}>5. Service Providers</Title>
        <Paragraph>
          We may employ third party companies to facilitate our Service, provide the Service on our behalf,
          or assist us in analyzing how our Service is used.
        </Paragraph>
        
        <Title level={4}>6. Changes to This Policy</Title>
        <Paragraph>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting
          the new Privacy Policy on this page.
        </Paragraph>
        
        <Title level={4}>7. Contact Us</Title>
        <Paragraph>
          If you have any questions about this Privacy Policy, please contact us at privacy@mveledziso.com.
        </Paragraph>
      </Card>
    </div>
  );
}