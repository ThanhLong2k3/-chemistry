// src/hooks/useNotification.ts
import { App } from 'antd';
import type { NotificationArgsProps } from 'antd';

interface NotificationProps {
  result: any;
  messageDone?: string;
  messageError?: string;
  messageErrorOfRighs?: string;
}

export const useNotification = () => {
  const { notification } = App.useApp();

  const notificationConfig: NotificationArgsProps = {
    message: 'Thông báo',
    duration: 3,
    style: {
      width: '400px',
      height: 'auto',
    },
    placement: 'topRight',
  };

  const show = ({
    result,
    messageDone = 'Thao tác thành công',
    messageError = 'Thao tác thất bại',
    messageErrorOfRighs = 'Bạn không có quyền thực hiện tác vụ',
  }: NotificationProps) => {
    if (
      result === 0 ||
      (result != 1 &&result != 2 &&
        result != 5 &&
        result != 6 &&
        result != 7 &&
        result != 8 &&
        result != 3 && result != -1 && result != -2)
    ) {
      notification.success({
        ...notificationConfig,
        description: messageDone,
      });
    }

    if (result === 1) {
      notification.error({
        ...notificationConfig,
        description: messageError,
      });
    }

    if (result === 2) {
      notification.error({
        ...notificationConfig,
        description: messageErrorOfRighs,
      });
    }

    // Thêm các trường hợp từ auth.api.ts
    if (result === 5) {
      notification.error({
        ...notificationConfig,
        description: 'Vui lòng nhập email và mật khẩu',
      });
    }

    if (result === 7 || result === 6) {
      notification.error({
        ...notificationConfig,
        description: 'Tài khoản, mật khẩu không đúng',
      });
    }

    if (result === 8) {
      notification.error({
        ...notificationConfig,
        description: 'Lỗi server, vui lòng thử lại sau',
      });
    }
    if (result === -1) {
      notification.error({
        ...notificationConfig,
        description: 'Tên đã tồn tại !',
      });
    }
    if (result === -2) {
      notification.error({
        ...notificationConfig,
        description: 'Mã tài sản đã tồn tại !',
      });
    }
  };

  return { show };
};
