'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';
import env from '@/env';
import { UpLoadImage } from '@/services/upload.service';

const ReactQuill: any = dynamic(() => import('react-quill'), { ssr: false });

export default function QuillEditor({ value, onChange, placeholder }:{value:any, onChange:any, placeholder:any }) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: function () {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              const quill = (this as any).quill;
              const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
              const loadingText = 'Đang tải ảnh lên...';

              quill.insertText(range.index, loadingText, 'user');
              try {
                const uploaded = await UpLoadImage([file]);
                if (!uploaded?.length) throw new Error('Upload thất bại');

                const imageUrl = uploaded[0];
                const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${env.BASE_URL}${imageUrl}`;

                quill.deleteText(range.index, loadingText.length);
                quill.insertEmbed(range.index, 'image', fullImageUrl);
                quill.setSelection({ index: range.index + 1, length: 0 });
              } catch (err) {
                quill.deleteText(range.index, loadingText.length);
                console.error('Upload ảnh lỗi:', err);
              }
            };
          },
        },
      },
    }),
    []
  );

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image'];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder || 'Nhập nội dung...'}
    />
  );
}
