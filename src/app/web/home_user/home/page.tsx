'use client';

import {
  Button,
  Card,
  Image,
  Layout,
  List,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';

import styles from './ScienceForumHomepage.module.scss';
import { BookOutlined } from '@ant-design/icons';
import SliderShowSection from '@/modules/systems/manage-web/home-user/slider-show/SlideShow';
import { useRouter } from 'next/navigation';
import BlogItem from '@/modules/systems/manage-web/home-user/blog/blog';
import { LESSON_DETAIL_PATH, LESSON_LIST_PATH } from '@/path';
import { ISubject_Home } from '@/types/home';
import { searchBlog } from '@/services/blog.service';
import { IBlog } from '@/types/blog';
import { Home_Api } from '@/services/home.service';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Meta } = Card;

const ScienceForumHomepage: React.FC = () => {
  const router = useRouter();
  const [subjectData, setSubjectData] = useState<ISubject_Home[]>([]);
  const [blogData, setBlogData] = useState<IBlog[]>([]);

  useEffect(() => {
    document.title = 'Chemistry Forum - Trang chủ';
    GetSubjectsWithLessons();
    GetBlog();
  }, []);

  const GetBlog= async () => {
    const blog:any=await searchBlog({ page_index: 1, page_size: 10 });
    console.log("Baif Vieets",blog);
    setBlogData(blog?.data || []);
  }
  const GetSubjectsWithLessons = async () => {
  try {
    const res = await Home_Api.GetSubjectsWithLessons();
    const rawData = res?.data.data;

    if (Array.isArray(rawData)) {
      const cleaned = rawData.map((subject) => ({
        ...subject,
        lessons: Array.isArray(subject.lessons) ? subject.lessons : [],
      }));
      setSubjectData(cleaned);
    } else {
      setSubjectData([]);
    }
  } catch (err) {
    console.error('Lỗi khi lấy subject data:', err);
    setSubjectData([]);
  }
};


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
      description:
        'Truy cập hệ thống tài nguyên hoàn toàn miễn phí tư vấn tự động ',
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
  const handleOpenLessonList = (id: string) => {
    router.push(`${LESSON_LIST_PATH}/${id}`);
  };
  const handleOpenLessonDetail = (id: number | string) => {
    router.push(`${LESSON_DETAIL_PATH}/${id}`);
  };
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <SliderShowSection />

        <div className={styles.featuresSection}>
          <div className={styles.featuresContent}>
            <Title level={2} className={styles.sectionTitle}>
              {`TẠI SAO CHỌN "VUI HỌC HÓA" ?`}
            </Title>
            <div className={styles.featuresRow}>
              {features.map((feature, index) => (
                <Card
                  key={index}
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
              ))}
            </div>
          </div>
        </div>

        {subjectData?.map((subject, index) => (
          <div
            className={`${styles.subjectsection} ${
              index % 2 === 0 ? styles.even_background : styles.odd_background
            }`}
            key={index}
          >
            <div className={styles.subjectconten}>
              {/* Title Section - Centered at top */}
              <Title level={1} className={styles.sectionTitle}>
                {subject.subject_name}
              </Title>

              {/* Main Content Area */}
              <div className={styles.subject_main_content}>
                {/* Image Section */}
                <div className={styles.subject_image_section}>
                  <div className={styles.image_container}>
                    <Image
                      src={subject.image}
                      alt={subject.subject_name}
                      className={styles.subjectImage}
                      preview={false}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className={styles.subject_content_section}>
                  <div className={styles.content_body}>
                    {subject.description.split('\n').map((line, index) => (
                      <Paragraph
                        key={index}
                        className={styles.subjectDescription}
                      >
                        {parse(line)}
                      </Paragraph>
                    ))}
                  </div>
                </div>

                {/* Lesson List Section */}
                <div className={styles.subject_lesson_section}>
                  <div className={styles.lesson_title}>Danh sách bài học</div>

                  <List
                    className={styles.lessonList}
                    size="small"
                    dataSource={subject.lessons || []}
                    renderItem={(lesson, index) => (
                      <List.Item
                        className={styles.lessonItem}
                        onClick={() => handleOpenLessonDetail(lesson.id)}
                      >
                        <BookOutlined className={styles.lessonIcon} />
                        <div className={styles.lesson_content}>
                          {lesson.name}
                        </div>
                      </List.Item>
                    )}
                  />
                  <Button
                    type="primary"
                    className={styles.subjectButton}
                    onClick={() => handleOpenLessonList(subject.subject_id)}
                  >
                    Xem bài học
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <BlogItem blogData={blogData} />
      </Content>
    </Layout>
  );
};

export default ScienceForumHomepage;
