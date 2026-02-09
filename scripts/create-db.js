const { Client } = require('pg');

const createDB = async () => {
    // Try connecting to 'postgres' db first with the system username
    const user = process.env.USER || 'harshalbaviskar';
    console.log(`Attempting to connect as user: ${user}`);

    const client = new Client({
        connectionString: `postgresql://${user}:Welcome@123@localhost:5432/postgres`,
    });

    try {
        await client.connect();

        // Check if database exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'driving_school'");
        if (res.rowCount === 0) {
            await client.query('CREATE DATABASE driving_school');
            console.log('Database driving_school created successfully.');
        } else {
            console.log('Database driving_school already exists.');
        }
        await client.end();
    } catch (err) {
        console.error('Failed to connect to postgres db, trying template1...');
        // Fallback: try connecting to template1
        const client2 = new Client({
            connectionString: `postgresql://${user}:Welcome@123@localhost:5432/template1`,
        });
        try {
            await client2.connect();
            const res = await client2.query("SELECT 1 FROM pg_database WHERE datname = 'driving_school'");
            if (res.rowCount === 0) {
                await client2.query('CREATE DATABASE driving_school');
                console.log('Database driving_school created successfully.');
            } else {
                console.log('Database driving_school already exists.');
            }
            await client2.end();
        } catch (err2) {
            console.error('Error creating database:', err2);
        }
    }
};

createDB();
