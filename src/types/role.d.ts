export interface IRole {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    deleted: boolean;
}
