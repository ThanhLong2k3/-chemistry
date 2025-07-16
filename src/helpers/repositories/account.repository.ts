//1
import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IAccount } from '@/types/account';

// Thêm tài khoản mới
export const createAccount = async (model: IAccount): Promise<any> => {
  try {
    const sql = 'CALL add_account(?,?,?,?,?,?,?)';
    return await db_Provider(
      sql,
      [
        model.username,
        model.password,
        model.image ?? null,
        model.name,
        model.role,
        model.email,
        model.updated_by
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Cập nhật tài khoản
export const updateAccount = async (model: IAccount): Promise<any> => {
  try {
    const sql = 'CALL update_account(?,?,?,?,?,?)';
    return await db_Provider(
      sql,
      [
        model.username,
        model.password,
        model.image,
        model.name,
        model.email,
        model.updated_by
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Xóa tài khoản (xoá mềm)
export const deleteAccount = async (username: string, deletedBy: string): Promise<any> => {
  try {
    const sql = 'CALL delete_account(?,?)';
    return await db_Provider(sql, [username, deletedBy], true);
  } catch (error: any) {
    console.error(error);

    throw new Error(error.message);
  }
};

// Tìm kiếm tài khoản có phân trang
export const searchAccounts = async (model: IBaseSearch): Promise<any> => {
  try {
    const sql = 'CALL get_accounts(?,?,?,?)'; // 
    const searchContent = model.search_content || null;
    const results = await db_Provider(sql, [
      model.page_index ?? 0,
      model.page_size ?? 10,
      model.order_type ?? 'ASC',
      searchContent,
    ]);
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const authenticate = async (username: string): Promise<any> => {
  try {
    const sql = 'CALL get_user_by_username(?)';
    const results = await db_Provider(sql, [username]);
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
};