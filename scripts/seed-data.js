const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const seedData = async () => {
    try {
        console.log('🌱 Seeding database with test accounts...\n');

        // Create Harshal (Instructor)
        const password = await bcrypt.hash('Welcome@123', 10);
        await pool.query(`
            INSERT INTO users (name, email, password, role, status)
            VALUES ($1, $2, $3, 'instructor', 'approved')
            ON CONFLICT (email) DO UPDATE 
            SET password = $3, status = 'approved'
        `, ['Harshal Baviskar', 'harshal@drivingschool.com', password]);
        console.log('✅ Created instructor: harshal@drivingschool.com (Password: Welcome@123)');

        // Create Harshal (Student)
        await pool.query(`
            INSERT INTO users (name, email, password, role, status)
            VALUES ($1, $2, $3, 'student', 'approved')
            ON CONFLICT (email) DO UPDATE 
            SET password = $3, status = 'approved'
        `, ['Harshal Baviskar', 'harshal@gmail.com', password]);
        console.log('✅ Created student: harshal@gmail.com (Password: Welcome@123)');

        console.log('\n═══════════════════════════════════════');
        console.log('🎉 Seed data inserted successfully!');
        console.log('═══════════════════════════════════════\n');

        console.log('📋 Test Accounts:');
        console.log('  Instructor: harshal@drivingschool.com / Welcome@123');
        console.log('  Student:    harshal@gmail.com / Welcome@123\n');

    } catch (err) {
        console.error('❌ Error seeding data:', err);
    } finally {
        pool.end();
    }
};

seedData();

