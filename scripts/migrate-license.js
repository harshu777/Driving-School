const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const migrate = async () => {
    try {
        console.log('Starting migration for License Applications...');

        // Create License Applications Table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS license_applications (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'applied', -- 'applied', 'info_needed', 'processing', 'completed'
        student_details JSONB DEFAULT '{}', -- Stores address, dob, blood_group, etc.
        license_number VARCHAR(50),
        certificate_issued_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Add unique constraint so a student can only have one active application
        // Actually, maybe they can re-apply if failed? For now, let's keep it simple: one per student.
        await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_license_student ON license_applications(student_id);
    `);

        console.log('Created table: license_applications');
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await pool.end();
    }
};

migrate();
