'use client';

import env from '@/env';
import { searchSubject } from '@/services/subject.service';
import { px } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ViewFlipBookPageClient({
  id,
  typebook,
}: {
  id: string;
  typebook: string;
}) {
  useEffect(() => {
    let title = '';

    if (typebook === 'SGK') {
      title = 'Xem sách giáo khoa';
    } else if (typebook === 'SBT') {
      title = 'Xem sách bài tập';
    } else {
      title = 'Xem vở bài tập';
    }

    document.title = title;
    getAllSubject();
  }, [id, typebook]);

  const [linkFlip, setlinkFlip] = useState<string>('');
  const [linkDowload, setlinkDowload] = useState<string>('');
  const handleDownload = async () => {
    const res = await fetch(`${env.BASE_URL}${linkDowload}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = linkDowload.split('/').pop() || 'file.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const getAllSubject = async () => {
    const data: any = await searchSubject({
      page_index: 1,
      page_size: 10000000,
      order_type: 'ASC',
    });
    const listSubject = data.data || [];
    if (listSubject.length > 0) {
      listSubject.forEach((element: any) => {
        if (element.id === id) {
          if (typebook === 'SGK') {
            setlinkFlip(element.flip_textbook);
            setlinkDowload(element.textbook);
          } else if (typebook === 'SBT') {
            setlinkFlip(element.flip_workbook);
            setlinkDowload(element.workbook);
          } else {
            setlinkFlip(element.flip_exercise_book);
            setlinkDowload(element.exercise_book);
          }
        }
      });
    }
  };
  return (
   <div style={{ marginTop: '65px' }}>
      {/* Iframe đọc sách */}
      <div
        style={{
          position: 'relative',
          paddingTop: 'max(60%,324px)',
          width: '100%',
          height: 0,
        }}
      >
        {linkFlip || linkDowload ? (
          linkFlip ? (
            <iframe
              style={{
                position: 'absolute',
                border: 'none',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
              }}
              src={linkFlip}
              seamless
              scrolling="no"
              frameBorder="0"
              allowTransparency={true}
              allowFullScreen={true}
            ></iframe>
          ) : (
            <iframe
              style={{
                position: 'absolute',
                border: 'none',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
              }}
              src={`${env.BASE_URL}${linkDowload}#toolbar=0`}
              frameBorder="0"
            ></iframe>
          )
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>
            Đang tải sách...
          </p>
        )}
      </div>

      {/* Nút tải xuống */}
      <div
        style={{ marginTop: '16px', textAlign: 'center', marginBottom: '16px' }}
      >
        <button
          onClick={handleDownload}
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
          }}
        >
          Tải xuống
        </button>
      </div>
    </div>
  );
}
