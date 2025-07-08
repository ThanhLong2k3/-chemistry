import { Button, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

// Define the interface for props
interface ColumnProps<T> {
  columnType: ColumnType<T>[];
  openModal: (record: T) => void;
  handleDelete: (record: T) => void;
  addCustomer?:(record: T) => void;
  Tile1?:string;
  icon1?:React.ReactNode;
}

const createColumns = <T,>({
  columnType,
  openModal,
  handleDelete,addCustomer,Tile1,icon1
}: ColumnProps<T>): ColumnType<T>[] => {
  return [
    ...columnType,
    {
      title: 'Tác vụ',
      key: 'action',
      width: addCustomer?'150px':'100px',
      fixed: 'right',
      render: (_: any, record: T) => (
        <Space size="middle">
          {addCustomer &&(
            <Tooltip title={Tile1?Tile1:"Thông tin khách hàng"}>
            <Button
              type="primary"
              shape="circle"
              icon={icon1?icon1:<UserAddOutlined />}
              className="bg-purple-600"
              onClick={() => addCustomer(record)}
            />
          </Tooltip>
          )}
          
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              className="bg-purple-600"
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                style={{ backgroundColor: 'red', color: 'white' }}
                className="bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
};

export const COLUMNS = <T,>(props: ColumnProps<T>) => createColumns(props);
