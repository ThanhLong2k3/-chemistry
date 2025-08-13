import { useDisclosure } from '@/components/hooks/useDisclosure';
import { Button, Col, Form, Input, Modal, Row, Select, Spin, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { createLesson, updateLesson } from '@/services/lesson.service';
import { ILesson } from '@/types/lesson';
import { useNotification } from '@/components/UI_shared/Notification';
import { RULES_FORM } from '@/utils/validator';
import { EditOutlined, FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { searchChapter } from '@/services/chapter.service';
import axios from 'axios';
import { IChapter } from '@/types/chapter';

import { getAccountLogin } from '@/env/getInfor_token';
import { showSessionExpiredModal } from '@/utils/session-handler';
import { ISubject } from '@/types/subject';
import { searchSubject } from '@/services/subject.service';
import { UpLoadImage } from '@/services/upload.service';
import env from '@/env';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  isCreate?: boolean;
  row?: ILesson;
  getAll: () => void;
}

export const LessonModal = ({
  isCreate = false,
  row,
  getAll,
}: Props): JSX.Element => {
  const { isOpen, open, close } = useDisclosure();
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [description, setDescription] = useState('');

  // State cho bộ lọc
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  // 1. Sử dụng Form.useWatch để theo dõi giá trị của trường 'image'
  const imageFileList = Form.useWatch('image', form);

  // 2. Kiểm tra xem có ảnh hay không. `hasImage` sẽ là true nếu có file, và false nếu không có.
  const hasImage = imageFileList && imageFileList.length > 0;

  useEffect(() => {
    const fetchInitialData = async () => {
      // 1. Tải danh sách tất cả Môn học
      setLoadingSubjects(true);
      try {
        const res = await searchSubject({ page_index: 1, page_size: 1000 });
        if (res.success) {
          const allSubjects = res.data;
          setSubjects(allSubjects);

          // 2. Nếu là SỬA, tìm môn học tương ứng với chương của bài học
          if (!isCreate && row) {
            // Cần tải tất cả chương một lần để tìm ra môn học của chương đó
            const allChaptersRes = await searchChapter({ page_index: 1, page_size: 1000 });
            if (allChaptersRes.success) {
              const chapterOfRow = allChaptersRes.data.find((c: IChapter) => c.id === row.chapter_id);
              if (chapterOfRow) {
                setSelectedSubjectId(chapterOfRow.subject_id);
              }
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    if (isOpen) {
      if (isCreate) {
        // Reset mọi thứ cho form TẠO MỚI
        form.resetFields();
        setDescription('');
        setSelectedSubjectId(null);
        setChapters([]);
      } else if (row) {
        // Set giá trị ban đầu cho form SỬA
        const imageFileList: UploadFile[] = row.image ? [
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: `${env.BASE_URL}${row.image}`,
          }
        ] : [];
        form.setFieldsValue({ ...row, image: imageFileList });
        setDescription(row.description || '');
      }
      fetchInitialData();
    }
  }, [isOpen, isCreate, row, form]);



  //tải lại danh sách Chương khi Môn học được chọn thay đổi
  useEffect(() => {
    if (!isOpen) return; // Chỉ chạy khi modal đang mở

    const fetchChapters = async () => {
      setLoadingChapters(true);
      setChapters([]); // Reset danh sách chương cũ
      try {
        // Tìm tên môn học từ ID để gửi lên API 
        const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name || null;

        const res = await searchChapter({
          page_index: 1,
          page_size: 1000,
          search_content_2: subjectName,
        });
        if (res.success) {
          setChapters(res.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải chương:', err);
      } finally {
        setLoadingChapters(false);
      }
    };

    fetchChapters();
  }, [selectedSubjectId, isOpen, subjects]);


  // Hàm xử lý khi đổi Môn học
  const handleSubjectChange = (subjectId: string | undefined) => {
    setSelectedSubjectId(subjectId || null);
    form.setFieldsValue({ chapter_id: undefined }); // Reset ô chọn Chương
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

      let imageUrl: string | null = null;
      const imageValue = values.image; // imageValue bây giờ luôn là một mảng

      if (imageValue && imageValue.length > 0) {
        const file = imageValue[0];
        if (file.originFileObj) {
          const uploadedPaths = await UpLoadImage([file.originFileObj], show);
          imageUrl = uploadedPaths[0];
        } else if (file.url) {
          const baseUrl = env.BASE_URL;
          imageUrl = file.url.replace(baseUrl, '');
        }
      } else {
        imageUrl = null;
      }

      if (isCreate) {
        const responseData: any = await createLesson({
          id: uuidv4(),
          ...values,
          created_by: currentAccount.username,
          image: imageUrl
        });

        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Thêm bài học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Thêm bài học thất bại.',
          });
        }
      } else if (row?.id) {
        const responseData: any = await updateLesson({ ...values, id: row.id, updated_by: currentAccount.username, image: imageUrl });
        if (responseData.success) {
          show({
            result: 0,
            messageDone: 'Cập nhật bài học thành công!',
          });
        } else {
          show({
            result: 1,
            messageError: responseData.message || 'Cập nhật bài học thất bại.',
          });
        }
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
  };

  return (
    <>
      <Button type={isCreate ? 'primary' : 'default'} onClick={open} icon={isCreate ? <FileAddOutlined /> : <EditOutlined />}>
        {isCreate ? 'Thêm bài học' : 'Sửa'}
      </Button >
      <Modal
        title={
          <div style={{ fontSize: '20px', paddingBottom: '8px' }}>
            {isCreate ? 'Thêm bài học' : 'Sửa bài học'}
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={close}
        okText={isCreate ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        width={900}
        style={{ top: 30 }}
        styles={{ body: { height: '93vh' } }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="image"
                label="Ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
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
                    style={hasImage ? { marginBottom: '12px' } : {}}
                    icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="sort_order"
                label="Sắp xếp"
                rules={RULES_FORM.required}
              >
                <Input type='number' min={1} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên bài học"
                rules={[
                  ...RULES_FORM.required,
                  ...RULES_FORM.noSpecialChars,
                ]}
              >
                <Input />
              </Form.Item>

              {/* === SELECT LỌC MÔN HỌC === */}
              <Form.Item label="Chọn Môn học (để lọc chương)">
                <Select
                  placeholder="Lọc chương theo môn học"
                  allowClear
                  showSearch
                  loading={loadingSubjects}
                  value={selectedSubjectId}
                  onChange={handleSubjectChange}
                  // Lọc dựa trên thuộc tính `label` của `options`
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  // Cung cấp dữ liệu qua prop `options`
                  options={subjects.map((subject) => ({
                    key: subject.id,
                    value: subject.id,
                    label: subject.name,
                  }))}
                />
              </Form.Item>

              {/* === SELECT CHƯƠNG === */}
              <Form.Item name="chapter_id" label="Tên chương" rules={RULES_FORM.required}>
                <Select
                  placeholder="Chọn chương"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  loading={loadingChapters}
                  notFoundContent={loadingChapters ? <Spin size="small" /> : null}
                >
                  {chapters.map((chapter) => (
                    <Select.Option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
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
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
