'use client';
import React from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Rate,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

const FeedBacks=({testimonials}:{testimonials:any})=>{
    
    return (
        <>
        <div style={{ padding: '120px 5%', background: '#f8fafc' }}>
                  <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <Title level={2} style={{ color: '#0d448a', marginBottom: '24px', fontSize: '2.5rem' }}>
                      Khách hàng nói gì về chúng tôi
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
                      Hàng nghìn gia đình đã tin tưởng sử dụng dịch vụ của chúng tôi
                    </Paragraph>
                  </div>
        
                  <Row gutter={[40, 40]}>
                    {testimonials.map((testimonial:any, index:number) => (
                      <Col xs={24} md={8} key={index}>
                        <Card
                          style={{
                            height: '100%',
                            border: '1px solid #e1e1e1',
                            borderRadius: '20px',
                            boxShadow: '0 8px 30px rgba(13, 68, 138, 0.08)',
                            transition: 'all 0.3s ease',
                          }}
                          bodyStyle={{ padding: '40px' }}
                          hoverable
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 16px 40px rgba(13, 68, 138, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(13, 68, 138, 0.08)';
                          }}
                        >
                          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Avatar
                              size={80}
                              src={testimonial.avatar}
                              style={{ marginBottom: '20px', border: '3px solid #e1e1e1' }}
                            />
                            <div>
                              <Text
                                strong
                                style={{ fontSize: '18px', display: 'block', color: '#0d448a' }}
                              >
                                {testimonial.name}
                              </Text>
                              <Text type="secondary" style={{ fontSize: '14px' }}>{testimonial.role}</Text>
                            </div>
                          </div>
                          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Rate
                              disabled
                              defaultValue={testimonial.rating}
                              style={{ color: '#284973' }}
                            />
                          </div>
                          <Paragraph
                            style={{
                              fontStyle: 'italic',
                              color: '#6b7280',
                              lineHeight: '1.7',
                              fontSize: '16px',
                              textAlign: 'center',
                            }}
                          >
                            {testimonial.content}
                          </Paragraph>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
        </>
    )
}
export default FeedBacks;