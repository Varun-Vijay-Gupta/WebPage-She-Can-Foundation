const { validateContact } = require("../validators/contactValidator");
const contactModel = require("../models/contactModel");
const { sendContactNotification } = require("../services/emailService");

async function submitContact(req, res, next) {
  try {
    const { valid, errors, sanitized } = validateContact(req.body);
    if (!valid) {
      return res.status(400).json({
        success: false,
        error: errors[0] || "Invalid request data",
      });
    }

    // Prevent rapid duplicate submissions (server-side).
    const cooldownSeconds = Number.parseInt(process.env.SUBMISSION_COOLDOWN_SECONDS || "10", 10);
    const isDuplicate = await contactModel.isRapidDuplicate(
      sanitized.email,
      Number.isNaN(cooldownSeconds) ? 10 : cooldownSeconds
    );

    if (isDuplicate) {
      return res.status(429).json({
        success: false,
        error: "Please wait a few seconds before submitting again.",
      });
    }

    await contactModel.createContact(sanitized);

    // Send email notification (non-blocking for user if email fails)
    try {
      await sendContactNotification(sanitized);
    } catch (emailErr) {
      console.error("[email] Contact notification failed:", emailErr.message);
    }

        return res.status(201).json({
      success: true,
      message: "Thanks! Your message has been received. We will get back to you soon.",
    });
  } catch (err) {
    console.error("CONTACT CONTROLLER ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
module.exports = { submitContact };

