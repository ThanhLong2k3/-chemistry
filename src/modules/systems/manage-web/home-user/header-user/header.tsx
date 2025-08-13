'use client';

import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Image, Layout, Menu, Dropdown } from 'antd';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './header.module.scss';
import { LOGIN_PATH } from '@/path';
import GoogleTranslate from '@/modules/shared/GoogleTranslate';
import { getAccountLogin } from '@/env/getInfor_token';
import { useNotification } from '@/components/UI_shared/Notification';
import { authAPI } from '@/services/auth.service';
import { usePermissions } from '@/contexts/PermissionContext';
import { ProfileModal } from '@/modules/shared/ProfileModal';
import { useDisclosure } from '@/components/hooks/useDisclosure';
import env from '@/env';

const { Header } = Layout;

const Header_User = ({ menuItems }: { menuItems: any[] }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const router = useRouter();
  const show = useNotification();
  const { refreshPermissions } = usePermissions();
  const [overlayActive, setOverlayActive] = useState(false);
  const {
    isOpen: isProfileOpen,
    open: openProfile,
    close: closeProfile,
  } = useDisclosure();

  useEffect(() => {
    const acc = getAccountLogin();
    if (!acc) {
      setCurrentAccount(null);
    } else {
      setCurrentAccount(acc);
    }
  }, []);
  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
    setDrawerVisible(false);
  };
  const handelProfile = () => {
    openProfile();
  };
  const handleLogout = () => {
    authAPI.logout();
    refreshPermissions();
    show.show({ result: 0, messageDone: 'Đăng xuất thành công' });
    setCurrentAccount(null);
    router.push(LOGIN_PATH);
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: 'Trang cá nhân',
        onClick: handelProfile,
      },
      {
        key: 'logout',
        label: 'Đăng xuất',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <>
      <div className={`menu-overlay ${overlayActive ? 'active' : ''}`} />
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
            onMouseEnter={() => setOverlayActive(true)} // khi hover vào menu
            onMouseLeave={() => setOverlayActive(false)} // khi rời khỏi menu
            mode="horizontal"
            items={menuItems}
            className={styles.menu}
            onClick={handleMenuClick}
          />
          <GoogleTranslate />

          {currentAccount ? (
            <Dropdown menu={userMenu} placement="bottomRight">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 8,
                }}
              >
                <Avatar
                  src={`${env.BASE_URL}${currentAccount.image}`}
                  icon={<UserOutlined />}
                  size={40} // to hơn
                  shape="circle"
                  style={{
                    border: '2px solid #1890ff',
                    backgroundColor: '#f0f0f0',
                  }}
                />
                <span className={styles.avatarContainer}>
                  {currentAccount.name || currentAccount.username}
                </span>
              </div>
            </Dropdown>
          ) : (
            <a href={LOGIN_PATH}>
              <Button
                style={{ marginRight: '10px', marginLeft: '10px' }}
                type="primary"
              >
                Đăng nhập
              </Button>
            </a>
          )}

          <MenuOutlined
            className={styles.hamburger}
            onClick={() => setDrawerVisible(true)}
          />
          <ProfileModal isOpen={isProfileOpen} onClose={closeProfile} />
        </div>

        <Drawer
          title="Danh mục"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          style={{ padding: 0, backgroundColor: 'white', color: 'black' }}
        >
          <Menu
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            selectable={false}
          />
        </Drawer>
      </Header>
    </>
  );
};

export default Header_User;
