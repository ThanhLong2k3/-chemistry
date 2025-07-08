"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Alert,
  Typography,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { authAPI } from '@/libs/api/auth.api';
import { RULES_FORM } from '@/utils/validator';
import { useNotification } from '@/components/UI_shared/Notification';
import styles from './LoginPage.module.scss';
import { login } from '@/services/user.service';
import { encrypt } from '@/libs/access';
import { cookies } from 'next/headers';
import { FOGOTPASS_PATH, REGISTER_PATH } from '@/path';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { show } = useNotification();

  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
debugger;
    try {
      const value={
        UserName:values.userName,
        PassWork:encrypt(values.password)
      }
      const data:any = await login(value);
      if(!data.success)
      {
        show({ result: 1, messageError: data.message });
      }

      show({ result: 0, messageDone: 'Đăng nhập thành công' });
      console.log("data",data);
      localStorage.setItem('ROLE',data.role);
      localStorage.setItem('USERNAME',data.username);
      localStorage.setItem('ID_USER',data.id_user);
      data.role==='user'? router.push('/vi/admin_user'):router.push('/vi/manage_user');
      
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
              <p className={styles.brandTagline}>Viện trí tuệ nhân vạo Việt Nam</p>
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
              Đăng nhập để tiếp tục với Gia phả việt
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
            <Button 
              icon={<FacebookOutlined />} 
              className={styles.socialButton}
              size="large"
            >
              Đăng nhập với Facebook
            </Button>
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