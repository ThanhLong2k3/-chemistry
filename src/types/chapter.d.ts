export interface IChapter {
    id: string;
    name: string;
    subject_id: string;
    subject_name: string | null;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    deleted: boolean
}
