const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const resetData = async () => {
    try {
        console.log('🔄 Cleaning database while preserving seed users...\n');

        // Define emails to keep (from seed-data.js)
        const emailsToKeep = ['harshal@drivingschool.com', 'harshal@gmail.com'];

        await pool.query('BEGIN');

        // 1. Clear all dependent tables
        // 'CASCADE' is generally good, but listing them explicitly is safer to avoid deleting users if users were dependent (they're not, usually parent)
        // But bookings, vehicles etc depend on users.
        const tablesToClear = [
            'bookings',
            'fuel_logs',
            'maintenance_logs',
            'license_applications',
            'slots',
            'vehicles'
        ];

        for (const table of tablesToClear) {
            await pool.query(`TRUNCATE TABLE ${table} CASCADE`);
            console.log(`✅ Cleared table: ${table}`);
        }

        // 2. Delete non-seed users
        // Use parameterized query for safety
        const placeholders = emailsToKeep.map((_, i) => `$${i + 1}`).join(',');
        const deleteQuery = `
            DELETE FROM users 
            WHERE email NOT IN (${placeholders})
        `;

        const res = await pool.query(deleteQuery, emailsToKeep);
        console.log(`✅ Deleted ${res.rowCount} non-seed users.`);

        // 3. Reset sequences (optional but good for clean slate)
        const sequences = [
            'bookings_id_seq',
            'fuel_logs_id_seq',
            'license_applications_id_seq',
            'maintenance_logs_id_seq',
            'slots_id_seq',
            'users_id_seq',
            'vehicles_id_seq'
        ];

        for (const seq of sequences) {
            // Reset sequence to max id + 1, or 1 if empty
            // Since we deleted most, we can set to 1? Or max+1 of kept users?
            // Users table still has rows, so we should set users_id_seq to max(id)+1
            if (seq === 'users_id_seq') {
                await pool.query(`SELECT setval('${seq}', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false)`);
            } else {
                await pool.query(`ALTER SEQUENCE ${seq} RESTART WITH 1`);
            }
        }
        console.log('✅ Reset sequences.');

        await pool.query('COMMIT');

        console.log('\n═══════════════════════════════════════');
        console.log('🎉 Database cleaned! Preserved seed users.');
        console.log('═══════════════════════════════════════\n');

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('❌ Error cleaning data:', err);
    } finally {
        pool.end();
    }
};

resetData();
