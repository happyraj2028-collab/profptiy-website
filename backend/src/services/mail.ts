import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '2525');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@profptiy-luxury.com';
const EMAIL_TO = process.env.EMAIL_TO || 'owner@profptiy-luxury.com';

const createTransporter = () => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠️ SMTP mail credentials are not configured. Emails will be logged to console.');
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendInquiryNotification = async (inquiry: any, property: any) => {
  const transporter = createTransporter();

  const propertyDetailsHTML = property
    ? `
      <div style="background-color: #f7f5f0; padding: 15px; border-left: 4px solid #c5a880; margin: 15px 0;">
        <h3 style="color: #1a1a1a; margin-top: 0;">Property Details</h3>
        <p><strong>Title:</strong> ${property.title}</p>
        <p><strong>Location:</strong> ${property.area}, ${property.city}</p>
        <p><strong>Price:</strong> ₹${property.price.toLocaleString('en-IN')}</p>
        <p><strong>ID:</strong> ${property.id}</p>
      </div>
    `
    : '<p><em>General Website Inquiry (No specific property)</em></p>';

  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 30px; border-radius: 8px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">New Luxury Lead Acquired!</h2>
      
      <p style="font-size: 16px; color: #4b5563;">You have received a new inquiry from the luxury portal. Here are the client's details:</p>
      
      <div style="margin: 20px 0;">
        <p><strong>Client Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>
        <p><strong>Message:</strong></p>
        <blockquote style="background-color: #f9fafb; padding: 12px; border-left: 4px solid #9ca3af; margin: 10px 0; font-style: italic;">
          ${inquiry.message}
        </blockquote>
      </div>

      ${propertyDetailsHTML}

      <div style="margin-top: 30px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center;">
        <p>Profptiy Luxury Real Estate System • Automated Notification</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log('\n✉️ --- MOCK EMAIL SENT ---');
    console.log(`From: ${EMAIL_FROM}`);
    console.log(`To: ${EMAIL_TO}`);
    console.log(`Subject: New Inquiry from ${inquiry.name}`);
    console.log(`Content:\n`, htmlContent);
    console.log('✉️ -----------------------\n');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Profptiy Luxury Real Estate" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: `Luxury Lead: ${inquiry.name} interested in ${property ? property.title : 'General Inquiry'}`,
      html: htmlContent,
    });
    console.log(`✅ Notification email sent successfully. ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send notification email:', error);
  }
};
