import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        // Fetch distinct students who have booked at least one slot with this instructor
        const result = await client.query(`
            SELECT DISTINCT u.id, u.name, u.email
            FROM users u
            JOIN bookings b ON u.id = b.student_id
            JOIN slots s ON b.slot_id = s.id
            WHERE s.instructor_id = $1
            ORDER BY u.name ASC
        `, [userId]);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
