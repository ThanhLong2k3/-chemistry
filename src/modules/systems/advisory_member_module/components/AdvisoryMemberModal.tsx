'use client';

import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createAdvisoryMember, updateAdvisoryMember } from '@/services/advisory_member.service';
import { IAdvisoryMember } from '@/types/advisory_member';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { getAccountLogin } from '@/env/getInfor_token';
import { UpLoadImage } from '@/services/upload.service';
import env from '@/env';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: IAdvisoryMember;
  getAll: () => void;
}

export const AdvisoryMemberModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const qualifications = ['Cao đẳng', 'Cử nhân', 'Thạc sĩ', 'Tiến sĩ'];
  const gradeLevels = [10, 11, 12];
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');


  const imageFileList = Form.useWatch('image', form);
  const hasImage = imageFileList && imageFileList.length > 0;

  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        form.resetFields();
        setDescription('');
      } else if (row) {
        // 1. Chuyển đổi URL ảnh tương đối thành URL tuyệt đối để hiển thị
        const convertImageToUploadFile = (url: string | null): UploadFile[] => {
          if (!url) return [];
          return [{
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: `${env.BASE_URL}${url}`,
          }];
        };

        // 2. Chuyển đổi chuỗi "in_charge" thành mảng các số
        const inChargeArray = row.in_charge ? String(row.in_charge).split(', ').filter(Boolean).map(Number) : [];

        // 3. Điền tất cả dữ liệu đã xử lý vào form
        form.setFieldsValue({
          ...row,
          image: convertImageToUploadFile(row.image),
          in_charge: inChargeArray,
        });
        setDescription(row.description || '');
      }
    }
  }, [isOpen, isCreate, row, form]);

  const handleOk = async () => {
    try {
      const currentAccount = getAccountLogin();
      if (!currentAccount) {
        showSessionExpiredModal();
        return;
      }

      const values = await form.validateFields();

      // --- Xử lý dữ liệu trước khi GỬI ĐI ---

      // 1. Trích xuất URL ảnh cuối cùng
      const extractImageUrl = async (fileList: UploadFile[] | undefined): Promise<string | null> => {
        if (!fileList || fileList.length === 0) return null;
        const file = fileList[0];
        if (file.originFileObj) {
          // Nếu có file mới, upload và lấy URL
          const uploaded = await UpLoadImage([file.originFileObj], show);
          return uploaded[0] ?? null;
        } else if (file.url) {
          // Nếu giữ lại file cũ, loại bỏ BASE_URL để lấy URL tương đối
          return file.url.replace(env.BASE_URL, '');
        }
        return null;
      };

      const imageUrl = await extractImageUrl(values.image);

      // 2. Chuẩn bị payload cuối cùng để gửi cho API
      const dataToSubmit = {
        ...values,
        image: imageUrl,
        in_charge: Array.isArray(values.in_charge) ? values.in_charge.join(', ') : values.in_charge,
      };

      let responseData: any;
      if (isCreate) {
        responseData = await createAdvisoryMember({
          id: uuidv4(),
          ...dataToSubmit,
          created_by: currentAccount.username,
        });
      } else if (row?.id) {
        responseData = await updateAdvisoryMember({
          ...dataToSubmit,
          id: row.id,
          updated_by: currentAccount.username,
        });
      }

      if (responseData?.success) {
        show({ result: 0, messageDone: isCreate ? 'Thêm thành viên thành công!' : 'Cập nhật thành công!' });
      } else {
        show({ result: 1, messageError: responseData?.message || (isCreate ? 'Thêm thất bại.' : 'Cập nhật thất bại.') });
      }
      getAll();
      setTimeout(() => {
        close();
      }, 1000);

    } catch (error: any) {
      //lỗi validation của Antd Form có thuộc tính `errorFields`, nếu là lỗi validation thì không cần hiển thị thông báo lỗi.
      // Antd sẽ tự động hiển thị lỗi trên form.
      if (error && error.errorFields) {
        console.log('Validation Failed:', error.errorFields[0].errors[0]);
        return;
      }

      let errorMessage = 'Đã có lỗi không xác định xảy ra.';

      if (axios.isAxiosError(error)) {
        const axiosError = error; // TypeScript hiểu đây là AxiosError
        const responseMessage = axiosError.response?.data?.message;

        if (axiosError.response?.status === 401) {
          showSessionExpiredModal();
          return;
        } else {
          errorMessage = responseMessage || axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      show({
        result: 1,
        messageError:
          errorMessage === 'Network Error'
            ? 'Lỗi kết nối đến máy chủ.'
            : errorMessage,
      });
    }
  };

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm thành viên' : 'Sửa'}
      </Button>
      <Modal
        title={<div style={{ fontSize: '20px', paddingBottom: '8px' }}>{isCreate ? 'Thêm thành viên ban tư vấn' : 'Sửa thành viên ban tư vấn'}</div>}
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
        style={{ top: 25 }}
      >
        <Form layout="vertical" form={form} initialValues={{ description: '' }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="image"
                label="Ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  name="avatar"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={(file) => {
                    if (file.name.length > 70) {
                      show({
                        result: 1,
                        messageError: 'Tên ảnh không được vượt quá 70 ký tự.',
                      });
                      return Upload.LIST_IGNORE; // Ngăn file được thêm vào danh sách
                    }
                    return false; // Giữ nguyên hành vi upload thủ công
                  }}
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                >
                  <Button icon={<UploadOutlined />} style={hasImage ? { marginBottom: '12px' } : {}}>
                    Chọn ảnh
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="subject" label="Môn học phụ trách"
                rules={[
                  ...RULES_FORM.required,
                  ...RULES_FORM.validateText255,
                ]}>
                <Input />
              </Form.Item>

              <Form.Item name="years_of_experience" label="Số năm kinh nghiệm" rules={RULES_FORM.years_of_experience}>
                <Input type="number" min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="teacher_name"
                label="Tên thành viên"
                rules={[
                  ...RULES_FORM.required,
                  ...RULES_FORM.validateText255,
                ]}>
                <Input />
              </Form.Item>

              <Form.Item name="qualification" label="Trình độ" rules={RULES_FORM.required}>
                <Select placeholder="Chọn trình độ" allowClear>
                  {qualifications.map(level => (
                    <Select.Option key={level} value={level}>
                      {level}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="in_charge" label="Phụ trách">
                <Select mode="multiple" placeholder="Chọn các khối phụ trách" allowClear>
                  {gradeLevels.map(grade => (
                    <Select.Option key={grade} value={grade}>
                      Khối {grade}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="workplace"
                label="Nơi công tác"
                rules={[
                  ...RULES_FORM.required,
                  ...RULES_FORM.validateText255,
                ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={RULES_FORM.validateDescription}
          >
            <ReactQuill
              className="custom-quill"
              theme="snow"
              value={description}
              onChange={(value) => {
                setDescription(value);
                form.setFieldsValue({ description: value });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};