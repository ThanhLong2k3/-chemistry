import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createAccount, updateAccount } from '@/services/account.service';
import { IAccount } from '@/types/account';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { encrypt } from '@/libs/access';
import { NewuploadFiles } from '@/libs/api/upload.api';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { IRole } from '@/types/role';
import { searchRole } from '@/services/role.service';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';

interface Props {
  isCreate?: boolean;
  row?: IAccount;
  getAll: () => void;
}

export const AccountModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  // THÊM STATE MỚI ĐỂ LƯU DANH SÁCH VAI TRÒ
  const [roles, setRoles] = useState<IRole[]>([]);

  // 1. Sử dụng Form.useWatch để theo dõi giá trị của trường 'image'
  const imageFileList = Form.useWatch('image', form);

  // 2. Kiểm tra xem có ảnh hay không. `hasImage` sẽ là true nếu có file, và false nếu không có.
  const hasImage = imageFileList && imageFileList.length > 0;

  useEffect(() => {
    if (isOpen) {

      //mới thêm
      const fetchRoles = async () => {
        try {
          // Gọi API lấy tất cả các vai trò, không phân trang
          const response: any = await searchRole({ page_index: 1, page_size: 1000 });
          setRoles(response.data || []);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách vai trò:", error);
        }
      };

      fetchRoles();


      if (isCreate) {
        form.resetFields();
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


        form.setFieldsValue({
          username: row.username,
          name: row.name,
          email: row.email,
          role_id: row.role_id,
          password: '',
          image: imageFileList, // Set giá trị đã được chuyển đổi chính xác
        });
      }
    }
  }, [isOpen]);

  const handleOk = async () => {
    try {
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


      if (values.password) {
        values.password = encrypt(values.password);
      } else {
        delete values.password;
      }

      const dataToSubmit = {
        ...values,
        image: imageUrl,
      };



      if (isCreate) {
        const data: any = await createAccount({ ...dataToSubmit, created_by: currentAccount.username });

        show({
          result: data.data.result,
          messageDone: 'Thêm người dùng thành công',
          messageError: 'Thêm người dùng thất bại',
          messageErrorOfRighs: 'Tài khoản hoặc Email đã tồn tại !',
        });
      } else if (row?.username) {
        const result: any = await updateAccount({ ...dataToSubmit, old_username: row.username, updated_by: currentAccount.username });
        show({
          result: result.data.result,
          messageDone: 'Cập nhập người dùng thành công',
          messageError: 'Cập nhập người dùng thất bại',
        });
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
        {isCreate ? 'Thêm người dùng' : 'Sửa'}
      </Button>
      <Modal
        title=
        {
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm người dùng' : 'Sửa người dùng'}
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="image"
                label="Ảnh đại diện"
                valuePropName="fileList"
                style={hasImage ? { height: '147px' } : {}}
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
                  <Button icon={<UploadOutlined />}
                    style={hasImage ? { marginBottom: '12px' } : {}}
                  >Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={RULES_FORM.required}
              >
                <Input />
              </Form.Item>

              {/* nếu đang ở dialog sửa vào đang có k có ảnh*/}
              {hasImage ? null :
                (<Form.Item
                  name="name"
                  label="Tên người dùng"
                  rules={RULES_FORM.required}
                >
                  <Input />
                </Form.Item>)
              }
            </Col>
            <Col span={12}>
              <Form.Item
                name="role_id"
                label="Quyền"
                rules={RULES_FORM.required}
              >
                <Select placeholder="Chọn quyền">
                  {roles.map(role => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.name}
                    </Select.Option>
                  ))}
                </Select>
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
              </Form.Item></Col>
            {/* nếu đang ở dialog tạo và có ảnh thì tăng chiều rộng, chỉ định 1 mình nó 1 dòng */}
            {hasImage ?
              (<Form.Item
                name="name"
                label="Tên người dùng"
                style={{ width: '100%', padding: '0px 12px' }}
                rules={RULES_FORM.required}
              >
                <Input />
              </Form.Item>
              ) :
              null}
          </Row>
        </Form>
      </Modal >
    </>
  );
};