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
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { getAccountLogin } from '@/env/getInfor_token';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IRole;
  getAll: () => void;
  get_All_Role: () => void;
}

export const RoleModal = ({
  isCreate = false,
  row,
  getAll, get_All_Role,
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
      get_All_Role();
      setTimeout(() => {
        close();
      }, 1000);
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
      // show({
      //   result: 1,
      //   messageError: errorMessage,
      // });
      show({ result: 1, messageError: "Lỗi kết nối đến máy chủ." });

    }
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
                rules={[
                  ...RULES_FORM.required,
                  ...RULES_FORM.validateText255,
                ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={RULES_FORM.validateDescription}
          >
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
