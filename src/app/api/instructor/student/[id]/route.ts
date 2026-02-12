import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: studentId } = await params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Delete the student. 
        // Database schema has ON DELETE CASCADE for most relations (bookings, licenses).
        // Slots has ON DELETE SET NULL for student_id.
        const result = await client.query(
            `DELETE FROM users WHERE id = $1 AND role = 'student' RETURNING id`,
            [studentId]
        );

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'Student not found or not a student' }, { status: 404 });
        }

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Student deleted successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting student:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
