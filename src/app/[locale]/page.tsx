'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Alert,
  Divider,
  Typography,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { authAPI } from '@/libs/api/auth.api';
import { RULES_FORM } from '@/utils/validator';
import { useNotification } from '@/components/UI_shared/Notification';
const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { show } = useNotification();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const data: any = await authAPI.login(values.email, values.password);

      show({ result: data, messageDone: 'Đăng nhập thành công' });
    } catch (err: any) {
      const errorCode = err.response?.data?.errorCode || 8;
      show({ result: errorCode });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
        padding: '12px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '16px' }}>
          Đăng nhập
        </Title>
        <Text
          type="secondary"
          style={{
            display: 'block',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          Hoặc{' '}
          <Link href="/vi/register" style={{ fontWeight: 500 }}>
            đăng ký tài khoản mới
          </Link>
        </Text>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item name="email" rules={RULES_FORM.email}>
            <Input prefix={<UserOutlined />} placeholder="Địa chỉ email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Link href="#" style={{ fontSize: '14px' }}>
                Quên mật khẩu?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Hoặc đăng nhập với</Divider>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <Button icon={<GoogleOutlined />} style={{ width: '100%' }}>
            Google
          </Button>
          <Button icon={<FacebookOutlined />} style={{ width: '100%' }}>
            Facebook
          </Button>
        </div>
      </Card>
    </div>
  );
}
