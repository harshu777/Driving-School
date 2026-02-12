
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, phoneNumber, location, message } = await req.json();

        // specific validation could go here
        if (!firstName || !lastName || !email || !phoneNumber || !location) {
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
            from: `"Driving School" <${user}>`, // Sender name is now static "Driving School"
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
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phoneNumber}</p>
        <p><strong>Location:</strong> ${location || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #orange;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
      `,
        };

        await transporter.sendMail(mailOptions);

        // Auto-reply to the visitor
        const autoReplyOptions = {
            from: `"Driving School" <${user}>`,
            to: email,
            subject: 'We received your message - Driving School',
            text: `Hi ${firstName},\n\nThank you for contacting us. We have received your message and will get back to you shortly.\n\nBest regards,\nDriving School Team`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #ea580c;">Thank you for contacting us!</h2>
                    <p>Hi ${firstName},</p>
                    <p>We have received your message and our team will get back to you shortly.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 0.9em; color: #666;"><strong>Your Details:</strong></p>
                    <p style="font-size: 0.9em; color: #666; margin: 5px 0;">Phone: ${phoneNumber} | Location: ${location || 'Not provided'}</p>
                    <p style="font-size: 0.9em; color: #666; margin-top: 15px;"><strong>Your Message:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ea580c; margin: 0;">
                        ${message.replace(/\n/g, '<br>')}
                    </blockquote>
                    <p style="margin-top: 30px;">Best regards,<br><strong>Driving School Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(autoReplyOptions);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send message' },
            { status: 500 }
        );
    }
}
