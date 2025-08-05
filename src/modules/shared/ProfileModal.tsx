'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Avatar, Typography, Spin, Modal, Divider } from 'antd';
import type { UploadProps, RcFile, UploadFile } from 'antd/es/upload';
import {
    UserOutlined,
    SmileOutlined,
    CameraOutlined,
    MailOutlined,
    SaveOutlined,
    LockOutlined,
    EyeTwoTone,
    EyeInvisibleOutlined
} from '@ant-design/icons';

import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { IDecodedToken } from '@/types/decodedToken';
import { UpLoadImage } from '@/services/upload.service';
import env from "@/env";
import { getAccountLogin } from '@/env/getInfor_token';
import { authAPI } from '@/services/auth.service';

const { Title } = Typography;

// Định nghĩa Props mà component này nhận vào
interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
    const [loading, setLoading] = useState(false);
    const { show } = useNotification();
    const [form] = Form.useForm();
    const [currentUser, setCurrentUser] = useState<IDecodedToken | null>(null);

    const imageFileList = Form.useWatch('image', form);

    // Logic để tạo URL xem trước
    const previewImageUrl = imageFileList?.[0]?.url?.startsWith('blob:')
        ? imageFileList?.[0]?.url
        : imageFileList?.[0]?.url ? `${env.BASE_URL}${imageFileList?.[0]?.url}` : imageFileList?.[0]?.thumbUrl;

    // useEffect để điền dữ liệu vào form khi Modal được mở
    useEffect(() => {
        if (isOpen) {
            const account = getAccountLogin();
            if (account) {
                setCurrentUser(account);
                const initialImage: UploadFile[] = account.image
                    ? [{ uid: '-1', name: 'avatar.png', status: 'done', url: account.image }]
                    : [];
                form.setFieldsValue({
                    ...account,
                    image: initialImage,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                onClose();
            }
        }
    }, [isOpen, form, onClose]);

    // useEffect để dọn dẹp blob URL
    useEffect(() => {
        return () => {
            if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewImageUrl);
            }
        };
    }, [previewImageUrl]);

    // Hàm xử lý khi nhấn nút "Lưu thay đổi"
    const handleOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();

            let imageUrl: string | null = null;
            const imageValue = values.image;

            if (imageValue && imageValue.length > 0) {
                const file = imageValue[0];
                if (file.originFileObj) {
                    const uploadedPaths = await UpLoadImage([file.originFileObj], show);
                    imageUrl = uploadedPaths[0];
                } else if (file.url) {
                    const baseUrl = env.BASE_URL || '';
                    imageUrl = file.url.replace(baseUrl, '');
                }
            } else {
                imageUrl = null;
            }

            const dataToUpdate = {
                name: values.name,
                email: values.email,
                image: imageUrl,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            };

            const updateResponse = await authAPI.updateProfile(dataToUpdate);

            if (updateResponse.success) {
                show({ result: 0, messageDone: updateResponse.message || 'Cập nhật thành công!' });

                const message = values.newPassword
                    ? 'Bạn đã đổi mật khẩu. Vui lòng đăng nhập lại.'
                    : 'Thông tin đã được cập nhật. Vui lòng đăng nhập lại để thấy thay đổi.';
                show({ result: 0, messageDone: message });
                setTimeout(() => {
                    onClose();
                    authAPI.logout();
                }, 2000);
            } else {
                show({ result: 1, messageError: updateResponse.message || 'Cập nhật thất bại.' });
            }
        } catch (err: any) {
            if (err.errorFields) {
                console.log('Lỗi validation:', err.errorFields);
            } else {
                show({ result: 1, messageError: err.message || 'Có lỗi xảy ra. Vui lòng thử lại.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange: UploadProps['onChange'] = ({ fileList }) => {
        const newFileList = fileList.map(file => {
            if (!file.url && file.originFileObj) {
                file.url = URL.createObjectURL(file.originFileObj as RcFile);
            }
            return file;
        });
        form.setFieldsValue({ image: newFileList });
    };

    const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

    return (
        <Modal
            title={<Title level={4} style={{ textAlign: 'center', margin: 0 }}>Chỉnh sửa thông tin cá nhân</Title>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
        >
            {!currentUser ? <div style={{ textAlign: 'center', padding: '48px' }}><Spin /></div> : (
                <Form name="profile" form={form} onFinish={handleOk} layout="vertical" autoComplete="off">

                    <Form.Item name="image" valuePropName="fileList" getValueFromEvent={normFile} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            showUploadList={false}
                            onChange={handleImageChange}
                            maxCount={1}
                            beforeUpload={() => false}
                            accept=".jpg,.jpeg,.png,.gif,.webp"
                        >
                            <Avatar size={100} src={previewImageUrl} icon={!previewImageUrl ? <CameraOutlined /> : undefined} />
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Tên đăng nhập">
                        <Input prefix={<UserOutlined />} size="large" value={currentUser.username} disabled />
                    </Form.Item>

                    <Form.Item label="Họ và Tên" name="name" rules={RULES_FORM.required}>
                        <Input prefix={<SmileOutlined />} placeholder="Ví dụ: Nguyễn Văn A" size="large" />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={RULES_FORM.email}>
                        <Input prefix={<MailOutlined />} placeholder="Nhập địa chỉ email" size="large" type="email" />
                    </Form.Item>

                    <Divider>Đổi mật khẩu (để trống nếu không đổi)</Divider>

                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: !!form.getFieldValue('newPassword'), message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu hiện tại" size="large" />
                    </Form.Item>

                    <Form.Item name="newPassword" label="Mật khẩu mới">
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['newPassword']}
                        rules={[
                            { required: !!form.getFieldValue('newPassword'), message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value && !getFieldValue('newPassword')) return Promise.resolve();
                                    if (getFieldValue('newPassword') !== value) {
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" size="large" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" size="large" loading={loading} block icon={<SaveOutlined />}>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};