'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { MailOutlined, ThunderboltOutlined } from '@ant-design/icons'; // Import ThunderboltOutlined
import { authAPI } from '@/libs/api/auth.api';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import styles from './ForgotPasswordPage.module.scss'; // Import SCSS module
import { LOGIN_PATH } from '@/path';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Thêm state cho lỗi
  const { show } = useNotification();

  useEffect(() => {
    document.title = 'Quên mật khẩu';
  }, []);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);

    try {
      // await authAPI.forgotpass(values.email); // <-- API gọi xử lý gửi mật khẩu về email

      show({
        result: 0,

        messageDone: 'Mật khẩu đã được gửi về email nếu tài khoản tồn tại.',
      });

      router.push(LOGIN_PATH); // quay về login
    } catch (error: any) {
      show({
        result: 1,

        messageError: error?.message || 'Gửi email thất bại. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      {/* Left Side - Geometric Pattern (similar to Login Page) */}
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
              <h1 className={styles.brandName}>Gia phả Việt</h1>
              <p className={styles.brandTagline}>
                Viện trí tuệ nhân tạo Việt Nam
              </p>
            </div>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <span>Lightning Fast</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <span>Ultra Secure</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚀</div>
              <span>AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Title level={2} className={styles.welcomeTitle}>
              Quên mật khẩu?
            </Title>
            <Text className={styles.subtitle}>
              Nhập email của bạn và chúng tôi sẽ gửi mật khẩu mới cho bạn.
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className={styles.errorAlert}
            />
          )}

          <Form
            name="forgotPassword"
            onFinish={onFinish}
            layout="vertical"
            className={styles.forgotPasswordForm}
          >
            <Form.Item
              name="email"
              rules={RULES_FORM.email}
              className={styles.formItem}
            >
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Email</label>
                <Input
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="Nhập địa chỉ email của bạn"
                  type="email"
                  size="large"
                  className={styles.input}
                />
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className={styles.resetPasswordButton}
              >
                Gửi mật khẩu mới
              </Button>
            </Form.Item>

            <div className={styles.registerSection}>
              <Text className={styles.registerText}>
                Đã nhớ mật khẩu?{' '}
                <Link href={LOGIN_PATH} className={styles.registerLink}>
                  Đăng nhập
                </Link>
              </Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
