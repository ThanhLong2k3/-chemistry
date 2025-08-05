'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dropdown, Avatar, Spin } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import styles from '@/modules/shared/header/Header.module.scss';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/contexts/PermissionContext';
import { IDecodedToken } from '@/types/decodedToken';
import { getAccountLogin } from '@/env/getInfor_token';
import { authAPI } from '@/services/auth.service';
import env from '@/env';
import { useDisclosure } from '@/components/hooks/useDisclosure';
import { useColorState } from '@/stores/color.store'; // Giữ lại các import của bạn
import {
  themeOrangeConfig,
  themeBlueConfig,
  themeDarkConfig,
  themeBrownConfig,
} from '@/constants/theme';
import { ProfileModal } from '../ProfileModal';

// --- Style Objects ---
const buttonStyle = (color: string) => ({
  backgroundColor: color,
  borderRadius: '50%',
  height: '15px',
  width: '15px',
  border: '1px black solid',
  cursor: 'pointer',
});

const imageStyle: React.CSSProperties = {
  marginLeft: '10px',
  borderRadius: '50%',
  border: '1px black solid',
  objectFit: 'cover'
};

const ThemeChanger = () => {
  const { push } = useRouter();
  const { setThemeColor } = useColorState();
  const { refreshPermissions } = usePermissions();
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  // State để quản lý ProfileModal
  const { isOpen: isProfileOpen, open: openProfile, close: closeProfile } = useDisclosure();

  useEffect(() => {
    const account = getAccountLogin();
    if (account) {
      setCurrentAccount(account);
    }
  }, []);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      authAPI.logout();
      refreshPermissions();
    } else if (e.key === 'settings') {
      openProfile();
    }
  };

  if (!currentAccount) {
    return <Spin />; // Hiển thị loading nếu chưa có thông tin
  }

  const menuItems = [
    { key: 'user', icon: <UserOutlined />, label: `Xin chào, ${currentAccount.name}` },
    { type: 'divider' as const },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt thông tin cá nhân' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Các nút đổi theme */}
        <button onClick={() => setThemeColor(themeBlueConfig)} style={buttonStyle('#0d448a')} />
        <button onClick={() => setThemeColor(themeDarkConfig)} style={buttonStyle('#52c41a')} />
        <button onClick={() => setThemeColor(themeOrangeConfig)} style={buttonStyle('#ff6b35')} />
        <button onClick={() => setThemeColor(themeBrownConfig)} style={buttonStyle('#48433d')} />

        <h1>/</h1>

        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
            <div className={styles.rightContent}>
              {currentAccount.image ? (
                <Image
                  src={`${env.BASE_URL}${currentAccount.image}`}
                  alt="Avatar"
                  width={40}
                  height={40}
                  style={imageStyle}
                  onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                />
              ) : (
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  style={{ ...imageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              )}
            </div>
          </a>
        </Dropdown>
      </div>

      {/* Render Modal ở đây */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={closeProfile}
      />
    </>
  );
};

export default ThemeChanger;