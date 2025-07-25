'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Upload, Avatar, Typography, Space } from 'antd';
import type { UploadProps, RcFile } from 'antd/es/upload';
import {
    UserOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    ThunderboltOutlined,
    MailOutlined,
    SmileOutlined,
    CameraOutlined,
    KeyOutlined,
} from '@ant-design/icons';

import { NewuploadFiles } from '@/libs/api/upload.api';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { LOGIN_PATH } from '@/path';
import styles from './LoginPage.module.scss';
import { authAPI } from '@/libs/api/auth.api';
import { encrypt } from '@/libs/access';

const { Title, Text } = Typography;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { show } = useNotification();
    const [form] = Form.useForm();

    const [step, setStep] = useState(0);
    const [otpToken, setOtpToken] = useState('');
    const [registrationData, setRegistrationData] = useState<any>(null);

    const imageFileList = Form.useWatch('image', form);
    const previewImageUrl = imageFileList?.[0]?.url || imageFileList?.[0]?.thumbUrl;

    useEffect(() => {
        document.title = 'Đăng Ký Tài Khoản';
        return () => {
            if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewImageUrl);
            }
        };
    }, [previewImageUrl]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // === BƯỚC 0: LƯU DỮ LIỆU VÀ GỬI YÊU CẦU OTP (KHÔNG UPLOAD) ===
            if (step === 0) {
                //kiểm tra username, email đã tồn tại chưa và gửi otp
                const validationResponse = await authAPI.registerOTP(values.email, values.username);

                // không thành công thì trả ra thông báo lỗi
                if (!validationResponse.success) {
                    show({ result: 1, messageError: validationResponse.message });
                    return;
                }

                // 2. Nếu kiểm tra thành công, LƯU DỮ LIỆU TẠM THỜI
                const imageFile = values.image?.[0]?.originFileObj || null;
                const encryptedPassword = encrypt(values.password);

                const dataToSave = {
                    username: values.username,
                    password: encryptedPassword,
                    name: values.name,
                    email: values.email,
                    imageFile: imageFile, // QUAN TRỌNG: Lưu File object, không phải URL
                };
                setRegistrationData(dataToSave);
                setOtpToken(validationResponse.otpToken!);

                // 3. Thông báo và chuyển bước
                show({ result: 0, messageDone: "Mã OTP đã được gửi đến email của bạn." });
                setStep(1);
                form.resetFields(['otp']);
            }
            // === BƯỚC 1: XÁC THỰC OTP -> UPLOAD ẢNH -> TẠO TÀI KHOẢN ===
            else if (step === 1) {
                // 1. Xác thực OTP trước
                const otpResponse = await authAPI.verifyOtp(values.otp, otpToken);

                if (!otpResponse.success) {
                    show({ result: 1, messageError: otpResponse.message || "Mã OTP không chính xác." });
                    return; // Dừng lại nếu OTP sai
                }

                // 2. Nếu OTP đúng, BÂY GIỜ MỚI BẮT ĐẦU UPLOAD ẢNH
                show({ result: 0, messageDone: "Xác thực thành công! Đang xử lý đăng ký..." });

                let imageUrl: string | null = null;
                // Kiểm tra xem có file ảnh đã được lưu từ bước 0 không
                if (registrationData.imageFile) {
                    const uploadedPaths = await NewuploadFiles([registrationData.imageFile as RcFile], show);
                    if (uploadedPaths && uploadedPaths.length > 0) {
                        imageUrl = uploadedPaths[0];
                    }
                }

                // 3. Tiến hành tạo tài khoản trong DB với dữ liệu đầy đủ
                const finalResponse = await authAPI.register(
                    registrationData.username,
                    registrationData.password,
                    registrationData.name,
                    registrationData.email,
                    imageUrl // Sử dụng imageUrl vừa upload (hoặc null nếu không có ảnh)
                );

                if (finalResponse.success) {
                    show({ result: 0, messageDone: 'Đăng ký thành công! Chuyển đến trang đăng nhập...' });
                    setTimeout(() => router.push(LOGIN_PATH), 2000);
                } else {
                    show({ result: 1, messageError: finalResponse.message || 'Đăng ký thất bại.' });
                }
            }
        } catch (err: any) {
            show({ result: 1, messageError: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(0);
        setOtpToken('');
        setRegistrationData(null);
    };

    const handleImageChange: UploadProps['onChange'] = ({ fileList }) => {
        const newFileList = [...fileList];
        const latestFile = newFileList[0];
        if (latestFile && latestFile.originFileObj) {
            latestFile.url = URL.createObjectURL(latestFile.originFileObj);
        }
        form.setFieldsValue({ image: newFileList });
    };

    const beforeImageUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            show({ result: 1, messageError: 'Bạn chỉ có thể tải lên file JPG/PNG!' });
        }
        return false;
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const uploadButton = (
        <div style={{ textAlign: 'center' }}>
            <CameraOutlined style={{ fontSize: 24, color: '#999' }} />
            <div style={{ marginTop: 8, color: '#999' }}>Chọn ảnh</div>
        </div>
    );

    return (
        <div className={styles.loginContainer} style={{ height: '100vh', overflow: 'hidden' }}>
            <div className={styles.leftPanel}>
                <div className={styles.trianglePattern}>
                    <div className={styles.triangleGrid}>
                        {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className={styles.triangle}></div>
                        ))}
                    </div>
                </div>
                <div className={styles.brandSection}>
                    <div className={styles.logoContainer}>
                        <ThunderboltOutlined className={styles.brandIcon} />
                        <div className={styles.brandText}>
                            <h1 className={styles.brandName}>CHEMISTRY FORUM</h1>
                            <p className={styles.brandTagline}>Diễn đàn hoá học</p>
                        </div>
                    </div>
                    <div className={styles.featuresGrid}>
                        <div className={styles.feature}><div className={styles.featureIcon}>⚡</div><span>Lightning Fast</span></div>
                        <div className={styles.feature}><div className={styles.featureIcon}>🔒</div><span>Ultra Secure</span></div>
                        <div className={styles.feature}><div className={styles.featureIcon}>🚀</div><span>AI Powered</span></div>
                    </div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <Title level={2} className={styles.welcomeTitle}>
                            {step === 0 ? 'Tạo tài khoản' : 'Xác thực Email'}
                        </Title>
                        <Text className={styles.subtitle}>
                            {step === 0
                                ? 'Bắt đầu hành trình của bạn với chúng tôi'
                                : `Một mã OTP đã được gửi đến email ${registrationData?.email}. Vui lòng kiểm tra.`}
                        </Text>
                    </div>

                    <Form name="register" form={form} onFinish={onFinish} layout="vertical" className={styles.loginForm} autoComplete="off">
                        {step === 0 && (
                            <>
                                <Form.Item name="image" valuePropName="fileList" getValueFromEvent={normFile} style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Upload name="avatar" listType="picture-circle" showUploadList={false} beforeUpload={beforeImageUpload} onChange={handleImageChange} maxCount={1}>
                                        {previewImageUrl ? <Avatar size={100} src={previewImageUrl} /> : <Avatar size={100} icon={<CameraOutlined />} style={{ backgroundColor: '#f0f2f5' }}>{uploadButton}</Avatar>}
                                    </Upload>
                                </Form.Item>
                                <Form.Item
                                    name="name" rules={RULES_FORM.required}
                                    className={styles.formItem}>
                                    <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>Họ và Tên</label>
                                        <Input prefix={<SmileOutlined className={styles.inputIcon} />} placeholder="Ví dụ: Nguyễn Văn A" className={styles.input} size="large" />
                                    </div>
                                </Form.Item>
                                <Form.Item name="username" rules={RULES_FORM.required} className={styles.formItem}>
                                    <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>Tên đăng nhập</label>
                                        <Input prefix={<UserOutlined className={styles.inputIcon} />} placeholder="Nhập tên đăng nhập" className={styles.input} size="large" />
                                    </div>
                                </Form.Item>
                                <Form.Item name="email" rules={RULES_FORM.email} className={styles.formItem}>
                                    <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>Email</label>
                                        <Input prefix={<MailOutlined className={styles.inputIcon} />} placeholder="Nhập địa chỉ email" className={styles.input} size="large" type="email" />
                                    </div>
                                </Form.Item>
                                <Form.Item name="password" rules={RULES_FORM.password} className={styles.formItem}><div className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>Mật khẩu</label>
                                    <Input.Password prefix={<LockOutlined className={styles.inputIcon} />} placeholder="Nhập mật khẩu" size="large" className={styles.input} iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} />
                                </div>
                                </Form.Item>
                                <Form.Item name="confirmPassword" dependencies={['password']} hasFeedback rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('Mật khẩu không khớp!')); }, }),]}>
                                    <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>Nhập lại Mật khẩu</label>
                                        <Input.Password prefix={<LockOutlined className={styles.inputIcon} />} placeholder="Nhập lại mật khẩu" size="large" className={styles.input} iconRender={(visible) => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} />
                                    </div>
                                </Form.Item>
                            </>
                        )}
                        {step === 1 && (
                            <Form.Item name="otp" label="Mã OTP" rules={RULES_FORM.required} className={styles.formItem}>
                                <Input prefix={<KeyOutlined className={styles.inputIcon} />} placeholder="Nhập 6 chữ số OTP" size="large" className={styles.input} />
                            </Form.Item>
                        )}
                        <Form.Item>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="primary" htmlType="submit" size="large" loading={loading} className={styles.loginButton} block>
                                    {step === 0 ? 'Gửi mã OTP' : 'Xác nhận & Đăng ký'}
                                </Button>
                                {step === 1 && (
                                    <Button type="link" onClick={handleBack} disabled={loading}>
                                        Quay lại
                                    </Button>
                                )}
                            </Space>
                        </Form.Item>
                    </Form>

                    <div className={styles.registerSection}>
                        <Text className={styles.registerText}>Đã có tài khoản?{' '}<Link href={LOGIN_PATH} className={styles.registerLink}>Đăng nhập tại đây</Link></Text>
                    </div>
                </div>
            </div>
        </div>
    );
}