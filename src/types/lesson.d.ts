export interface ILesson {
    id: string;
    name: string;
    image: string;
    chapter_id: string;
    chapter_name: string | null;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    deleted: boolean;
    sort_order: number;
}
