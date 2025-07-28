//here
import { message } from 'antd';

interface Document {
  Id?: number;
  DocumentName: string;
  DocumentFile?: File;
  DocumentLink?: string;
  RelatedId?: number;
  RelatedType?: string;
}

interface UploadResult {
  success: boolean;
  documents: Document[];
  uploadedPaths?: string[];
  error?: string;
}

export const UpLoadDocument = async (
  documents: Document[], show?: (msg: any) => void
): Promise<UploadResult> => {
  if (documents.length === 0) {
    return { success: false, documents: [], error: 'No documents to upload' };
  }
  // const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const formData = new FormData();
  let hasFiles = false;
  let filesCount = 0;

  // Count files that need uploading
  documents.forEach((doc) => {
    if (doc.DocumentFile instanceof File) {
      filesCount++;
    }
  });

  if (filesCount === 0) {
    return {
      success: true,
      documents: documents.map((doc) => ({ ...doc, DocumentFile: undefined })),
      uploadedPaths: [],
    };
  }

  // // 🛑 Kiểm tra nếu có file nào lớn hơn 10MB => Chặn ngay
  // const hasLargeFile = documents.some(doc => doc.DocumentFile instanceof File && doc.DocumentFile.size > MAX_SIZE);

  // if (hasLargeFile) {
  //   show?.({
  //     result: 1,
  //     messageError: '❌ File không được lớn hơn 10MB',
  //   });
  //   return { success: false, documents, error: 'File quá lớn (>10MB)' };
  // }
  documents.forEach((doc) => {
    if (doc.DocumentFile instanceof File) {
      formData.append('files', doc.DocumentFile);
      hasFiles = true;
    }
  });

  if (!hasFiles) {
    return {
      success: true,
      documents: documents.map((doc) => ({ ...doc, DocumentFile: undefined })),
      uploadedPaths: [],
    };
  }

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result = await response.json();
    if (result.urls.length > 0) {
      const updatedDocuments = [...documents];
      let uploadedIndex = 0;

      updatedDocuments.forEach((doc, index) => {
        if (doc.DocumentFile instanceof File) {
          updatedDocuments[index] = {
            ...doc,
            DocumentLink: result.urls[uploadedIndex],
            DocumentFile: undefined,
          };
          uploadedIndex++;
        }
      });

      return {
        success: true,
        documents: updatedDocuments,
        uploadedPaths: result.urls,
      };
    }
    else {
      message.error('File upload failed: Invalid response');
      return { success: false, documents, error: 'Invalid server response' };
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    message.error(
      `Error uploading files: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    return {
      success: false,
      documents,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
};




export async function NewuploadFiles(files: File[], show?: (msg: any) => void) {
  if (!files || files.length === 0) return [];

  // const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const formData = new FormData();

  // // 🛑 Kiểm tra nếu có file nào lớn hơn 10MB => Chặn ngay
  // const hasLargeFile = files.some(file => file.size > MAX_SIZE);

  // if (hasLargeFile) {
  //   show?.({
  //     result: 1,
  //     messageError: '❌ File không được lớn hơn 10MB',
  //   });
  //   return []; // Không gọi API
  // }

  // ✅ Nếu tất cả file hợp lệ => Tiến hành upload
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    return data.urls || [];
  } catch (error) {
    console.error('❌ Lỗi khi upload:', error);
    return [];
  }
}


export async function fetchFile(filename: string) {
  if (!filename) return { success: false, error: 'Tên file không hợp lệ' };

  const cleanFilename = filename.replace(/^\/?uploads\//, '');
  const fileUrl = `/uploads/${cleanFilename}`;

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Không tìm thấy file: ${filename}`);
    }

    return {
      success: true,
      url: fileUrl,
    };
  } catch (error: any) {
    console.error('❌ Lỗi khi lấy file:', error);
    return { success: false, error: error.message };
  }
}
