const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not defined');
    console.log('Please set DATABASE_URL environment variable or create .env.local file');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

async function runMigrations() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting comprehensive database migrations...\n');
        await client.query('BEGIN');

        // ========================================
        // 1. CREATE USERS TABLE
        // ========================================
        console.log('📝 Creating users table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('instructor', 'student')),
                status VARCHAR(20) DEFAULT 'approved' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Users table created\n');

        // ========================================
        // 2. CREATE SLOTS TABLE
        // ========================================
        console.log('📝 Creating slots table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS slots (
                id SERIAL PRIMARY KEY,
                instructor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                status VARCHAR(50) NOT NULL CHECK (status IN ('available', 'booked', 'completed')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                max_students INTEGER DEFAULT 4,
                booked_count INTEGER DEFAULT 0
            );
        `);
        console.log('✅ Slots table created\n');

        // ========================================
        // 3. CREATE BOOKINGS TABLE
        // ========================================
        console.log('📝 Creating bookings table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                slot_id INTEGER REFERENCES slots(id) ON DELETE CASCADE,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                km_driven NUMERIC DEFAULT 0,
                grade VARCHAR(50),
                instructor_notes TEXT,
                status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed')),
                UNIQUE(slot_id, student_id)
            );
        `);
        console.log('✅ Bookings table created\n');

        // ========================================
        // 4. CREATE LICENSE APPLICATIONS TABLE
        // ========================================
        console.log('📝 Creating license_applications table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS license_applications (
                id SERIAL PRIMARY KEY,
                student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                status VARCHAR(50) NOT NULL DEFAULT 'applied',
                student_details JSONB DEFAULT '{}',
                license_number VARCHAR(50),
                certificate_issued_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS idx_license_student 
            ON license_applications(student_id);
        `);
        console.log('✅ License applications table created\n');

        // ========================================
        // 5. CREATE VEHICLES TABLE
        // ========================================
        console.log('📝 Creating vehicles table...');
        await client.query(`
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
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Vehicles table created\n');

        // ========================================
        // 6. CREATE FUEL LOGS TABLE
        // ========================================
        console.log('📝 Creating fuel_logs table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS fuel_logs (
                id SERIAL PRIMARY KEY,
                vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                liters DECIMAL(5, 2) NOT NULL,
                cost_per_liter DECIMAL(5, 2) NOT NULL,
                total_cost DECIMAL(7, 2) NOT NULL,
                odometer_reading INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Fuel logs table created\n');

        // ========================================
        // 7. CREATE MAINTENANCE LOGS TABLE
        // ========================================
        console.log('📝 Creating maintenance_logs table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS maintenance_logs (
                id SERIAL PRIMARY KEY,
                vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                service_type VARCHAR(100) NOT NULL,
                cost DECIMAL(7, 2) NOT NULL,
                description TEXT,
                garage_name VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Maintenance logs table created\n');

        // ========================================
        // 8. ADD PERFORMANCE INDEXES
        // ========================================
        console.log('📊 Adding performance indexes...');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
        `);
        console.log('  ✅ Created index: idx_bookings_student_id');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_slots_instructor_id ON slots(instructor_id);
        `);
        console.log('  ✅ Created index: idx_slots_instructor_id');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_slots_start_time ON slots(start_time);
        `);
        console.log('  ✅ Created index: idx_slots_start_time');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_slots_status ON slots(status);
        `);
        console.log('  ✅ Created index: idx_slots_status');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_vehicles_instructor_id ON vehicles(instructor_id);
        `);
        console.log('  ✅ Created index: idx_vehicles_instructor_id');

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_license_applications_status ON license_applications(status);
        `);
        console.log('  ✅ Created index: idx_license_applications_status\n');

        await client.query('COMMIT');

        console.log('═══════════════════════════════════════');
        console.log('🎉 All migrations completed successfully!');
        console.log('═══════════════════════════════════════\n');

        // Display summary
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log('📊 Database tables:');
        tables.rows.forEach(row => {
            console.log(`   ✓ ${row.table_name}`);
        });
        console.log('');

        // Verify timestamp columns
        const timestampCheck = await client.query(`
            SELECT 
                table_name, 
                column_name, 
                data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
                AND (column_name LIKE '%_at' OR column_name LIKE '%_time')
            ORDER BY table_name, column_name;
        `);

        console.log('📅 Timestamp columns (all should be "timestamp with time zone"):');
        let allCorrect = true;
        timestampCheck.rows.forEach(row => {
            const isCorrect = row.data_type === 'timestamp with time zone';
            const icon = isCorrect ? '✅' : '⚠️';
            console.log(`   ${icon} ${row.table_name}.${row.column_name}: ${row.data_type}`);
            if (!isCorrect) allCorrect = false;
        });

        if (!allCorrect) {
            console.log('\n⚠️  Some timestamp columns need timezone conversion. Run timezone fix migration.');
        }
        console.log('');

        // Verify indexes
        const indexCheck = await client.query(`
            SELECT 
                tablename, 
                indexname 
            FROM pg_indexes 
            WHERE schemaname = 'public' 
                AND indexname LIKE 'idx_%'
            ORDER BY tablename, indexname;
        `);

        console.log('🔍 Performance indexes:');
        indexCheck.rows.forEach(row => {
            console.log(`   ✅ ${row.tablename}: ${row.indexname}`);
        });
        console.log('');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', err.message);
        console.error('Stack trace:', err.stack);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run migrations
runMigrations().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
