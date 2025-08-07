'use client';
import { useCallback, useMemo } from 'react';
import { ConfigProvider, Menu } from 'antd';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useColorState } from '@/stores/color.store';
import type { MenuProps } from 'antd';
import {
  SettingOutlined,
  TeamOutlined,
  ProjectOutlined,
  BookOutlined,
  ReadOutlined,
  IdcardOutlined,
  LineChartOutlined,
  ProfileOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import styles from '@/modules/shared/siderbar/siderbar.module.scss';
import { ADMIN_MANAGE_ACCOUNT_PATH, ADMIN_MANAGE_ADVISORY_MEMBER_PATH, ADMIN_MANAGE_BLOG_PATH, ADMIN_MANAGE_CHAPTER_PATH, ADMIN_MANAGE_EXAM_PATH, ADMIN_MANAGE_LESSON_PATH, ADMIN_MANAGE_PROFILE_PATH, ADMIN_MANAGE_ROLE_PATH, ADMIN_MANAGE_SUBJECT_PATH, ADMIN_OVERVIEW_PATH } from '@/path';

type MenuItem = Required<MenuProps>['items'][number];
interface SiderBarProps {
  collapsed: boolean;
}

const routeMap: Record<string, string> = {
  sub1: ADMIN_OVERVIEW_PATH,
  '1': ADMIN_MANAGE_SUBJECT_PATH,
  '2': ADMIN_MANAGE_CHAPTER_PATH,
  '3': ADMIN_MANAGE_LESSON_PATH,
  '4': ADMIN_MANAGE_EXAM_PATH,
  sub3: ADMIN_MANAGE_ADVISORY_MEMBER_PATH,
  sub4: ADMIN_MANAGE_BLOG_PATH,
  '5': ADMIN_MANAGE_ROLE_PATH,
  '6': ADMIN_MANAGE_ACCOUNT_PATH,
};

const SiderBar: React.FC<SiderBarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { themeColor } = useColorState();

  const getCurrentKey = useCallback(() => {
    const entry = Object.entries(routeMap).find(
      ([, path]) => path === pathname,
    );
    return entry ? entry[0] : '1';
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    const path = routeMap[e.key];
    if (path && path !== pathname) {
      router.push(path);
    }
  };

  const sidebarItems = useMemo<MenuItem[]>(
    () => [
      { key: 'sub1', label: 'Tổng quan', icon: <LineChartOutlined /> },
      {
        key: 'sub2',
        label: 'Quản lý nội dung bài học',
        icon: <ProfileOutlined />,
        children: [
          { key: '1', label: 'Quản lý môn học', icon: <ProjectOutlined />, },
          { key: '2', label: 'Danh mục chương', icon: <BookOutlined /> },
          { key: '3', label: 'Danh mục bài học', icon: <ReadOutlined /> },
          { key: '4', label: 'Danh mục đề kiểm tra', icon: <CopyOutlined /> },
        ],
      },
      { key: 'sub3', label: 'Quản lý ban tư vấn', icon: <IdcardOutlined /> },
      { key: 'sub4', label: 'Quản lý bài viết', icon: <EditOutlined />, },
      {
        key: 'sub5',
        label: 'Quản trị hệ thống',
        icon: <SettingOutlined />,
        children: [
          { key: '5', label: 'Quản lý nhóm tài khoản', icon: <TeamOutlined /> },
          { key: '6', label: 'Quản lý tài khoản', icon: <TeamOutlined /> },
        ],
      },
    ],
    [],
  );

  const sidebarBg = themeColor?.token?.colorPrimary || 'rgb(13,68,138)';
  const textColor = themeColor?.token?.colorPrimary ? '#ffffff' : '#000000';

  return (
    <div
      className={styles.menuContainer}
      style={{
        backgroundColor: sidebarBg,
        color: textColor,
      }}
    >
      <div
        className={styles.headerLogo}
        style={{
          backgroundColor: sidebarBg,
          color: textColor,
        }}
      >
        <Image
          src={collapsed ? '/image/logotrangnho.png' : '/image/logotrang.png'}
          alt="Logo"
          width={collapsed ? 50 : 150}
          height={60}
          priority
          style={{
            objectFit: 'contain',
            height: 60,
            marginLeft: collapsed ? '-50%' : '10%',
          }}
        />
      </div>

      <ConfigProvider
        theme={{ token: { colorBgContainer: sidebarBg, colorText: textColor } }}
      >
        <div style={{ height: '15px' }}></div>
        <Menu
          onClick={onClick}
          defaultOpenKeys={collapsed ? [] : ['sub1', 'sub2', 'sub4']}
          selectedKeys={[getCurrentKey()]}
          mode="inline"
          items={sidebarItems}
          inlineCollapsed={collapsed}
          className={styles.menu}
          style={{
            backgroundColor: sidebarBg,
            color: textColor,
          }}
        />
      </ConfigProvider>
    </div >
  );
};

export default SiderBar;