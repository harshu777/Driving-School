const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createInstructor = async () => {
    try {
        const password = 'Harshal123!@#';
        const hashedPassword = await bcrypt.hash(password, 10);
        const email = 'harshal@example.com'; // Assuming an email, or I should ask? I'll use a placeholder based on name.
        // Wait, the user said "make an entry of instructor named Harshal". They didn't provide an email.
        // I will use 'harshal@driving.school' or similar and let them know.
        // actually, I'll use 'harshal@example.com' for now and print it out.

        const result = await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'instructor')
      ON CONFLICT (email) DO UPDATE SET password = $3
      RETURNING id, name, email, role
    `, ['Harshal', 'harshal@drivingschool.com', hashedPassword]);

        console.log('Instructor created successfully:', result.rows[0]);
    } catch (err) {
        console.error('Error creating instructor:', err);
    } finally {
        pool.end();
    }
};

createInstructor();
