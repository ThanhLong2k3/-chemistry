import { IPerson } from './../../types/person.d';
import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';

export const createPerson = async (model: IPerson): Promise<any> => {
  try {
    const sql = 'CALL AddPerson(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    return await db_Provider(
      sql,
      [
        model.id,
        model.user_id,
        model.name,
        model.status,
        model.birth_hour,
        model.birth_minute,
        model.birth_day,
        model.birth_month,
        model.birth_year,
        model.death_hour,
        model.death_minute,
        model.death_day,
        model.death_month,
        model.death_year,
        model.gender,
        model.description,
        model.generation,
        model.photo,
        model.parent_id,
        model.created_user,
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const updatePerson = async (model: IPerson): Promise<any> => {
  try {
    const sql = 'CALL UpdatePerson(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    return await db_Provider(
      sql,
      [
        model.id,
        model.name,
        model.status,
        model.birth_hour,
        model.birth_minute,
        model.birth_day,
        model.birth_month,
        model.birth_year,
        model.death_hour,
        model.death_minute,
        model.death_day,
        model.death_month,
        model.death_year,
        model.gender,
        model.description,
        model.generation,
        model.photo,
        model.parent_id,
        model.lu_user,
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Xóa người dùng (mềm hoặc cứng tùy thủ tục)
export const DeletePerson = async (userId: string): Promise<any> => {
  try {
    const sql = 'CALL DeletePerson(?)'; 
    return await db_Provider(sql, [userId], true);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Tìm kiếm người dùng có phân trang
export const searchPerson = async (model: IBaseSearch): Promise<any> => {
  try {
    const sql = 'CALL GetPersonsByPageOrder(?,?,?,?)'; // cần tạo thủ tục
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

// lẤY THÔNg tin người dùng theo ID
export const getPersonById = async (id: string): Promise<any> => {
  try {
  if (!id) {
      throw new Error('ID người dùng không được để trống');
    }
    const sql = 'CALL Get_Persons_ByUserId(?)'; 
    const results = await db_Provider(sql, [id]);
    console.log('getPersonById results:', results);
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
