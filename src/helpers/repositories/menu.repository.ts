import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IMenu } from '@/types/menu';

export const createMenu = async (model: IMenu): Promise<any> => {
  try {
    console.log('model', model);
    const des = model.description ? model.description : null;
    const par = model.parent_id ? model.parent_id : null;
    const sql = 'CALL AddMenu(?,?,?,?,?,?,?)';
    return await db_Provider(
      sql,
      [
        model.menu_id,
        model.menu_name,
        par,
        model.url,
        des,
        model.level,
        model.sort_order,
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateMenu = async (model: IMenu): Promise<any> => {
  try {
    const sql = 'CALL UpdateMenu(?,?,?,?,?,?,?)';
    return await db_Provider(
      sql,
      [
        model.menu_id,
        model.menu_name,
        model.parent_id,
        model.url,
        model.description,
        model.level,
        model.sort_order,
      ],
      true
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteMenus = async (menuId: string): Promise<any> => {
  try {
    const sql = 'CALL DeleteMenu(?)';
    return await db_Provider(sql, [menuId], true);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const searchMenus = async (model: IBaseSearch): Promise<any> => {
  try {
    const sql = 'CALL GetMenusByPageOrder(?,?,?,?)';
    const menu_namme = model.search_content ? model.search_content : undefined;
    const results = await db_Provider(sql, [
      model.page_index ?? 0,
      model.page_size ?? 0,
      model.order_type ?? 'ASC',
      menu_namme || null,
    ]);
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
