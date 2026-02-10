import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { slotId } = await request.json();
        if (!slotId) {
            return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // Begin transaction
            await client.query('BEGIN');

            // Check if student is approved
            const studentCheck = await client.query(
                'SELECT status FROM users WHERE id = $1 AND role = $2',
                [userId, 'student']
            );

            if (studentCheck.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Student not found' }, { status: 404 });
            }

            const studentStatus = studentCheck.rows[0].status;
            if (studentStatus === 'pending') {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Your account is pending approval. Please wait for instructor approval before booking lessons.' }, { status: 403 });
            }

            if (studentStatus === 'rejected') {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Your account has been rejected. Please contact an instructor.' }, { status: 403 });
            }

            // Check if slot is full AND lock it
            const checkRes = await client.query('SELECT booked_count, max_students FROM slots WHERE id = $1 FOR UPDATE', [slotId]);

            if (checkRes.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
            }

            const slot = checkRes.rows[0];
            if (slot.booked_count >= slot.max_students) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Slot is full' }, { status: 409 });
            }

            // Check if student already booked this slot
            const existingBooking = await client.query('SELECT 1 FROM bookings WHERE slot_id = $1 AND student_id = $2', [slotId, userId]);
            if (existingBooking.rows.length > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'You have already booked this slot' }, { status: 409 });
            }

            // Book the slot
            await client.query('INSERT INTO bookings (slot_id, student_id) VALUES ($1, $2)', [slotId, userId]);

            // Update booked count
            const result = await client.query(`
                UPDATE slots
                SET booked_count = booked_count + 1,
                    status = CASE WHEN booked_count + 1 >= max_students THEN 'booked' ELSE 'available' END
                WHERE id = $1
                RETURNING *
            `, [slotId]);

            await client.query('COMMIT');

            return NextResponse.json(result.rows[0]);
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error booking slot:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
