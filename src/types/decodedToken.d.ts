// 2. Interface cho payload của token
export interface IDecodedToken {
  username: string;
  role_id: string;
  email: string;
  name: string;
  image: string;
  permissions: string[];
}