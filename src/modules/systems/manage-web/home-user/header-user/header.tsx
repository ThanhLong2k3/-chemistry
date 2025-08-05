'use client';

import {
  BookOutlined,
  ExperimentOutlined,
  FacebookOutlined,
  FileTextOutlined,
  HomeOutlined,
  ReadOutlined,
  UserOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Image, Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './header.module.scss';
import {
  ADVISORY_BOARD_PATH,
  BLOG_LIST_PATH,
  EXAM_LIST_PATH,
  HOME_PATH,
  LOGIN_PATH,
  PERIODIC_TABLE_PATH,
  REVIEW_FILE_PDF_PATH,
} from '@/path';
import { searchSubject } from '@/services/subject.service';
import GoogleTranslate from '@/modules/shared/GoogleTranslate';
import { Home_Api } from '@/services/home.service';
import env from '@/env';

const { Header } = Layout;

const Header_User = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    GetSubjectsWithLessons();
  }, []);

  const GetSubjectsWithLessons = async () => {
    try {
      const res = await Home_Api.GetSubjectsWithLessons();
      const rawData = res?.data.data;

      if (Array.isArray(rawData)) {
        const cleaned = rawData.map((subject) => ({
          ...subject,
          lessons: Array.isArray(subject.lessons) ? subject.lessons : [],
        }));
        console.log('Subject Data', cleaned);
        setSubjectData(cleaned);
        buildMenuItems(cleaned);
      } else {
        setSubjectData([]);
        buildMenuItems([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy subject data:', err);
      setSubjectData([]);
      buildMenuItems([]);
    }
  };

  const buildMenuItems = (subjects: any[]) => {
    // Menu cố định
    const staticMenuItems = [
      { key: HOME_PATH, icon: <HomeOutlined />, label: 'TRANG CHỦ' },
      { key: ADVISORY_BOARD_PATH, icon: <UserOutlined />, label: 'BAN TƯ VẤN' },
      { key: 'facebook-link', icon: <FacebookOutlined />, label: 'HOẠT ĐỘNG' },
      { key: BLOG_LIST_PATH, icon: <FileTextOutlined />, label: 'BLOG' },
      {
        key: PERIODIC_TABLE_PATH,
        icon: <ExperimentOutlined />,
        label: 'BẢNG TUẦN HOÀN',
      },
    ];

    // Menu động từ API
    const dynamicMenuItems = subjects.map((subject) => {
      const subjectKey = subject.subject_name
        .toLowerCase()
        .replace(/\s+/g, '-');

      // Tạo submenu cho từng môn học
      const children = [
        {
          key: `${EXAM_LIST_PATH}${subject.id}`,
          label: 'Đề kiểm tra',
        },
        {
          key: `${env.BASE_URL}${subject.workbook}`,
          label: 'Vở bài tập',
        },
        {
          key: `${env.BASE_URL}${subject.exercise_book}`,
          label: 'Sách bài tập',
        },
        {
          key: ` ${env.BASE_URL}${subject.textbook}`,
          label: 'Sách giáo khoa',
        },
      ];

      return {
        key: subjectKey,
        icon: <BookOutlined />,
        label: subject.subject_name.toUpperCase(),
        children: children,
      };
    });

    // Kết hợp menu cố định và động
    const allMenuItems = [...staticMenuItems, ...dynamicMenuItems];
    setMenuItems(allMenuItems);
  };

  // Xử lý click cho các mục menu
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'facebook-link') {
      window.open('https://www.facebook.com/diendanhoahoc.2023', '_blank');
    }
    else if (!['1', '2', '3', '4'].includes(key)) {
      router.push(`${key}`);
    }

    setDrawerVisible(false);
  };

  

  return (
    <Header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <Image
            src="https://file.unica.vn/storage/37c75fa5c5064eaf537629a6373082628b69b224/395374478-648703620778409-6977458858086740057-n-01-01-1.png"
            alt="Diễn đàn Hóa học"
            className={styles.logoImage}
            preview={false}
          />
        </div>

        <Menu
          theme="light"
          mode="horizontal"
          items={menuItems}
          className={styles.menu}
          onClick={handleMenuClick}
        />
        <GoogleTranslate />
        {/* Button đăng nhập */}
        <a href={LOGIN_PATH}>
          <Button style={{ marginRight: '10px', marginLeft:'10px' }} type="primary">
            Đăng nhập
          </Button>
        </a>

        <MenuOutlined
          className={styles.hamburger}
          onClick={() => setDrawerVisible(true)}
        />
      </div>

      {/* Drawer menu cho mobile */}
      <Drawer
        title="Danh mục"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          selectable={false}
        />
      </Drawer>
    </Header>
  );
};

export default Header_User;
