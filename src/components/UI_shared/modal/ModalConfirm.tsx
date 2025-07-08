'use client';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Space, Typography, ConfigProvider } from 'antd';
import type { ModalProps } from 'antd';

const { Text } = Typography;

interface Props extends Omit<ModalProps, 'onOk'> {
  children: React.ReactNode;
  onOk?: () => void | Promise<void>;
}

export const ModalConfirm = ({
  title = 'Xác nhận',
  open,
  onCancel,
  onOk,
  children,
  confirmLoading,
  ...props
}: Props) => {

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: '#ffffff',
            headerBg: '#ffffff',
            titleFontSize: 16,
            titleLineHeight: 1.5,
          },
        },
      }}
    >
      <Modal
        {...props}
        title={
          <Space align="center" size={8}>
            <ExclamationCircleFilled 
              style={{ 
                color: '#faad14', 
                fontSize: '16px' 
              }} 
            />
            <Text strong style={{ fontSize: '16px' }}>
              {title}
            </Text>
          </Space>
        }
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
        centered
        destroyOnClose
        maskClosable={false}
        cancelText={"Hủy"}
        okText={"Đồng ý"}
        okButtonProps={{
          style: { 
            boxShadow: 'none',
          }
        }}
        cancelButtonProps={{
          type: 'default'
        }}
        styles={{
          header: {
            paddingBottom: '16px',
            marginBottom: '16px',
            borderBottom: '1px solid #f0f0f0',
          },
          body: {
            paddingTop: 0,
          },
          footer: {
            paddingTop: '16px',
            marginTop: '24px',
            borderTop: '1px solid #f0f0f0',
          },
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '40px',
          padding: '8px 0'
        }}>
          {children}
        </div>
      </Modal>
    </ConfigProvider>
  );
};