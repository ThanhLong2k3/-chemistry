'use client';

import React from 'react';
import { Card, Tag, Row, Col, Typography, Avatar, Space } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  BankOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import styles from './AdvisoryBoard.module.scss';
import HeaderTitle from '@/modules/systems/manage-web/components/header_title/header_title';

const { Title, Text } = Typography;

interface AdvisoryMember {
  id: number;
  name: string;
  degree: string;
  department: string;
  classesInCharge: string[];
  workplace: string;
  yearsOfExperience: number;
  avatar?: string;
}

// Dữ liệu mẫu
const advisoryMembers: AdvisoryMember[] = [
  {
    id: 1,
    name: 'PGS.TS. Nguyễn Văn An',
    degree: 'Phó Giáo sư, Tiến sĩ',
    department: 'Khoa Công nghệ Thông tin',
    classesInCharge: ['CNTT-01', 'CNTT-02', 'CNTT-03'],
    workplace: 'Trường Đại học Bách khoa Hà Nội',
    yearsOfExperience: 15,
  },
  {
    id: 2,
    name: 'TS. Trần Thị Bình',
    degree: 'Tiến sĩ',
    department: 'Khoa Kinh tế',
    classesInCharge: ['KT-01', 'KT-02'],
    workplace: 'Trường Đại học Kinh tế Quốc dân',
    yearsOfExperience: 12,
  },
  {
    id: 3,
    name: 'ThS. Lê Minh Cường',
    degree: 'Thạc sĩ',
    department: 'Khoa Ngoại ngữ',
    classesInCharge: ['NN-01', 'NN-02', 'NN-03', 'NN-04'],
    workplace: 'Trường Đại học Ngoại ngữ - ĐHQGHN',
    yearsOfExperience: 8,
  },
  {
    id: 4,
    name: 'PGS.TS. Phạm Thị Dung',
    degree: 'Phó Giáo sư, Tiến sĩ',
    department: 'Khoa Y học',
    classesInCharge: ['Y-01', 'Y-02'],
    workplace: 'Trường Đại học Y Hà Nội',
    yearsOfExperience: 20,
  },
  {
    id: 5,
    name: 'TS. Hoàng Văn Em',
    degree: 'Tiến sĩ',
    department: 'Khoa Kỹ thuật',
    classesInCharge: ['KT-01', 'KT-02', 'KT-03'],
    workplace: 'Trường Đại học Công nghiệp',
    yearsOfExperience: 18,
  },
  {
    id: 6,
    name: 'ThS. Ngô Thị Phương',
    degree: 'Thạc sĩ',
    department: 'Khoa Luật',
    classesInCharge: ['L-01', 'L-02'],
    workplace: 'Trường Đại học Luật Hà Nội',
    yearsOfExperience: 10,
  },
];

const AdvisoryBoard: React.FC = () => {
  const getDegreeColor = (degree: string) => {
    if (degree.includes('Phó Giáo sư')) return '#1890ff';
    if (degree.includes('Tiến sĩ')) return '#1890ff';
    if (degree.includes('Thạc sĩ')) return '#52c41a';
    return '#1890ff';
  };


  const getExperienceColor = (years: number) => {
    if (years >= 15) return '#ff4d4f';
    if (years >= 10) return '#fa8c16';
    if (years >= 5) return '#1890ff';
    return '#1890ff';
  };

  return (
    <>
      <HeaderTitle title={'Ban tư vấn'} />
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            BAN TƯ VẤN
          </Title>
          <Text className={styles.subtitle}>
            Danh sách các thành viên ban tư vấn với kinh nghiệm và chuyên môn
            cao
          </Text>
        </div>

        <Row gutter={[20, 20]} className={styles.grid}>
          {advisoryMembers.map((member) => (
            <Col key={member.id} xs={24} sm={12} md={8} lg={8} xl={8}>
              <Card className={styles.memberCard}>
                {/* Header với avatar */}
                <div className={styles.cardHeader}>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    className={styles.avatar}
                  />
                </div>

                {/* Tên thành viên */}
                <Title level={4} className={styles.memberName}>
                  {member.name}
                </Title>

                {/* Thông tin chi tiết */}
                <div className={styles.infoSection}>
                  <div className={styles.infoRow}>
                    <BookOutlined className={styles.icon} />
                    <Text strong>Trình độ: </Text>
                    <Tag
                      color={getDegreeColor(member.degree)}
                      className={styles.degreeTag}
                    >
                      {member.degree}
                    </Tag>
                  </div>

                  <div className={styles.infoRow}>
                    <TeamOutlined className={styles.icon} />
                    <Text strong>Bộ môn:</Text>
                    <Text className={styles.department}>
                      {member.department}
                    </Text>
                  </div>

                  <div className={styles.infoRow}>
                    <BankOutlined className={styles.icon} />
                    <Text strong>Nơi công tác:</Text>
                    <Text className={styles.workplace} italic>
                      {member.workplace}
                    </Text>
                  </div>

                  {/* Lớp phụ trách */}
                  <div className={styles.classesSection}>
                    <Text strong className={styles.classesTitle}>
                      Lớp phụ trách:
                    </Text>
                    <div className={styles.classesContainer}>
                      {member.classesInCharge.map((className, index) => (
                        <Tag
                          key={index}
                          color="#f0f0f0"
                          className={styles.classTag}
                        >
                          {className}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <Tag
                    color={getExperienceColor(member.yearsOfExperience)}
                    className={styles.experienceTag}
                  >
                    {member.yearsOfExperience} năm kinh nghiệm
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default AdvisoryBoard;
