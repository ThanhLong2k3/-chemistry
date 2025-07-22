export interface IExam {
    id: string;
    name: string;
    subject_id: string;
    file: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    deleted: boolean
}
