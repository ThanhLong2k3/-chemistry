//2
import { IAccount } from '@/types/account';
import bcrypt from 'bcryptjs';

import {
  authenticate,
  createAccount,
  deleteAccount,
  searchAccounts,
  updateAccount,
} from '../repositories/account.repository';

import { IBaseSearch } from '@/types/base';
import { isDisposableEmail } from '@/services/utils.services';
import { decrypt, encrypt } from '@/libs/access';

const BCRYPT_ROUNDS = parseInt('10');

export const createAccountService = async (model: IAccount) => {
  try {
    // Validate input
    if (!model.username?.trim()) throw new Error('Tên đăng nhập không được để trống');
    if (!model.name?.trim()) throw new Error('Họ tên không được để trống');
    if (!model.email?.trim()) throw new Error('Email không được để trống');
    if (!model.password?.trim()) throw new Error('Mật khẩu không được để trống');

    const isInvalidEmail = await isDisposableEmail(model.email);
    if (isInvalidEmail) throw new Error('Địa chỉ email không được hỗ trợ');

    const decryptedPassword = decrypt(model.password);
    if (!decryptedPassword) throw new Error('Mật khẩu không hợp lệ');

    const hashedPassword = await bcrypt.hash(decryptedPassword, BCRYPT_ROUNDS);

    // Save
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

    if (!account || !account[0]) return null;

    const user = account[0];
    const isMatch = await bcrypt.compare(rawPassword, user.password);

    if (!isMatch) return null;

    return user;
  } catch (error) {
    console.error("❌ Login error", error);
    return null;
  }
};
