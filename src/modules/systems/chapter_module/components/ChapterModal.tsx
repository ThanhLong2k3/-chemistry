import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { createChapter, updateChapter } from '@/services/chapter.service';
import { IChapter } from '@/types/chapter';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { ISubject } from '@/types/subject';
import { searchSubject } from '@/services/subject.service';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { getAccountLogin } from '@/env/getInfor_token';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IChapter;
  getAll: () => void;
}

export const ChapterModal = ({
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
        form.setFieldsValue(row);
        setDescription(row.description || '');
      }
    }

    if (isOpen) {
      if (isCreate) {
        form.resetFields();
        setDescription('');
      } else if (row) {
        form.setFieldsValue(row); //đổ data cũ vào form sửa
        setDescription(row.description || '');
      }
    }
  }, [isOpen]);


  useEffect(() => {
  }, [isOpen]);

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

      if (isCreate) {
        const responseData: any = await createChapter({
          id: uuidv4(),
          ...values,
          created_by: currentAccount.username,

        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm chương thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm chương thất bại.',
          });
        }
      } else if (row?.id) {
        const responseData: any = await updateChapter({ ...values, id: row.id, updated_by: currentAccount.username });
        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật chương thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật chương thất bại.',
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
        {isCreate ? 'Thêm chương' : 'Sửa'}
      </Button>
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm chương' : 'Sửa chương'}
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
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên chương"
                rules={RULES_FORM.required}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={4}>
              <Form.Item
                name="sort_order"
                label="Sắp xếp"
                rules={RULES_FORM.required}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <div className="custom-quill-wrapper">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={(value) => {
                  setDescription(value);
                  form.setFieldsValue({ description: value });
                }}
                className="custom-quill"
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
