import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (!['instructor', 'student'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // Check if user already exists
            const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            if (checkUser.rows.length > 0) {
                return NextResponse.json({ error: 'User already exists' }, { status: 409 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Set status based on role: students need approval, instructors are auto-approved
            const status = role === 'student' ? 'pending' : 'approved';

            const result = await client.query(`
        INSERT INTO users (name, email, password, role, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, role, status
      `, [name, email, hashedPassword, role, status]);

            return NextResponse.json({ user: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
