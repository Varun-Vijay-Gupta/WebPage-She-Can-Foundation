const nodemailer = require("nodemailer");

function isEmailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatDateTime(date = new Date()) {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildContactEmailHtml({ name, email, message, submittedAt }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <div style="background: linear-gradient(135deg, #6b21a8, #db2777); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px;">New Contact Form Submission</h1>
        <p style="margin: 8px 0 0; color: #f3e8ff; font-size: 14px;">She Can Foundation Website</p>
      </div>
      <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; width: 120px; color: #6b7280;">Name</td>
            <td style="padding: 10px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Email</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #6b7280; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; white-space: pre-wrap;">${message}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #6b7280;">Submitted</td>
            <td style="padding: 10px 0;">${submittedAt}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          This email was sent automatically from the She Can Foundation contact form.
        </p>
      </div>
    </div>
  `;
}

async function sendContactNotification({ name, email, message }) {
  if (!isEmailConfigured()) {
    console.warn("[email] SMTP not configured. Skipping contact notification.");
    return { sent: false };
  }

  const submittedAt = formatDateTime();
  const notifyEmail = process.env.NOTIFY_EMAIL || "vg9584911@gmail.com";
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"She Can Foundation" <${process.env.SMTP_USER}>`,
    to: notifyEmail,
    replyTo: email,
    subject: `New Contact: ${name} - She Can Foundation`,
    text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nSubmitted: ${submittedAt}`,
    html: buildContactEmailHtml({ name, email, message, submittedAt }),
  });

  return { sent: true };
}

module.exports = { sendContactNotification, isEmailConfigured };
