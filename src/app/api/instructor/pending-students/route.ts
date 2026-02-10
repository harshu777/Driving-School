import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

            // Get all pending students
            const result = await client.query(`
                SELECT id, name, email, created_at
                FROM users
                WHERE role = 'student' AND status = 'pending'
                ORDER BY created_at DESC
            `);

            return NextResponse.json(result.rows);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching pending students:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
