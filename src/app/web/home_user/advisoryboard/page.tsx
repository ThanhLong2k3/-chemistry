'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Tag,
  Row,
  Col,
  Typography,
  Avatar,
  Space,
  Pagination,
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  BankOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import styles from './AdvisoryBoard.module.scss';
import HeaderTitle from '@/modules/systems/manage-web/components/header_title/header_title';
import { IAdvisoryMember } from '@/types/advisory_member';
import { searchAdvisoryMember } from '@/services/advisory_member.service';
import env from '@/env';

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

const AdvisoryBoard: React.FC = () => {
  const [advisoryMembers, setadvisoryMembers] = useState<IAdvisoryMember[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalRecords, setTotalRecords] = useState();
  useEffect(() => {
    document.title = 'Ban tư vấn';
    getAllAdvisoryMember();
  },[currentPage]);

  const getAllAdvisoryMember = async () => {
    const data: any = await searchAdvisoryMember({
      page_index: currentPage,
      page_size: 9,
      order_type: 'ASC',
      search_content_1: null,
    });
    setadvisoryMembers(data.data || []);
    setTotalRecords(data.data[0].TotalRecords);
  };

  const getDegreeColor = (degree?: string | null) => {
    if (degree?.includes('Phó Giáo sư')) return '#1890ff';
    if (degree?.includes('Tiến sĩ')) return '#1890ff';
    if (degree?.includes('Thạc sĩ')) return '#52c41a';
    return '#1890ff';
  };

  const getExperienceColor = (years: number) => {
    if (years >= 15) return '#ff4d4f';
    if (years >= 10) return '#fa8c16';
    if (years >= 5) return '#1890ff';
    return '#1890ff';
  };
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
   
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
                    size={100}
                    src={
                      member.image
                        ? `${env.BASE_URL}${member.image}`
                        : '/default.png'
                    }
                    className={styles.avatar}
                  />
                </div>

                {/* Tên thành viên */}
                <Title level={4} className={styles.memberName}>
                  {member.teacher_name}
                </Title>

                {/* Thông tin chi tiết */}
                <div className={styles.infoSection}>
                  <div className={styles.infoRow}>
                    <BookOutlined className={styles.icon} />
                    <Text strong>Trình độ: </Text>
                    <Tag
                      color={getDegreeColor(member.qualification)}
                      className={styles.degreeTag}
                    >
                      {member.qualification}
                    </Tag>
                  </div>

                  <div className={styles.infoRow}>
                    <TeamOutlined className={styles.icon} />
                    <Text strong>Bộ môn:</Text>
                    <Text className={styles.department}>{member.subject}</Text>
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
                      <Tag color="#f0f0f0" className={styles.classTag}>
                        {member.in_charge}
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                  <Tag
                    color={getExperienceColor(member.years_of_experience)}
                    className={styles.experienceTag}
                  >
                    {member.years_of_experience} năm kinh nghiệm
                  </Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <div className={styles.paginationWrapper}>
          <Pagination
            current={currentPage}
            total={TotalRecords}
            pageSize={9}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default AdvisoryBoard;
