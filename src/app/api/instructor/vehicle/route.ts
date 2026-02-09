import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        // 1. Get Vehicle Details
        const vehicleRes = await client.query(
            'SELECT * FROM vehicles WHERE instructor_id = $1',
            [userId]
        );

        if (vehicleRes.rows.length === 0) {
            return NextResponse.json(null);
        }

        const vehicle = vehicleRes.rows[0];

        // 2. Get Fuel Stats
        const fuelRes = await client.query(
            'SELECT COALESCE(SUM(total_cost), 0) as total_fuel_cost, COALESCE(SUM(liters), 0) as total_liters FROM fuel_logs WHERE vehicle_id = $1',
            [vehicle.id]
        );

        // 3. Get Maintenance Stats
        const maintRes = await client.query(
            'SELECT COALESCE(SUM(cost), 0) as total_maintenance_cost FROM maintenance_logs WHERE vehicle_id = $1',
            [vehicle.id]
        );

        return NextResponse.json({
            ...vehicle,
            stats: {
                total_fuel_cost: parseFloat(fuelRes.rows[0].total_fuel_cost),
                total_liters: parseFloat(fuelRes.rows[0].total_liters),
                total_maintenance_cost: parseFloat(maintRes.rows[0].total_maintenance_cost)
            }
        });
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        let { make, model, year, plate_number, image_url, last_service_date, next_service_due_date, insurance_expiry_date, road_tax_expiry_date } = body;

        // Sanitize
        year = parseInt(year);
        if (!last_service_date) last_service_date = null;
        if (!next_service_due_date) next_service_due_date = null;
        if (!insurance_expiry_date) insurance_expiry_date = null;
        if (!road_tax_expiry_date) road_tax_expiry_date = null;

        const client = await pool.connect();
        try {
            // Check if vehicle exists
            const checkRes = await client.query(
                'SELECT id FROM vehicles WHERE instructor_id = $1',
                [userId]
            );

            if (checkRes.rows.length > 0) {
                // Update
                const updateRes = await client.query(
                    `UPDATE vehicles 
                     SET make = $1, model = $2, year = $3, plate_number = $4, image_url = $5, 
                         last_service_date = $6, next_service_due_date = $7, insurance_expiry_date = $8, road_tax_expiry_date = $9
                     WHERE instructor_id = $10
                     RETURNING *`,
                    [make, model, year, plate_number, image_url, last_service_date, next_service_due_date, insurance_expiry_date, road_tax_expiry_date, userId]
                );
                return NextResponse.json(updateRes.rows[0]);
            } else {
                // Insert
                const insertRes = await client.query(
                    `INSERT INTO vehicles (instructor_id, make, model, year, plate_number, image_url, last_service_date, next_service_due_date, insurance_expiry_date, road_tax_expiry_date)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                     RETURNING *`,
                    [userId, make, model, year, plate_number, image_url, last_service_date, next_service_due_date, insurance_expiry_date, road_tax_expiry_date]
                );
                return NextResponse.json(insertRes.rows[0]);
            }
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error saving vehicle:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
