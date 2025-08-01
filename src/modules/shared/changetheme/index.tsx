import { useColorState } from '@/stores/color.store';
import Image from 'next/image';
import { Dropdown, Avatar } from 'antd';
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
import { usePermissions } from '@/contexts/PermissionContext';
import { IDecodedToken } from '@/types/decodedToken';
import { getAccountLogin } from '@/env/getInfor_token';
import { authAPI } from '@/services/auth.service';

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


const ThemeChanger = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { setThemeColor } = useColorState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { refreshPermissions } = usePermissions();
  // Sửa lại state để lưu thông tin tài khoản
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  useEffect(() => {
    const account = getAccountLogin();
    if (!account) {
      // Điều hướng về trang đăng nhập nếu chưa login
      push('/vi/auth/login');
    } else {
      // Nếu đã đăng nhập, lưu thông tin vào state
      setCurrentAccount(account);
    }
  }, [push]);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'logout') {
      authAPI.logout();
      //cập nhật lại state quyền thành rỗng
      refreshPermissions();

      //điều hướng về trang login
      push('/vi/auth/login');

    } else if (e.key === 'settings') {
      push('/vi/auth/resetPassword');
    }
  };

  if (!currentAccount) {
    return;
  }

  const menuItems = [
    { key: 'user', icon: <UserOutlined />, label: `Xin chào, ${currentAccount.name}` },
    { type: 'divider' as const }, // Thêm đường kẻ phân cách cho đẹp
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
          {/* Kiểm tra nếu có currentAccount.image thì mới dùng Next/Image */}
          {currentAccount.image ? (
            <Image
              src={currentAccount.image}
              alt="Avatar"
              width={40}
              height={40}
              className="h-12 object-contain"
              style={imageStyle}
            />
          ) : (
            // Nếu không có ảnh, hiển thị Avatar mặc định của Antd
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{ ...imageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          )}
        </div>
      </Dropdown>
    </div>
  );
};

export default ThemeChanger;
