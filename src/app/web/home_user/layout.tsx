'use client';

import '@/assets/scss/_global.scss';
import SmartChatComponent from '@/components/UI_shared/SmartChat';
import Footer_User from '@/modules/systems/manage-web/home-user/footer-user/footer';
import Header_User from '@/modules/systems/manage-web/home-user/header-user/header';
import {
  ADVISORY_BOARD_PATH,
  BLOG_LIST_PATH,
  HOME_PATH,
  PERIODIC_TABLE_PATH,
  EXAM_LIST_PATH,
} from '@/path';
import { Home_Api } from '@/services/home.service';
import {
  BookOutlined,
  ExperimentOutlined,
  FacebookOutlined,
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import env from '@/env';

const Home_User = ({ children }: { children: React.ReactNode }) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    GetSubjectsWithLessons();
  }, []);

  const GetSubjectsWithLessons = async () => {
    try {
      const res = await Home_Api.GetSubjectsWithLessons();
      const rawData = res?.data.data || [];

      const cleaned = rawData.map((subject:any) => ({
        ...subject,
        lessons: Array.isArray(subject.lessons) ? subject.lessons : [],
      }));

      const staticMenuItems = [
        { key: HOME_PATH, icon: <HomeOutlined />, label: 'TRANG CHỦ' },
        { key: ADVISORY_BOARD_PATH, icon: <UserOutlined />, label: 'BAN TƯ VẤN' },
        { key: 'facebook-link', icon: <FacebookOutlined />, label: 'HOẠT ĐỘNG' },
        { key: BLOG_LIST_PATH, icon: <FileTextOutlined />, label: 'BÀI VIẾT' },
        { key: PERIODIC_TABLE_PATH, icon: <ExperimentOutlined />, label: 'BẢNG TUẦN HOÀN' },
      ];
      const dynamicMenuItems = cleaned.map((subject:any) => {

        const subjectKey = subject.subject_name.toLowerCase().replace(/\s+/g, '-');
        const children = [
          { key: `${EXAM_LIST_PATH}/${subject.subject_id}`, label: 'Đề kiểm tra' },
          { key: subject.flip_workbook  ? `${subject.flip_workbook }`:`${env.BASE_URL}${subject.workbook}`, label: 'Vở bài tập' },
          { key:  subject.flip_exercise_book   ? `${subject.flip_exercise_book  }`:`${env.BASE_URL}${subject.exercise_book}`, label: 'Sách bài tập' },
          { key: subject.flip_textbook    ? `${subject.flip_textbook   }`:`${env.BASE_URL}${subject.textbook }`, label: 'Sách giáo khoa' },
        ];

        return {
          key: subjectKey,
          icon: <BookOutlined />,
          label: subject.subject_name.toUpperCase(),
          children,
        };
      });

      setMenuItems([...staticMenuItems, ...dynamicMenuItems]);
    } catch (err) {
      console.error('Lỗi khi lấy subject data:', err);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header_User menuItems={menuItems} />
      {children}
      <Footer_User menuItems={menuItems} />
      <SmartChatComponent />
    </Layout>
  );
};

export default Home_User;
