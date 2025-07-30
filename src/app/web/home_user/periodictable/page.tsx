import React from 'react';
import { Image } from 'antd';

const PeriodicTable: React.FC = () => {
  return (
    <Image
      preview={false}
      style={{ marginTop: '64px' }}
      src="/BangTuanHoan.jpg"
      alt="Bảng tuần hoàn"
    />
  );
};

export default PeriodicTable;
