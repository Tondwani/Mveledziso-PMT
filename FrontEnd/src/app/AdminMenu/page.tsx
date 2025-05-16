"use client";

import React, { useState } from "react";
import { Typography } from "antd";
import StatCards from "@/components/dashboard/statCards";
import { useAuthState } from "../../provider/CurrentUserProvider"; 

const { Title } = Typography;

const MveledzisoPage = () => {
  const { currentUser } = useAuthState();
  console.error("Current User:", currentUser);
   // Get current user from context
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const baseColor = "#66ccff";
  const hoverColor = "#001f3f";

  const titleStyle = {
    color: isHovered ? hoverColor : baseColor,
    transition: "color 2s ease, transform 0.2s ease",
    transform: isPressed ? "scale(0.96)" : "scale(1)",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <Title
        level={3}
        style={titleStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        Welcome, {currentUser?.name || "Phanda nga Tshumelo"}!
      </Title>

      <StatCards />
    </div>
  );
};

export default MveledzisoPage;
