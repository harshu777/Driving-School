import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST: Apply for License
export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        // Check if already applied
        const check = await client.query(
            'SELECT id FROM license_applications WHERE student_id = $1',
            [userId]
        );

        if (check.rows.length > 0) {
            return NextResponse.json({ error: 'Application already exists' }, { status: 400 });
        }

        const result = await client.query(
            `INSERT INTO license_applications (student_id, status)
             VALUES ($1, 'applied')
             RETURNING *`,
            [userId]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error applying for license:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
