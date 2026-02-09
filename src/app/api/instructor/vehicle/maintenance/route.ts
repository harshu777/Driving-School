import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { vehicle_id, date, service_type, cost, description, garage_name } = body;

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
                `INSERT INTO maintenance_logs (vehicle_id, date, service_type, cost, description, garage_name)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [vehicle_id, date, service_type, cost, description, garage_name]
            );

            // If it's a routine service, update the vehicle's last service date
            // Simple heuristic or could be explicit field
            if (service_type.toLowerCase().includes('service')) {
                await client.query(
                    'UPDATE vehicles SET last_service_date = $1 WHERE id = $2',
                    [date, vehicle_id]
                );
            }

            return NextResponse.json(result.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error logging maintenance:', error);
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
            'SELECT * FROM maintenance_logs WHERE vehicle_id = $1 ORDER BY date DESC LIMIT 50',
            [vehicleId]
        );
        return NextResponse.json(result.rows);
    } finally {
        client.release();
    }
}
