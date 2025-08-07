'use client';
import '@/assets/scss/_global.scss';
import type React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AppProvider from './AppProvider';
import { Layout, ConfigProvider } from 'antd';
import SiderBar from '@/modules/shared/siderbar/siderbar';
import { App as AntApp } from 'antd';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {
  ADVISORY_BOARD_PATH,
  BASE_PATH,
  HOME_PATH,
  LESSON_DETAIL_PATH,
  LESSON_LIST_PATH,
  LOGIN_PATH,
  PERIODIC_TABLE_PATH,
  REGISTER_PATH,
  REVIEW_FILE_PDF_PATH,
  FOGOTPASS_PATH,
  BLOG_LIST_PATH,
  BLOG_DETAIL_PATH,
  EXAM_LIST_PATH,
} from '@/path';

const { Sider, Content } = Layout;

interface RootLayoutProps {
  children: React.ReactNode;
}
const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';
export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const normalizedPath = normalizePath(pathname);
  const isLessonListPage = normalizedPath.startsWith(LESSON_LIST_PATH);
  const isLessonDetailPage = normalizedPath.startsWith(LESSON_DETAIL_PATH);
  const isBlogDetailPage = normalizedPath.startsWith(BLOG_DETAIL_PATH);
  const isOpenPDFPage = normalizedPath.startsWith(REVIEW_FILE_PDF_PATH);
  const isExamListPage = normalizedPath.startsWith(EXAM_LIST_PATH);


  const staticAuthPaths = [
    BASE_PATH,
    REGISTER_PATH,
    HOME_PATH,
    LOGIN_PATH,
    ADVISORY_BOARD_PATH,
    PERIODIC_TABLE_PATH,
    FOGOTPASS_PATH, BLOG_LIST_PATH,
    '/',
    BLOG_LIST_PATH,
  ].map(normalizePath);

  const isAuthPage =
    staticAuthPaths.includes(normalizedPath) ||
    isLessonListPage ||
    isLessonDetailPage ||
    isOpenPDFPage || isBlogDetailPage ||isExamListPage;

  const siderStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'all 0.3s',
    backgroundColor: 'transparent',
    borderRight: '1px solid rgba(0,0,0,0.06)',
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: 'fixed',
    top: collapsed ? '10px' : '20px',
    left: collapsed ? '60px' : '205px',
    zIndex: 1000,
    transition: 'all 0.3s',
    background: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  };

  return (
    <html lang="en">
      <body style={{ margin: 0, overflow: 'hidden' }}>
        <ConfigProvider>
          <AntApp>
            <AppProvider>
              <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
                {!isAuthPage && (
                  <>
                    <Sider
                      collapsed={collapsed}
                      width={250}
                      collapsedWidth={60}
                      style={siderStyle}
                    >
                      <SiderBar collapsed={collapsed} />
                    </Sider>
                    <div
                      style={toggleButtonStyle}
                      onClick={() => setCollapsed(!collapsed)}
                    >
                      {collapsed ? (
                        <MenuUnfoldOutlined />
                      ) : (
                        <MenuFoldOutlined />
                      )}
                    </div>
                  </>
                )}
                <Layout
                  style={{
                    marginLeft: isAuthPage ? 0 : collapsed ? 30 : 220,
                    transition: 'all 0.3s',
                    overflow: 'auto',
                    height: '100vh',
                  }}
                >
                  <Content
                    style={{
                      padding: isAuthPage ? 0 : '24px 24px 24px 48px',
                      minHeight: '100vh',
                    }}
                  >
                    {children}
                  </Content>
                </Layout>
              </Layout>
            </AppProvider>
          </AntApp>
        </ConfigProvider>
      </body>
    </html>
  );
}