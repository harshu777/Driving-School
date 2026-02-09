const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

async function migrate() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Updating bookings table for Digital Logbook...');
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS km_driven NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS grade VARCHAR(50),
      ADD COLUMN IF NOT EXISTS instructor_notes TEXT,
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed'));
    `);

        await client.query('COMMIT');
        console.log('Logbook migration completed successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
