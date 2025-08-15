'use client';

import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Space,
  Empty,
  Tooltip,
  Badge,
  Pagination
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  ClockCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import styles from './ExamList.module.scss';
import { useRouter } from 'next/navigation';
import { IExam } from '@/types/exam';
import env from '@/env';
import parse from 'html-react-parser';
import HeaderTitle from '../../../header_title/header_title';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ExamListProps {
  exams: IExam[];
}

const ExamList: React.FC<ExamListProps> = ({ exams }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Số đề thi mỗi trang

  // Tính toán dữ liệu hiển thị theo trang
  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return exams.slice(startIndex, endIndex);
  }, [exams, currentPage, pageSize]);

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const handleExamClick = (fileName: string) => {
    router.push(`${env.BASE_URL}${fileName}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const handleDownload = async (exemfile: string, examName: string) => {
    const res = await fetch(`${env.BASE_URL}${exemfile}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exemfile.split('/').pop() || 'file.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Kiểm tra có cần hiển thị pagination không
  const showPagination = exams.length > pageSize;
  
  return (
    <>
      <HeaderTitle title={"Danh sách đề thi"} />
      <div className={styles.examListWrapper}>
        
        {/* Hiển thị thông tin tổng số đề thi */}
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text>
            Tổng số đề thi: <strong>{exams.length}</strong>
          </Text>
          {showPagination && (
            <Text type="secondary">
              Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, exams.length)} của {exams.length} đề thi
            </Text>
          )}
        </div>

        <div className={styles.examGrid}>
          {paginatedExams.length > 0 ? (
            paginatedExams.map((exam) => (
              <Card
                key={exam.id}
                className={styles.examCard}
                hoverable
                actions={[
                  <Tooltip title="Xem đề thi" key="view">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />}
                      onClick={() => handleExamClick(exam.file)}
                      className={styles.actionBtn}
                      style={{marginLeft:'20px'}}
                    >
                      Xem đề
                    </Button>
                  </Tooltip>,
                  <Tooltip title="Tải xuống" key="download">
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(exam.file, exam.name);
                      }}
                      className={styles.actionBtn}
                      style={{marginLeft:'20px'}}
                    >
                      Tải về
                    </Button>
                  </Tooltip>
                ]}
              >
                <div className={styles.examHeader}>
                  <div className={styles.examTitle}>
                    <Title level={2} className={styles.examName}>
                      {exam.name}
                    </Title>
                  </div>
                </div>

                <div className={styles.examDescription}>
                  {parse(exam.description ? exam.description : "")}
                </div>

                <div className={styles.examMeta}>
                  <div className={styles.metaItem}>
                    <ClockCircleOutlined className={styles.metaIcon} />
                    <Text className={styles.metaText}>
                      {formatDate(exam.created_at)}
                    </Text>
                  </div>
                  <div className={styles.metaItem}>
                    <Text className={styles.metaText}>
                      Tạo bởi: {exam.created_by}
                    </Text>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text>Không tìm thấy đề thi phù hợp</Text>
                    <br />
                    <Text type="secondary">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</Text>
                  </div>
                }
              >
              </Empty>
            </div>
          )}
        </div>

        {/* Pagination - chỉ hiển thị khi có > 10 đề thi */}
        {showPagination && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '24px',
            padding: '16px 0' 
          }}>
            <Pagination
              current={currentPage}
              total={exams.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={exams.length > 50} // Hiển thị quick jumper nếu có > 50 đề thi
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} của ${total} đề thi`
              }
              size="default"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ExamList;