'use client';

import {
  BookOutlined,
  ExperimentOutlined,
  FacebookOutlined,
  FileTextOutlined,
  HomeOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Image, Layout, Menu } from 'antd';
import styles from './header.module.scss';

import { useRouter } from 'next/navigation';
import { ADVISORY_BOARD_PATH, HOME_PATH, PERIODIC_TABLE_PATH } from '@/path';

const { Header } = Layout;

const Header_User = () => {
  const menuItems = [
    { key: HOME_PATH, icon: <HomeOutlined />, label: 'TRANG CHỦ' },
    { key: ADVISORY_BOARD_PATH, icon: <UserOutlined />, label: 'BAN TƯ VẤN' },
    { key: 'facebook-link', icon: <FacebookOutlined />, label: 'HOẠT ĐỘNG' },
    { key: 'blog', icon: <FileTextOutlined />, label: 'BLOG' },
    { key: PERIODIC_TABLE_PATH, icon: <ExperimentOutlined />, label: 'BẢNG TUẦN HOÀN'},
    { key: 'tests', icon: <ReadOutlined />, label: 'ĐỀ KIỂM TRA' },
    { key: 'workbook', icon: <BookOutlined />, label: 'VỞ BÀI TẬP' },
    { key: 'textbook-10', icon: <BookOutlined />, label: 'SGK HÓA 10' },
    { key: 'exercise-book-10', icon: <BookOutlined />, label: 'SBT HÓA 10' },
  ];

  const router = useRouter();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'facebook-link') {
      window.open('https://www.facebook.com/diendanhoahoc.2023', '_blank');
    } else {
      router.push(`${key}`);
    }
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
      </div>
    </Header>
  );
};

export default Header_User;
