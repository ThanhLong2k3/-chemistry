export interface IDecentralization {
    id: string;
    name: string;
    permission_code: string;
    id_parent: string | null;
    parent_name: string | null;
    created_by: string;
    updated_by: string;
    deleted: boolean;
}
