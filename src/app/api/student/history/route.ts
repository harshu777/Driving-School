import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                b.id as booking_id,
                s.start_time,
                b.km_driven,
                b.grade,
                b.instructor_notes,
                b.status,
                u.name as instructor_name
            FROM bookings b
            JOIN slots s ON b.slot_id = s.id
            JOIN users u ON s.instructor_id = u.id
            WHERE b.student_id = $1
            ORDER BY s.start_time ASC
        `, [userId]);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching student history:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
