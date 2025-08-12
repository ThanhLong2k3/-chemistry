'use client';

import React, { useCallback, useMemo } from 'react';
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
import {
  ADMIN_MANAGE_ACCOUNT_PATH,
  ADMIN_MANAGE_ADVISORY_MEMBER_PATH,
  ADMIN_MANAGE_BLOG_PATH,
  ADMIN_MANAGE_CHAPTER_PATH,
  ADMIN_MANAGE_EXAM_PATH,
  ADMIN_MANAGE_LESSON_PATH,
  ADMIN_MANAGE_ROLE_PATH,
  ADMIN_MANAGE_SUBJECT_PATH,
  ADMIN_DASHBOARD_PATH
} from '@/path';
import { usePermissions } from '@/contexts/PermissionContext';

type MenuItem = Required<MenuProps>['items'][number];
interface SiderBarProps {
  collapsed: boolean;
}

// Map giữa key của menu và đường dẫn
const routeMap: Record<string, string> = {
  'sub1': ADMIN_DASHBOARD_PATH,
  '1': ADMIN_MANAGE_SUBJECT_PATH,
  '2': ADMIN_MANAGE_CHAPTER_PATH,
  '3': ADMIN_MANAGE_LESSON_PATH,
  '4': ADMIN_MANAGE_EXAM_PATH,
  'sub3': ADMIN_MANAGE_ADVISORY_MEMBER_PATH,
  'sub4': ADMIN_MANAGE_BLOG_PATH,
  '5': ADMIN_MANAGE_ROLE_PATH,
  '6': ADMIN_MANAGE_ACCOUNT_PATH,
};

// Map giữa key của menu và permission_code tương ứng
const menuPermissionMap: Record<string, string> = {
  'sub1': 'DASHBOARD_VIEW',
  '1': 'SUBJECT_MANAGE',
  '2': 'CHAPTER_MANAGE',
  '3': 'LESSON_MANAGE',
  '4': 'EXAM_MANAGE',
  'sub3': 'ADVISORY_MANAGE',
  'sub4': 'BLOG_MANAGE',
  '5': 'ROLE_MANAGE',
  '6': 'ACCOUNT_MANAGE',
};

const SiderBar: React.FC<SiderBarProps> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { themeColor } = useColorState();
  const { hasPermission, permissions } = usePermissions(); // Lấy hàm hasPermission và cả mảng permissions

  const getCurrentKey = useCallback(() => {
    const entry = Object.entries(routeMap).find(
      ([, path]) => path === pathname,
    );
    return entry ? entry[0] : 'sub1'; // Mặc định về dashboard
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    const path = routeMap[e.key];
    if (path && path !== pathname) {
      router.push(path);
    }
  };

  // Lọc danh sách menu dựa trên quyền của người dùng
  const filteredSidebarItems = useMemo<MenuItem[]>(() => {
    // Định nghĩa cấu trúc menu đầy đủ
    const allItems: MenuItem[] = [
      { key: 'sub1', label: 'Tổng quan', icon: <LineChartOutlined /> },
      {
        key: 'sub2',
        label: 'Quản lý nội dung bài học',
        icon: <ProfileOutlined />,
        children: [
          { key: '1', label: 'Quản lý môn học', icon: <ProjectOutlined /> },
          { key: '2', label: 'Danh mục chương', icon: <BookOutlined /> },
          { key: '3', label: 'Danh mục bài học', icon: <ReadOutlined /> },
          { key: '4', label: 'Danh mục đề kiểm tra', icon: <CopyOutlined /> },
        ],
      },
      { key: 'sub3', label: 'Quản lý ban tư vấn', icon: <IdcardOutlined /> },
      { key: 'sub4', label: 'Quản lý bài viết', icon: <EditOutlined /> },
      {
        key: 'sub5',
        label: 'Quản trị hệ thống',
        icon: <SettingOutlined />,
        children: [
          { key: '5', label: 'Quản lý nhóm tài khoản', icon: <TeamOutlined /> },
          { key: '6', label: 'Quản lý tài khoản', icon: <TeamOutlined /> },
        ],
      },
    ];

    // Hàm đệ quy để lọc menu
    const filterMenu = (items: any[]): any[] => {
      return items.reduce((acc: any[], item) => {
        if (!item) return acc;

        // Nếu là menu cha (có children)
        if (item.children) {
          const filteredChildren = filterMenu(item.children);
          if (filteredChildren.length > 0) {
            acc.push({ ...item, children: filteredChildren });
          }
        }
        // Nếu là menu đơn
        else {
          const permissionCode = menuPermissionMap[item.key];
          // Menu sẽ được hiển thị nếu không yêu cầu quyền, hoặc người dùng có quyền đó
          if (!permissionCode || hasPermission(permissionCode)) {
            acc.push(item);
          }
        }
        return acc;
      }, []);
    };

    return filterMenu(allItems);

  }, [hasPermission]); // Chỉ tính toán lại khi hàm `hasPermission` thay đổi

  const sidebarBg = themeColor?.token?.colorPrimary || 'rgb(13,68,138)';
  const textColor = themeColor?.token?.colorPrimary ? '#ffffff' : '#000000';

  return (
    <div
      className={styles.menuContainer}
      style={{ backgroundColor: sidebarBg, color: textColor }}
    >
      <div
        className={styles.headerLogo}
        style={{ backgroundColor: sidebarBg, color: textColor }}
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
          defaultOpenKeys={collapsed ? [] : ['sub1', 'sub2', 'sub5']} // Cập nhật defaultOpenKeys
          selectedKeys={[getCurrentKey()]}
          mode="inline"
          items={filteredSidebarItems} // Sử dụng danh sách menu đã lọc
          inlineCollapsed={collapsed}
          className={styles.menu}
          style={{ backgroundColor: sidebarBg, color: textColor }}
        />
      </ConfigProvider>
    </div >
  );
};

export default SiderBar;