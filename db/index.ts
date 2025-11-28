import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Initialize Neon serverless client (HTTP) - optimized for serverless/edge environments
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle database instance with schema
// This provides type-safe queries and access to all defined tables
export const db = drizzle(sql, { schema });
