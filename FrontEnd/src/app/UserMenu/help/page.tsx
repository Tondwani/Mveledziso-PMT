"use client";

import { Card, Typography, Collapse } from 'antd';
import React from 'react';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function HelpPage() {
  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2}>Help Center</Title>
      
      <Card title="Getting Started">
        <Paragraph>
          Welcome to Mveledziso! Here&apos;s how to get started with our project management tool.
        </Paragraph>
        
        <Collapse accordion>
          <Panel header="How do I create a new project?" key="1">
            <Text>
              To create a new project, click the &quot;New Project&quot; button on the Projects page. 
              Fill in the required details including project name, description, team assignment, 
              and timeline. Click &quot;Create Project&quot; when done.
            </Text>
          </Panel>
          <Panel header="How do I add team members to a project?" key="2">
            <Text>
              Navigate to the project details page and click on the &quot;Team&quot; tab. 
              From there you can add existing team members or invite new ones via email.
            </Text>
          </Panel>
          <Panel header="How do I track project progress?" key="3">
            <Text>
              Each project has a progress bar showing overall completion. You can also 
              view individual task completion in the Tasks tab. Milestones will show 
              key deliverables and their status.
            </Text>
          </Panel>
        </Collapse>
      </Card>
      
      <Card title="Troubleshooting" style={{ marginTop: 24 }}>
        <Collapse accordion>
          <Panel header="I can't access a project" key="4">
            <Text>
              Project access is controlled by your team permissions. If you can&apos;t access 
              a project, contact your team administrator or the project owner to request access.
            </Text>
          </Panel>
          <Panel header="My changes aren't saving" key="5">
            <Text>
              Ensure you have a stable internet connection. If the problem persists, 
              try refreshing the page. If you continue to experience issues, contact 
              our support team.
            </Text>
          </Panel>
        </Collapse>
      </Card>
      
      <Card title="Contact Support" style={{ marginTop: 24 }}>
        <Paragraph>
          <Text strong>Email:</Text> info@mveledziso.com
        </Paragraph>
        <Paragraph>
          <Text strong>Phone:</Text> +27 (76) 229 0023
        </Paragraph>
        <Paragraph>
          <Text strong>Hours:</Text> Monday-Friday, 9am-5pm EST
        </Paragraph>
      </Card>
    </div>
  );
}