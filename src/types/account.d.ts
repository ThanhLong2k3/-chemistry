import { DateTimeFormatOptions } from "next-intl";

export interface IAccount {
  old_username: string;
  username: string;
  password: string;
  image: string | null;
  name: string;
  role_id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
  deleted: boolean;
}
