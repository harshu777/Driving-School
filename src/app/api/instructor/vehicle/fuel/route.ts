import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { vehicle_id, date, liters, cost_per_liter, total_cost, odometer_reading } = body;

        const client = await pool.connect();
        try {
            // Verify vehicle belongs to user
            const vehicleCheck = await client.query(
                'SELECT id FROM vehicles WHERE id = $1 AND instructor_id = $2',
                [vehicle_id, userId]
            );

            if (vehicleCheck.rows.length === 0) {
                return NextResponse.json({ error: 'Vehicle not found or unauthorized' }, { status: 404 });
            }

            const result = await client.query(
                `INSERT INTO fuel_logs (vehicle_id, date, liters, cost_per_liter, total_cost, odometer_reading)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [vehicle_id, date, liters, cost_per_liter, total_cost, odometer_reading]
            );

            return NextResponse.json(result.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error logging fuel:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');

    if (!vehicleId) return NextResponse.json([], { status: 400 });

    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM fuel_logs WHERE vehicle_id = $1 ORDER BY date DESC LIMIT 50',
            [vehicleId]
        );
        return NextResponse.json(result.rows);
    } finally {
        client.release();
    }
}
