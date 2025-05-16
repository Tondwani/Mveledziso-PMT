"use client";

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG } from './config';
import { Upload, Button, Input, Card, Alert, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload/interface';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';

interface AnalysisResponse {
  answer: string;
  recommendations: string[];
}

export default function TaskAnalyzerPage() {
  const [question, setQuestion] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handlePDFUpload = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done' && info.file.originFileObj) {
      setPdfFile(info.file.originFileObj);
      message.success('PDF uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error('Failed to upload PDF');
    }
  };

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeTask = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!API_CONFIG.GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please check your environment variables.');
      }

      const genAI = new GoogleGenerativeAI(API_CONFIG.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      let prompt = `Task Analysis Request:
      Question: ${question}
      
      Please provide:
      1. A detailed answer to the question
      2. Practical recommendations for improvement or next steps`;

      if (pdfFile) {
        try {
          const reader = new FileReader();
          const text = await new Promise<string>((resolve, reject) => {
            reader.onload = (e) => {
              if (e.target?.result) {
                const pdfText = e.target.result as string;
                // For actual PDF text extraction, you would need to implement proper PDF parsing
                // This is a placeholder that will work with text files
                resolve(pdfText);
              } else {
                reject(new Error('Failed to read file'));
              }
            };
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(pdfFile);
          });

          prompt += `\n\nAdditional context from uploaded document:\n${text}`;
        } catch (error) {
          console.error('Error extracting PDF text:', error);
          prompt += '\n\nNote: Failed to extract text from PDF. Analysis will proceed without document context.';
        }
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response?.text() || '';
      
      if (!text) {
        throw new Error('Failed to get response from AI model');
      }

      const analysisData = parseAnalysis(text);
      setAnalysis(analysisData);
    } catch (err) {
      setError('Failed to analyze task. Please check the console for more details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysis = (text: string): AnalysisResponse => {
    try {
      const answerMatch = text.match(/answer.*?:\s*([\s\S]*?)(?=recommendations|$)/i);
      const recommendationsMatch = text.match(/recommendations.*?:\s*([\s\S]*?)(?=\n|$)/i);

      const answer = answerMatch?.[1]?.trim() || 'No answer found';
      const recommendations = recommendationsMatch?.[1]?.split('\n').filter(Boolean) || 
        ['No recommendations found'];

      return {
        answer,
        recommendations
      };
    } catch (error) {
      console.error('Error parsing analysis:', error);
      return {
        answer: 'Failed to parse analysis. Please try again.',
        recommendations: []
      };
    }
  };

  return (
    <div className="task-analyzer-container">
      <style jsx global>{`
        .task-analyzer-container {
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .task-analyzer-content {
          padding: 24px;
        }

        .upload-section {
          margin-bottom: 24px;
        }

        .uploaded-file {
          color: #666;
          margin-top: 8px;
        }

        .question-section {
          margin-bottom: 24px;
        }

        .analysis-results {
          margin-top: 24px;
        }
        
        .answer-section h4,
        .recommendations-section h4 {
          margin: 16px 0 8px;
          color: #1890ff;
        }
        
        .recommendations-section ul {
          list-style-type: disc;
          padding-left: 20px;
        }
      `}</style>
      <Card title="Task Analyzer">
        <div className="task-analyzer-content">
          <div className="upload-section">
            <Upload
              accept=".pdf"
              beforeUpload={() => false}
              onChange={handlePDFUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Task Document (PDF)</Button>
            </Upload>
            {pdfFile && (
              <p className="uploaded-file">File: {pdfFile.name}</p>
            )}
          </div>

          <div className="question-section">
            <Input.TextArea
              placeholder="Ask a question about your task..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              style={{ marginBottom: 16 }}
            />
          </div>

          <Button
            type="primary"
            onClick={analyzeTask}
            disabled={!question.trim()}
            loading={loading}
            style={{ marginBottom: 16 }}
          >
            Analyze Task
          </Button>

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

          {analysis && (
            <div className="analysis-results">
              <h3>Analysis Results:</h3>
              <div className="answer-section">
                <h4>Answer:</h4>
                <p>{analysis.answer}</p>
              </div>
              <div className="recommendations-section">
                <h4>Recommendations:</h4>
                <ul>
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
