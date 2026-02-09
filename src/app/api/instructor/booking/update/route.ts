import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request) {
    const userId = request.headers.get('x-user-id');
    // In a real app, verify userId is an instructor
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { bookingId, kmDriven, grade, notes, status } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            const result = await client.query(`
                UPDATE bookings
                SET km_driven = $1, grade = $2, instructor_notes = $3, status = $4
                WHERE id = $5
                RETURNING *
            `, [kmDriven || 0, grade, notes, status || 'completed', bookingId]);

            // Also mark the slot as completed
            if (result.rows.length > 0) {
                await client.query(`
                    UPDATE slots 
                    SET status = 'completed' 
                    WHERE id = (SELECT slot_id FROM bookings WHERE id = $1)
                `, [bookingId]);
            }

            if (result.rowCount === 0) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
            }

            return NextResponse.json(result.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
