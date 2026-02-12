const nodemailer = require('nodemailer');

// 1. Replace these with your ACTUAL credentials
const user = 'hbaviskar1106@gmail.com';
const pass = 'jgfb szew lman ggif'; // Keep spaces if that's how you have it

async function main() {
    console.log('--- Starting Email Test ---');
    console.log(`User: ${user}`);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
            // debug: true, // Uncomment to see deep SMTP logs
            // logger: true // Uncomment to see deep SMTP logs
        });

        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection successful!');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Test Script" <${user}>`,
            to: user, // Send to yourself
            subject: "Test Email from Server",
            text: "If you see this, the server can send emails!",
        });

        console.log('✅ Email sent: %s', info.messageId);
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error(error);
    }
}

main();
