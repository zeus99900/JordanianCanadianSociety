import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import type { Registration, Event } from './types';

// Configure the SMTP transport
// Using Gmail settings (much more reliable than Hotmail for app passwords)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // This must be a Gmail App Password
  },
});

export async function sendTicketEmail(registration: Registration, event: Event) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email credentials not configured. Skipping email.');
    return;
  }

  try {
    // Generate QR code as a buffer
    const qrBuffer = await QRCode.toBuffer(registration.id, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });

    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString('en-CA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = eventDate.toLocaleTimeString('en-CA', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const totalGuests = (registration.count_men || 0) + (registration.count_women || 0) + (registration.count_kids || 0);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #B22234; padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Jordanian Canadian Society</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 16px;">Ticket Confirmation</p>
        </div>
        
        <div style="padding: 30px 20px; background-color: #ffffff;">
          <h2 style="margin-top: 0; color: #1a1a1a; font-size: 20px;">${event.title}</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;">Name</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; font-weight: bold; text-align: right;">${registration.lead_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;">Total Guests</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; font-weight: bold; text-align: right;">${totalGuests}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;">Date</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; font-weight: bold; text-align: right;">${formattedDate} at ${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;">Location</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; font-weight: bold; text-align: right;">${event.location || 'See website for details'}</td>
            </tr>
          </table>
          
          <div style="text-align: center; margin: 40px 0;">
            <p style="font-weight: bold; margin-bottom: 15px; font-size: 18px;">Please present this QR code at the door</p>
            <img src="cid:ticket-qrcode" alt="Ticket QR Code" style="border: 1px solid #ccc; border-radius: 12px; padding: 15px; background: white; max-width: 250px; display: inline-block;" />
          </div>
          
          <p style="font-size: 11px; color: #999; text-align: center; margin-bottom: 0;">
            Ticket ID: ${registration.id}
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Jordanian Canadian Society" <${process.env.SMTP_USER}>`,
      to: registration.email,
      subject: `Your Tickets: ${event.title}`,
      html: htmlContent,
      attachments: [
        {
          filename: 'ticket-qr.png',
          content: qrBuffer,
          cid: 'ticket-qrcode' // Same cid value as in the html img src
        }
      ]
    });
    
    console.log(`✅ Ticket email sent successfully to ${registration.email}`);
  } catch (error) {
    console.error('❌ Failed to send ticket email:', error);
    // We don't throw here so that the registration itself still succeeds even if email fails
  }
}
