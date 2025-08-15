'use client';
import React, { useEffect } from 'react';
import { Image } from 'antd';

const PeriodicTable: React.FC = () => {
  useEffect(()=>{
    document.title='Bảng tuần hoàn';
  })
  return (
    <Image
      preview={false}
      style={{ marginTop: '64px', height:'93vh' }}
      src="/BangTuanHoan.jpg"
      alt="Bảng tuần hoàn"
    />
  );
};

export default PeriodicTable;
