'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Typography, Space } from 'antd';
import { MailOutlined, ThunderboltOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons';
import { authAPI } from '@/libs/api/auth.api';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import styles from './ForgotPasswordPage.module.scss';
import { LOGIN_PATH } from '@/path';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { show } = useNotification();

  const [step, setStep] = useState(0);
  const [otpToken, setOtpToken] = useState('');
  const [email, setEmail] = useState('');

  const [form] = Form.useForm();

  useEffect(() => {
    document.title = 'Quên mật khẩu';
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (step === 0) {
        const response = await authAPI.forgotPassword(values.email);
        if (response.success && response.otpToken) {
          show({ result: 0, messageDone: response.message });
          setOtpToken(response.otpToken);
          setEmail(values.email);
          setStep(1);
          form.resetFields(['otp']);
        } else {
          show({ result: 1, messageError: response.message });
        }
      }
      else if (step === 1) {
        const response = await authAPI.verifyOtp(values.otp, otpToken);
        if (response.success) {
          show({ result: 0, messageDone: "Xác thực OTP thành công!" });
          setStep(2);
          form.resetFields(['newPassword', 'confirmPassword']);
        } else {
          show({ result: 1, messageError: response.message });
        }
      }
      else if (step === 2) {
        if (values.newPassword !== values.confirmPassword) {
          show({ result: 1, messageError: "Mật khẩu xác nhận không khớp!" });
          setLoading(false);
          return;
        }
        const response = await authAPI.resetPassword(email, values.newPassword);
        if (response.success) {
          show({ result: 0, messageDone: response.message });
          setTimeout(() => router.push(LOGIN_PATH), 1500);
        } else {
          show({ result: 1, messageError: response.message });
        }
      }
    } catch (error: any) {
      show({ result: 1, messageError: error.message || "Đã có lỗi xảy ra." });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(0);
    form.resetFields();
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      {/* ===== PHẦN GIAO DIỆN BÊN TRÁI ===== */}
      <div className={styles.leftPanel}>
        <div className={styles.trianglePattern}>
          <div className={styles.triangleGrid}>
            {Array.from({ length: 24 }, (_, i) => (<div key={i} className={styles.triangle}></div>))}
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

      {/* ===== PHẦN GIAO DIỆN BÊN PHẢI ===== */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Title level={2} className={styles.welcomeTitle}>Khôi phục mật khẩu</Title>
            {step === 0 && <Text className={styles.subtitle}>Nhập email để nhận mã xác thực OTP.</Text>}
            {step === 1 && <Text className={styles.subtitle}>Mã OTP đã được gửi đến <strong>{email}</strong>.</Text>}
            {step === 2 && <Text className={styles.subtitle}>Xác thực thành công. Vui lòng đặt mật khẩu mới.</Text>}
          </div>


          <Form form={form} onFinish={onFinish} layout="vertical" className={styles.forgotPasswordForm}>

            {step === 0 && (
              <Form.Item name="email" rules={RULES_FORM.email} className={styles.formItem}>
                <div className={styles.inputContainer}>
                  <Input prefix={<MailOutlined className={styles.inputIcon} />} placeholder="Nhập địa chỉ email của bạn" size="large" className={styles.input} />
                </div>
              </Form.Item>
            )}

            {step === 1 && (
              <Form.Item name="otp" label="Mã OTP" rules={RULES_FORM.required} className={styles.formItem}>
                <Input prefix={<KeyOutlined className={styles.inputIcon} />} placeholder="Nhập 6 chữ số OTP" size="large" className={styles.input} />
              </Form.Item>
            )}

            {step === 2 && (
              <>
                <Form.Item name="newPassword" label="Mật khẩu mới" rules={RULES_FORM.required} className={styles.formItem}>
                  <Input.Password prefix={<LockOutlined className={styles.inputIcon} />} placeholder="Nhập mật khẩu mới" size="large" className={styles.input} />
                </Form.Item>
                <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" rules={RULES_FORM.required} className={styles.formItem}>
                  <Input.Password prefix={<LockOutlined className={styles.inputIcon} />} placeholder="Xác nhận mật khẩu mới" size="large" className={styles.input} />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" htmlType="submit" size="large" loading={loading} block className={styles.resetPasswordButton} style={{ marginTop: '10px' }}>
                  {step === 0 && 'Gửi OTP'}
                  {step === 1 && 'Xác nhận OTP'}
                  {step === 2 && 'Đặt lại mật khẩu'}
                </Button>
                {step > 0 && (
                  <Button type="link" onClick={handleBack} disabled={loading}>
                    Quay lại
                  </Button>
                )}
              </Space>
            </Form.Item>

            {step === 0 && (
              <div className={styles.registerSection}>
                <Text className={styles.registerText}>
                  Đã nhớ mật khẩu?{' '}
                  <Link href={LOGIN_PATH} className={styles.registerLink}>Đăng nhập</Link>
                </Text>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div >
  );
}