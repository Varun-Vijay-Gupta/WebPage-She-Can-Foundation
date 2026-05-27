const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function validateContact(body) {
  const name = normalizeString(body?.name);
  const email = normalizeString(body?.email);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  const errors = [];

  if (!name || name.length < 2) {
    errors.push("Full name is required and must be at least 2 characters.");
  }

  if (!email || !emailRegex.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!message || message.length < 10) {
    errors.push("Message is required and must be at least 10 characters.");
  }

  // Basic size guard to keep payload reasonable.
  if (message.length > 2000) {
    errors.push("Message must be 2000 characters or less.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    sanitized: {
      name,
      email: email.toLowerCase(),
      message,
    },
  };
}

module.exports = { validateContact };

