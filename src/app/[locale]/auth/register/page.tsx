'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, Input, Button, Checkbox, Alert, Typography } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { authAPI } from '@/libs/api/auth.api';
import { RULES_FORM } from '@/utils/validator';
import { useNotification } from '@/components/UI_shared/Notification';
import styles from './LoginPage.module.scss';
import { createUser, login } from '@/services/user.service';
import { encrypt } from '@/libs/access';
import { LOGIN_PATH } from '@/path';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { show } = useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    document.title = 'Đăng Ký';
  }, []);
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        id: '',
        username: values.userName,
        email: values.email,
        password: encrypt(values.password),
      };

      const res: any = await createUser(payload);

      show({
        result: res.data.result,
        messageDone: 'Đăng ký thành công',
        messageError: 'Tài khoản hoặc Mật khẩu không đúng!',
        messageErrorOfRighs:'Tài khoản hoặc Email đã tồn tại!'
      });

      form.resetFields(); 
    } catch (err: any) {
      const errorCode = err.response?.data?.errorCode || 8;
      show({ result: errorCode });
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
              <h1 className={styles.brandName}>Gia phả Việt</h1>
              <p className={styles.brandTagline}>
                Viện trí tuệ nhân vạo Việt Nam
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

      {/* Right Side - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Title level={2} className={styles.welcomeTitle}>
              Chào mừng trở lại!
            </Title>
            <Text className={styles.subtitle}>
              Đăng ký để tiếp tục với Gia phả việt
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
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className={styles.loginForm}
          >
            <Form.Item
              name="userName"
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
              name="email"
              rules={RULES_FORM.email}
              className={styles.formItem}
            >
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Email</label>
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="Nhập email của bạn"
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

            <Form.Item
              name="confilmpassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
              className={styles.formItem}
            >
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Nhập lại Mật khẩu</label>
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder=" Nhập lại mật khẩu"
                  size="large"
                  className={styles.input}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className={styles.loginButton}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.registerSection}>
            <Text className={styles.registerText}>
              Đã có tài khoản?{' '}
              <Link href={LOGIN_PATH} className={styles.registerLink}>
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
