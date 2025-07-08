import {  FrownOutlined } from '@ant-design/icons';
import {  Flex, Typography, theme } from 'antd';
import { ModalConfirm } from './modal';

const { Text } = Typography;
interface props {
  isOpen: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
}
const ModalConfirmDelete = ({ isOpen, handleCancel, handleSubmit }: props) => {
   const { token } = theme.useToken();
    return (
    <>
      <ModalConfirm
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        title={'Bạn có chắc chắn muốn xóa ?'}
        okType="danger"
        width={400}
      >
        <Flex vertical align="center" gap={16} style={{ padding: '16px 0' }}>
          <FrownOutlined
            style={{
              fontSize: '48px',
              color: token.colorWarning,
            }}
          />
          <Text
            strong
            style={{
              fontSize: '16px',
              textAlign: 'center',
              color: token.colorTextHeading,
            }}
          >
            {'Đồng ý xóa'}
          </Text>
          <Text
            type="secondary"
            style={{
              textAlign: 'center',
              fontSize: '14px',
            }}
          >
            {'Dữ liệu sẽ mất vĩnh viễn !!'}
          </Text>
        </Flex>
      </ModalConfirm>
    </>
  );
};
export default ModalConfirmDelete;
