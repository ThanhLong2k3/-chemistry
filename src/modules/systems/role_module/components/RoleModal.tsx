import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { createRole, updateRole } from '@/services/role.service';
import { IRole } from '@/types/role';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { searchSubject } from '@/services/subject.service';
import axios from 'axios';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IRole;
  getAll: () => void;
}

export const RoleModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
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
        const responseData: any = await createRole({
          id: uuidv4(),
          ...values
        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm nhóm quyền thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm nhóm quyền thất bại.',
          });
        }
      } else if (row?.id) {
        const responseData: any = await updateRole({ ...values, id: row.id });
        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật nhóm quyền thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật nhóm quyền thất bại.',
          });
        }
      }
      getAll();
      close();
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
  };

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm nhóm quyền' : 'Sửa'}
      </Button>
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm nhóm quyền' : 'Sửa nhóm quyền'}
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
                label="Tên nhóm quyền"
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
