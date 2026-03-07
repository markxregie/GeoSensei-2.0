const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  try {
    console.log(`[Email Debug] Preparing to send email to: ${email}`);
    console.log(`[Email Debug] Using SMTP User: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        // IMPORTANT: Remove spaces from the App Password if present
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '',
      },
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.error('[Email Debug] Transporter verification failed:', error);
          reject(error);
        } else {
          console.log("[Email Debug] SMTP Server is ready to take messages");
          resolve(success);
        }
      });
    });

    const mailOptions = {
      // Use the environment variable, or fallback to a constructed string if missing
      from: process.env.EMAIL_FROM || `"GeoSensei Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'GeoSensei - Verify your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #5D4A68; text-align: center;">Verify Your Email</h2>
          <p style="color: #333; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 16px;">Thank you for signing up for GeoSensei. Please use the following One-Time Password (OTP) to complete your verification:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
          </div>
          <p style="color: #555; font-size: 14px;">This code is valid for 10 minutes.</p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">If you did not request this email, please ignore it.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] OTP sent successfully to ${email}. MessageID: ${info.messageId}`);
  } catch (error) {
    console.error('[Email Service] Error sending email:', error);
    throw error;
  }
};

const sendResetEmail = async (email, resetLink) => {
  try {
    console.log(`[Email Debug] Preparing to send reset email to: ${email}`);
    console.log(`[Email Debug] Using SMTP User: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        // IMPORTANT: Remove spaces from the App Password if present
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '',
      },
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.error('[Email Debug] Transporter verification failed:', error);
          reject(error);
        } else {
          console.log("[Email Debug] SMTP Server is ready to take messages");
          resolve(success);
        }
      });
    });

    const mailOptions = {
      // Use the environment variable, or fallback to a constructed string if missing
      from: process.env.EMAIL_FROM || `"GeoSensei Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'GeoSensei - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #5D4A68; text-align: center;">Reset Your Password</h2>
          <p style="color: #333; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 16px;">You have requested to reset your password for GeoSensei. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #5D4A68; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #555; font-size: 14px;">This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">If the button doesn't work, copy and paste this link into your browser: ${resetLink}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Reset email sent successfully to ${email}. MessageID: ${info.messageId}`);
  } catch (error) {
    console.error('[Email Service] Error sending reset email:', error);
    throw error;
  }
};

module.exports = { sendOtpEmail, sendResetEmail };
