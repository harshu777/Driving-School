import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const result = await client.query(`
      SELECT 
        s.*, 
        COALESCE(
          json_agg(
            json_build_object(
                'id', u.id, 
                'name', u.name,
                'booking_id', b.id,
                'km_driven', b.km_driven,
                'grade', b.grade,
                'notes', b.instructor_notes,
                'status', b.status
            )
          ) FILTER (WHERE u.id IS NOT NULL), 
          '[]'
        ) as students
      FROM slots s
      LEFT JOIN bookings b ON s.id = b.slot_id
      LEFT JOIN users u ON b.student_id = u.id
      WHERE s.instructor_id = $1
      GROUP BY s.id
      ORDER BY s.start_time ASC
    `, [userId]);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching slots:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { startTimes } = await request.json(); // Expecting an array now

        // Backward compatibility or single slot handling if needed, but we'll focus on array
        const slotsToCreate = Array.isArray(startTimes) ? startTimes : [startTimes].filter(Boolean);

        if (slotsToCreate.length === 0) {
            return NextResponse.json({ error: 'Start times are required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const createdSlots = [];

            for (const time of slotsToCreate) {
                // Check if slot already exists
                const existing = await client.query(
                    'SELECT 1 FROM slots WHERE instructor_id = $1 AND start_time = $2',
                    [userId, time]
                );

                if (existing.rows.length === 0) {
                    const result = await client.query(`
                        INSERT INTO slots (instructor_id, start_time, status)
                        VALUES ($1, $2, 'available')
                        RETURNING *
                    `, [userId, time]);
                    createdSlots.push(result.rows[0]);
                }
            }

            await client.query('COMMIT');
            return NextResponse.json(createdSlots);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating slots:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
