'use client';

import { Flex, Dropdown } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import styles from './Header.module.scss';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      // Xử lý đăng xuất
      console.log('Đăng xuất');
    } else if (e.key === 'settings') {
      // Điều hướng đến trang cài đặt
      console.log('Đi đến trang cài đặt');
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt thông tin cá nhân',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <div className={styles.topbar}>
          <div className="layout-client">
            <Flex
              className={styles.inner}
              align="center"
              justify="space-between"
            >
              {/* <LanguagesSwitcher /> */}
              <div className={styles.leftContent}>
                HỆ THỐNG QUẢN LÝ TÀI SẢN ACADEMY
              </div>
              <Dropdown
                menu={{ items: menuItems, onClick: handleMenuClick }}
                onOpenChange={setIsMenuOpen}
                open={isMenuOpen}
                trigger={['click']}
              >
                <div className={styles.rightContent}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  Thanh Long 2k3@
                </div>
              </Dropdown>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
