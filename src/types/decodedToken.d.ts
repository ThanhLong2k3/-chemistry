// 2. Interface cho payload của token
export interface IDecodedToken {
  username: string;
  role: string;
  email: string;
  name: string;
  image: string;
  permissions: string[];
}