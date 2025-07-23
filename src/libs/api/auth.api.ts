import { CallApi } from '@/libs/call_API';
import { API_URL } from '@/libs/call_API';
interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

//đã sửa
interface LoginResponse {
  success: boolean;
  message?: string;
  account?: {
    username: string;
    name: string;
    email: string;
    role: string;
    image: string;
  };
  token?: string;
}


export const authAPI = {
  register: async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<number> => {
    try {
      const data = await CallApi.create<number>('auth/register', {
        email,
        password,
        fullName,
      });
      return data;
    } catch (error) {
      throw new Error(
        `Đăng ký thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
      );
    }
  },




  //đã sửa
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      if (!username || !password) {
        return {
          success: false,
          message: 'Tên đăng nhập và mật khẩu là bắt buộc'
        };
      }

      const response = await fetch(`https://vuihochoa.edu.vn/${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();


      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Đăng nhập thất bại'
        };
      }
      return {
        success: true,
        message: 'Đăng nhập thành công',
        token: data.token       // Token trả về từ server
      };
    } catch (error) {
      console.error('Lỗi API đăng nhập:', error);
      return {
        success: false,
        message: 'Lỗi kết nối đến máy chủ.'
      };
    }
  },




  getCurrentUser: async (): Promise<User> => {
    try {
      const data = await CallApi.getAll<User>('auth/me');
      return data[0];
    } catch (error) {
      throw new Error(
        `Lấy thông tin user thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
      );
    }
  },

  logout: () => {
    localStorage.clear();
  },
};
