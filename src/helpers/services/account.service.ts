import { IAccount } from '@/types/account';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';


import {
  authenticate,
  createAccount,
  deleteAccount,
  findAccountByEmail,
  registerAccount,
  searchAccounts,
  updateAccount,
  updatePasswordByEmail,
} from '../repositories/account.repository';

import { IBaseSearch } from '@/types/base';
import { isDisposableEmail } from '@/services/utils.services';
import { decrypt } from '@/libs/access';
import { getPermissionsByRole } from '../repositories/permission.repository';

const BCRYPT_ROUNDS = parseInt('10'); //số vòng lặp mà thư viện bcryptjs sử dụng khi mã hoá mật khẩu

export const createAccountService = async (model: IAccount) => {
  try {
    // Validate input
    if (!model.username?.trim()) throw new Error('Tên đăng nhập không được để trống');
    if (!model.name?.trim()) throw new Error('Họ tên không được để trống');
    if (!model.email?.trim()) throw new Error('Email không được để trống');
    if (!model.password?.trim()) throw new Error('Mật khẩu không được để trống');

    const isInvalidEmail = await isDisposableEmail(model.email);
    if (isInvalidEmail) throw new Error('Địa chỉ email không được hỗ trợ');
    //vừa sửa
    const decryptedPassword = decrypt(model.password);
    if (!decryptedPassword) throw new Error('Mật khẩu không hợp lệ');

    const hashedPassword = await bcrypt.hash(decryptedPassword, BCRYPT_ROUNDS);
    const result = await createAccount({
      ...model,
      password: hashedPassword,
    });

    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Lỗi khi tạo người dùng');
  }
};

export const updateAccountService = async (model: IAccount) => {
  try {
    if (!model.username?.trim()) throw new Error('Tên đăng nhập không được để trống');
    if (!model.name?.trim()) throw new Error('Họ tên không được để trống');
    if (!model.email?.trim()) throw new Error('Email không được để trống');


    const isInvalidEmail = await isDisposableEmail(model.email);
    if (isInvalidEmail) throw new Error('Địa chỉ email không được hỗ trợ');

    const updatedModel = { ...model };

    if (model.password?.trim()) {
      const decryptedPassword = decrypt(model.password);
      if (!decryptedPassword) throw new Error('Mật khẩu không hợp lệ');

      const hashedPassword = await bcrypt.hash(decryptedPassword, BCRYPT_ROUNDS);

      updatedModel.password = hashedPassword;
    }

    const result = await updateAccount(updatedModel);
    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Lỗi khi cập nhật người dùng');
  }
};

export const searchAccountService = async (model: IBaseSearch) => {
  try {
    return await searchAccounts(model);
  } catch (error) {
    throw new Error('Không thể tìm kiếm người dùng');
  }
};

export const deleteAccountService = async (username: string, deletedBy: string) => {
  try {
    return await deleteAccount(username, deletedBy);
  } catch (error) {
    throw new Error('Không thể xóa người dùng' + error);
  }
};



export const login = async (username: string, rawPassword: string) => {
  try {
    const account = await authenticate(username);

    if (!account || !account[0]) {
      return { error: "Tên đăng nhập không tồn tại." };
    }

    const user = account[0];
    const isMatch = await bcrypt.compare(rawPassword, user.password);
    if (!isMatch) {
      return { error: "Mật khẩu không chính xác." };
    }

    // 1. Gọi hàm mới để lấy tất cả thông tin phân quyền
    const allPermissionsInfo = await getPermissionsByRole(user.role_id);

    // 2. Dùng .map() để lọc ra mảng chỉ chứa các `permission_code`
    const permissions = allPermissionsInfo.map((p: any) => p.permission_code);

    // 3. Tạo object mới để trả về client
    const userWithPermissions = {
      ...user,
      password: '', // Xóa password hash
      permissions: permissions, // Mảng mã quyền
    };

    return userWithPermissions;

  } catch (error) {
    console.error("❌ Login error", error);
    return null;
  }
};


export const forgotPasswordService = async (email: string) => {
  try {
    const account = await findAccountByEmail(email);
    if (!account) {
      throw new Error(`Không tồn tại tài khoản liên kết với ${email}.`);
    }


    // 1. Tạo OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số

    // 2. Gửi email chứa OTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng 16 ký tự
      },
    });
    const mailOptions = {
      from: `"CHEMISTRY FORUM Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã OTP khôi phục mật khẩu CHEMISTRY FORUM',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #0d448a;">Khôi phục mật khẩu</h2>
            <p>Xin chào ${account.name},</p>
            <p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn trên Diễn đàn Hóa học (CHEMISTRY FORUM).</p>
            <p>Đây là mã OTP của bạn:</p>
             <p style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 10px 15px; font-size: 18px; font-weight: bold; text-align: center; letter-spacing: 2px;">
                ${otp}
            </p>
            <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu bạn lo ngại về vấn đề bảo mật.</p>
            <hr>
            <p>Trân trọng,<br/>Đội ngũ CHEMISTRY FORUM</p>
        </div>`,
    };
    await transporter.sendMail(mailOptions);

    // 3. Tạo JWT tạm thời chứa OTP và email
    const otpToken = jwt.sign(
      { email: account.email, otp: otp },
      process.env.JWT_SECRET as string,
      { expiresIn: '5m' } // Hết hạn sau 5 phút
    );

    return {
      success: true,
      message: 'OTP đã được gửi đến email của bạn.',
      otpToken: otpToken // Gửi token này về cho client
    };

  } catch (error: any) {
    const errorMessage = error.message || "Gửi email thất bại do lỗi hệ thống.";
    throw new Error(errorMessage);
  }
};

