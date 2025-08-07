'use client';

import { MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Image, Layout, Menu } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './header.module.scss';
import {
  ADVISORY_BOARD_PATH,
  BLOG_LIST_PATH,
  EXAM_LIST_PATH,
  HOME_PATH,
  LOGIN_PATH,
  PERIODIC_TABLE_PATH,
} from '@/path';
import GoogleTranslate from '@/modules/shared/GoogleTranslate';

const { Header } = Layout;

const Header_User = ({ menuItems }: { menuItems: any[] }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
 
  const internalPaths = [
  HOME_PATH,
  ADVISORY_BOARD_PATH,
  BLOG_LIST_PATH,
  PERIODIC_TABLE_PATH,
];

const handleMenuClick = ({ key }: { key: string }) => {
   if (
    internalPaths.includes(key) ||
    key.startsWith(`${EXAM_LIST_PATH}/`) 
  ) {
    router.push(key);
  } else {
    window.open(key, '_blank');
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
        <a href={LOGIN_PATH}>
          <Button
            style={{ marginRight: '10px', marginLeft: '10px' }}
            type="primary"
          >
            Đăng nhập
          </Button>
        </a>

        <MenuOutlined
          className={styles.hamburger}
          onClick={() => setDrawerVisible(true)}
        />
      </div>

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
