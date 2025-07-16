import { db_Provider } from '@/app/api/Api_Provider';
import { IBaseSearch } from '@/types/base';
import { IAdvisoryMember } from '@/types/advisory_member';
import { mode } from 'd3';

// Thêm thành viên ban tư vấn mới
export const createAdvisoryMember = async (model: IAdvisoryMember): Promise<any> => {
    try {
        const sql = 'CALL add_advisory_member(?,?,?,?,?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.teacher_name,
                model.image,
                model.qualification ?? null,
                model.subject_id,
                model.in_charge ?? null,
                model.workplace ?? null,
                model.years_of_experience ?? null,
                model.description ?? null,
                model.created_by,
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Cập nhật thành viên ban tư vấn
export const updateAdvisoryMember = async (model: IAdvisoryMember): Promise<any> => {
    try {
        const sql = 'CALL update_advisory_member(?,?,?,?,?,?,?,?,?,?)';
        return await db_Provider(
            sql,
            [
                model.id,
                model.teacher_name,
                model.image,
                model.qualification ?? null,
                model.subject_id,
                model.in_charge ?? null,
                model.workplace ?? null,
                model.years_of_experience ?? null,
                model.description ?? null,
                model.updated_by,
            ],
            true
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Xóa thành viên ban tư vấn (xoá mềm)
export const deleteAdvisoryMember = async (id: string, deletedBy: string): Promise<any> => {
    try {
        const sql = 'CALL delete_advisory_member(?,?)';
        return await db_Provider(sql, [id, deletedBy], true);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Tìm kiếm thành viên ban tư vấn có phân trang
export const searchAdvisoryMembers = async (model: IBaseSearch): Promise<any> => {
    try {
        const sql = 'CALL get_advisory_members(?,?,?,?)';
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
