import { IUser } from '@/types/user';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

import {
  authenticate,
  createUser,
  deleteUser,
  searchUsers,
  updateUser,
} from '../repositories/user.repository';

import { IBaseSearch } from '@/types/base';
import { isDisposableEmail } from '@/services/utils.services';
import { decrypt } from '@/libs/access';

const BCRYPT_ROUNDS = parseInt('10');

export const createUserService = async (model: IUser) => {
  try {
    // Validate input
    if (!model.username?.trim()) throw new Error('Tên đăng nhập không được để trống');
    if (!model.email?.trim()) throw new Error('Email không được để trống');
    if (!model.password?.trim()) throw new Error('Mật khẩu không được để trống');

    const isInvalidEmail = await isDisposableEmail(model.email);
    if (isInvalidEmail) throw new Error('Địa chỉ email không được hỗ trợ');

    // Decrypt & hash password
    const decryptedPassword = decrypt(model.password);
    console.log("mã hóa mật khẩu",decryptedPassword);
    if (!decryptedPassword) throw new Error('Mật khẩu không hợp lệ');

    const hashedPassword = await bcrypt.hash(decryptedPassword, BCRYPT_ROUNDS);
    const userId = randomUUID();

    // Save
    const result = await createUser({
      ...model,
      id: userId,
      password: hashedPassword,
    });

    return result;
  } catch (error:any) {
    throw new Error(error.message || 'Lỗi khi tạo người dùng');
  }
};

export const updateUserService = async (model: IUser) => {
  try {
    if (!model.username?.trim()) throw new Error('Tên đăng nhập không được để trống');
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

    const result = await updateUser(updatedModel);
    return result;
  } catch (error:any) {
    throw new Error(error.message || 'Lỗi khi cập nhật người dùng');
  }
};

export const searchUserService = async (model: IBaseSearch) => {
  try {
    return await searchUsers(model);
  } catch (error) {
    throw new Error('Không thể tìm kiếm người dùng');
  }
};

export const deleteUserService = async (userId: string) => {
  try {
    return await deleteUser(userId);
  } catch (error) {
    throw new Error('Không thể xóa người dùng');
  }
};

export const authenticateService = async (
  username: string,
  encryptedPassword: string
) => {
  try {
    const decryptedPassword = decrypt(encryptedPassword);
    
    const user = await authenticate(username);
    if (!user) return null;
    console.log("user",user)

    console.log("decryptedPassword",decryptedPassword)
    console.log("user.password",user[0].password)
    const isMatch = await bcrypt.compare(decryptedPassword, user[0].password);

    if (!isMatch) return null;

    return { ...user, hashed_password: undefined };
  } catch (error) {
    return null; 
  }
};
