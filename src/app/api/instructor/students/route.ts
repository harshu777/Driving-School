import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query = `
            SELECT id, name, email, status, created_at
            FROM users
            WHERE role = 'student'
        `;

        const values: any[] = [];

        // If status is provided and not 'all', filter by it. Default to 'approved' if not 'all'.
        if (status !== 'all') {
            query += ` AND status = $1`;
            values.push(status || 'approved');
        }

        query += ` ORDER BY created_at DESC`; // Order by newest first generally better for management

        const result = await client.query(query, values);

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
