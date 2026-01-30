import express from "express";
import { generateOTP, getExpiry, saveOTP, verifyOTP } from "../utils/otp.js";
import { sendEmailOTP } from "../services/email.service.js";

const router = express.Router();

router.post("/email/send", async (req, res) => {
  try {
    console.log("📧 Email OTP request received:", JSON.stringify(req.body));
    const { email } = req.body;

    if (!email) {
      console.error("❌ Email is missing from request");
      return res.status(400).json({ 
        success: false,
        error: "Email is required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("❌ Invalid email format:", email);
      return res.status(400).json({ 
        success: false,
        error: "Invalid email format" 
      });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    console.log("✅ Email validated and normalized:", normalizedEmail);

    const otp = generateOTP();
    const otpData = saveOTP(normalizedEmail, otp);
    console.log("🔐 Generated OTP for", normalizedEmail, ":", otp);

    const result = await sendEmailOTP(normalizedEmail, otp);
    console.log("📤 Email sending result:", JSON.stringify(result, null, 2));

    if (result.success) {
      res.json({
        success: true,
        message: "Verification code sent successfully"
      });
    } else {
      // Return 400 for client errors, 500 for server errors
      const statusCode = result.error?.includes('Invalid') || result.error?.includes('format') ? 400 : 500;
      console.error("❌ Failed to send email, status:", statusCode, "error:", result.error);
      res.status(statusCode).json({ 
        success: false, 
        error: result.error || "Failed to send verification code" 
      });
    }
  } catch (err) {
    console.error("❌ Email OTP route error:", err);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to send verification code",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Verify OTP endpoint
router.post("/email/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: "OTP must be 6 digits" });
    }

    const result = verifyOTP(normalizedEmail, otp);

    if (result.isValid) {
      res.json({ 
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({ 
        success: false,
        error: result.message
      });
    }
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to verify code",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Test endpoint for debugging
router.get("/email/test", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email query parameter required" });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const testOTP = "123456";
    
    console.log("🧪 Test email send to:", normalizedEmail);
    const result = await sendEmailOTP(normalizedEmail, testOTP);
    
    res.json({
      success: result.success,
      message: result.success ? "Test email sent successfully" : "Test email failed",
      error: result.error,
      email: normalizedEmail
    });
  } catch (err) {
    console.error("Test email error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Test email failed"
    });
  }
});

export default router;