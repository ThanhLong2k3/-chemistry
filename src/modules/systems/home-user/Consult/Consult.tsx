'use client';
import React from 'react';
import {
  Button,
  Typography,
  Space,
} from 'antd';

const { Title, Paragraph } = Typography;
const Consult=()=>{
    return (
        <>
         <div
          style={{
            background: 'linear-gradient(135deg, #0d448a 0%, #284973 50%, #1a3357 100%)',
            padding: '100px 5%',
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
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Title level={2} style={{ color: 'white', marginBottom: '32px', fontSize: '2.5rem' }}>
              Sẵn sàng bắt đầu hành trình khám phá gia phả?
            </Title>
            <Paragraph
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '20px',
                marginBottom: '48px',
                maxWidth: '600px',
                margin: '0 auto 48px',
                lineHeight: '1.6',
              }}
            >
              Tham gia cùng hàng nghìn gia đình đã sử dụng nền tảng của chúng tôi
            </Paragraph>
            <Space size="large">
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
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                Dùng thử miễn phí 30 ngày
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
                Liên hệ tư vấn
              </Button>
            </Space>
          </div>
        </div>
        </>
    )
}
export default Consult;