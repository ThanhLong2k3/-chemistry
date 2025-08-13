import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createBlog, updateBlog } from '@/services/blog.service';
import { IBlog } from '@/types/blog';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { getAccountLogin } from '@/env/getInfor_token';
import { UpLoadImage } from '@/services/upload.service';
import env from '@/env';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IBlog;
  getAll: () => void;
}

export const BlogModal = ({ isCreate = false, row, getAll }: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');

  const imageFileList = Form.useWatch('image', form);
  const hasImage = imageFileList && imageFileList.length > 0;

  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        form.resetFields();
        setDescription('');
      } else if (row) {
        const convertImage = (url: string | null): UploadFile[] => {
          if (!url) return [];
          return [
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: `${env.BASE_URL}${url}`,
            },
          ];
        };

        form.setFieldsValue({
          ...row,
          image: convertImage(row.image),
        });
        setDescription(row.description || '');
      }
    }
  }, [isOpen]);

  const handleOk = async () => {
    try {
      const currentAccount = getAccountLogin();
      if (!currentAccount) {
        show({ result: 1, messageError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
        return;
      }

      const values = await form.validateFields();

      const extractImageUrl = async (fileList: UploadFile[] | undefined): Promise<string | null> => {
        if (!fileList || fileList.length === 0) return null;
        const file = fileList[0];
        if (file.originFileObj) {
          const uploadedPaths = await UpLoadImage([file.originFileObj], show);
          return uploadedPaths[0];
        } else if (file.url) {
          return file.url.replace(env.BASE_URL, '');
        }
        return null;
      };

      const imageUrl = await extractImageUrl(values.image);

      const dataToSubmit = {
        ...values,
        image: imageUrl,
        description,
      };

      let responseData: any;
      if (isCreate) {
        responseData = await createBlog({
          id: uuidv4(),
          ...dataToSubmit,
          created_by: currentAccount.username,
        });
      } else if (row?.id) {
        responseData = await updateBlog({
          ...dataToSubmit,
          id: row.id,
          updated_by: currentAccount.username,
        });
      }

      show({
        result: responseData.success ? 0 : 1,
        messageDone: isCreate ? 'Thêm bài viết thành công!' : 'Cập nhật bài viết thành công!',
        messageError: responseData.message || (isCreate ? 'Thêm bài viết thất bại.' : 'Cập nhật bài viết thất bại.'),
      });

      getAll();
      setTimeout(() => {
        close();
      }, 1000);
    } catch (error: any) {
      if (error?.errorFields) return;

      let errorMessage = 'Đã có lỗi không xác định xảy ra.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          showSessionExpiredModal();
          return;
        }
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      show({ result: 1, messageError: errorMessage });
    }
  };

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm bài viết' : 'Sửa'}
      </Button>
      <Modal
        title={<div style={{ fontSize: '20px', paddingBottom: '8px' }}>{isCreate ? 'Thêm bài viết' : 'Sửa bài viết'}</div>}
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
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  name="avatar"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={(file) => {
                    if (file.name.length > 70) {
                      show({
                        result: 1,
                        messageError: 'Tên ảnh không được vượt quá 70 ký tự.',
                      });
                      return Upload.LIST_IGNORE; // Ngăn file được thêm vào danh sách
                    }
                    return false; // Giữ nguyên hành vi upload thủ công
                  }}
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                >
                  <Button icon={<UploadOutlined />} style={hasImage ? { marginBottom: '12px' } : {}}>
                    Chọn ảnh
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item name="title" label="Tiêu đề bài viết" rules={RULES_FORM.required}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

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