export interface IComment {
    id: string;
    content: string | null;
    blog_id: string;
    created_at: Date;
    created_by: string;
    deleted: boolean;
}
