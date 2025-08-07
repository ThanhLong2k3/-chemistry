import CryptoJS from 'crypto-js';
import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

import env from '@/env';

export const actionsAccess = {
  VIEW_PAYMENT: 'view_payment',
};

export const encrypt = (value: any) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(value),
    env.ENCRYPTION_KEY
  ).toString();
};

export const decrypt = (encrypted: string) => {
  console.log(env.ENCRYPTION_KEY);
  const result = CryptoJS.AES.decrypt(encrypted, env.ENCRYPTION_KEY).toString(
    CryptoJS.enc.Utf8
  );

  return result ? JSON.parse(result) : '';
};

// export const generateToken = async (
//   payload: JWTPayload,
//   expiresIn: string = env.JWT_EXPIRES_IN
// ): Promise<string> => {
//   const secret = new TextEncoder().encode(env.JWT_SECRET);
//   const token = await new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime(expiresIn)
//     .sign(secret);

//   return token;
// };

// export const verifyToken = async (token: string): Promise<object | null> => {
//   try {
//     const secret = new TextEncoder().encode(env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret); // Verify the token
//     return payload; // JWT payload if valid
//   } catch {
//     return null;
//   }
// };

// export const generateRefreshToken = async (
//   payload: JWTPayload
// ): Promise<string> => {
//   const secret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);
//   const token = await new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime(env.JWT_REFRESH_EXPIRES_IN)
//     .sign(secret);

//   return token;
// };

// export const verifyRefreshToken = async (
//   token: string
// ): Promise<object | null> => {
//   try {
//     const secret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);
//     const { payload } = await jwtVerify(token, secret); // Verify the token
//     return payload; // JWT payload if valid
//   } catch {
//     return null;
//   }
// };
