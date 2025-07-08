import { useColorState } from '@/stores/color.store';
import Image from 'next/image';
import { Dropdown } from 'antd';
import {
  themeOrangeConfig,
  themeBlueConfig,
  themeDarkConfig,
  themeBrownConfig,
} from '@/constants/theme';

import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import styles from '@/modules/shared/header/Header.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '@/libs/api/auth.api';

const ThemeChanger = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { setThemeColor } = useColorState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>('');
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    const name = localStorage.getItem('FullName');
    setUser(name);
  };

  const handleMenuClick = async (e: { key: string }) => {
    if (e.key === 'logout') {
      console.log('Đăng xuất');
      await authAPI.logout();
      push('/vi');
    } else if (e.key === 'settings') {
      push('/vi/resetPassword');
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { key: 'user', icon: <UserOutlined />, label: user },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt thông tin cá nhân',
    },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        lineHeight: '30px',
        alignItems: 'center',
      }}
    >
      <button
        onClick={() => setThemeColor(themeBlueConfig)}
        style={buttonStyle('#0d448a')}
      />
      <button
        onClick={() => setThemeColor(themeDarkConfig)}
        style={buttonStyle('#52c41a')}
      />
      <button
        onClick={() => setThemeColor(themeOrangeConfig)}
        style={buttonStyle('#ff6b35')}
      />
      <button
        onClick={() => setThemeColor(themeBrownConfig)}
        style={buttonStyle('#48433d')}
      />
      
      <h1>/</h1>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        onOpenChange={setIsMenuOpen}
        open={isMenuOpen}
        trigger={['click']}
      >
        <div className={styles.rightContent}>
          <Image
            src="/image/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-12 object-contain"
            style={imageStyle}
          />
        </div>
      </Dropdown>
    </div>
  );
};

const buttonStyle = (color: string) => ({
  backgroundColor: color,
  borderRadius: '50%',
  height: '15px',
  width: '15px',
  border: '1px black solid',
  cursor: 'pointer',
});

const imageStyle = {
  marginLeft: '10px',
  borderRadius: '50%',
  border: '1px black solid',
};

export default ThemeChanger;
