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

        console.log('Creating bookings table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        slot_id INTEGER REFERENCES slots(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(slot_id, student_id)
      );
    `);

        console.log('Updating slots table...');
        await client.query(`
      ALTER TABLE slots 
      ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 4,
      ADD COLUMN IF NOT EXISTS booked_count INTEGER DEFAULT 0;
    `);

        // Data Migration: Move existing student_id from slots to bookings
        console.log('Migrating existing bookings...');
        const existingBookings = await client.query(`
      SELECT id, student_id FROM slots WHERE student_id IS NOT NULL AND status IN ('booked', 'completed')
    `);

        for (const row of existingBookings.rows) {
            // Check if already in bookings to avoid duplicates if re-run
            const check = await client.query('SELECT 1 FROM bookings WHERE slot_id = $1 AND student_id = $2', [row.id, row.student_id]);
            if (check.rows.length === 0) {
                await client.query('INSERT INTO bookings (slot_id, student_id) VALUES ($1, $2)', [row.id, row.student_id]);
                await client.query('UPDATE slots SET booked_count = 1 WHERE id = $1', [row.id]);
            }
        }

        // Optional: Drop student_id column from slots? 
        // Checking if we should drop it. Might break older code if not fully updated.
        // Let's keep it nullable for now but simpler to just ignore it in new code.
        // actually, let's leave it.

        await client.query('COMMIT');
        console.log('Migration completed successfully.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
