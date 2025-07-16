import { DateTimeFormatOptions } from "next-intl";

export interface ISubject {
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    textbook: string | null;
    workbook: string | null;
    exercise_book: string | null;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    deleted: boolean
}