//chỉ xác thực OTP
export const verifyOtpService = async (otp: string, otpToken: string) => {
  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET as string) as { email: string; otp: string };
    if (decoded.otp !== otp) {
      throw new Error("Mã OTP không chính xác.");
    }
    // Nếu OTP đúng, trả về email để dùng cho bước sau
    return { success: true, email: decoded.email };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error("Mã OTP đã hết hạn. Vui lòng thử lại.");
    }
    throw new Error(error.message || "Lỗi khi xác thực OTP.");
  }
};

// chỉ đặt lại mật khẩu (sau khi đã xác thực OTP, đặt lại mật khẩu cho email đã cung cấp)
export const resetPasswordService = async (email: string, newPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await updatePasswordByEmail(email, hashedPassword);
    return { success: true, message: "Đổi mật khẩu thành công." };
  } catch (error: any) {
    throw new Error(error.message || "Lỗi khi đặt lại mật khẩu.");
  }
}

export const registerAccountService = async (model: IAccount) => {
  try {
    //kiểm tra các trường dữ liệu bắt buộc
    if (!model.username?.trim()) throw new Error('Tên đăng nhập không được để trống');
    if (!model.name?.trim()) throw new Error('Họ tên không được để trống');
    if (!model.email?.trim()) throw new Error('Email không được để trống');
    if (!model.password?.trim()) throw new Error('Mật khẩu không được để trống');

    //kiểm tra email đã tồn tại chưa
    const existingAccountByEmail = await findAccountByEmail(model.email);
    if (existingAccountByEmail) {
      throw new Error(`Địa chỉ email ${model.email} đã được sử dụng.`);
    }

    //kiểm tra username đã tồn tại chưa
    const existingAccountByUsername = await authenticate(model.username);
    if (existingAccountByUsername && existingAccountByUsername[0]) {
      throw new Error(`Tên đăng nhập ${model.username} đã tồn tại.`);
    }

    //kiểm tra email có hợp lệ không
    const isInvalidEmail = await isDisposableEmail(model.email);
    if (isInvalidEmail) throw new Error('Địa chỉ email không hợp lệ.');

    const decryptedPassword = decrypt(model.password);
    if (!decryptedPassword) throw new Error('Mật khẩu không hợp lệ');

    const hashedPassword = await bcrypt.hash(decryptedPassword, BCRYPT_ROUNDS);
    const result = await registerAccount({
      ...model,
      password: hashedPassword,
    });

    return result;

  } catch (error: any) {
    throw new Error(error.message || 'Lỗi khi đăng ký tài khoản');
  }
};

export const registerOTPService = async (email: string, username: string) => {
  try {
    // 1. Kiểm tra xem email hoặc tài khoản đã được đăng ký chưa
    const existingAccount = await findAccountByEmail(email);
    if (existingAccount) {
      throw new Error(`Địa chỉ email ${email} đã được sử dụng.`);
    }

    const account = await authenticate(username);

    if (account || account[0]) {
      throw new Error(`Tên đăng nhập ${username} đã được sử dụng.`);
    }


    // 2. Tạo OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Gửi email chứa OTP
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"CHEMISTRY FORUM Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã OTP đăng ký tài khoản CHEMISTRY FORUM',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #0d448a;">Xác thực Email Đăng ký</h2>
            <p>Cảm ơn bạn đã quan tâm đến Diễn đàn Hóa học (CHEMISTRY FORUM).</p>
            <p>Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP sau:</p>
            <p style="background-color: #f0f0f0; border: 1px solid #ddd; padding: 10px 15px; font-size: 18px; font-weight: bold; text-align: center; letter-spacing: 2px;">
                ${otp}
            </p>
            <p>Mã này có hiệu lực trong 5 phút.</p>
            <p>Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.</p>
            <hr>
            <p>Trân trọng,<br/>Đội ngũ CHEMISTRY FORUM</p>
        </div>`,
    };
    await transporter.sendMail(mailOptions);

    const otpToken = jwt.sign(
      { email: email, otp: otp },
      process.env.JWT_SECRET as string,
      { expiresIn: '5m' } // Hết hạn sau 5 phút
    );

    return {
      success: true,
      message: 'OTP đã được gửi đến email của bạn.',
      otpToken: otpToken,
    };

  } catch (error: any) {
    // Ném lỗi ra ngoài để API route có thể bắt và trả về đúng thông báo
    throw new Error(error.message || "Gửi email thất bại do lỗi hệ thống.");
  }
};

