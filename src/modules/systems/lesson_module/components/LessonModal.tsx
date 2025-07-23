import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createLesson, updateLesson } from '@/services/lesson.service';
import { ILesson } from '@/types/lesson';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { searchChapter } from '@/services/chapter.service';
import axios from 'axios';
import { IChapter } from '@/types/chapter';
import { NewuploadFiles } from '@/libs/api/upload.api';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { showSessionExpiredModal } from '@/utils/session-handler';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: ILesson;
  getAll: () => void;
}

export const LessonModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');
  const [chapters, setChapters] = useState<IChapter[]>([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await searchChapter({ page_index: 1, page_size: 100 });
        if (res.success) {
          setChapters(res.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải chương:', err);
      }
    };

    if (isOpen) {
      fetchChapters();

      if (isCreate) {
        form.resetFields();
        setDescription('');
      } else if (row) {
        form.setFieldsValue(row);
        setDescription(row.description || '');
      }
    }
  }, [isOpen]);


  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        form.resetFields();
        setDescription('');
      } else if (row) {
        const imageFileList: UploadFile[] = row.image
          ? [
            {
              uid: '-1',
              name: 'avatar.png',
              status: 'done',
              url: row.image,
            },
          ]
          : [];
        form.setFieldsValue({ ...row, image: imageFileList }); //đổ data cũ vào form sửa
        setDescription(row.description || '');
      }
    }
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

      let imageUrl: string | null = null;
      const imageValue = values.image; // imageValue bây giờ luôn là một mảng

      if (imageValue && imageValue.length > 0) {
        const file = imageValue[0];
        if (file.originFileObj) {
          const uploadedPaths = await NewuploadFiles([file.originFileObj], show);
          imageUrl = uploadedPaths[0];
        } else if (file.url) {
          imageUrl = file.url;
        }
      } else {
        imageUrl = null;
      }

      if (isCreate) {
        const responseData: any = await createLesson({
          id: uuidv4(),
          ...values,
          created_by: currentAccount.username,
          image: imageUrl
        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm bài học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm bài học thất bại.',
          });
        }
      } else if (row?.id) {
        const responseData: any = await updateLesson({ ...values, id: row.id, updated_by: currentAccount.username, image: imageUrl });
        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật bài học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật bài học thất bại.',
          });
        }
      }
      getAll();
      close();
    } catch (error) {
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
        {isCreate ? 'Thêm bài học' : 'Sửa'}
      </Button >
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm bài học' : 'Sửa bài học'}
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
        style={{ top: 30 }}
        styles={{ body: { height: '75vh' } }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="image"
                label="Ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload
                  name="avatar"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >

                  <Button style={{ marginBottom: '12px' }}
                    icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên bài học"
                rules={RULES_FORM.required}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="chapter_id"
                label="Tên chương"
                rules={RULES_FORM.required}
              >
                <Select placeholder="Chọn chương" allowClear showSearch optionFilterProp="children">
                  {chapters.map((chapter) => (
                    <Select.Option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
              style={{ height: '270px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
