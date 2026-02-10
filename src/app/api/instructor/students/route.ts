import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        // Fetch all approved students in the system
        const result = await client.query(`
            SELECT id, name, email
            FROM users
            WHERE role = 'student' AND status = 'approved'
            ORDER BY name ASC
        `);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
