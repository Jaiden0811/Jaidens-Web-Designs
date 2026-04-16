// Email utilities
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orderData.email,
      subject: 'Your Jaiden Web Designs Order - Confirmation',
      html: `
        <h2>Thank You for Your Order!</h2>
        <p>Hi ${orderData.name},</p>
        <p>We've received your order and will be in touch shortly to discuss your project details.</p>
        <h3>Order Summary:</h3>
        <ul>
          <li><strong>Project Description:</strong> ${orderData.description}</li>
          <li><strong>Payment Method:</strong> ${orderData.paymentMethod}</li>
          <li><strong>Expected Timeline:</strong> 2 weeks</li>
        </ul>
        <p>We will contact you at <strong>${orderData.phone}</strong> to get started!</p>
        <p>Best regards,<br>Jaiden Web Designs Team</p>
        <hr>
        <p style="color: #888; font-size: 12px;">
          For inquiries, reach out to jaidentinning1@outlook.com
        </p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

export const sendOrderStatusUpdateEmail = async (email, name, status, timeline) => {
  try {
    const timelineHtml = Object.entries(timeline)
      .map(([stage, info]) => `
        <li>${stage}: <span style="color: ${info.status === 'completed' ? 'green' : 'orange'}">${info.status}</span></li>
      `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Project Status Update - Jaiden Web Designs',
      html: `
        <h2>Project Status Update</h2>
        <p>Hi ${name},</p>
        <p>Your project is progressing nicely! Here's the current status:</p>
        <h3>Timeline:</h3>
        <ul>
          ${timelineHtml}
        </ul>
        <p>Overall Status: <strong>${status}</strong></p>
        <p>Questions? Feel free to reach out to us anytime!</p>
        <p>Best regards,<br>Jaiden Web Designs Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
};

export const sendAdminNotificationEmail = async (orderData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jaidentinning1@outlook.com',
      subject: `NEW ORDER: ${orderData.name}`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Client Name:</strong> ${orderData.name}</p>
        <p><strong>Email:</strong> ${orderData.email}</p>
        <p><strong>Phone:</strong> ${orderData.phone}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        <h3>Project Description:</h3>
        <p>${orderData.description.replace(/\n/g, '<br>')}</p>
        <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
};
