'use client';
import React from 'react';
import { Card, Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const FeaturesSection = ({ features }: { features: any[] }) => {
  return (
    <div style={{ padding: '120px 5%', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <Title
          level={2}
          style={{
            color: '#0d448a',
            marginBottom: '24px',
            fontSize: '2.5rem',
          }}
        >
          Tính năng nổi bật
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
          Những công cụ mạnh mẽ giúp bạn quản lý gia phả một cách hiệu quả và chuyên nghiệp
        </Paragraph>
      </div>

      <Row gutter={[40, 40]}>
        {features.map((feature, index) => (
          <Col xs={24} md={12} lg={8} key={index}>
            <Card
              style={{
                textAlign: 'center',
                height: '100%',
                border: '1px solid #e1e1e1',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(13, 68, 138, 0.08)',
                padding: '20px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              bodyStyle={{ padding: '40px 32px' }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(13, 68, 138, 0.15)';
                e.currentTarget.style.borderColor = '#284973';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(13, 68, 138, 0.08)';
                e.currentTarget.style.borderColor = '#e1e1e1';
              }}
            >
                {feature.icon}

              <Title level={4} style={{ marginBottom: '20px', color: '#0d448a', fontSize: '20px' }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: '#6b7280', lineHeight: '1.7', fontSize: '16px' }}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default FeaturesSection;
