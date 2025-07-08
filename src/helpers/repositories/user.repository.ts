import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IUser } from '@/types/user';

// Thêm người dùng mới
export const createUser = async (model: IUser): Promise<any> => {
  try {
    console.log(model,"modelaaaaaaaaaaaa");
    const sql = 'CALL AddUser(?,?,?,?)'; 
    return await db_Provider(
      sql,
      [
        model.id,
        model.username,
        model.email,
        model.password,
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Cập nhật người dùng
export const updateUser = async (model: IUser): Promise<any> => {
  try {
    const sql = 'CALL UpdateUser(?,?,?,?)'; 
    return await db_Provider(
      sql,
      [
        model.id,
        model.username,
        model.email,
        model.password,
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Xóa người dùng (mềm hoặc cứng tùy thủ tục)
export const deleteUser = async (userId: string): Promise<any> => {
  try {
    const sql = 'CALL DeleteUser(?)'; 
    return await db_Provider(sql, [userId], true);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Tìm kiếm người dùng có phân trang
export const searchUsers = async (model: IBaseSearch): Promise<any> => {
  try {
    const sql = 'CALL GetUsersByPageOrder(?,?,?,?)'; // cần tạo thủ tục
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
    const sql = 'CALL getUserByUsername(?)';
    const results = await db_Provider(sql, [username]);
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
};