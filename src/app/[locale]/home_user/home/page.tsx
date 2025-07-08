'use client';

import { Card, Col, Image, Layout, Menu, Row, Typography } from 'antd';
import React from 'react';

import styles from './ScienceForumHomepage.module.scss';

const {  Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Meta } = Card;

const ScienceForumHomepage: React.FC = () => {
  
  const chapterData = [
    {
      title: 'CHƯƠNG 1: NGUYÊN TỬ',
      backgroundImage:
        'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/img-2736.png',
      lessons: [
        {
          title: 'BÀI 4: ÔN TẬP CHƯƠNG 1',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/nguyen-to-hoa-hoc-la-gi-1-1.jpg',
        },
        {
          title: 'BÀI 3: CẤU TRÚC LỚP VỎ ELECTRON NGUYÊN TỬ',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/51-background-powerpoint-hoa-hoc-hinh-nen-hoa-hoc-full-hd-18.jpg',
        },
        {
          title: 'BÀI 2: NGUYÊN TỐ HÓA HỌC',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/lien-ket-cong-hoa-tri-5.jpg',
        },
        {
          title: 'BÀI 1: THÀNH PHẦN NGUYÊN TỬ',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/c3429ab5006bc6be47eb4b055562f7b0.jpg',
        },
      ],
    },
    {
      title: 'CHƯƠNG 2: BẢNG TUẦN HOÀN',
      backgroundImage:
        'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/img-2734.png',
      lessons: [
        {
          title: 'BÀI 9: ÔN TẬP CHƯƠNG 2',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/51-background-powerpoint-hoa-hoc-hinh-nen-hoa-hoc-full-hd-18.jpg',
        },
        {
          title: 'BÀI 5: CẤU TẠO CỦA BẢNG TUẦN HOÀN CÁC NGUYÊN TỐ HÓA HỌC',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/nguyen-to-moi.jpg',
        },
        {
          title:
            'BÀI 8: ĐỊNH LUẬT TUẦN HOÀN, Ý NGHĨA CỦA BẢNG TUẦN HOÀN NGUYÊN TỐ',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/12-06-2022-18-10-33-bang-tuan-hoan-cac-nguyen-to-hoa-hoc-0.jpg',
        },
      ],
    },
    {
      title: 'CHƯƠNG 3: LIÊN KẾT HÓA HỌC',
      backgroundImage:
        'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/img-2730.png',
      lessons: [
        {
          title: 'BÀI 14: ÔN TẬP CHƯƠNG 3',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/360-f-136556031-xam5sua0lutnnkk67tnrst8yhcnglchi.jpg',
        },
        {
          title: 'BÀI 12: LIÊN KẾT CỘNG HÓA TRỊ',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/665309f1f88366img.jpg',
        },
        {
          title: 'BÀI 11: LIÊN KẾT ION',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/cau-tao-hat-nhan-nguyen-tu.jpg',
        },
        {
          title: 'BÀI 10: QUY TẮC OCTET',
          image:
            'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/c3429ab5006bc6be47eb4b055562f7b0.jpg',
        },
      ],
    },
  ];

  const features = [
    {
      icon: 'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/photo-64214fdae275cbd3a98b457b-1-1680495379.jpg',
      title: 'ĐA DẠNG NỘI DUNG',
      description:
        'Cung cấp đa dạng nội dung các câu hỏi trắc nghiệm dưới nhiều hình thức khác nhau',
    },
    {
      icon: 'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/question-flat-rounded-icon-vector-10501685.jpg',
      title: 'MA TRẬN CÂU HỎI',
      description:
        'Hệ thống dựa vào ma trận câu hỏi phong phú để tự tổng hợp thành trắc nghiệm',
    },
    {
      icon: 'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/free-circular-star-icon-isolated-sticker-badge-logo-design-elements-p8abj8.jpg',
      title: 'MIỄN PHÍ',
      description: 'Truy cập hệ thống tài nguyên hoàn toàn miễn phí',
    },
    {
      icon: 'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/green-tick-icon-on-white-background-check-vector-19755588.jpg',
      title: 'BÀI THI',
      description:
        'Nguồn bài thi chất lượng đã được sàng lọc với đầy đủ đáp án đi kèm',
    },
    {
      icon: 'https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/rs1.png',
      title: 'HỌC MỌI LÚC MỌI NƠI',
      description:
        'Chỉ cần có điện thoại máy tính bảng, laptop hoặc TV kết nối Internet',
    },
  ];

  return (
    <Layout className={styles.layout}>
      

      <Content className={styles.content}>
       

        {/* Chapter Sections */}
        {chapterData.map((chapter, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={styles.chapterSection}
            style={{
              backgroundImage: `url(${chapter.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className={styles.chapterContent}>
              <Title level={2} className={styles.chapterTitle}>
                {chapter.title}
              </Title>
              <Row gutter={[24, 24]} className={styles.lessonsRow}>
                {chapter.lessons.map((lesson, lessonIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Col xs={24} sm={12} md={8} lg={6} key={lessonIndex}>
                    <Card
                      hoverable
                      cover={
                        <div className={styles.lessonImageContainer}>
                          <Image
                            src={lesson.image}
                            alt={lesson.title}
                            className={styles.lessonImage}
                            preview={false}
                          />
                        </div>
                      }
                      className={styles.lessonCard}
                    >
                      <Meta
                        title={lesson.title}
                        className={styles.lessonMeta}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        ))}

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <Title level={2} className={styles.sectionTitle}>
            TRẮC NGHIỆM THÔNG MINH
          </Title>
          <Row gutter={[32, 32]} className={styles.featuresRow}>
            {features.map((feature, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Col xs={24} sm={12} md={8} lg={4} key={index}>
                <Card
                  hoverable
                  className={styles.featureCard}
                  cover={
                    <div className={styles.featureIconContainer}>
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        className={styles.featureIcon}
                        preview={false}
                      />
                    </div>
                  }
                >
                  <Meta
                    title={feature.title}
                    description={feature.description}
                    className={styles.featureMeta}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        
      </Content>
    </Layout>
  );
};

export default ScienceForumHomepage;
