import env from "@/env";
import axios from "axios";
const prefix = `${env.BASE_URL}/api/upload`;

export const UpLoadImage = async (
  files: File[],
  show?: ({ result }: { result: number }) => void
): Promise<string[]> => {
  const token = localStorage.getItem('TOKEN');

  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file); // key 'files' khớp với Multer
  });

  try {
    const response = await axios.post(`${prefix}/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.urls;
  } catch (error: any) {
    if (show) {
      show({ result: 1 });
    }
    throw error;
  }
};
