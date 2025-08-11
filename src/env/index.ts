const getEnvSafely = (envKey: string) => {
  const envVal = process.env[envKey];
  // if (!envVal) throw new Error(`Missing variable ${envKey}!`);
  return envVal;
};

/**
 * For server-used only
 */
// const BASE_URL = "https://vuihochoa.edu.vn/api";
const BASE_URL = "http://localhost:3000/api";
const ID_ROLE_STUDENT = "ade9dcaa-ee35-42a4-8855-3ba1506fa65a"
const JWT_SECRET = "dinhthientruong21dinhthientruong09dinhthientruong2004!@#$%^&*()-_=+[{]}\|;:,<.>/?"



const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';
// const JWT_SECRET = getEnvSafely('JWT_SECRET') || '';
const UPLOAD_PATH = getEnvSafely('UPLOAD_PATH') || 'uploads';


const env = {
  BASE_URL,
  ENCRYPTION_KEY,
  JWT_SECRET,
  ID_ROLE_STUDENT,
  UPLOAD_PATH
};

export default env;
