// 2. Interface cho payload của token
export interface IDecodedToken {
  username: string;
  role: 'admin' | 'teacher' | 'collaborator' | 'student';
  email: string;
  name: string;
  image: string;
}