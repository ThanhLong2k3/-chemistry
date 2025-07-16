// import { CallApi } from '@/libs/call_API';
// import { GetUser, AddUser, UpUser } from '@/models/user.model';
// export const userAPI = {
//   getAlluser: async () => {
//     const data: GetUser[] = await CallApi.getAll<GetUser>('user');
//     return data;
//   },
//   GetUsersByPageOrder: async (
//     pageIndex: number,
//     pageSize: number,
//     orderType: 'ASC' | 'DESC',
//     FullName?: string,
//     Role?: string,
//   ) => {
//     const queryParams = new URLSearchParams({
//       pageIndex: pageIndex.toString(),
//       pageSize: pageSize.toString(),
//       orderType,
//     });


//     if (Role) {
//       queryParams.append('role', Role);
//     }
//     if (FullName) {
//       queryParams.append('fullName', FullName);
//     }

//     const data: GetUser[] = await CallApi.getAll<GetUser>(
//       `user?${queryParams.toString()}`,
//     );

//     return data;
//   },

//   createuser: async (newuser: AddUser) => {
//     const data = await CallApi.create<number>('user', newuser);
//     return data;
//   },

//   updateuser: async (user: UpUser) => {
//     const data = await CallApi.update<number>('user', user);
//     return data;
//   },

//   deleteuser: async (Id: number): Promise<number> => {
//     const data = await CallApi.delete<number>('user', Id);
//     return data;
//   },
// };
