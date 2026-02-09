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

const seedData = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Insert Instructor
        await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'instructor')
      ON CONFLICT (email) DO NOTHING
    `, ['John Instructor', 'instructor@example.com', hashedPassword]);

        // Insert Student
        await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'student')
      ON CONFLICT (email) DO NOTHING
    `, ['Jane Student', 'student@example.com', hashedPassword]);

        console.log('Seed data inserted successfully.');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        pool.end();
    }
};

seedData();
