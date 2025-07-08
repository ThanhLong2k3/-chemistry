'use client'
import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined, HomeOutlined, BookOutlined, UsergroupAddOutlined, ApartmentOutlined, BranchesOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './Header.module.scss';

const Header_Admin_User: React.FC = () => {
  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'cong-duc',
      label: 'Công đức',
      icon: <BookOutlined />,
    },
    {
      key: 'hinh-anh',
      label: 'Hình ảnh',
      icon: <BookOutlined />,
    },
    {
      key: 'phu-khao',
      label: 'Phụ khảo',
      icon: <BookOutlined />,
    },
    {
      key: 'ngoai-pha',
      label: 'Ngoại phả',
      icon: <UsergroupAddOutlined />,
    },
  ];

  // Menu items chính
  const mainMenuItems: MenuProps['items'] = [
    {
      key: 'loi-noi-dau',
      label: 'Lời nói đầu',
      icon: <HomeOutlined />,
    },
    {
      key: 'pha-ky',
      label: 'Phả ký',
      icon: <BookOutlined />,
    },
    {
      key: 'pha-he',
      label: 'Phả hệ',
      icon: <UsergroupAddOutlined />,
    },
    {
      key: 'pha-do',
      label: 'Phả đồ',
      icon: <ApartmentOutlined />,
    },
    {
      key: 'cay-pha-do',
      label: 'Cây phả đồ',
      icon: <BranchesOutlined />,
    },
  ];

  const handleMenuClick = (key: string) => {
    console.log('Clicked menu item:', key);
    // Xử lý navigation logic ở đây
  };

  const handleMoreMenuClick: MenuProps['onClick'] = ({ key }) => {
    console.log('Clicked more menu item:', key);
    // Xử lý navigation logic cho menu "Xem thêm"
  };

  const moreMenu = (
    <Menu
      items={moreMenuItems}
      onClick={handleMoreMenuClick}
      className={styles.dropdownMenu}
    />
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo và tiêu đề */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <ApartmentOutlined className={styles.logoIcon} />
          </div>
          <div className={styles.brandText}>
            <h1 className={styles.title}>Gia Phả Việt Nam</h1>
            <p className={styles.subtitle}>Hệ thống quản lý phả hệ</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navigation}>
          <Menu
            mode="horizontal"
            items={mainMenuItems}
            className={styles.mainMenu}
            onClick={({ key }) => handleMenuClick(key)}
          />
          
          {/* Dropdown "Xem thêm" */}
          <div className={styles.moreMenu}>
            <Dropdown 
              overlay={moreMenu} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Button 
                type="text" 
                className={styles.moreButton}
                icon={<EllipsisOutlined />}
              >
                Xem thêm <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header_Admin_User;