const API_URL = '/api';

//đã sửa
interface LoginResponse {
  success: boolean;
  message?: string;
  account?: {
    username: string;
    name: string;
    email: string;
    role_id: string;
    image: string;
  };
  token?: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}


export const authAPI = {
  // register: async (
  //   email: string,
  //   password: string,
  //   fullName: string,
  // ): Promise<number> => {
  //   try {
  //     const data = await CallApi.create<number>('auth/register', {
  //       email,
  //       password,
  //       fullName,
  //     });
  //     return data;
  //   } catch (error) {
  //     throw new Error(
  //       `Đăng ký thất bại: ${error instanceof Error ? error.message : 'Không xác định'}`,
  //     );
  //   }
  // },




  //đã sửa
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      if (!username || !password) {
        return {
          success: false,
          message: 'Tên đăng nhập và mật khẩu là bắt buộc'
        };
      }

      const response = await fetch(`http://localhost:3000/${API_URL}/auth/login`, {
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


  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; otpToken?: string }> => {
    try {
      if (!email) return { success: false, message: 'Vui lòng nhập email.' };

      const response = await fetch(`http://localhost:3000/${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Yêu cầu thất bại.');

      // Trả về cả otpToken
      return { success: true, message: data.message, otpToken: data.otpToken };

    } catch (error) {
      console.error('Lỗi API quên mật khẩu:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Lỗi kết nối.' };
    }
  },


  verifyOtp: async (otp: string, otpToken: string): Promise<{ success: boolean; message: string; email?: string }> => {
    try {
      const response = await fetch(`http://localhost:3000/${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, otpToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  resetPassword: async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`http://localhost:3000/${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },


  logout: () => {
    localStorage.clear();
    window.location.href = '/vi/auth/login';
  },
};
