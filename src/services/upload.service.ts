import env from "@/env";
import axios from "axios";
const prefix = `${env.BASE_URL}/api/upload`;

export const UpLoadImage = async (
  request: any,
  show?: ({ result }: { result: number }) => void
): Promise<any> => {
  const token = localStorage.getItem('TOKEN');

  try {
    const response = await axios.post(`${prefix}/`, request, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Giả sử response.data.result là kết quả xử lý
    if (show) {
      show({ result: response.data.result ?? 0 }); // Nếu không có result thì coi như thành công
    }

    return response.data;
  } catch (error: any) {
    if (show) {
      show({ result: 1 });
    }
    throw error;
  }
};
