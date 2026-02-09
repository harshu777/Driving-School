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
        console.log('Starting migration for Vehicle Management...');

        // 1. Create Vehicles Table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        instructor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        plate_number VARCHAR(20) NOT NULL,
        image_url TEXT,
        last_service_date DATE,
        next_service_due_date DATE,
        insurance_expiry_date DATE,
        road_tax_expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Created table: vehicles');

        // 2. Create Fuel Logs Table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS fuel_logs (
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        liters DECIMAL(5, 2) NOT NULL,
        cost_per_liter DECIMAL(5, 2) NOT NULL,
        total_cost DECIMAL(7, 2) NOT NULL,
        odometer_reading INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Created table: fuel_logs');

        // 3. Create Maintenance Logs Table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS maintenance_logs (
        id SERIAL PRIMARY KEY,
        vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        service_type VARCHAR(100) NOT NULL, -- e.g., 'Routine Service', 'Tyre Change', 'Repair'
        cost DECIMAL(7, 2) NOT NULL,
        description TEXT,
        garage_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Created table: maintenance_logs');

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await pool.end();
    }
};

migrate();
