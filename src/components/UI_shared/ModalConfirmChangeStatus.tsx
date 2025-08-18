import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Flex, Typography, theme } from 'antd';
import { ModalConfirm } from './modal';

const { Text } = Typography;

interface Props {
    isOpen: boolean;
    isActive: boolean; // trạng thái hiện tại: true = đang kích hoạt, false = đang hủy
    handleCancel: () => void;
    handleSubmit: () => void;
}

const ModalConfirmChangeStatus = ({ isOpen, isActive, handleCancel, handleSubmit }: Props) => {
    const { token } = theme.useToken();

    return (
        <ModalConfirm
            open={isOpen}
            onCancel={handleCancel}
            onOk={handleSubmit}
            title={isActive ? 'Huỷ kích hoạt tài khoản ?' : 'Kích hoạt tài khoản ?'}
            okType={isActive ? 'danger' : 'primary'}
            width={420}
        >
            <Flex vertical align="center" gap={16} style={{ padding: '16px 0' }}>
                {isActive ? (
                    <StopOutlined
                        style={{
                            fontSize: '48px',
                            color: token.colorError,
                        }}
                    />
                ) : (
                    <CheckCircleOutlined
                        style={{
                            fontSize: '48px',
                            color: token.colorSuccess,
                        }}
                    />
                )}
                <Text
                    strong
                    style={{
                        fontSize: '16px',
                        textAlign: 'center',
                        color: token.colorTextHeading,
                    }}
                >
                    {isActive ? 'Xác nhận huỷ kích hoạt' : 'Xác nhận kích hoạt'}
                </Text>
                <Text
                    type="secondary"
                    style={{
                        textAlign: 'center',
                        fontSize: '14px',
                    }}
                >
                    {isActive
                        ? 'Tài khoản sẽ bị vô hiệu hoá và không thể đăng nhập.'
                        : 'Tài khoản sẽ được kích hoạt và có thể đăng nhập.'}
                </Text>
            </Flex>
        </ModalConfirm>
    );
};

export default ModalConfirmChangeStatus;
