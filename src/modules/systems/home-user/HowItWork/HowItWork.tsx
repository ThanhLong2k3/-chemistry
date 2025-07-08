'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Steps } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const HowItWork = ({ steps }: { steps: any[] }) => {
  const [countSteps, setCountSteps] = useState<number>(0);
  useEffect(()=>{
    setCountSteps(steps.length);
  },[steps])
  return (
    <>
      <div style={{ padding: '120px 5%', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Title
            level={2}
            style={{
              color: '#0d448a',
              marginBottom: '24px',
              fontSize: '2.5rem',
            }}
          >
            Cách thức hoạt động
          </Title>
          <Paragraph
            style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}
          >
            Chỉ {countSteps} bước đơn giản để có một gia phả điện tử hoàn chỉnh
          </Paragraph>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Steps
            direction="vertical"
            size="default"
            current={4}
            items={steps.map((step: any, index: number) => ({
              title: (
                <Text
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#0d448a',
                  }}
                >
                  {step.title}
                </Text>
              ),
              description: (
                <Text
                  style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    lineHeight: '1.6',
                  }}
                >
                  {step.description}
                </Text>
              ),
              icon: (
                <CheckCircleOutlined
                  style={{ color: '#284973', fontSize: '24px' }}
                />
              ),
            }))}
          />
        </div>
      </div>
    </>
  );
};
export default HowItWork;
