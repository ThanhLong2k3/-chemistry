import { CallApi } from '@/libs/call_API';
import { API_URL } from '@/libs/call_API';
interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}
interface LoginResponse {
  errorCode: number;
  message?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    fullName: string;
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

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      if (!email || !password) {
        return {
          errorCode: 5,
          message: 'Email and password are required'
        };
      }
  
      const response = await fetch(`http://localhost:5000${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Trả về errorCode từ backend hoặc status code nếu không có errorCode
        return {
          errorCode: data.errorCode || response.status,
          message: data.message || 'Login failed'
        };
      }
  
      // Lưu thông tin user vào localStorage khi đăng nhập thành công
      localStorage.setItem('ID', data.user.id);
      localStorage.setItem('ACCESS_TOKEN', data.token);
      localStorage.setItem('ROLE', data.user.role);
      localStorage.setItem('Email', data.user.email);
      localStorage.setItem('FullName', data.user.fullName);
  
      return {
        errorCode: 0,
        message: 'Login successful',
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        errorCode: 8,
        message: 'Internal server error'
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
