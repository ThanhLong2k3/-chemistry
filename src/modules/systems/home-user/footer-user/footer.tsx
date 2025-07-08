"use client"
import style from './footer.module.scss';
import React from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Steps,
  Divider
} from 'antd';
import {
  FallOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  YoutubeOutlined
} from '@ant-design/icons';

const {  Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const Footer_User = () => {
  return (
    <>
      <Footer
        style={{
          background: '#1f2937',
          color: 'white',
          padding: '60px 5% 30px',
        }}
      >
        <Row gutter={[48, 32]}>
          <Col xs={24} md={8}>
            <div style={{ marginBottom: '24px' }}>
              <FallOutlined
                style={{
                  fontSize: '32px',
                  color: '#1890ff',
                  marginRight: '12px',
                }}
              />
              <Text
                style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}
              >
                Gia Phả Việt
              </Text>
            </div>
            <Paragraph style={{ color: '#9ca3af', lineHeight: '1.6' }}>
              Nền tảng quản lý gia phả hiện đại, giúp kết nối các thế hệ và lưu
              giữ truyền thống văn hóa Việt Nam.
            </Paragraph>
            <Space size="large">
              <FacebookOutlined
                style={{ fontSize: '24px', color: '#9ca3af' }}
              />
              <YoutubeOutlined style={{ fontSize: '24px', color: '#9ca3af' }} />
            </Space>
          </Col>

          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Liên kết nhanh
            </Title>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                Tính năng
              </Text>
              <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                Bảng giá
              </Text>
              <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                Hướng dẫn
              </Text>
              <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                Hỗ trợ
              </Text>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Liên hệ
            </Title>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Space>
                <PhoneOutlined style={{ color: '#9ca3af' }} />
                <Text style={{ color: '#9ca3af' }}>1900 1234</Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#9ca3af' }} />
                <Text style={{ color: '#9ca3af' }}>info@giaphaviet.com</Text>
              </Space>
              <Space>
                <GlobalOutlined style={{ color: '#9ca3af' }} />
                <Text style={{ color: '#9ca3af' }}>www.giaphaviet.com</Text>
              </Space>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#374151', margin: '40px 0 20px' }} />

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#9ca3af' }}>
            © 2025 Gia Phả Việt. Thực hiện bởi AI Academy.
          </Text>
        </div>
      </Footer>
    </>
  );
};
export default Footer_User;
