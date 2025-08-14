'use client';

import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createExam, updateExam } from '@/services/exam.service';
import { IExam } from '@/types/exam';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, PaperClipOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { ISubject } from '@/types/subject';
import { searchSubject } from '@/services/subject.service';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { getAccountLogin } from '@/env/getInfor_token';
import { UpLoadImage } from '@/services/upload.service'; // Đổi tên thành UpLoadFile sẽ hợp lý hơn
import env from '@/env'; // Import env

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IExam;
  getAll: () => void;
}

export const ExamModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [description, setDescription] = useState('');


  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await searchSubject({ page_index: 1, page_size: 100 });
        if (res.success) setSubjects(res.data);
      } catch (err) {
        console.error('Lỗi khi tải môn học:', err);
      }
    };

    if (isOpen) {
      fetchSubjects();
      if (isCreate) {
        form.resetFields();
        setDescription('');
      } else if (row) {
        // --- ÁP DỤNG LOGIC HIỂN THỊ FILE CŨ TỪ SUBJECTMODAL ---
        const convertUrlToFile = (url: string | null): UploadFile[] => {
          if (!url) return [];
          return [{
            uid: '-1-file',
            name: url.split('/').pop() || 'file.pdf',
            status: 'done',
            url: `${env.BASE_URL}${url}`, // Ghép Base URL để tạo link tuyệt đối
          }];
        };

        form.setFieldsValue({
          ...row,
          file: convertUrlToFile(row.file), // Áp dụng hàm chuyển đổi
        });
        setDescription(row.description || '');
      }
    }
  }, [isOpen, isCreate, row, form]);

  const handleOk = async () => {
    try {
      const currentAccount = getAccountLogin();
      if (!currentAccount) {
        showSessionExpiredModal();
        return;
      }

      const values = await form.validateFields();

      // --- ÁP DỤNG LOGIC XỬ LÝ FILE KHI SUBMIT TỪ SUBJECTMODAL ---
      const extractFileUrl = async (fileList: UploadFile[] | undefined): Promise<string | null> => {
        if (!fileList || fileList.length === 0) return null;
        const file = fileList[0];
        if (file.originFileObj) {
          // UpLoadImage cần hỗ trợ upload PDF
          const uploaded = await UpLoadImage([file.originFileObj], show);
          return uploaded[0] ?? null;
        } else if (file.url) {
          // Loại bỏ Base URL để lấy đường dẫn tương đối
          return file.url.replace(env.BASE_URL, '');
        }
        return null;
      };

      const fileUrl = await extractFileUrl(values.file);

      const dataToSubmit = {
        ...values,
        file: fileUrl,
      };

      let responseData: any;
      if (isCreate) {
        responseData = await createExam({
          id: uuidv4(),
          ...dataToSubmit,
          created_by: currentAccount.username,
        });
      } else if (row?.id) {
        responseData = await updateExam({
          ...dataToSubmit,
          id: row.id,
          updated_by: currentAccount.username,
        });
      }

      if (responseData?.success) {
        show({ result: 0, messageDone: isCreate ? 'Thêm bài kiểm tra thành công!' : 'Cập nhật thành công!' });
        getAll();
        setTimeout(() => {
          close();
        }, 1000);
      } else {
        show({ result: 1, messageError: responseData?.message || (isCreate ? 'Thêm thất bại.' : 'Cập nhật thất bại.') });
      }

    } catch (error: any) {
      if (error?.errorFields) return;
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        showSessionExpiredModal();
        return;
      }
      show({ result: 1, messageError: error.response?.data?.message || error.message || 'Đã có lỗi xảy ra.' });
    }
  };

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm bài kiểm tra' : 'Sửa'}
      </Button>
      <Modal
        title={<div style={{ fontSize: '20px', paddingBottom: '8px' }}>{isCreate ? 'Thêm bài kiểm tra' : 'Sửa bài kiểm tra'}</div>}
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
        style={{ top: 50 }}
      >
        <Form layout="vertical" form={form} initialValues={{ description: '' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên bài kiểm tra"
                rules={[
                  ...RULES_FORM.required,
                  ...RULES_FORM.validateText255,
                ]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="subject_id" label="Môn học" rules={RULES_FORM.required}>
                <Select placeholder="Chọn môn học" allowClear showSearch optionFilterProp="children">
                  {subjects.map((subject) => (
                    <Select.Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="file"
            label="File đề kiểm tra (PDF)"
            rules={RULES_FORM.required}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              name="examFile"
              maxCount={1}
              beforeUpload={(file) => {
                if (file.name.length > 70) {
                  show({
                    result: 1,
                    messageError: 'Tên file không được vượt quá 70 ký tự.',
                  });
                  return Upload.LIST_IGNORE; // Ngăn file được thêm vào danh sách
                }
                return false; // Giữ nguyên hành vi upload thủ công
              }}
              accept=".pdf">
              <Button icon={<PaperClipOutlined />}>Chọn file PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <ReactQuill
              className="custom-quill"
              theme="snow"
              value={description}
              onChange={(value) => {
                setDescription(value);
                form.setFieldsValue({ description: value });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};