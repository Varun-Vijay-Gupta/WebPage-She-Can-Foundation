(function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+]?[\d\s-]{8,15}$/;
  const clientCooldownMs = 10_000;

  // --- Shared helpers ---
function getApiBase() {
  const host = window.location.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return "https://she-can-backend-38a3.onrender.com/";
}

  function setFieldError(fieldName, message) {
    const el = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (el) el.textContent = message || "";
  }

  function clearFieldErrors(fields) {
    fields.forEach((f) => setFieldError(f, ""));
  }

  function isClientDuplicate(key) {
    const last = Number(sessionStorage.getItem(key) || "0");
    const now = Date.now();
    if (last && now - last < clientCooldownMs) return true;
    sessionStorage.setItem(key, String(now));
    return false;
  }

  async function apiPost(path, payload) {
    const res = await fetch(`${getApiBase()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      // ignore parse error
    }

    if (!res.ok) {
      const msg = data?.error || data?.message || `Request failed (${res.status}).`;
      throw new Error(msg);
    }
    return data;
  }

  function bindToast(toastEl, toastTextEl, errorToastEl, errorTextEl) {
    return {
      success(text) {
        toastTextEl.textContent = text;
        toastEl.classList.add("show");
        errorToastEl.classList.remove("show");
        clearTimeout(bindToast._t);
        bindToast._t = setTimeout(() => toastEl.classList.remove("show"), 5200);
      },
      error(text) {
        errorTextEl.textContent = text;
        errorToastEl.classList.add("show");
        toastEl.classList.remove("show");
        clearTimeout(bindToast._e);
        bindToast._e = setTimeout(() => errorToastEl.classList.remove("show"), 7000);
      },
    };
  }

  function handleFetchError(err) {
    let msg = err?.message || "Something went wrong. Please try again.";
    if (msg === "Failed to fetch") {
      msg =
        "Cannot reach the server. Start the backend (npm start in backend folder) on port 5000.";
    }
    return msg;
  }

  function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.classList.toggle("is-loading", isLoading);
  }

  // --- Page loader ---
  window.addEventListener("load", () => {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.classList.add("hidden");
  });

  // --- Year in footer ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // --- Scroll reveal ---
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // --- Stats counter ---
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (statNumbers.length && "IntersectionObserver" in window) {
    const animateCounter = (el) => {
      const target = Number(el.dataset.target) || 0;
      const duration = 1500;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.floor(target * eased));
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
      };
      requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statNumbers.forEach((el) => statsObserver.observe(el));
  }

  // --- Mobile nav ---
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    document.querySelectorAll(".nav-link").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Contact form ---
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const submitBtn = document.getElementById("submitBtn");
    const toast = bindToast(
      document.getElementById("toast"),
      document.getElementById("toastText"),
      document.getElementById("toastError"),
      document.getElementById("toastErrorText")
    );

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = ["fullName", "email", "message"];
      clearFieldErrors(fields);

      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      let ok = true;

      if (!name || name.length < 2) {
        ok = false;
        setFieldError("fullName", "Please enter your full name (at least 2 characters).");
      }
      if (!email || !emailRegex.test(email)) {
        ok = false;
        setFieldError("email", "Please enter a valid email address.");
      }
      if (!message || message.length < 10) {
        ok = false;
        setFieldError("message", "Please enter a message (at least 10 characters).");
      }
      if (!ok) {
        toast.error("Please fix the highlighted fields and try again.");
        return;
      }

      const dupKey = `scf_contact_${email}`;
      if (isClientDuplicate(dupKey)) {
        toast.error("Please wait a few seconds before submitting again.");
        return;
      }

      setButtonLoading(submitBtn, true);
      try {
        const result = await apiPost("/api/contact", { name, email, message });
        toast.success(result?.message || "Message sent successfully!");
        contactForm.reset();
        clearFieldErrors(fields);
      } catch (err) {
        toast.error(handleFetchError(err));
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // --- Volunteer form ---
  const volunteerForm = document.getElementById("volunteerForm");
  if (volunteerForm) {
    const volBtn = document.getElementById("volunteerSubmitBtn");
    const volToast = bindToast(
      document.getElementById("volToast"),
      document.getElementById("volToastText"),
      document.getElementById("volToastError"),
      document.getElementById("volToastErrorText")
    );

    volunteerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = ["volName", "volEmail", "volPhone", "volSkills", "volMessage"];
      clearFieldErrors(fields);

      const name = document.getElementById("volName").value.trim();
      const email = document.getElementById("volEmail").value.trim();
      const phone = document.getElementById("volPhone").value.trim();
      const skills = document.getElementById("volSkills").value.trim();
      const message = document.getElementById("volMessage").value.trim();
      let ok = true;

      if (!name || name.length < 2) {
        ok = false;
        setFieldError("volName", "Please enter your full name.");
      }
      if (!email || !emailRegex.test(email)) {
        ok = false;
        setFieldError("volEmail", "Please enter a valid email address.");
      }
      if (phone && !phoneRegex.test(phone)) {
        ok = false;
        setFieldError("volPhone", "Please enter a valid phone number.");
      }
      if (!skills || skills.length < 3) {
        ok = false;
        setFieldError("volSkills", "Please describe your skills (at least 3 characters).");
      }
      if (!ok) {
        volToast.error("Please fix the highlighted fields and try again.");
        return;
      }

      const dupKey = `scf_volunteer_${email}`;
      if (isClientDuplicate(dupKey)) {
        volToast.error("Please wait a few seconds before submitting again.");
        return;
      }

      setButtonLoading(volBtn, true);
      try {
        const result = await apiPost("/api/volunteer", { name, email, phone, skills, message });
        volToast.success(result?.message || "Volunteer application submitted!");
        volunteerForm.reset();
        clearFieldErrors(fields);
      } catch (err) {
        volToast.error(handleFetchError(err));
      } finally {
        setButtonLoading(volBtn, false);
      }
    });
  }
})();
