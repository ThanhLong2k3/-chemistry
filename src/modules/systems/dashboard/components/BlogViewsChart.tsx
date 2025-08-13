'use client';

import { useEffect, useState } from 'react';
import { Card, DatePicker, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

import { getBlogViews } from '@/services/dashboard.service';
import { IBlogView } from '@/types/dashboard';
import { useNotification } from '@/components/UI_shared/Notification';
import dayjs from 'dayjs';


const { RangePicker } = DatePicker;
type RangeValue = [Date | null, Date | null] | null;

// Hàm lấy ngày trước đó
const subDaysJS = (date: Date, days: number) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() - days);
    return copy;
};

// Hàm format ngày sang chuỗi dd/MM/yyyy
const formatDateJS = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

// Hàm format ngày sang chuỗi yyyy-MM-dd
const formatAPIDateJS = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

// Giá trị mặc định: 7 ngày gần nhất
const defaultDateRange: RangeValue = [subDaysJS(new Date(), 6), new Date()];

export const BlogViewsChart = () => {
    const [data, setData] = useState<IBlogView[]>([]);
    const [dateRange, setDateRange] = useState<RangeValue>(defaultDateRange);
    const [loading, setLoading] = useState(true);
    const { show } = useNotification();

    useEffect(() => {
        if (dateRange && dateRange[0] && dateRange[1]) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    if (dateRange && dateRange[0] && dateRange[1]) {
                        const startDate = formatAPIDateJS(dateRange[0]!);
                        const endDate = formatAPIDateJS(dateRange[1]!);

                        const response = await getBlogViews(startDate, endDate);

                        if (response.success) {
                            const formattedData = response.data.map((item) => ({
                                ...item,
                                date: formatDateJS(new Date(item.date)),
                            }));
                            setData(formattedData);
                        } else {
                            throw new Error(response.message);
                        }
                    }
                } catch (err: unknown) {
                    console.error("Lỗi khi tải dữ liệu biểu đồ:", err);

                    let errorMessage = 'Không thể tải dữ liệu.';
                    if (axios.isAxiosError(err) && err.response) {
                        errorMessage = err.response.data.message || err.message;
                    } else if (err instanceof Error) {
                        errorMessage = err.message;
                    }

                    show({
                        result: 1,
                        messageError: errorMessage
                    });

                    setDateRange(defaultDateRange);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [dateRange]);

    return (
        <Card
            title="Thống kê lượt xem bài viết"
            extra={
                <RangePicker
                    value={
                        dateRange
                            ? [dateRange[0] ? dayjs(dateRange[0]) : null, dateRange[1] ? dayjs(dateRange[1]) : null]
                            : null
                    }
                    onChange={(dates) => {
                        if (dates && dates[0] && dates[1]) {
                            setDateRange([dates[0].toDate(), dates[1].toDate()]);
                        } else {
                            setDateRange(null);
                        }
                    }}
                    presets={[
                        { label: '7 ngày qua', value: [dayjs(subDaysJS(new Date(), 6)), dayjs(new Date())] },
                        { label: '30 ngày qua', value: [dayjs(subDaysJS(new Date(), 29)), dayjs(new Date())] },
                        { label: '90 ngày qua', value: [dayjs(subDaysJS(new Date(), 89)), dayjs(new Date())] },
                    ]}
                    format="DD/MM/YYYY"
                />
            }
        >
            <div style={{ height: 400, position: 'relative' }}>
                {loading && <Spin style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
                {!loading && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="views" name="Lượt xem" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
};
