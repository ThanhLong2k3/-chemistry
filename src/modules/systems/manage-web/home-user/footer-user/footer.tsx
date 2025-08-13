'use client';

import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import {
  BookOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer_User = ({ menuItems }: { menuItems: any[] }) => {
  const router = useRouter();

  const handleClick = (key: string) => {
   
      router.push(key);
  };

  return (
    <Footer style={{ background: '#1f2937', color: 'white', padding: '60px 0 30px' }}>
      <div style={{ width: '80%', margin: '0 auto', padding: '24px' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Liên hệ
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Space align="start">
                <EnvironmentOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text style={{ color: '#9ca3af', lineHeight: '1.6' }}>
                  Xã Liên Nghĩa, huyện Văn Giang, tỉnh Hưng Yên
                </Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text style={{ color: '#9ca3af' }}>contact@vuihochoa.edu.vn</Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <Text style={{ color: '#9ca3af' }}>0971 079 331</Text>
              </Space>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Danh mục
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {menuItems.map((item) => (
                <Space key={item.key} onClick={() => handleClick(item.key)} style={{ cursor: 'pointer' }}>
                  {item.icon || <BookOutlined style={{ fontSize: '14px', color: '#9ca3af' }} />}
                  <Text style={{ color: '#9ca3af' }}>{item.label}</Text>
                </Space>
              ))}
            </div>
          </Col>

          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>
              Theo dõi chúng tôi
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fdiendanhoahoc.2023&tabs=timeline,events,messages&width=340&height=125&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="100%"
                height="125"
                style={{ border: 'none', overflow: 'hidden' }}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
              <Space>
                <GlobalOutlined style={{ color: '#1890ff', fontSize: '20px', cursor: 'pointer' }} />
                <Text style={{ color: '#9ca3af', cursor: 'pointer' }}>Website</Text>
              </Space>
              <Paragraph style={{ color: '#9ca3af', lineHeight: '1.6', marginTop: '16px' }}>
                Kết nối với chúng tôi để nhận thông tin mới nhất về các khóa học và tài liệu học tập.
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
      </div>
    </Footer>
  );
};

export default Footer_User;
