import { DateTimeFormatOptions } from "next-intl";

export interface IBlog {
    id: string;
    image: string;
    title: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    create_by_name: string | null;
    updated_by: string;
    deleted: boolean
}
