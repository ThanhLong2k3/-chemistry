'use client';

import { useEffect, useState } from 'react';
import { Card, DatePicker, Spin } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import axios from 'axios';

import { getBlogViews } from '@/services/dashboard.service';
import { IBlogView } from '@/types/dashboard';
import { useNotification } from '@/components/UI_shared/Notification';
import moment from 'moment';
import { formatDate } from '@/utils/date';

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

// Giá trị mặc định dùng moment thay subDays
const defaultDateRange: RangeValue = [
  dayjs(moment().subtract(6, 'days').format('YYYY-MM-DD')),
  dayjs(moment().format('YYYY-MM-DD')),
];

export const BlogViewsChart = () => {
  const [data, setData] = useState<any>([]);
  const [dateRange, setDateRange] = useState<RangeValue>(defaultDateRange);
  const [loading, setLoading] = useState(true);
  const { show } = useNotification();

  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const startDate = dateRange[0]!.format('YYYY-MM-DD');
          const endDate = dateRange[1]!.format('YYYY-MM-DD');

          const response = await getBlogViews(startDate, endDate);

          if (response.success) {
            const formattedData = response.data.map((item) => ({
              ...item,
              date: formatDate(item.date, 'YYYY-MM-DD', 'DD/MM/YYYY'), // dùng hàm của bạn
            }));
            setData(formattedData);
          } else {
            throw new Error(response.message);
          }
        } catch (err: unknown) {
          console.error('Lỗi khi tải dữ liệu biểu đồ:', err);

          let errorMessage = 'Không thể tải dữ liệu.';
          if (axios.isAxiosError(err) && err.response) {
            errorMessage = err.response.data.message || err.message;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }

          show({
            result: 1,
            messageError: errorMessage,
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
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          presets={[
            {
              label: '7 ngày qua',
              value: [dayjs().subtract(6, 'days'), dayjs()],
            },
            {
              label: '30 ngày qua',
              value: [dayjs().subtract(29, 'days'), dayjs()],
            },
            {
              label: '90 ngày qua',
              value: [dayjs().subtract(89, 'days'), dayjs()],
            },
          ]}
          format="DD/MM/YYYY"
        />
      }
    >
      <div style={{ height: 400, position: 'relative' }}>
        {loading && (
          <Spin
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
        {!loading && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                name="Lượt xem"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
