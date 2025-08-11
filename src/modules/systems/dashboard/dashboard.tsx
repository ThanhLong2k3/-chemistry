'use client';

import Header_Children from "@/components/UI_shared/Children_Head";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert, Space, Spin } from "antd";
import React, { useEffect } from 'react';
import { StatsCards } from "./components/StatsCards";
import { BlogViewsChart } from "./components/BlogViewsChart";

export default function DashboardPage() {
    const { hasPermission } = usePermissions();
    useEffect(() => {
        document.title = "Tổng quan";
    }, []);

    if (!hasPermission('DASHBOARD_VIEW')) {
        return (
            <>
                <Header_Children title={'Tổng quan'} />
                <Alert
                    message="Không có quyền truy cập"
                    description="Bạn không có quyền truy cập vào trang này."
                    type="error"
                    showIcon
                />
            </>
        )
    }

    return (
        <>
            <Header_Children title={'Tổng quan'} />
            <div style={{ padding: '24px' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <StatsCards />
                    <BlogViewsChart />
                </Space>
            </div>
        </>
    );
}