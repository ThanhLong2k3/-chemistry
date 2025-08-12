const getEnvSafely = (envKey: string) => {
  const envVal = process.env[envKey];
  // if (!envVal) throw new Error(`Missing variable ${envKey}!`);
  return envVal;
};

/**
 * For server-used only
 */
const BASE_URL = "https://vuihochoa.edu.vn/api";
// const BASE_URL = "http://localhost:3000/api";
const ID_ROLE_STUDENT = "5bb89efe-f547-4892-b85d-3646b06ed5a8"
const JWT_SECRET = "dinhthientruong21dinhthientruong09dinhthientruong2004!@#$%^&*()-_=+[{]}\|;:,<.>/?"



const ENCRYPTION_KEY = "a0as20csd5c2s0cs5s0cs365s12s0c2sc4s5d0s";
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
