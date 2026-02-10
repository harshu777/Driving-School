require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

async function testConnection() {
    try {
        console.log('=== Database Connection Test ===');
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('');

        console.log('Attempting to connect...');
        const client = await pool.connect();
        console.log('✅ Connected to database successfully');
        console.log('');

        console.log('Testing query execution...');
        const result = await client.query('SELECT NOW() as current_time');
        console.log('✅ Query executed successfully');
        console.log('Current time:', result.rows[0].current_time);
        console.log('');

        console.log('Checking tables...');
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        console.log('✅ Tables found:', tables.rowCount);
        tables.rows.forEach(row => {
            console.log('  -', row.table_name);
        });
        console.log('');

        console.log('Checking users table...');
        const users = await client.query('SELECT COUNT(*) as count FROM users');
        console.log('✅ Users in database:', users.rows[0].count);
        console.log('');

        client.release();
        await pool.end();

        console.log('=== All Tests Passed! ===');
        process.exit(0);
    } catch (error) {
        console.error('');
        console.error('❌ Connection Test Failed');
        console.error('Error message:', error.message);
        console.error('');
        console.error('Full error details:');
        console.error(error);
        console.error('');

        if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Suggestion: Check if the database host is correct and accessible');
        } else if (error.message.includes('authentication failed')) {
            console.error('💡 Suggestion: Check your database username and password');
        } else if (error.message.includes('does not exist')) {
            console.error('💡 Suggestion: Create the database first using scripts/create-db.js');
        } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
            console.error('💡 Suggestion: Run migrations using scripts/migrate-database.js');
        }

        process.exit(1);
    }
}

testConnection();
