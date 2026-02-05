import nodemailer from 'nodemailer';

// Check if SMTP is configured
const isSMTPConfigured = !!(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD
);

// Create transporter with connection pool and timeout settings
const transporter = isSMTPConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Connection pool settings
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      // Timeout settings (in milliseconds)
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
      // Retry settings
      tls: {
        rejectUnauthorized: false, // For self-signed certificates
      },
    })
  : null;

interface PdfDownloadEmailParams {
  to: string;
  downloadUrl: string;
  calculationId: string;
  expiresIn?: string;
}

/**
 * Send PDF download link email
 */
export async function sendPdfDownloadEmail({
  to,
  downloadUrl,
  calculationId,
  expiresIn = '24 hours',
}: PdfDownloadEmailParams): Promise<void> {
  if (!transporter) {
    console.warn('[Email] SMTP not configured, skipping email send');
    return;
  }

  try {
    // Verify connection before sending
    console.log('[Email] Verifying SMTP connection...');
    await transporter.verify();
    console.log('[Email] SMTP connection verified');

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'HELOC Calculator <noreply@heloccalculator.pro>',
      to,
      subject: 'Your HELOC Financial Report is Ready',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0B3B24 0%, #16A34A 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #16A34A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 Your HELOC Report is Ready!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for using our HELOC Calculator. Your personalized financial report has been generated and is ready for download.</p>
              <p style="text-align: center;">
                <a href="${downloadUrl}" class="button">Download Your Report</a>
              </p>
              <p><strong>Important:</strong></p>
              <ul>
                <li>This download link will expire in ${expiresIn}</li>
                <li>Report ID: <code>${calculationId}</code></li>
                <li>If you need to download again, visit our <a href="${process.env.APP_DOMAIN}/en/heloc/retrieve">Retrieve Report</a> page</li>
              </ul>
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} HELOC Calculator. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`[Email] PDF download email sent to: ${to}`);
  } catch (error) {
    console.error('[Email] Failed to send PDF download email:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

interface RetrieveReportsEmailParams {
  to: string;
  reports: Array<{
    calculationId: string;
    downloadUrl: string;
    createdAt: Date;
  }>;
}

/**
 * Send retrieve reports email with multiple download links
 */
export async function sendRetrieveReportsEmail({
  to,
  reports,
}: RetrieveReportsEmailParams): Promise<void> {
  if (!transporter) {
    console.warn('[Email] SMTP not configured, skipping email send');
    return;
  }

  const reportsList = reports
    .map(
      (report, index) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${index + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${report.createdAt.toLocaleDateString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <a href="${report.downloadUrl}" style="color: #16A34A; text-decoration: none; font-weight: bold;">Download</a>
        </td>
      </tr>
    `
    )
    .join('');

  try {
    // Verify connection before sending
    console.log('[Email] Verifying SMTP connection...');
    await transporter.verify();
    console.log('[Email] SMTP connection verified');

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'HELOC Calculator <noreply@heloccalculator.pro>',
      to,
      subject: `Your HELOC Reports (${reports.length} found)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0B3B24 0%, #16A34A 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
            th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Your HELOC Reports</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We found <strong>${reports.length}</strong> report(s) associated with your email address.</p>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${reportsList}
                </tbody>
              </table>
              <p><strong>Note:</strong> Download links will expire in 24 hours. You can request new links anytime from our <a href="${process.env.APP_DOMAIN}/en/heloc/retrieve">Retrieve Report</a> page.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} HELOC Calculator. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`[Email] Retrieve reports email sent to: ${to} (${reports.length} reports)`);
  } catch (error) {
    console.error('[Email] Failed to send retrieve reports email:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

/**
 * Check if email service is available
 */
export function isEmailAvailable(): boolean {
  return isSMTPConfigured;
}
