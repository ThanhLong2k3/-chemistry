'use client';
import style from './footer.module.scss';
import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  FacebookOutlined,
  FileTextOutlined,
  ExperimentOutlined,
  BookOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Footer } = Layout;
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
          {/* Cột 1: Liên hệ */}
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Liên hệ
            </Title>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <Space align="start">
                <EnvironmentOutlined
                  style={{ color: '#1890ff', fontSize: '16px' }}
                />
                <Text style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                  Xã Liên Nghĩa, huyện Văn Giang, tỉnh Hưng Yên
                </Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text style={{ color: '#9ca3af' }}>
                 contact@vuihochoa.edu.vn
                </Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text style={{ color: '#9ca3af' }}>0971 079 331</Text>
              </Space>
            </div>
          </Col>

          {/* Cột 2: Danh mục */}
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Danh mục
            </Title>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Space>
                <HomeOutlined style={{ color: '#9ca3af', fontSize: '14px' }} />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Trang chủ
                </Text>
              </Space>
              <Space>
                <UserOutlined style={{ color: '#9ca3af', fontSize: '14px' }} />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Ban tư vấn
                </Text>
              </Space>
              <Space>
                <FacebookOutlined
                  style={{ color: '#9ca3af', fontSize: '14px' }}
                />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Hoạt động
                </Text>
              </Space>
              <Space>
                <FileTextOutlined
                  style={{ color: '#9ca3af', fontSize: '14px' }}
                />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Blog
                </Text>
              </Space>
              <Space>
                <ExperimentOutlined
                  style={{ color: '#9ca3af', fontSize: '14px' }}
                />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Bảng tuần hoàn
                </Text>
              </Space>
              <Space>
                <BookOutlined style={{ color: '#9ca3af', fontSize: '14px' }} />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Hóa 10
                </Text>
              </Space>
              <Space>
                <BookOutlined style={{ color: '#9ca3af', fontSize: '14px' }} />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Hóa 11
                </Text>
              </Space>
              <Space>
                <BookOutlined style={{ color: '#9ca3af', fontSize: '14px' }} />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Hóa 12
                </Text>
              </Space>
            </div>
          </Col>

          {/* Cột 3: Theo dõi chúng tôi */}
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Theo dõi chúng tôi
            </Title>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fdiendanhoahoc.2023&tabs=timeline,events,messages&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="100%"
                  height="125"
                  style={{ border: 'none', overflow: 'hidden' }}
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
              <Space>
                <GlobalOutlined
                  style={{
                    color: '#1890ff',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>
                  Website
                </Text>
              </Space>
              <Paragraph
                style={{
                  color: '#9ca3af',
                  lineHeight: '1.6',
                  marginTop: '16px',
                }}
              >
                Kết nối với chúng tôi để nhận thông tin mới nhất về các khóa học
                và tài liệu học tập.
              </Paragraph>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#374151', margin: '40px 0 20px' }} />

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#9ca3af' }}>
            © 2025 Chemistry Learning Platform. All rights reserved.
          </Text>
        </div>
      </Footer>
    </>
  );
};

export default Footer_User;
