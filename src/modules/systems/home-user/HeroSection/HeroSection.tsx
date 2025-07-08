'use client';
import React from 'react';
import {  Button, Typography, Space } from 'antd';
import { BranchesOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const HeroSection = () => {
  return (
    <>
      <div
        style={{
          background:
            'linear-gradient(135deg, #0d448a 0%, #284973 50%, #1a3357 100%)',
          padding: '120px 5% 100px',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
            opacity: 0.1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Title
            level={1}
            style={{
              color: 'white',
              fontSize: '4rem',
              marginBottom: '32px',
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Kết nối dòng họ
            <br />
            <span style={{ color: '#8abbff' }}>Lưu giữ truyền thống</span>
          </Title>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: '22px',
              maxWidth: '700px',
              margin: '0 auto 48px',
              lineHeight: '1.6',
              fontWeight: '400',
            }}
          >
            Nền tảng quản lý gia phả hiện đại giúp bạn xây dựng cây gia đình,
            lưu trữ lịch sử tổ tiên và kết nối với họ hàng trên toàn thế giới
          </Paragraph>
          <Space size="large" style={{ marginBottom: '60px' }}>
            <Button
              type="primary"
              size="large"
              style={{
                height: '56px',
                fontSize: '18px',
                background: 'white',
                color: '#284973',
                border: 'none',
                fontWeight: 'bold',
                padding: '0 40px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              icon={<RightOutlined />}
            >
              Bắt đầu ngay - Miễn phí
            </Button>
            <Button
              size="large"
              style={{
                height: '56px',
                fontSize: '18px',
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.6)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0 40px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
            >
              Xem demo
            </Button>
          </Space>

          {/* Hero Illustration */}
          <div
            style={{
              marginTop: '60px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '60px',
              maxWidth: '900px',
              margin: '60px auto 0',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                borderRadius: '16px',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0d448a',
              }}
            >
              <BranchesOutlined style={{ fontSize: '120px', opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HeroSection;
