import { DateTimeFormatOptions } from "next-intl";

export interface IAccount {
  username: string;
  password: string;
  image: string | null;
  name: string;
  role: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  updated_by: string;
  deleted: boolean
}
