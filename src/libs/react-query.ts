import { AxiosError } from 'axios';
import {
  QueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { DefaultOptions } from '@tanstack/react-query';

// Cấu hình mặc định cho QueryClient
const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false, // Không refetch khi focus lại
    retry: 1, // Thử lại 1 lần nếu thất bại
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

// Trích xuất giá trị từ Promise
export type PromiseValue<PromiseType, Otherwise = PromiseType> =
  PromiseType extends Promise<infer Value>
    ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown>
        ? 0
        : 1]
    : Otherwise;

// Trích xuất kiểu trả về của hàm
export type ExtractFnReturnType<FnType extends (...args: any) => any> =
  PromiseValue<ReturnType<FnType>>;

// Cấu hình cho useQuery, dùng Omit chuẩn của TypeScript
export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

// Cấu hình cho useMutation
export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError<any>,
    Parameters<MutationFnType>[0]
  >;

// Định nghĩa Omit nếu TypeScript không nhận diện (tuỳ chọn nếu cần)
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
