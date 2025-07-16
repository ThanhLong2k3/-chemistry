import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createSubject, updateSubject } from '@/services/subject.service';
import { ISubject } from '@/types/subject';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css'; // CSS mặc định
import dynamic from 'next/dynamic';
import { getAccountLogin } from '@/helpers/auth/auth.helper';
import axios from 'axios';
import { NewuploadFiles } from '@/libs/api/upload.api';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: ISubject;
  getAll: () => void;
}

export const SubjectModal = ({
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
        const responseData: any = await createSubject({
          id: uuidv4(),
          ...values,
          created_by: currentAccount.username,
          image: imageUrl
        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm môn học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm môn học thất bại.',
          });
        }
      } else if (row?.id) {
        console.log({ ...values, id: row.id, updated_by: currentAccount.username });

        const responseData: any = await updateSubject({ ...values, id: row.id, updated_by: currentAccount.username, image: imageUrl });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật môn học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật môn học thất bại.',
          });
        }
      }
      getAll();
    } catch (error) {
      let errorMessage = 'Đã có lỗi không xác định xảy ra.';
      // 1. Kiểm tra xem đây có phải là lỗi từ Axios không
      if (axios.isAxiosError(error)) {
        // 2. Lấy thông báo lỗi từ response của backend (nếu có)
        const responseMessage = error.response?.data?.message;
        // 3. Xử lý cụ thể cho từng mã lỗi
        if (error.response?.status === 403) {
          // Lỗi 403: Không có quyền
          errorMessage = responseMessage || 'Bạn không có quyền thực hiện hành động này.';
        } else if (error.response?.status === 401) {
          // Lỗi 401: Chưa xác thực hoặc token hết hạn
          errorMessage = responseMessage || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
        } else {
          // Các lỗi khác (500, 404, ...)
          errorMessage = responseMessage || 'Lỗi từ máy chủ, vui lòng thử lại sau.';
        }
      }
      show({
        result: 1,
        messageError: errorMessage,
      });
    } finally {
      close();
    };
  }

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm môn học' : 'Sửa'}
      </Button>
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm môn học' : 'Sửa môn học'}
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
                name="name"
                label="Tên môn học"
                rules={RULES_FORM.required}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="textbook"
                label="Sách giáo khoa"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="workbook"
                label="Sách bài tập"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="exercise_book"
                label="Vở bài tập"
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
