import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({
      status: 'error',
      message: 'SMTP_USER or SMTP_PASS not set in environment variables',
      SMTP_USER_exists: !!smtpUser,
      SMTP_PASS_exists: !!smtpPass,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Verify the connection
    await transporter.verify();

    // Send a test email
    await transporter.sendMail({
      from: `"Jordanian Canadian Society" <${smtpUser}>`,
      to: smtpUser, // send to ourselves
      subject: 'Test Email — It Works!',
      html: '<h1>Email is working!</h1><p>Your Jordanian Canadian Society website can now send confirmation emails.</p>',
    });

    return NextResponse.json({
      status: 'success',
      message: `Test email sent successfully to ${smtpUser}`,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({
      status: 'error',
      message: errMsg,
      stack: errStack,
      SMTP_USER: smtpUser,
      SMTP_PASS_length: smtpPass.length,
    });
  }
}
