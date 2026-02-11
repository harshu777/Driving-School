
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, message } = await req.json();

        // specific validation could go here
        if (!firstName || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = process.env.EMAIL_USER;
        // Remove any spaces from the App Password which users often copy-paste
        const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

        console.log(`[Contact API] Sending email from: ${user}`);
        console.log(`[Contact API] Password length (after trim): ${pass?.length}`);

        if (!user || !pass) {
            console.error('Missing email credentials in .env');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass,
            },
            tls: {
                rejectUnauthorized: false // Helps with some local dev environments
            }
        });

        const mailOptions = {
            from: `"${firstName} ${lastName}" <${user}>`, // Display name helps identify the sender
            to: 'hbaviskar1106@gmail.com', // Send to the owner
            replyTo: email, // Reply to the person who filled the form
            subject: `New Contact Form Message from ${firstName} ${lastName}`,
            text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        
        Message:
        ${message}
      `,
            html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #orange;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
