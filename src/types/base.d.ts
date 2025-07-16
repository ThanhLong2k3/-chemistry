export interface IBaseIn {
  lu_user?: string;
  created_user?: string;
}
export interface IBaseSearch {
  page_index?: number;
  page_size?: number;
  order_type?: string;
  search_content?: string | null;
  from_date?: string;
  to_date?: string;
  year?: number;

  //
  menu_id?: string;

  //
  user_id?: string;
  //
  role_id?: string;
  branch_id?: string;
  department_id?: string;

  //
  package_function_id?: string;
  package_product_id?: string;
  parent_id?: string;

  //
  status?: string;
  is_gift?: boolean;
}

export type ResponseProps<T = undefined> = {
  data: T;
  message: string;
  success: boolean;
  total_rows?: number;
};
