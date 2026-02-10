import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        // Count completed slots
        const result = await client.query(`
      SELECT COUNT(*) as count
      FROM slots
      WHERE instructor_id = $1 AND status = 'completed'
    `, [userId]);

        // Count total approved students in the system
        const studentsResult = await client.query(`
            SELECT COUNT(*) as count
            FROM users
            WHERE role = 'student' AND status = 'approved'
        `);

        // Count upcoming lessons (future slots with at least one booking)
        const upcomingResult = await client.query(`
            SELECT COUNT(*) as count
            FROM slots
            WHERE instructor_id = $1 
            AND start_time > NOW()
            AND booked_count > 0
        `, [userId]);

        const completedLessons = parseInt(result.rows[0].count);
        const totalStudents = parseInt(studentsResult.rows[0].count);
        const upcomingLessons = parseInt(upcomingResult.rows[0].count);

        return NextResponse.json({
            completedLessons,
            totalStudents,
            upcomingLessons
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
