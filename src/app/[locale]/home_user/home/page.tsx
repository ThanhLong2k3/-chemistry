'use client';

import {
  Button,
  Card,
  Col,
  Flex,
  Image,
  Layout,
  List,
  Menu,
  Row,
  Typography,
} from 'antd';
import React from 'react';

import styles from './ScienceForumHomepage.module.scss';
import { BookOutlined } from '@ant-design/icons';
import { Key } from 'lucide-react';
import SliderShowSection from '@/modules/systems/manage-web/home-user/slider-show/SlideShow';
import { useRouter } from 'next/navigation';
import LessonDetail from '@/modules/systems/manage-web/components/lessonDetail/LessonDetail';
import BlogItem from '@/modules/systems/manage-web/home-user/blog/blog';
import { LESSON_DETAIL_PATH, LESSON_LIST_PATH } from '@/path';


const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Meta } = Card;

const ScienceForumHomepage: React.FC = () => {
  const router = useRouter();

  const subjectData = [
    {
      id: 1,
      name: 'Hóa học 10',
      description:
        'Khám phá cấu trúc nguyên tử, bảng tuần hoàn và phản ứng hoá học cơ bản. \n- Tìm hiểu về các nguyên tố hoá học và tính chất của chúng.\n- Nắm vững các khái niệm cơ bản về phản ứng hoá học và cân bằng phương trình.\n- Hiểu rõ về các loại liên kết hoá học và ảnh hưởng của chúng đến tính chất vật lý và hoá học của chất. \n - Làm quen với các phương pháp thí nghiệm cơ bản trong hoá học.',
      image: 'https://img.loigiaihay.com/picture/2024/0123/1_5.png',
      lessons: [
        'Giới thiệu về môn học',
        'Số học cơ bản',
        'Đại số và phương trình',
        'Ứng dụng trong thực tế',
      ],
    },
    {
      id: 2,
      name: 'Hóa học 11',
      description: 'Tìm hiểu liên kết hóa học, động học và nhiệt hóa học.',
      image: 'https://img.loigiaihay.com/picture/2024/0123/1.png',
      lessons: [
        'Giới thiệu về môn học',
        'Số học cơ bản',
        'Đại số và phương trình',
        'Ứng dụng trong thực tế',
      ],
    },
    {
      id: 3,
      name: 'Hóa học 12',
      description:
        'Tổng hợp kiến thức nâng cao về hữu cơ, vô cơ và kỹ năng giải bài tập.',
      image:
        'https://docx.com.vn/storage/uploads/documents/4ffaff7d4e13f0a51d85f271216490c8/bg1.png',
      lessons: [
        'Giới thiệu về môn học',
        'Số học cơ bản',
        'Đại số và phương trình',
        'Ứng dụng trong thực tế',
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
  const handleOpenLessonList=(id:number)=>{
      router.push(`${LESSON_LIST_PATH}/${id}`);
  }
  const handleOpenLessonDetail=(id:number | string)=>{
      router.push(`${LESSON_DETAIL_PATH}/${id}`);
  }
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

        {subjectData.map((subject,index) => (
          <div className={`${styles.subjectsection} ${ index % 2 === 0 ? styles.even_background : styles.odd_background}`} key={index }>
            <div className={styles.subjectconten}>
              {/* Title Section - Centered at top */}
              <Title level={1} className={styles.sectionTitle}>
                {subject.name}
              </Title>

              {/* Main Content Area */}
              <div className={styles.subject_main_content}>
                {/* Image Section */}
                <div className={styles.subject_image_section}>
                  <div className={styles.image_container}>
                    <Image
                      src={subject.image}
                      alt={subject.name}
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
                        {line}
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
                    dataSource={subject.lessons}
                    renderItem={(lesson, index) => (
                      <List.Item className={styles.lessonItem} onClick={()=>handleOpenLessonDetail(lesson)}>
                        <BookOutlined className={styles.lessonIcon} />
                        <div className={styles.lesson_content} >
                          <strong>Bài {index + 1}:</strong>&nbsp;{lesson}
                        </div>
                      </List.Item>
                    )}
                  />
                    <Button type="primary" className={styles.subjectButton} onClick={()=>handleOpenLessonList(subject.id)}>
                    Xem bài học
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <BlogItem />
      </Content>
    </Layout>
  );
};

export default ScienceForumHomepage;
