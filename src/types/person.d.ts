import { IBaseIn } from "./base";

export interface IPerson extends IBaseIn {
  id: string;
    user_id: string;
    name: string;
    status: string;
    birth_hour?: number;
    birth_minute?: number;
    birth_day?: number;
    birth_month?: number;
    birth_year?: number;
    death_hour?: number;
    death_minute?: number;
    death_day?: number;
    death_month?: number;
    death_year?: number;
    gender: string;
    description?: string;
    generation: number;
    photo?: string | null;
    parent_id?: string | null;
    active_flag: number;
    children?: Person[];
    spouses?: Person[];
}
