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
  HOME_PATH,
  PERIODIC_TABLE_PATH,
  REVIEW_FILE_PDF_PATH,
} from '@/path';
import { searchSubject } from '@/services/subject.service';
import { Home_Api } from '@/libs/api/home.api';
import GoogleTranslate from '@/modules/shared/GoogleTranslate';

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
      { key: 'blog', icon: <FileTextOutlined />, label: 'BLOG' },
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
          key: `1`,
          label: 'Đề kiểm tra',
          onClick: () =>
            handleSubjectItemClick(subject.subject_id, 'dekiemtra'),
        },
        {
          key: `2`,
          label: 'Vở bài tập',
          onClick: (e: any) => {
            e.domEvent.stopPropagation();
            handleWorkbookClick(subject.workbook);
          },
        },
        {
          key: `3`,
          label: 'Sách bài tập',
          onClick: (e: any) => {
            e.domEvent.stopPropagation();
            handleExerciseBookClick(subject.exercise_book);
          },
        },
        {
          key: `4`,
          label: 'Sách giáo khoa',
          onClick: (e: any) => {
            e.domEvent.stopPropagation();
            handleTextbookClick(subject.textbook);
          },
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
    } else if (!['1', '2', '3', '4'].includes(key)) {
      router.push(`${key}`);
    }

    setDrawerVisible(false);
  };

  // Xử lý click cho các mục của môn học
  const handleSubjectItemClick = (subjectId: string, type: string) => {
    router.push(`/subject/${subjectId}/${type}`);
    setDrawerVisible(false);
  };

  // Xử lý click cho workbook
  const handleWorkbookClick = (workbookUrl: string | null) => {
    if (workbookUrl) {
      window.open(workbookUrl, '_blank');
    } else {
      console.log('Vở bài tập chưa có sẵn');
      // Có thể hiển thị notification hoặc message
    }
    setDrawerVisible(false);
  };

  // Xử lý click cho exercise book
  const handleExerciseBookClick = (exerciseBookUrl: string | null) => {
    if (exerciseBookUrl) {
      window.open(exerciseBookUrl, '_blank');
    } else {
      console.log('Sách bài tập chưa có sẵn');
    }
    setDrawerVisible(false);
  };

  // Xử lý click cho textbook
  const handleTextbookClick = (textbookUrl: string | null) => {
    if (textbookUrl) {
      window.open(textbookUrl, '_blank');
    } else {
      console.log('Sách giáo khoa chưa có sẵn');
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
        <a href="/vi/auth/login">
          <Button style={{ marginRight: '10px' }} type="primary">
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
