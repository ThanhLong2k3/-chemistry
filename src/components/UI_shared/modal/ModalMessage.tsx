'use client';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, Typography } from 'antd';
import type { ModalProps } from 'antd';
import { motion } from 'framer-motion';

import classes from './modal.module.scss';

export const ModalMessage = ({
  message,
  isSuccess = true,
  ...props
}: {
  message: string;
  isSuccess: boolean;
} & ModalProps) => {
  

  return (
    <Modal
      width={400}
      footer
      closeIcon={false}
      centered
      className={classes.modalMessage}
      {...props}
    >
      <Flex justify="flex-end">
        <Button onClick={props.onCancel} shape="circle" icon={<CloseOutlined />} />
      </Flex>
      <Flex
        justify="center"
        align="center"
        vertical
        className={classes.content}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={classes.icon}
          style={{
            borderColor: isSuccess
              ? 'var(--color-success)'
              : 'var(--color-danger)',
          }}
        >
          {isSuccess ? (
            <CheckOutlined style={{ fontSize: 20, color: 'green' }} />
          ) : (
            <CloseOutlined style={{ fontSize: 20, color: 'red' }} />

          )}
        </motion.div>
        <Typography.Title
          level={4}
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 0,
            marginTop: 8,
          }}
        >
          {isSuccess ? "Xóa thành công" : "Xóa thất bại"}
        </Typography.Title>
        <Typography.Text style={{ textAlign: 'center', marginBottom: 18 }}>
          {message}
        </Typography.Text>

        <Button onClick={props.onCancel}>{"Hủy"}</Button>
      </Flex>
    </Modal>
  );
};
