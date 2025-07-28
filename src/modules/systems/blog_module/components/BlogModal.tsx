import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createBlog, updateBlog } from '@/services/blog.service';
import { IBlog } from '@/types/blog';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css'; // CSS mặc định
import dynamic from 'next/dynamic';
import axios from 'axios';
import { NewuploadFiles } from '@/libs/api/upload.api';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { showSessionExpiredModal } from '@/utils/session-handler';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IBlog;
  getAll: () => void;
}

export const BlogModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');

  // 1. Sử dụng Form.useWatch để theo dõi giá trị của trường 'image'
  const imageFileList = Form.useWatch('image', form);

  // 2. Kiểm tra xem có ảnh hay không. `hasImage` sẽ là true nếu có file, và false nếu không có.
  const hasImage = imageFileList && imageFileList.length > 0;


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
        const responseData: any = await createBlog({
          id: uuidv4(),
          ...values,
          created_by: currentAccount.username,
          image: imageUrl
        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm bài viết thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm bài viết thất bại.',
          });
        }
      } else if (row?.id) {
        const responseData: any = await updateBlog({ ...values, id: row.id, updated_by: currentAccount.username, image: imageUrl });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật bài viết thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật bài viết thất bại.',
          });
        }
      }
      getAll();
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
  }

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm bài viết' : 'Sửa'}
      </Button>
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm bài viết' : 'Sửa bài viết'}
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
        style={{ top: 15 }}
      >
        <Form layout="vertical" form={form}>

          <Row gutter={24}>
            <Col span={12}>
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
                  <Button icon={<UploadOutlined />} style={hasImage ? { marginBottom: '12px' } : {}}
                  >Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="title"
                label="Tiêu đề bài viết"
                rules={RULES_FORM.required}
              >
                <Input />
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
              style={{ height: '200px', marginBottom: '40px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
