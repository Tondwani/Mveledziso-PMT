"use client";

import { useState, useEffect, useRef, KeyboardEvent, useCallback } from "react";
import { Card, Col, Row, Button, Input, Avatar, Popover, message } from "antd";
import { SoundOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";

// Define TypeScript interfaces for our data structures
interface StatItem {
  title: string;
  value: number;
  key: string;
}

interface ConversationMessage {
  speaker: string;
  text: string;
}

// Define interfaces for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Create a type for our SpeechRecognition
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

// Create a type for the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
}

const StatCards = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { title: "Active Projects", value: 8, key: "projects" },
    { title: "Pending Tasks", value: 23, key: "tasks" },
    { title: "Completed Goals", value: 12, key: "goals" },
    { title: "Team Members", value: 5, key: "team" },
  ]);

  const [aiQuery, setAiQuery] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const speechRecognition = useRef<SpeechRecognitionInstance | null>(null);
  const synth = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const addToConversation = (speaker: string, text: string) => {
    setConversation(prev => [...prev, { speaker, text }]);
  };

  const speak = (text: string) => {
    if (synth.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      synth.current.speak(utterance);
      addToConversation("AI", text);
    }
  };

  // Use useCallback to memoize the function so it doesn't change on each render
  const handleAIQuery = useCallback((query: string) => {
    addToConversation("You", query);
    
    // Simple AI response logic - extend with real API calls as needed
    const lowerQuery = query.toLowerCase();
    let response = "";

    if (lowerQuery.includes("active project") || lowerQuery.includes("projects")) {
      const count = stats.find(s => s.key === "projects")?.value;
      response = `You currently have ${count} active projects.`;
    } 
    else if (lowerQuery.includes("task") || lowerQuery.includes("pending")) {
      const count = stats.find(s => s.key === "tasks")?.value;
      response = `There are ${count} pending tasks across all projects.`;
    }
    else if (lowerQuery.includes("goal") || lowerQuery.includes("complete")) {
      const count = stats.find(s => s.key === "goals")?.value;
      response = `Your team has completed ${count} major goals this quarter.`;
    }
    else if (lowerQuery.includes("team") || lowerQuery.includes("member")) {
      const count = stats.find(s => s.key === "team")?.value;
      response = `Your project team consists of ${count} members.`;
    }
    else if (lowerQuery.includes("summary") || lowerQuery.includes("overview")) {
      response = `Here's your project summary: ${stats[0].value} active projects, ${stats[1].value} pending tasks, ${stats[2].value} completed goals, with ${stats[3].value} team members.`;
    }
    else {
      response = "I can help you with project stats. Try asking about active projects, pending tasks, completed goals, or team members.";
    }

    speak(response);
  }, [stats]); // Add stats as dependency

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Type-safe way to access browser APIs
      const SpeechRecognition = 
        (window as Window & typeof globalThis & { 
          SpeechRecognition?: SpeechRecognitionConstructor,
          webkitSpeechRecognition?: SpeechRecognitionConstructor 
        }).SpeechRecognition || 
        (window as Window & typeof globalThis & { 
          SpeechRecognition?: SpeechRecognitionConstructor,
          webkitSpeechRecognition?: SpeechRecognitionConstructor 
        }).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        speechRecognition.current = new SpeechRecognition();
        speechRecognition.current.continuous = false;
        speechRecognition.current.interimResults = false;
        
        speechRecognition.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setAiQuery(transcript);
          handleAIQuery(transcript);
        };
        
        speechRecognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
      }
    }
  }, [handleAIQuery]); // Include handleAIQuery in dependencies

  const startListening = () => {
    if (speechRecognition.current) {
      speechRecognition.current.start();
      setIsListening(true);
      message.info("Listening... Speak now");
    } else {
      message.error("Speech recognition not supported in your browser");
    }
  };

  const stopListening = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
      setIsListening(false);
    }
  };

  const updateStat = (key: string, newValue: number) => {
    setStats(prev => prev.map(stat => 
      stat.key === key ? { ...stat, value: newValue } : stat
    ));
    speak(`Updated ${key} to ${newValue}`);
  };

  const handleEnterKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAIQuery(aiQuery);
      setAiQuery("");
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Stats Cards with Interactive Controls */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} md={6} key={stat.title}>
            <Card
              title={stat.title}
              variant="borderless"
              style={{ borderRadius: 10, textAlign: "center" }}
              extra={
                <Popover 
                  content={
                    <div style={{ padding: 8 }}>
                      <Input 
                        type="number"
                        min={0} 
                        defaultValue={stat.value.toString()} 
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            updateStat(stat.key, value);
                          }
                        }}
                        style={{ marginBottom: 8 }}
                      />
                    </div>
                  }
                  trigger="click"
                >
                  <Button size="small" type="text">✏️</Button>
                </Popover>
              }
            >
              <h2 style={{ fontSize: 28, margin: "12px 0" }}>{stat.value}</h2>
              <Button 
                icon={<SoundOutlined />} 
                type="text" 
                onClick={() => speak(`${stat.title}: ${stat.value}`)}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* AI Assistant Section */}
      <Card
        title={
          <span>
            <RobotOutlined style={{ marginRight: 8 }} />
            Project AI Assistant
          </span>
        }
        variant="borderless"
        style={{ borderRadius: 10, marginTop: 24 }}
      >
        <div style={{ marginBottom: 16 }}>
          <Input.TextArea
            placeholder="Ask about your project stats..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={handleEnterKey}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <Button 
              type="primary" 
              onClick={() => {
                handleAIQuery(aiQuery);
                setAiQuery("");
              }}
            >
              Ask AI
            </Button>
            <Button 
              icon={<SoundOutlined />} 
              onClick={isListening ? stopListening : startListening}
              danger={isListening}
            >
              {isListening ? "Stop Listening" : "Voice Input"}
            </Button>
          </div>
        </div>

        {/* Conversation History */}
        <div style={{ 
          border: '1px solid #f0f0f0', 
          borderRadius: 8, 
          padding: 16,
          maxHeight: 300,
          overflowY: 'auto'
        }}>
          {conversation.length === 0 ? (
            <div style={{ color: '#999', textAlign: 'center' }}>
              Start a conversation with your project AI
            </div>
          ) : (
            conversation.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  marginBottom: 12,
                  display: 'flex',
                  flexDirection: msg.speaker === "You" ? 'row-reverse' : 'row',
                  gap: 8
                }}
              >
                <Avatar 
                  icon={msg.speaker === "You" ? <UserOutlined /> : <RobotOutlined />} 
                  style={{ 
                    backgroundColor: msg.speaker === "You" ? '#1890ff' : '#f56a00'
                  }}
                />
                <div 
                  style={{ 
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: msg.speaker === "You" ? '#e6f7ff' : '#f5f5f5',
                    maxWidth: '70%'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default StatCards;