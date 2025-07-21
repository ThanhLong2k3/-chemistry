import { DateTimeFormatOptions } from "next-intl";

export interface IAdvisoryMember {
    id: string;
    teacher_name: string;
    image: string;
    qualification: string | null;
    subject: string;
    in_charge: string | null;
    workplace: string | null;
    years_of_experience: int | null;
    description: text | null;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    deleted: boolean
}
