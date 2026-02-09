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
                b.id, 
                s.start_time, 
                u.name as instructor_name,
                b.status
            FROM bookings b
            JOIN slots s ON b.slot_id = s.id
            JOIN users u ON s.instructor_id = u.id
            WHERE b.student_id = $1
            ORDER BY s.start_time ASC
        `, [userId]);

        const totalBookings = result.rows;

        // Filter in memory or could do in SQL. 
        // Upcoming: status is 'scheduled' (default) and time is in future
        const now = new Date();
        const upcoming = totalBookings.filter(b =>
            (b.status === 'scheduled') && new Date(b.start_time) > now
        );

        const completed = totalBookings.filter(b => b.status === 'completed');

        // Calculate progress (assuming 10 lessons is the goal for this demo)
        const goal = 10;
        const progressPercentage = Math.min((completed.length / goal) * 100, 100);

        return NextResponse.json({
            upcoming,
            completed,
            progressPercentage,
            totalLessons: completed.length
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
