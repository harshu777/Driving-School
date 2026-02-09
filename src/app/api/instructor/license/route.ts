import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: Fetch all license applications for instructor's students
export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        // Get applications from students who have booked with this instructor
        const result = await client.query(
            `SELECT DISTINCT 
                la.*,
                u.name as student_name,
                u.email as student_email
             FROM license_applications la
             JOIN users u ON la.student_id = u.id
             JOIN bookings b ON b.student_id = u.id
             JOIN slots s ON b.slot_id = s.id
             WHERE s.instructor_id = $1
             ORDER BY la.created_at DESC`,
            [userId]
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
