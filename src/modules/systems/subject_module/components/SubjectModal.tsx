'use client';
import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createSubject, updateSubject } from '@/services/subject.service';
import { ISubject } from '@/types/subject';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import {
  EditOutlined,
  FileAddOutlined,
  PaperClipOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import axios from 'axios';

import { getAccountLogin } from '@/env/getInfor_token';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { UpLoadImage } from '@/services/upload.service';
import env from '@/env';
import QuillEditor from '@/modules/shared/QuillEditor';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: ISubject;
  getAll: () => void;
}

export const SubjectModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
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
        const convertFile = (
          url: string | null,
          name = 'file.pdf'
        ): UploadFile[] => {
          if (!url) return [];
          return [
            {
              uid: '-1',
              name,
              status: 'done',
              url: `${env.BASE_URL}${url}`,
            },
          ];
        };

        form.setFieldsValue({
          ...row,
          image: convertFile(row.image, 'image.jpg'),
          textbook: convertFile(row.textbook, 'SGK.pdf'),
          workbook: convertFile(row.workbook, 'SBT.pdf'),
          exercise_book: convertFile(row.exercise_book, 'VBT.pdf'),
        });
        setDescription(row.description || '');
      }
    }
  }, [isOpen, isCreate, row, form]);

  const handleOk = async () => {
    try {
      const currentAccount = getAccountLogin();
      if (!currentAccount) {
        show({
          result: 1,
          messageError: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        });
        return;
      }

      const values = await form.validateFields();

      const extractUrl = async (
        fileList: UploadFile[] | undefined
      ): Promise<string | null> => {
        if (!fileList || fileList.length === 0) return null;
        const file = fileList[0];
        if (file.originFileObj) {
          const uploaded = await UpLoadImage([file.originFileObj], show);
          return uploaded[0];
        } else if (file.url) {
          return file.url.replace(env.BASE_URL, '');
        }
        return null;
      };

      const imageUrl = await extractUrl(values.image);
      const textbookUrl = await extractUrl(values.textbook);
      const workbookUrl = await extractUrl(values.workbook);
      const exerciseBookUrl = await extractUrl(values.exercise_book);

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

        show({
          result: responseData.success ? 0 : 1,
          messageDone: 'Thêm môn học thành công!',
          messageError: responseData.message || 'Thêm môn học thất bại.',
        });
      } else if (row?.id) {
        const responseData: any = await updateSubject({
          ...dataToSubmit,
          id: row.id,
          updated_by: currentAccount.username,
        });

        show({
          result: responseData.success ? 0 : 1,
          messageDone: 'Cập nhật môn học thành công!',
          messageError: responseData.message || 'Cập nhật môn học thất bại.',
        });
      }

      getAll();
      setTimeout(() => {
        close();
      }, 1000);
    } catch (error: any) {
      if (error?.errorFields) return;

      let errorMessage = 'Đã có lỗi không xác định xảy ra.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          showSessionExpiredModal();
          return;
        }
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      show({
        result: 1,
        messageError: errorMessage,
      });
    }
  };

  return (
    <>
      <Button
        type={isCreate ? 'primary' : 'default'}
        onClick={open}
        icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}
      >
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
            <Col span={9}>
              <Form.Item
                name="image"
                label="Ảnh đại diện"
                valuePropName="fileList"
                style={hasImage ? { height: '147px' } : {}}
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
                  <Button
                    icon={<UploadOutlined />}
                    style={hasImage ? { marginBottom: '12px' } : {}}
                  >
                    Chọn ảnh
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên môn học"
                rules={[...RULES_FORM.required, ...RULES_FORM.validateText255]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="sort_order"
                label="Sắp xếp"
                rules={RULES_FORM.required}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <Form.Item
                name="textbook"
                label="Sách giáo khoa (PDF)"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload
                  name="textbook"
                  maxCount={1}
                  beforeUpload={() => false}
                  accept=".pdf"
                >
                  <Button icon={<PaperClipOutlined />}>Chọn file PDF</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="workbook"
                label="Sách bài tập (PDF)"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload
                  name="workbook"
                  maxCount={1}
                  beforeUpload={() => false}
                  accept=".pdf"
                >
                  <Button icon={<PaperClipOutlined />}>Chọn file PDF</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="exercise_book"
                label="Vở bài tập (PDF)"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
              >
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
            <Col span={8}>
              <Form.Item name="flip_textbook" label="Link lật sách giáo khoa">
                <Input />
              </Form.Item>

              <Form.Item name="flip_workbook" label="Link lật sách bài tập">
                <Input />
              </Form.Item>

              <Form.Item name="flip_exercise_book" label="Link lật vở bài tập">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={RULES_FORM.validateDescription}
          >
            <div className="custom-quill">
              <QuillEditor
                value={description}
                onChange={setDescription}
                placeholder="Nhập mô tả môn học..."
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
