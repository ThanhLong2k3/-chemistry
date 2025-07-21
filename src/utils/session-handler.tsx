import { Modal } from 'antd';
import { ExclamationCircleFilled, StopOutlined } from '@ant-design/icons';

/**
 * Hiển thị một Modal thông báo phiên đăng nhập đã hết hạn.
 */
export const showSessionExpiredModal = () => {
    // Dùng Modal.destroyAll() để đóng các modal khác có thể đang mở
    Modal.destroyAll();

    Modal.warning({
        title: 'Phiên đăng nhập đã hết hạn',
        icon: <ExclamationCircleFilled />,
        content: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.',
        okText: 'Đăng nhập lại',
        centered: true,
        onOk() {
            // Xóa token và chuyển hướng
            localStorage.removeItem('TOKEN');
            window.location.href = '/vi/auth/login';
        },
    });
};