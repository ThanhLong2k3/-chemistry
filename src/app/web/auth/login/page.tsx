"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Checkbox, Alert, Typography, } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, GoogleOutlined, FacebookOutlined, ThunderboltOutlined, } from '@ant-design/icons';
import { RULES_FORM } from '@/utils/validator';
import { useNotification } from '@/components/UI_shared/Notification';
import styles from './LoginPage.module.scss';
import { ADMIN_MANAGE_ACCOUNT_PATH, FOGOTPASS_PATH, HOME_PATH, REGISTER_PATH } from '@/path';
import { jwtDecode } from 'jwt-decode';
import { IDecodedToken } from '@/types/decodedToken';
import { usePermissions } from '@/contexts/PermissionContext';
import { authAPI } from '@/services/auth.service';
import env from '@/env';

const { Title, Text } = Typography;


export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { show } = useNotification();
  const { refreshPermissions } = usePermissions();
  const ID_ROLE_STUDENT = env.ID_ROLE_STUDENT;

  useEffect(() => {
    document.title = "Đăng nhập";
    console.log(env);

  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values.username, values.password);

      // Kiểm tra login có thành công và có trả về token không
      if (!response.success || !response.token) {
        show({ result: 1, messageError: response.message || 'Đăng nhập thất bại, vui lòng thử lại.' });
        return;
      }

      const { token } = response;
      let accountInfo: IDecodedToken;

      try {
        // Giải mã token để lấy thông tin người dùng
        accountInfo = jwtDecode<IDecodedToken>(token);
      } catch (e) {
        console.error("Token không hợp lệ:", e);
        show({ result: 1, messageError: 'Đã xảy ra lỗi khi xử lý phiên đăng nhập.' });
        return;
      }

      // Lưu trữ token vào localStorage
      localStorage.setItem('TOKEN', token);
      show({ result: 0, messageDone: 'Đăng nhập thành công!' });

      refreshPermissions();
      if (accountInfo.role_id === ID_ROLE_STUDENT) {
        router.push(`${HOME_PATH}`);
      }
      else {
        router.push(`${ADMIN_MANAGE_ACCOUNT_PATH}`);
      }

    } catch (err: any) {
      console.error("Lỗi ngoài dự kiến khi đăng nhập:", err);
      show({ result: 1, messageError: 'Đã có lỗi kết nối, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Left Side - Geometric Pattern */}
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

      {/* Right Side - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Title level={2} className={styles.welcomeTitle}>
              Chào mừng trở lại!
            </Title>
            <Text className={styles.subtitle}>
              Đăng nhập để tiếp tục
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
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className={styles.loginForm}
          >
            <Form.Item
              name="username"
              rules={RULES_FORM.required}
              className={styles.formItem}
            >
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Tên đăng nhập</label>
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="Nhập tên đăng nhập của bạn"
                  className={styles.input}
                  size="large"
                />
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              className={styles.formItem}
            >
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Mật khẩu</label>
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Nhập mật khẩu"
                  size="large"
                  className={styles.input}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </div>
            </Form.Item>

            <div className={styles.formOptions}>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox className={styles.checkbox}>
                  Ghi nhớ đăng nhập
                </Checkbox>
              </Form.Item>
              <Link href={FOGOTPASS_PATH} className={styles.forgotLink}>
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className={styles.loginButton}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>hoặc</span>
          </div>

          <div className={styles.socialButtons}>
            <Button
              icon={<GoogleOutlined />}
              className={styles.socialButton}
              size="large"
            >
              Đăng nhập với Google
            </Button>
            {/* <Button
              icon={<FacebookOutlined />}
              className={styles.socialButton}
              size="large"
            >
              Đăng nhập với Facebook
            </Button> */}
          </div>

          <div className={styles.registerSection}>
            <Text className={styles.registerText}>
              Chưa có tài khoản?{' '}
              <Link href={REGISTER_PATH} className={styles.registerLink}>
                Đăng ký ngay
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}