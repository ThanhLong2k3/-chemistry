import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect } from 'react';
import { createAccount, updateAccount } from '@/services/account.service';
import { IAccount } from '@/types/account';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { encrypt } from '@/libs/access';
import { NewuploadFiles } from '@/libs/api/upload.api';
import { getAccountLogin } from '@/helpers/auth/auth.helper';

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

  // 1. Sử dụng Form.useWatch để theo dõi giá trị của trường 'image'
  const imageFileList = Form.useWatch('image', form);

  // 2. Kiểm tra xem có ảnh hay không. `hasImage` sẽ là true nếu có file, và false nếu không có.
  const hasImage = imageFileList && imageFileList.length > 0;

  useEffect(() => {
    if (isOpen) {
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
          role: row.role,
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
        const data: any = await createAccount({ ...dataToSubmit, updated_by: currentAccount.username });
        show({
          result: data.data.result,
          messageDone: 'Thêm người dùng thành công',
          messageError: 'Thêm người dùng thất bại',
          messageErrorOfRighs: 'Tài khoản hoặc Email đã tồn tại !',
        });
      } else if (row?.username) {
        const result: any = await updateAccount({ ...dataToSubmit, id: row.username, updated_by: currentAccount.username });
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

              {isCreate ?
                (
                  <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={RULES_FORM.required}
                  >
                    <Input disabled={!isCreate} />
                  </Form.Item>
                ) : null
              }

              {/* nếu đang ở dialog tạo vào đang có ảnh (tức là ở sửa và có ảnh thì có ô tên người dùng) */}
              {isCreate && hasImage ? null :
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
                name="role"
                label="Quyền"
                rules={RULES_FORM.required}
              >
                <Select placeholder="Chọn quyền">
                  <Select.Option value="admin">Quản trị viên</Select.Option>
                  <Select.Option value="teacher">Giáo viên</Select.Option>
                  <Select.Option value="collaborator">Cộng tác viên</Select.Option>
                  <Select.Option value="student">Học sinh</Select.Option>
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
            {isCreate && hasImage ?
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