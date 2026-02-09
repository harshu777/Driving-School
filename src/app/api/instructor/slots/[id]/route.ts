import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    try {
        const { status } = await request.json();

        const client = await pool.connect();
        try {
            // Verify adding instructor owns the slot
            const check = await client.query('SELECT * FROM slots WHERE id = $1 AND instructor_id = $2', [id, userId]);
            if (check.rows.length === 0) {
                return NextResponse.json({ error: 'Slot not found or unauthorized' }, { status: 404 });
            }

            const result = await client.query(`
        UPDATE slots
        SET status = $1
        WHERE id = $2
        RETURNING *
      `, [status, id]);

            return NextResponse.json(result.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error updating slot:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const client = await pool.connect();
    try {
        // Verify instructor owns the slot
        const check = await client.query('SELECT * FROM slots WHERE id = $1 AND instructor_id = $2', [id, userId]);
        if (check.rows.length === 0) {
            return NextResponse.json({ error: 'Slot not found or unauthorized' }, { status: 404 });
        }

        await client.query('DELETE FROM slots WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting slot:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}
