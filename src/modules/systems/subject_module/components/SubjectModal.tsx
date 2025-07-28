import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createSubject, updateSubject } from '@/services/subject.service';
import { ISubject } from '@/types/subject';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css'; // CSS mặc định
import dynamic from 'next/dynamic';
import axios from 'axios';
import { NewuploadFiles } from '@/libs/api/upload.api';
import { getAccountLogin } from '@/helpers/auth/auth.helper.client';
import { showSessionExpiredModal } from '@/utils/session-handler';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: ISubject;
  getAll: () => void;
}

// Hàm tiện ích để chuyển đổi URL thành định dạng UploadFile của Antd
const urlToUploadFile = (url: string | null, fieldName: string): UploadFile[] => {
  if (!url) return [];
  return [{
    uid: `-1-${fieldName}`,
    name: url.split('/').pop() || 'file.pdf', // Lấy tên file từ url
    status: 'done',
    url: url,
  }];
};

export const SubjectModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');

  // 1. Sử dụng Form.useWatch để theo dõi giá trị của trường 'image'
  const imageFileList = Form.useWatch('image', form);

  // 2. Kiểm tra xem có ảnh hay không. `hasImage` sẽ là true nếu có file, và false nếu không có.
  const hasImage = imageFileList && imageFileList.length > 0;


  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        form.resetFields();
        setDescription('');
      } else if (row) {
        // Chuyển đổi các URL thành định dạng UploadFile
        form.setFieldsValue({
          ...row,
          image: urlToUploadFile(row.image, 'image'),
          textbook: urlToUploadFile(row.textbook, 'textbook'),
          workbook: urlToUploadFile(row.workbook, 'workbook'),
          exercise_book: urlToUploadFile(row.exercise_book, 'exercise_book'),
        });
        setDescription(row.description || '');
      }
    }
  }, [isOpen, isCreate, row, form]);

  /**
   * HÀM XỬ LÝ UPLOAD FILE ĐA NĂNG
   * @param formValue - Giá trị từ Form.Item (thường là một mảng file)
   * @returns Đường dẫn URL của file sau khi upload, hoặc URL cũ, hoặc null.
   */
  const handleFileUpload = async (formValue: any): Promise<string | null> => {
    if (!formValue || formValue.length === 0) {
      return null; // Không có file
    }
    const file = formValue[0];
    if (file.originFileObj) {
      // Trường hợp file mới được người dùng chọn
      const uploadedPaths = await NewuploadFiles([file.originFileObj], show);
      return uploadedPaths[0];
    } else if (file.url) {
      // Trường hợp file cũ đã tồn tại, giữ nguyên URL
      return file.url;
    }
    return null; // Mọi trường hợp khác
  };

  const handleOk = async () => {
    try {
      //lấy thông tin người dùng đang đăng nhập
      const currentAccount = getAccountLogin();

      if (!currentAccount) {
        show({
          result: 1,
          messageError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        });
        return;
      }

      const values = await form.validateFields();

      // SỬ DỤNG HÀM UPLOAD ĐA NĂNG
      const imageUrl = await handleFileUpload(values.image);
      const textbookUrl = await handleFileUpload(values.textbook);
      const workbookUrl = await handleFileUpload(values.workbook);
      const exerciseBookUrl = await handleFileUpload(values.exercise_book);

      // Xây dựng object dữ liệu cuối cùng
      const dataToSubmit = {
        ...values,
        image: imageUrl,
        textbook: textbookUrl,
        workbook: workbookUrl,
        exercise_book: exerciseBookUrl,
      };

      if (isCreate) {
        const responseData: any = await createSubject({
          id: uuidv4(),
          ...dataToSubmit,
          created_by: currentAccount.username,
        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm môn học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm môn học thất bại.',
          });
        }
      } else if (row?.id) {
        const responseData: any = await updateSubject({ ...dataToSubmit, id: row.id, updated_by: currentAccount.username });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật môn học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật môn học thất bại.',
          });
        }
      }
      getAll();
      close();
    } catch (error: any) {
      //lỗi validation của Antd Form có thuộc tính `errorFields`, nếu là lỗi validation thì không cần hiển thị thông báo lỗi.
      // Antd sẽ tự động hiển thị lỗi trên form.
      if (error && error.errorFields) {
        console.log('Validation Failed:', error.errorFields[0].errors[0]);
        return;
      }

      let errorMessage = "Đã có lỗi không xác định xảy ra.";

      if (axios.isAxiosError(error)) {
        const axiosError = error; // TypeScript hiểu đây là AxiosError
        const responseMessage = axiosError.response?.data?.message;

        if (axiosError.response?.status === 401) {
          showSessionExpiredModal();
          return;
        } else {
          errorMessage = responseMessage || axiosError.message;
        }
      }
      else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Chỉ hiển thị notification cho các lỗi không phải 401
      show({
        result: 1,
        messageError: errorMessage,
      });
    }
  }

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm môn học' : 'Sửa'}
      </Button>
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm môn học' : 'Sửa môn học'}
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
        style={{ top: 15 }}
      >
        <Form layout="vertical" form={form}>

          <Row gutter={24}>
            <Col span={12}>
              {/* === UPLOAD ẢNH === */}
              <Form.Item name="image" label="Ảnh đại diện" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
                <Upload
                  name="avatar"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  // Sửa lại: Chỉ chấp nhận file ảnh
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên môn học"
                rules={RULES_FORM.required}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="sort_order"
                label="Sắp xếp"
                rules={RULES_FORM.required}
              >
                <Input type='number' min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* === UPLOAD SÁCH GIÁO KHOA (PDF) === */}
              <Form.Item name="textbook" label="Sách giáo khoa (PDF)" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
                <Upload
                  name="textbook"
                  maxCount={1}
                  beforeUpload={() => false}
                  // Giữ nguyên: Chỉ chấp nhận file PDF
                  accept=".pdf"
                >
                  <Button icon={<PaperClipOutlined />}>Chọn file PDF</Button>
                </Upload>
              </Form.Item>

              {/* === UPLOAD SÁCH BÀI TẬP (PDF) === */}
              <Form.Item name="workbook" label="Sách bài tập (PDF)" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
                <Upload
                  name="workbook"
                  maxCount={1}
                  beforeUpload={() => false}
                  accept=".pdf"
                >
                  <Button icon={<PaperClipOutlined />}>Chọn file PDF</Button>
                </Upload>
              </Form.Item>

              {/* === UPLOAD VỞ BÀI TẬP (PDF) === */}
              <Form.Item name="exercise_book" label="Vở bài tập (PDF)" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList}>
                <Upload
                  name="exercise_book"
                  maxCount={1}
                  beforeUpload={() => false}
                  accept=".pdf"
                >
                  <Button icon={<PaperClipOutlined />}>Chọn file PDF</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={(value) => {
                setDescription(value);
                form.setFieldsValue({ description: value });
              }}
              style={{ height: '200px', marginBottom: '40px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
