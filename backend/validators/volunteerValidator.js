const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[\d\s-]{8,15}$/;

function normalizeString(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function validateVolunteer(body) {
  const name = normalizeString(body?.name);
  const email = normalizeString(body?.email);
  const phone = normalizeString(body?.phone);
  const skills = normalizeString(body?.skills);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  const errors = [];

  if (!name || name.length < 2) {
    errors.push("Full name is required (at least 2 characters).");
  }

  if (!email || !emailRegex.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (phone && !phoneRegex.test(phone)) {
    errors.push("Please enter a valid phone number.");
  }

  if (!skills || skills.length < 3) {
    errors.push("Please describe your skills or area of interest (at least 3 characters).");
  }

  if (message.length > 1000) {
    errors.push("Message must be 1000 characters or less.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    sanitized: {
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      skills,
      message,
    },
  };
}

module.exports = { validateVolunteer };
