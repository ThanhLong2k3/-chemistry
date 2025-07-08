import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'academi_v4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function getConnection() {
  for (let i = 0; i < 10; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL');
      connection.release();
      return pool;
    } catch (error) {
      console.error(
        `MySQL connection attempt ${i + 1} failed:`,
        (error as Error).message,
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error('Failed to connect to MySQL after retries');
}

export async function executeQuery<T>(
  query: string,
  params: any[] = [],
): Promise<T> {
  const pool = await getConnection();
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T;
  } catch (error) {
    console.error('Query execution failed:', (error as Error).message);
    throw new Error(`Database error: ${(error as Error).message}`);
  }
}
