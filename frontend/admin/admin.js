(function () {
  const STORAGE_KEY = "scf_admin_key";

  function getApiBase() {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return `http://${host}:5000`;
    }
    return "http://localhost:5000";
  }

  function getAdminKey() {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  }

  function setAdminKey(key) {
    sessionStorage.setItem(STORAGE_KEY, key);
  }

  function clearAdminKey() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  async function fetchAdmin(path) {
    const res = await fetch(`${getApiBase()}${path}`, {
      headers: { "x-admin-key": getAdminKey() },
    });

    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      // ignore
    }

    if (!res.ok) {
      throw new Error(data?.error || `Request failed (${res.status})`);
    }
    return data;
  }

  function formatDate(value) {
    if (!value) return "-";
    const d = new Date(value);
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const loginSection = document.getElementById("loginSection");
  const dashboard = document.getElementById("dashboard");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const logoutBtn = document.getElementById("logoutBtn");
  const contactsBody = document.getElementById("contactsTableBody");
  const volunteersBody = document.getElementById("volunteersTableBody");

  function showDashboard() {
    loginSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loadContacts();
  }

  function showLogin() {
    loginSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }

  async function loadContacts() {
    contactsBody.innerHTML = '<tr><td colspan="5" class="empty">Loading...</td></tr>';
    try {
      const { data } = await fetchAdmin("/api/admin/contacts");
      if (!data || data.length === 0) {
        contactsBody.innerHTML = '<tr><td colspan="5" class="empty">No contact submissions yet.</td></tr>';
        return;
      }
      contactsBody.innerHTML = data
        .map(
          (row) => `
        <tr>
          <td>${row.id}</td>
          <td>${escapeHtml(row.name)}</td>
          <td><a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a></td>
          <td class="msg-cell">${escapeHtml(row.message)}</td>
          <td>${formatDate(row.created_at)}</td>
        </tr>`
        )
        .join("");
    } catch (err) {
      contactsBody.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(err.message)}</td></tr>`;
    }
  }

  async function loadVolunteers() {
    volunteersBody.innerHTML = '<tr><td colspan="7" class="empty">Loading...</td></tr>';
    try {
      const { data } = await fetchAdmin("/api/admin/volunteers");
      if (!data || data.length === 0) {
        volunteersBody.innerHTML =
          '<tr><td colspan="7" class="empty">No volunteer applications yet.</td></tr>';
        return;
      }
      volunteersBody.innerHTML = data
        .map(
          (row) => `
        <tr>
          <td>${row.id}</td>
          <td>${escapeHtml(row.name)}</td>
          <td><a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a></td>
          <td>${escapeHtml(row.phone || "-")}</td>
          <td>${escapeHtml(row.skills)}</td>
          <td class="msg-cell">${escapeHtml(row.message || "-")}</td>
          <td>${formatDate(row.created_at)}</td>
        </tr>`
        )
        .join("");
    } catch (err) {
      volunteersBody.innerHTML = `<tr><td colspan="7" class="empty">${escapeHtml(err.message)}</td></tr>`;
    }
  }

  // Tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.tab;
      document.getElementById("contactsPanel").classList.toggle("hidden", target !== "contacts");
      document.getElementById("volunteersPanel").classList.toggle("hidden", target !== "volunteers");

      if (target === "volunteers") loadVolunteers();
      else loadContacts();
    });
  });

  document.getElementById("refreshContacts")?.addEventListener("click", loadContacts);
  document.getElementById("refreshVolunteers")?.addEventListener("click", loadVolunteers);

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    const key = document.getElementById("adminKey").value.trim();
    setAdminKey(key);

    try {
      await fetchAdmin("/api/admin/contacts");
      showDashboard();
    } catch (err) {
      clearAdminKey();
      loginError.textContent = err.message || "Invalid admin key.";
    }
  });

  logoutBtn?.addEventListener("click", () => {
    clearAdminKey();
    showLogin();
    document.getElementById("adminKey").value = "";
  });

  if (getAdminKey()) {
    fetchAdmin("/api/admin/contacts")
      .then(() => showDashboard())
      .catch(() => {
        clearAdminKey();
        showLogin();
      });
  } else {
    showLogin();
  }
})();
