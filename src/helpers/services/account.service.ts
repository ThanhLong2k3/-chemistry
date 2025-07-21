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

    // const decryptedPassword = decrypt(model.password);
    // if (!decryptedPassword) throw new Error('Mật khẩu không hợp lệ');

    // const hashedPassword = await bcrypt.hash(decryptedPassword, BCRYPT_ROUNDS);

    // Save
    const result = await createAccount({
      ...model,
      // password: hashedPassword,
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
    // if (!isMatch) return null;

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