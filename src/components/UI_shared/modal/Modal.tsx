'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button, Modal as ModalAntd, Typography } from 'antd';
import type { ModalProps } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import classes from './modal.module.scss';

const modalVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100, transition: { duration: 0.15, ease: 'easeOut' } },
};

const top = 40;

interface Props extends ModalProps {
  extraActions?: React.ReactNode;
}

export const Modal = ({
  children,
  open,
  title,
  onCancel,
  extraActions,
  ...props
}: Props) => {
  const [heightContent, setHeightContent] = useState(
    `calc(100vh - ${top}px) - 32px`
  );
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(open);

  // Sync internal state with Antd modal state
  useEffect(() => {
    if (open) setVisible(true);
    else setVisible(false);
  }, [open]);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setVisible(false); // Trigger exit animation
    // onCancel?.(e);
    setTimeout(() => onCancel?.(e), 200); // Delay unmounting (match animation duration)
  };

  useEffect(() => {
    if (!visible || !headerRef.current) return;
    setHeightContent(
      `calc(100vh - ${top}px - ${headerRef.current?.offsetHeight}px - 32px)`
    );
  }, [headerRef.current, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <ModalAntd
          style={{ top: 40 }}
          width="100%"
          {...props}
          styles={{
            content: { padding: 0 },
          }}
          footer={null}
          okText={"Đồng ý"}
          cancelText={"Hủy"}
          destroyOnClose
          open={visible}
          onCancel={handleClose}
          transitionName=""
          maskTransitionName=""
          className={classes.modal}
          title={undefined}
          closable={false}
          maskClosable={false}
          maskProps={{
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
          modalRender={node => (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {node}
            </motion.div>
          )}
        >
          <Button
            onClick={handleClose}
            type="text"
            className={classes.btnClose}
            style={{
              borderRadius: 5,
              padding: 0,
              height: 'auto',
            }}
            icon={
              <motion.span
                style={{ color: '#fff' }}
                key="close"
                className="flex-center"
              >
                <CloseOutlined className="lg"  />
              </motion.span>
            }
          />
          <div className={classes.title} ref={headerRef}>
            <Typography.Title level={5}>{title}</Typography.Title>

            {extraActions && extraActions}
            {!extraActions && (
              <Button
                type="primary"
                loading={props.confirmLoading}
                onClick={props.onOk}
                style={{
                  boxShadow: 'none',
                }}
              >
                {"Đồng ý"}
              </Button>
            )}
          </div>
          <div
            className={classes.content}
            style={{
              minHeight: 200,
              maxHeight: heightContent,
            }}
          >
            {children}
          </div>
        </ModalAntd>
      )}
    </AnimatePresence>
  );
};
