import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Aiven PostgreSQL connection configuration
const connectionString = process.env.DATABASE_URL;

let pool = null;

if (connectionString && !connectionString.includes('<ENTER_AIVEN_PASSWORD_HERE>') && !connectionString.includes('<YOUR_PASSWORD>')) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Aiven SSL
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected database client error:', err.message);
  });
} else {
  console.log('⚠️ DATABASE_URL not fully configured in server/.env (password needed).');
}

export const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database pool not initialized. Please configure DATABASE_URL with valid credentials in server/.env.');
  }
  return await pool.query(text, params);
};

export const testConnection = async () => {
  if (!pool) return { connected: false, reason: 'DATABASE_URL not configured with password in server/.env' };
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    return { connected: true, time: res.rows[0].current_time };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};

/**
 * Initialize schema tables in PostgreSQL
 */
export const initDatabase = async () => {
  if (!pool) return false;
  try {
    const schemaPath = path.resolve(__dirname, '../../schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ PostgreSQL database tables initialized successfully.');
      return true;
    }
  } catch (err) {
    console.error('Database initialization warning:', err.message);
  }
  return false;
};

export default { query, testConnection, initDatabase, pool };
