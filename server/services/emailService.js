const nodemailer = require("nodemailer");

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use App Password for Gmail
  }
});

// Email templates
const appointmentConfirmationTemplate = (appointment) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { color: #16a34a; font-size: 24px; font-weight: bold; margin-bottom: 16px; }
        .details { margin: 20px 0; }
        .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; min-width: 120px; }
        .detail-value { flex: 1; }
        .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        .success-badge { display: inline-block; background: #16a34a; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">✓ Appointment Confirmed</div>
          <p>Hi <strong>${appointment.patientName}</strong>,</p>
          <p>Your appointment has been successfully booked! Here are your appointment details:</p>
          
          <div class="details">
            <div class="detail-row">
              <div class="detail-label">Doctor:</div>
              <div class="detail-value">${appointment.doctorName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Date:</div>
              <div class="detail-value">${appointment.date}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Time:</div>
              <div class="detail-value">${appointment.time}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Status:</div>
              <div class="detail-value"><span class="success-badge">${appointment.status}</span></div>
            </div>
          </div>

          <p style="margin-top: 24px;">
            <strong>Important:</strong> Please arrive 10 minutes before your scheduled time. 
            If you need to reschedule, please visit your appointment dashboard.
          </p>

          <div class="footer">
            <p>This is an automated email from City Med Portal. Please do not reply to this email.</p>
            <p>&copy; 2026 City Med Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const appointmentStatusUpdateTemplate = (appointment, newStatus) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
        .details { margin: 20px 0; }
        .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; min-width: 120px; }
        .detail-value { flex: 1; }
        .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 4px; font-weight: bold; color: white; }
        .status-confirmed { background: #16a34a; }
        .status-cancelled { background: #ef4444; }
        .status-pending { background: #f59e0b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">Appointment Status Update</div>
          <p>Hi <strong>${appointment.patientName}</strong>,</p>
          <p>Your appointment status has been updated:</p>
          
          <div class="details">
            <div class="detail-row">
              <div class="detail-label">Doctor:</div>
              <div class="detail-value">${appointment.doctorName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Date:</div>
              <div class="detail-value">${appointment.date}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Time:</div>
              <div class="detail-value">${appointment.time}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">New Status:</div>
              <div class="detail-value">
                <span class="status-badge status-${newStatus.toLowerCase()}">${newStatus}</span>
              </div>
            </div>
          </div>

          ${newStatus === "Cancelled" 
            ? `<p style="margin-top: 24px; color: #ef4444;"><strong>Your appointment has been cancelled.</strong> If you would like to reschedule, please visit your appointment dashboard.</p>`
            : newStatus === "Confirmed"
            ? `<p style="margin-top: 24px; color: #16a34a;"><strong>Your appointment is confirmed.</strong> Please arrive 10 minutes before your scheduled time.</p>`
            : ""
          }

          <div class="footer">
            <p>This is an automated email from City Med Portal. Please do not reply to this email.</p>
            <p>&copy; 2026 City Med Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send confirmation email
async function sendConfirmationEmail(appointment) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: appointment.patientEmail,
      subject: `Appointment Confirmed - City Med Portal`,
      html: appointmentConfirmationTemplate(appointment)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${appointment.patientEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
}

// Send status update email
async function sendStatusUpdateEmail(appointment, newStatus) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: appointment.patientEmail,
      subject: `Appointment ${newStatus} - City Med Portal`,
      html: appointmentStatusUpdateTemplate(appointment, newStatus)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${appointment.patientEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending status update email:", error);
    return false;
  }
}

module.exports = {
  sendConfirmationEmail,
  sendStatusUpdateEmail
};
