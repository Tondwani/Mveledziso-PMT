
"use client";

import { Card, Col, Row } from "antd";

const StatCards = () => {
  const stats = [
    { title: "Active Projects", value: 8 },
    { title: "Pending Duties", value: 23 },
    { title: "Completed Milestones", value: 12 },
    { title: "Team Members", value: 5 },
  ];

  return (
    <Row gutter={16}>
      {stats.map((stat) => (
        <Col xs={24} sm={12} md={6} key={stat.title}>
          <Card
            title={stat.title}
            bordered={false}
            style={{ borderRadius: 10, textAlign: "center" }}
          >
            <h2>{stat.value}</h2>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatCards;
