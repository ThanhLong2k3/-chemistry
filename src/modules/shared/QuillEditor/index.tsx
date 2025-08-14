'use client';

import env from '@/env';
import { getAccountLogin } from '@/env/getInfor_token';
import { UpLoadImage } from '@/services/upload.service';
import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // Custom image handler sử dụng API của bạn
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        

        // Lấy editor instance và vị trí con trở
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true);
        const loadingText = 'Đang tải ảnh lên...';

        // Hiển thị loading text
        quill.insertText(range.index, loadingText, 'user');

        // Upload ảnh sử dụng API của bạn
        const uploaded = await UpLoadImage([file]);

        if (!uploaded || uploaded.length === 0) {
          throw new Error('Upload thất bại');
        }

        const imageUrl = uploaded[0];

        // Tạo URL đầy đủ để hiển thị
        const fullImageUrl = imageUrl.startsWith('http')
          ? imageUrl
          : `${env.BASE_URL}${imageUrl}`;

        // Xóa loading text và chèn ảnh
        quill.deleteText(range.index, loadingText.length);
        quill.insertEmbed(range.index, 'image', fullImageUrl);
        quill.setSelection({ index: range.index + 1, length: 0 });
      } catch (error: any) {
        console.error('Lỗi khi upload ảnh:', error);

        // Xóa loading text nếu có lỗi
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const currentContent = quill.getText();
          const loadingText = 'Đang tải ảnh lên...';
          const loadingIndex = currentContent.indexOf(loadingText);
          if (loadingIndex !== -1) {
            quill.deleteText(loadingIndex, loadingText.length);
          }
        }
      }
    };
  };

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
          image: handleImageUpload, // Custom image handler
        },
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder || 'Nhập nội dung...'}
    />
  );
};

export default QuillEditor;
