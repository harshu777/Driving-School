import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');
        const { studentId, action } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!studentId || !action) {
            return NextResponse.json({ error: 'Missing studentId or action' }, { status: 400 });
        }

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // Verify requester is an instructor
            const userCheck = await client.query(
                'SELECT role FROM users WHERE id = $1',
                [userId]
            );

            if (userCheck.rows.length === 0 || userCheck.rows[0].role !== 'instructor') {
                return NextResponse.json({ error: 'Forbidden - Instructor access only' }, { status: 403 });
            }

            // Verify the student exists and is pending
            const studentCheck = await client.query(
                'SELECT id, name, status FROM users WHERE id = $1 AND role = $2',
                [studentId, 'student']
            );

            if (studentCheck.rows.length === 0) {
                return NextResponse.json({ error: 'Student not found' }, { status: 404 });
            }

            const newStatus = action === 'approve' ? 'approved' : 'rejected';

            // Update student status
            const result = await client.query(
                'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, email, status',
                [newStatus, studentId]
            );

            return NextResponse.json({
                success: true,
                student: result.rows[0],
                message: `Student ${action === 'approve' ? 'approved' : 'rejected'} successfully`
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error updating student status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
