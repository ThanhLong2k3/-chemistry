import { DeleteOutlined, FrownOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Typography, theme } from 'antd';
import { useDisclosure } from '@/components/hooks/useDisclosure';
import { deleteAccount } from '@/services/account.service';
import { useNotification } from '@/components/UI_shared/Notification';
import ModalConfirmDelete from '@/components/UI_shared/DeleteComfilm';
import axios from 'axios';
import ModalConfirmChangeStatus from '@/components/UI_shared/ModalConfirmChangeStatus';
import { useEffect, useState } from 'react';
import { getAccountLogin } from '@/env/getInfor_token';
import { IDecodedToken } from '@/types/decodedToken';
import { authAPI } from '@/services/auth.service';
import { usePermissions } from '@/contexts/PermissionContext';
import { showSessionExpiredModal } from '@/utils/session-handler';

const { Text } = Typography;

interface Props {
  username: string;
  deleted_by: string;
  getAllAccount: () => void;
  deleted: boolean;
}

export const AccountDelete = ({ username, deleted_by, getAllAccount, deleted }: Props) => {
  const [currentAccount, setCurrentAccount] = useState<IDecodedToken | null>(null);

  //lấy tài khoản đang đăng nhập ra 
  useEffect(() => {
    const account = getAccountLogin();
    setCurrentAccount(account);
  }, []);

  const { isOpen, open, close } = useDisclosure();
  const { show } = useNotification();
  const handleSubmit = async () => {
    try {
      const data = await deleteAccount({ username, deleted_by });
      show({
        result: data,
        messageDone: 'Thay đổi trạng thái người dùng thành công !',
        messageError: 'Có lỗi xảy ra !',
      });

      if (username === currentAccount?.username) {
        // Nếu đúng, gọi thông báo phiên đã hết hạn và điều hướng ra đăng nhập đồng thời xoá token 
        showSessionExpiredModal();
      }

      getAllAccount();
    } catch (error) {
      let errorMessage = 'Đã có lỗi không xác định xảy ra.';
      // 1. Kiểm tra xem đây có phải là lỗi từ Axios không
      if (axios.isAxiosError(error)) {
        // 2. Lấy thông báo lỗi từ response của backend (nếu có)
        const responseMessage = error.response?.data?.message;

        // 3. Xử lý cụ thể cho từng mã lỗi
        if (error.response?.status === 403) {
          // Lỗi 403: Không có quyền
          errorMessage = responseMessage || 'Bạn không có quyền thực hiện hành động này.';
        } else if (error.response?.status === 401) {
          // Lỗi 401: Chưa xác thực hoặc token hết hạn
          errorMessage = responseMessage || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
        } else {
          // Các lỗi khác (500, 404, ...)
          errorMessage = responseMessage || 'Lỗi từ máy chủ, vui lòng thử lại sau.';
        }
      }
      show({
        result: 1, // Mã lỗi
        messageError: errorMessage,
      });
    } finally {
      close();
    }
  };

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <Tooltip title={'Bạn có chắc chắn muốn thay đổi trạng thái ?'}>
        <Button
          danger={!deleted}
          type="default"
          onClick={open}
          style={{
            borderRadius: '1px solid black',
            color: deleted ? '#52c41a' : undefined,
            borderColor: deleted ? '#52c41a' : undefined,
          }}
        >
          {deleted ? 'Kích hoạt' : 'Huỷ kích hoạt'}
        </Button>

      </Tooltip>

      <ModalConfirmChangeStatus isOpen={isOpen} isActive={!deleted} handleCancel={handleCancel} handleSubmit={handleSubmit} />
    </>
  );
};

