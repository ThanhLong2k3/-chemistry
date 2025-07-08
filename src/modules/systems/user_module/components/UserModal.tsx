import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { createUser, updateUser } from '@/services/user.service';
import { IUser } from '@/types/user';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined } from '@ant-design/icons';

interface Props {
  isCreate?: boolean;
  row?: IUser;
  getAll: () => void;
}

export const UserModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        form.resetFields();
      } else if (row) {
        form.setFieldsValue({ ...row, password: '' });
      }
    }
  }, [isOpen]);

  const handleOk = async () => {
    try {
      debugger;
      const values = await form.validateFields();
      if (isCreate) {
        const data: any = await createUser(values);
        show({
          result: data.data.result,
          messageDone: 'Thêm người dùng thành công',
          messageError: 'Thêm người dùng thất bại',
          messageErrorOfRighs: 'Tài khoản hoặc Email đã tồn tại !',
        });
      } else if (row?.id) {
        const result: any = await updateUser({ ...values, id: row.id });
        show({
          result: result.data.result,
          messageDone: 'Cập nhập người dùng thành công',
          messageError: 'Cập nhập người dùng thất bại',
        });
      }
      getAll();
      close();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={<EditOutlined/>}>
        {isCreate ? 'Thêm người dùng' : 'Sửa'}
      </Button>
      <Modal
        title={isCreate ? 'Thêm người dùng' : 'Sửa người dùng'}
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={RULES_FORM.required}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={RULES_FORM.email}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={RULES_FORM.required}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
