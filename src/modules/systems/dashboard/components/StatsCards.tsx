'use client';

import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Skeleton, Typography } from 'antd';
import { UserOutlined, ReadOutlined, BookOutlined, AppstoreOutlined } from '@ant-design/icons';
import React from 'react';
import { getDashboardStats } from '@/services/dashboard.service';
import { IDashboardStats } from '@/types/dashboard';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { useNotification } from '@/components/UI_shared/Notification';
import { ADMIN_MANAGE_ACCOUNT_PATH, ADMIN_MANAGE_BLOG_PATH, ADMIN_MANAGE_LESSON_PATH, ADMIN_MANAGE_SUBJECT_PATH } from '@/path';

const { Title, Text } = Typography;

export const StatsCards = () => {
    const { show } = useNotification();
    const [stats, setStats] = useState<IDashboardStats>({
        studentCount: 0,
        blogCount: 0,
        lessonCount: 0,
        subjectCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error: any) {
                //lỗi validation của Antd Form có thuộc tính `errorFields`, nếu là lỗi validation thì không cần hiển thị thông báo lỗi.
                // Antd sẽ tự động hiển thị lỗi trên form.
                if (error && error.errorFields) {
                    console.log('Validation Failed:', error.errorFields[0].errors[0]);
                    return;
                }

                let errorMessage = "Đã có lỗi không xác định xảy ra.";

                if (axios.isAxiosError(error)) {
                    const axiosError = error; // TypeScript hiểu đây là AxiosError
                    const responseMessage = axiosError.response?.data?.message;

                    if (axiosError.response?.status === 401) {
                        showSessionExpiredModal();
                        return;
                    } else {
                        errorMessage = responseMessage || axiosError.message;
                    }
                }
                else if (error instanceof Error) {
                    errorMessage = error.message;
                }

                // Chỉ hiển thị notification cho các lỗi không phải 401
                show({
                    result: 1,
                    messageError: errorMessage,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cardData = [
        {
            title: "Học sinh",
            value: stats.studentCount,
            icon: <UserOutlined />,
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            path: ADMIN_MANAGE_ACCOUNT_PATH
        },
        {
            title: "Bài viết",
            value: stats.blogCount,
            icon: <UserOutlined />,
            color: "linear-gradient(135deg, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)",
            path: ADMIN_MANAGE_BLOG_PATH
        },
        {
            title: "Bài học",
            value: stats.lessonCount,
            icon: <UserOutlined />,
            color: "linear-gradient(135deg, #21D4FD 0%, #B721FF 100%)",
            path: ADMIN_MANAGE_LESSON_PATH
        },
        {
            title: "Môn học",
            value: stats.subjectCount,
            icon: <UserOutlined />,
            color: "linear-gradient(135deg, #2AF598 0%, #009EFD 100%)",
            path: ADMIN_MANAGE_SUBJECT_PATH
        },
    ];

    return (
        <Row gutter={[24, 24]}>
            {cardData.map((item, index) => (
                <Col key={index} xs={24} sm={12} md={12} lg={6}>
                    <Skeleton loading={loading} active avatar={{ shape: 'square' }} paragraph={{ rows: 2 }}>
                        <Card
                            style={{
                                background: item.color,
                                color: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                            }}
                            hoverable
                            onClick={() => window.location.href = item.path}
                        >

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <Text style={{ fontSize: '18px', fontWeight: 500, color: 'white' }}>
                                        {item.title}
                                    </Text>
                                </div>

                                <div>
                                    <Title level={2} style={{ color: 'white', margin: 0, fontSize: '34px', fontWeight: 'bold' }}>
                                        {item.value}
                                    </Title>
                                </div>
                            </div>


                        </Card>
                    </Skeleton>
                </Col>
            ))
            }
        </Row >
    );
};