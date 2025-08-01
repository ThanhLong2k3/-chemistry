const getEnvSafely = (envKey: string) => {
  const envVal = process.env[envKey];
  // if (!envVal) throw new Error(`Missing variable ${envKey}!`);
  return envVal;
};

/**
 * For server-used only
 */
const BASE_URL = "https://vuihochoa.edu.vn";
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';
const DB_HOST = getEnvSafely('DB_HOST');
const DB_PORT = getEnvSafely('DB_PORT');
const DB_USERNAME = getEnvSafely('DB_USERNAME');
const DB_PASSWORD = getEnvSafely('DB_PASSWORD');
const DB_NAME = getEnvSafely('DB_NAME');
const DB_APP_NAME = getEnvSafely('DB_BOT_NAME');
const JWT_SECRET = getEnvSafely('JWT_SECRET') || '';
const JWT_REFRESH_SECRET = getEnvSafely('JWT_REFRESH_SECRET') || '';
const JWT_EXPIRES_IN = getEnvSafely('JWT_EXPIRES_IN') || '1d';
const JWT_REFRESH_EXPIRES_IN = getEnvSafely('JWT_REFRESH_EXPIRES_IN') || '1h';
const LIMIT_SIZE = getEnvSafely('LIMIT_SIZE') ?? 0;
const UPLOAD_PATH = getEnvSafely('UPLOAD_PATH') || 'uploads';
const SYSTEM_EMAIL_EMAIL = getEnvSafely('SYSTEM_EMAIL_EMAIL');
const SYSTEM_EMAIL_PASSWORD = getEnvSafely('SYSTEM_EMAIL_PASSWORD');

const VNPAY_TNM_CODE = getEnvSafely('VNPAY_TNM_CODE');
const VNPAY_HASH_SECRET = getEnvSafely('VNPAY_HASH_SECRET');
const VNPAY_URL = getEnvSafely('VNPAY_URL');
const VNPAY_API = getEnvSafely('VNPAY_API');
const VNPAY_RETURN_URL = getEnvSafely('VNPAY_RETURN_URL');

const VNPAY_INV_URL = getEnvSafely('VNPAY_INV_URL');
const CLIENT_ID = getEnvSafely('CLIENT_ID');
const CLIENT_SECRET = getEnvSafely('CLIENT_SECRET');
const TAX_CODE = getEnvSafely('TAX_CODE');
const INVOICE_SYMBOL = getEnvSafely('INVOICE_SYMBOL');
const WEBHOOK_SECRET = getEnvSafely('WEBHOOK_SECRET');

const WHITELIST_IP = getEnvSafely('WHITELIST_IP');

const env = {
  BASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_APP_NAME,
  ENCRYPTION_KEY,
  LIMIT_SIZE,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  UPLOAD_PATH,
  SYSTEM_EMAIL_EMAIL,
  SYSTEM_EMAIL_PASSWORD,
  VNPAY_TNM_CODE,
  VNPAY_HASH_SECRET,
  VNPAY_URL,
  VNPAY_API,
  VNPAY_RETURN_URL,

  //
  VNPAY_INV_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  TAX_CODE,
  INVOICE_SYMBOL,
  WEBHOOK_SECRET,

  //
  WHITELIST_IP,
};

export default env;
