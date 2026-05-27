const { validateVolunteer } = require("../validators/volunteerValidator");
const volunteerModel = require("../models/volunteerModel");

async function submitVolunteer(req, res, next) {
  try {
    const { valid, errors, sanitized } = validateVolunteer(req.body);
    if (!valid) {
      return res.status(400).json({
        success: false,
        error: errors[0] || "Invalid request data",
      });
    }

    const cooldownSeconds = Number.parseInt(process.env.SUBMISSION_COOLDOWN_SECONDS || "10", 10);
    const isDuplicate = await volunteerModel.isRapidDuplicate(
      sanitized.email,
      Number.isNaN(cooldownSeconds) ? 10 : cooldownSeconds
    );

    if (isDuplicate) {
      return res.status(429).json({
        success: false,
        error: "Please wait a few seconds before submitting again.",
      });
    }

    await volunteerModel.createVolunteer(sanitized);

    return res.status(201).json({
      success: true,
      message:
        "Thank you for volunteering! We have received your application and will contact you soon.",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { submitVolunteer };
