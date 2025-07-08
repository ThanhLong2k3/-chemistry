import { DeleteOutlined, FrownOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Typography, theme } from 'antd';
import { ModalConfirm } from '@/components/UI_shared/modal';
import { useDisclosure } from '@/components/hooks/useDisclosure';
import { deleteUser } from '@/services/user.service';
import { useNotification } from '@/components/UI_shared/Notification';
import { result } from 'lodash';
import ModalConfirmDelete from '@/components/UI_shared/DeleteComfilm';

const { Text } = Typography;

interface Props {
  UserId: string;
  getAllUser: () => void;
}

export const UserDelete = ({ UserId, getAllUser }: Props) => {
  const { isOpen, open, close } = useDisclosure();
  const { show } = useNotification();
  const handleSubmit = async () => {
    const data = await deleteUser({ UserId });
    show({
      result: data,
      messageDone: 'Xóa người dùng thành công !',
      messageError: 'Có lỗi sảy ra !',
    });
    getAllUser();
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
          style={{borderRadius:'1px solid black'}}
        >Xóa</Button>
      </Tooltip>

      <ModalConfirmDelete isOpen={isOpen} handleCancel={handleCancel} handleSubmit={handleSubmit}/>
    </>
  );
};
