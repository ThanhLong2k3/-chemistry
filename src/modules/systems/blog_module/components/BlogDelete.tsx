import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useDisclosure } from '@/components/hooks/useDisclosure';
import { deleteBlog } from '@/services/blog.service';
import { useNotification } from '@/components/UI_shared/Notification';
import ModalConfirmDelete from '@/components/UI_shared/DeleteComfilm';
import axios from 'axios';

interface Props {
  id: string;
  deleted_by: string;
  getAllBlog: () => void;
}

export const BlogDelete = ({ id, deleted_by, getAllBlog }: Props) => {
  const { isOpen, open, close } = useDisclosure();
  const { show } = useNotification();

  const handleSubmit = async () => {
    try {
      const data = await deleteBlog({ id, deleted_by });

      if (data.success) {
        show({
          result: 0, // Mã thành công
          messageDone: 'Xóa bài viết thành công!',
        });
        getAllBlog(); // Tải lại dữ liệu
      } else {
        // Trường hợp API trả về success: false nhưng không ném lỗi
        show({
          result: 1,
          messageError: data.message || 'Có lỗi xảy ra!',
        });
      }

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
      <Tooltip title={'Bạn có chắc chắn muốn xóa ?'}>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={open}
          type="default"
        >Xóa</Button>
      </Tooltip>

      <ModalConfirmDelete isOpen={isOpen} handleCancel={handleCancel} handleSubmit={handleSubmit} />
    </>
  );
};