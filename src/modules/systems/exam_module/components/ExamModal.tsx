import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createExam, updateExam } from '@/services/exam.service';
import { IExam } from '@/types/exam';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { ISubject } from '@/types/subject';
import { searchSubject } from '@/services/subject.service';
import axios from 'axios';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { NewuploadFiles } from '@/libs/api/upload.api';



const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IExam;
  getAll: () => void;
}

// Hàm tiện ích để chuyển đổi URL thành định dạng UploadFile của Antd
const urlToUploadFile = (url: string | null, fieldName: string): UploadFile[] => {
  if (!url) return [];
  return [{
    uid: `-1-${fieldName}`,
    name: url.split('/').pop() || 'file.pdf',
    status: 'done',
    url: url,
  }];
};

export const ExamModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await searchSubject({ page_index: 1, page_size: 10 });
        if (res.success) {
          setSubjects(res.data);
        }
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
        // Chuyển đổi URL của file đề thi thành định dạng UploadFile
        form.setFieldsValue({
          ...row,
          file: urlToUploadFile(row.file, 'file'),
        });
        setDescription(row.description || '');
      }
    }
  }, [isOpen]);


  const handleFileUpload = async (formValue: any): Promise<string | null> => {
    if (!formValue || formValue.length === 0) return null;
    const file = formValue[0];
    if (file.originFileObj) {
      const uploadedPaths = await NewuploadFiles([file.originFileObj], show);
      return uploadedPaths[0];
    } else if (file.url) {
      return file.url;
    }
    return null;
  };
  const handleOk = async () => {
    try {
      //lấy thông tin người dùng đang đăng nhập
      const currentAccount = getAccountLogin();

      if (!currentAccount) {
        show({
          result: 1,
          messageError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        });
        return;
      }

      const values = await form.validateFields();
      const fileUrl = await handleFileUpload(values.file);

      // Xây dựng object dữ liệu cuối cùng để gửi đi
      const dataToSubmit = {
        ...values,
        file: fileUrl,
      };


      if (isCreate) {
        const responseData: any = await createExam({
          id: uuidv4(),
          ...dataToSubmit,
          created_by: currentAccount.username,

        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm bài kiểm tra thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm bài kiểm tra thất bại.',
          });
        }
      } else if (row?.id) {
        const responseData: any = await updateExam({ ...dataToSubmit, id: row.id, updated_by: currentAccount.username });
        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật bài kiểm tra thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật bài kiểm tra thất bại.',
          });
        }
      }
      getAll();
      close();
    } catch (error: any) {
      //lỗi validation của Antd Form có thuộc tính `errorFields`, nếu là lỗi validation thì không cần hiển thị thông báo lỗi.
      // Antd sẽ tự động hiển thị lỗi trên form.
      if (error && error.errorFields) {
        console.log('Validation Failed:', error.errorFields[0].errors[0]);
        return;
      }

      let errorMessage = "Đã có lỗi không xác định xảy ra.";

      if (axios.isAxiosError(error)) {
        const axiosError = error; // TypeScript hiểu đây là AxiosError
        const responseMessage = axiosError.response?.data?.message;

        if (axiosError.response?.status === 401) {
          showSessionExpiredModal();
          return;
        } else {
          errorMessage = responseMessage || axiosError.message;
        }
      }
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Chỉ hiển thị notification cho các lỗi không phải 401
      show({
        result: 1,
        messageError: errorMessage,
      });
    }
  };

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm bài kiểm tra' : 'Sửa'}
      </Button>
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm bài kiểm tra' : 'Sửa bài kiểm tra'}
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
        style={{ top: 50 }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên bài kiểm tra"
                rules={RULES_FORM.required}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subject_id"
                label="Môn học"
                rules={RULES_FORM.required}
              >
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
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload
              name="examFile"
              maxCount={1}
              beforeUpload={() => false}
              accept=".pdf"
            >
              <Button icon={<PaperClipOutlined />}>Chọn file PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={(value) => {
                setDescription(value);
                form.setFieldsValue({ description: value });
              }}
              style={{ height: '200px', marginBottom: '40px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
