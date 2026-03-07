const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const validator = require('validator');
const { sendOtpEmail, sendResetEmail } = require('../sendEmail');
const crypto = require('crypto');

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(`[Signup Attempt] Email: ${email}, Name: ${firstName} ${lastName}`);

    if (!firstName || !lastName || !email || !password) {
      console.warn(`[Signup Failed] Missing fields for email: ${email}`);
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate Names (No numbers or special chars, spaces allowed)
    if (!validator.isAlpha(firstName.replace(/\s/g, '')) || !validator.isAlpha(lastName.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'First and Last Name must contain only letters' });
    }
    // Validate Email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    // Validate Password Complexity
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 12-16 characters, with at least one uppercase, one digit, and one special character' });
    }
    // Validate Password Containment
    const lowerPass = password.toLowerCase();
    if (lowerPass.includes(firstName.toLowerCase()) || lowerPass.includes(lastName.toLowerCase()) || lowerPass.includes(email.split('@')[0].toLowerCase())) {
      return res.status(400).json({ message: 'Password cannot contain your name or email' });
    }

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    if (user && user.is_verified) {
      console.warn(`[Signup Failed] User already exists and verified: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user && !user.is_verified) {
      // Update existing unverified user
      console.log(`[Signup] Updating existing unverified user: ${email}`);
      user.first_name = firstName;
      user.last_name = lastName;
      user.password = hashedPassword;
      user.otp_code = otp;
      user.otp_expires_at = otpExpires;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        is_verified: false, // User is NOT verified yet
        otp_code: otp,
        otp_expires_at: otpExpires
      });
    }

    // Send OTP Email
    await sendOtpEmail(email, otp);

    console.log(`[Signup Success] User processed: ${email} (ID: ${user.id}). OTP sent.`);
    res.status(201).json({ message: 'Signup successful. Please verify your email.', email });
  } catch (error) {
    console.error("------------------------------------------------");
    console.error("[Signup Error] Details:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("------------------------------------------------");
    // Return the specific error message to the client for debugging
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`[Verify OTP] Request for: ${email}, Code: ${otp}`);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Debugging Logs (Check your terminal for these values)
    const currentTime = new Date();
    console.log(`[Verify OTP Debug] DB Code: '${user.otp_code}' vs Input: '${otp}'`);
    console.log(`[Verify OTP Debug] DB Expires: ${user.otp_expires_at} vs Now: ${currentTime}`);

    // Check if OTP matches (ensure string comparison)
    if (String(user.otp_code).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if expired
    let expiresAt = new Date(user.otp_expires_at);
    if (currentTime > expiresAt) {
      // Fix for potential timezone mismatch (DB storing UTC as local)
      // If the difference is large (> 1 hour), try adjusting by timezone offset
      const diff = currentTime.getTime() - expiresAt.getTime();
      if (diff > 3600000) { // 1 hour
        const timezoneOffsetMs = currentTime.getTimezoneOffset() * 60000;
        expiresAt = new Date(expiresAt.getTime() - timezoneOffsetMs);
        console.log(`[Verify OTP Debug] Adjusted Expires for Timezone: ${expiresAt}`);
      }
      if (currentTime > expiresAt) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
    }

    // Verify user
    user.is_verified = true;
    user.otp_code = null;
    user.otp_expires_at = null;
    await user.save();

    console.log(`[Verify OTP Success] User verified: ${email}`);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error("[Verify OTP Error]", error);
    res.status(500).json({ message: 'Server error during verification', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[Login Attempt] Email: ${email}`);

    if (!email || !password) {
      console.warn(`[Login Failed] Missing email or password`);
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.warn(`[Login Failed] User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[Login Failed] Incorrect password for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      console.warn(`[Login Failed] Unverified user: ${email}`);
      return res.status(403).json({ message: 'Account not verified. Please check your email for the OTP.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`[Login Success] User logged in: ${email} (ID: ${user.id})`);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error("------------------------------------------------");
    console.error("[Login Error] Details:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("------------------------------------------------");
    // Return the specific error message to the client for debugging
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[Forgot Password] Request for: ${email}`);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    user.reset_token = token;
    user.reset_token_expires_at = expiresAt;
    await user.save();

    // Construct the reset link (Assuming frontend runs on port 3000)
    const resetLink = `http://localhost:3000/resetpassword?token=${token}`;

    // Send the reset email
    try {
      console.log(`[Forgot Password] Attempting to send reset email to: ${email}`);
      await sendResetEmail(email, resetLink);
      console.log(`[Forgot Password] Reset email sent successfully to: ${email}`);
    } catch (emailError) {
      console.error('[Forgot Password] Failed to send reset email:', emailError);
      // Still return success to prevent email enumeration, but log the error
    }

    res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error("[Forgot Password Error]", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log(`[Reset Password] Received token: '${token}'`);
    console.log(`[Reset Password] Token Length: ${token ? token.length : 'N/A'}`);

    const user = await User.findOne({ where: { reset_token: token } });

    if (!user) {
      console.warn(`[Reset Password Failed] Token NOT found in DB.`);
      
      // --- DEBUGGING: List all users with tokens to see what's actually in the DB ---
      const allUsers = await User.findAll();
      const usersWithTokens = allUsers.filter(u => u.reset_token);
      
      if (usersWithTokens.length > 0) {
        console.log("--- DEBUG: Active Tokens in Database ---");
        usersWithTokens.forEach(u => {
          console.log(`User: ${u.email} | Token: '${u.reset_token}' | Expires: ${u.reset_token_expires_at}`);
        });
        console.log("----------------------------------------");
      } else {
        console.log("--- DEBUG: No users have pending reset tokens. Database might have been reset. ---");
      }

      return res.status(400).json({ message: 'Invalid password reset token. Please request a new link.' });
    }

    let expiresAt = new Date(user.reset_token_expires_at);
    const currentTime = new Date();

    if (currentTime > expiresAt) {
      // Fix for potential timezone mismatch (DB storing UTC as local)
      const diff = currentTime.getTime() - expiresAt.getTime();
      if (diff > 3600000) { // If expired by more than 1 hour, try adjusting by timezone offset
        const timezoneOffsetMs = currentTime.getTimezoneOffset() * 60000;
        expiresAt = new Date(expiresAt.getTime() - timezoneOffsetMs);
        console.log(`[Reset Password] Timezone adjustment applied. Adjusted Expires: ${expiresAt}`);
      }
    }

    if (currentTime > expiresAt) {
      console.warn(`[Reset Password Failed] Token expired. Now: ${currentTime}, Expires: ${expiresAt}`);
      return res.status(400).json({ message: 'Password reset token has expired. Please request a new link.' });
    }

    // Validate Password Complexity
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 12-16 characters, with at least one uppercase, one digit, and one special character' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires_at = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error("[Reset Password Error]", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login, verifyOtp, forgotPassword, resetPassword };
