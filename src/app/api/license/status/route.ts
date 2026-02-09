import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: Check Status
export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT * FROM license_applications WHERE student_id = $1',
            [userId]
        );
        return NextResponse.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error fetching license status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
