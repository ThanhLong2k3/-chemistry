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

export const uploadFile = async (
  documents: Document[],
): Promise<UploadResult> => {
  if (documents.length === 0) {
    return { success: false, documents: [], error: 'No documents to upload' };
  }

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

  // Append files to FormData with key 'file'
  documents.forEach((doc) => {
    if (doc.DocumentFile instanceof File) {
      formData.append('file', doc.DocumentFile);
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
    const response = await fetch('/api/uploadfile', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result = await response.json();

    if (result.status === 'success' && Array.isArray(result.uploadedPaths)) {
      const updatedDocuments = [...documents];
      let uploadedIndex = 0;

      updatedDocuments.forEach((doc, index) => {
        if (doc.DocumentFile instanceof File) {
          updatedDocuments[index] = {
            ...doc,
            DocumentLink: result.uploadedPaths[uploadedIndex],
            DocumentFile: undefined,
          };
          uploadedIndex++;
        }
      });

      return {
        success: true,
        documents: updatedDocuments,
        uploadedPaths: result.uploadedPaths,
      };
    } else {
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

export async function uploadFilesImage(files: File[]): Promise<string[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('file', file); // Dùng key 'file'
  });

  try {
    const response = await fetch('/api/uploadfile', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.status === 'success') {
      return data.uploadedPaths;
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
}

export async function getInforFile(filePath: string) {
  if (!filePath) {
    throw new Error('Thiếu đường dẫn file');
  }

  try {
    const response = await fetch(
      `/api/uploadfile?path=${encodeURIComponent(filePath)}`,
      { method: 'GET' },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Lấy thông tin file thất bại');
    }

    return {
      success: true,
      fileInfo: data,
    };
  } catch (error) {
    console.error('Lỗi khi lấy thông tin file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi không xác định',
    };
  }
}

