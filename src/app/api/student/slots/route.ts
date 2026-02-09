import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    // Authentication check
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(`
      SELECT s.*, u.name as instructor_name, s.booked_count, s.max_students
      FROM slots s
      JOIN users u ON s.instructor_id = u.id
      WHERE s.status = 'available' AND s.booked_count < s.max_students
      ORDER BY s.start_time ASC
    `);
        // We might want to add a flag 'is_booked_by_me' later, but for now simple list
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching available slots:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
