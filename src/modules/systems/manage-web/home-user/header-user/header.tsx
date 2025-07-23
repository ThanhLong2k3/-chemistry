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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './header.module.scss';
import { ADVISORY_BOARD_PATH, HOME_PATH, PERIODIC_TABLE_PATH } from '@/path';

const { Header } = Layout;

const Header_User = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  const menuItems = [
    { key: HOME_PATH, icon: <HomeOutlined />, label: 'TRANG CHỦ' },
    { key: ADVISORY_BOARD_PATH, icon: <UserOutlined />, label: 'BAN TƯ VẤN' },
    { key: 'facebook-link', icon: <FacebookOutlined />, label: 'HOẠT ĐỘNG' },
    { key: 'blog', icon: <FileTextOutlined />, label: 'BLOG' },
    {
      key: PERIODIC_TABLE_PATH,
      icon: <ExperimentOutlined />,
      label: 'BẢNG TUẦN HOÀN',
    },
    {
      key: 'hoa-10',
      icon: <BookOutlined />,
      label: 'HÓA 10',
      children: [
        { key: 'hoa10-dekiemtra', label: 'Đề kiểm tra' },
        { key: 'hoa10-vbt', label: 'Vở bài tập' },
        { key: 'hoa10-sbt', label: 'Sách bài tập' },
        { key: 'hoa10-sgk', label: 'Sách giáo khoa' },
      ],
    },
    {
      key: 'hoa-11',
      icon: <BookOutlined />,
      label: 'HÓA 11',
      children: [
        { key: 'hoa11-dekiemtra', label: 'Đề kiểm tra' },
        { key: 'hoa11-vbt', label: 'Vở bài tập' },
        { key: 'hoa11-sbt', label: 'Sách bài tập' },
        { key: 'hoa11-sgk', label: 'Sách giáo khoa' },
      ],
    },
    {
      key: 'hoa-12',
      icon: <BookOutlined />,
      label: 'HÓA 12',
      children: [
        { key: 'hoa12-dekiemtra', label: 'Đề kiểm tra' },
        { key: 'hoa12-vbt', label: 'Vở bài tập' },
        { key: 'hoa12-sbt', label: 'Sách bài tập' },
        { key: 'hoa12-sgk', label: 'Sách giáo khoa' },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'facebook-link') {
      window.open('https://www.facebook.com/diendanhoahoc.2023', '_blank');
    } else {
      router.push(`${key}`);
    }
    setDrawerVisible(false); // đóng drawer khi click
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

        {/* Button đăng nhập */}
        <a href="/vi/auth/login"><Button type="primary" >Đăng nhập</Button></a>

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
