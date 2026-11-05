const DEMO_USERS_KEY = "professionalMiningUsers";
const DEMO_KYC_KEY = "professionalMiningKyc";
const DEMO_MESSAGES_KEY = "professionalMiningChat";

function demoUsers() {
  return [
    {
      id: "u1",
      name: "Ava Brooks",
      email: "ava@example.com",
      password: "demo123",
      country: "United States",
      role: "admin",
      status: "active",
      kyc: "approved",
      joined: "2026-02-14"
    },
    {
      id: "u2",
      name: "Daniel Smith",
      email: "daniel@example.com",
      password: "demo123",
      country: "United Kingdom",
      role: "user",
      status: "active",
      kyc: "pending",
      joined: "2026-03-08"
    }
  ];
}

function safeRead(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initDemoData() {
  if (!localStorage.getItem(DEMO_USERS_KEY)) safeWrite(DEMO_USERS_KEY, demoUsers());
  if (!localStorage.getItem(DEMO_KYC_KEY)) safeWrite(DEMO_KYC_KEY, [{ id: "u2", name: "Daniel Smith", email: "daniel@example.com", status: "pending" }]);
  if (!localStorage.getItem(DEMO_MESSAGES_KEY)) safeWrite(DEMO_MESSAGES_KEY, [
    { from: "support", text: "Hello! Welcome to ProfessionalMining support." },
    { from: "user", text: "I need help with my account and KYC review." }
  ]);
}

function getUsers() { return safeRead(DEMO_USERS_KEY, demoUsers()); }
function saveUsers(users) { safeWrite(DEMO_USERS_KEY, users); }
function getKycQueue() { return safeRead(DEMO_KYC_KEY, []); }
function saveKycQueue(queue) { safeWrite(DEMO_KYC_KEY, queue); }

function renderAdminUsers() {
  const table = document.getElementById("adminUsersTable");
  if (!table) return;

  const users = getUsers();
  table.innerHTML = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.kyc}</td>
      <td>${user.status}</td>
      <td><button class="btn btn-secondary" data-user-id="${user.id}">Toggle</button></td>
    </tr>
  `).join("");

  const userCount = document.getElementById("adminUserCount");
  const kycCount = document.getElementById("adminKycCount");
  if (userCount) userCount.textContent = String(users.length);
  if (kycCount) {
    const pending = users.filter(u => String(u.kyc).toLowerCase() !== "approved").length;
    kycCount.textContent = String(pending);
  }

  document.querySelectorAll("[data-user-id]").forEach(button => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("data-user-id");
      const users = getUsers();
      const user = users.find(item => item.id === userId);
      if (!user) return;
      user.status = user.status === "active" ? "suspended" : "active";
      saveUsers(users);
      renderAdminUsers();
    });
  });
}

function renderAdminKycQueue() {
  const queueWrap = document.getElementById("kycQueue");
  if (!queueWrap) return;

  const queue = getKycQueue();
  if (!queue.length) {
    queueWrap.innerHTML = "<p class='muted'>No KYC submissions pending.</p>";
    return;
  }

  queueWrap.innerHTML = queue.map(item => `
    <div class="panel" style="margin-top:12px;">
      <div class="wallet-head">
        <strong>${item.name}</strong>
        <span class="badge warning">${item.status}</span>
      </div>
      <p class="muted">${item.email}</p>
      <div class="cta-row">
        <button class="btn btn-secondary" data-kyc-approve="${item.id}">Approve</button>
        <button class="btn btn-secondary" data-kyc-reject="${item.id}">Reject</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-kyc-approve]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-kyc-approve");
      const users = getUsers();
      const user = users.find(item => item.id === id);
      if (user) {
        user.kyc = "approved";
        user.status = "active";
      }
      saveUsers(users);

      const nextQueue = getKycQueue().filter(item => item.id !== id);
      saveKycQueue(nextQueue);

      renderAdminUsers();
      renderAdminKycQueue();
    });
  });

  document.querySelectorAll("[data-kyc-reject]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-kyc-reject");
      const users = getUsers();
      const user = users.find(item => item.id === id);
      if (user) {
        user.kyc = "rejected";
        user.status = "suspended";
      }
      saveUsers(users);

      const nextQueue = getKycQueue().filter(item => item.id !== id);
      saveKycQueue(nextQueue);

      renderAdminUsers();
      renderAdminKycQueue();
    });
  });
}

function handleRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const country = document.getElementById("country").value;

    if (!name || !email || !password) {
      alert("Please complete all fields.");
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert("A user with this email already exists.");
      return;
    }

    const newUser = {
      id: "u" + Date.now(),
      name,
      email,
      password,
      country,
      role: "user",
      status: "active",
      kyc: "pending",
      joined: new Date().toISOString().slice(0, 10)
    };

    users.push(newUser);
    saveUsers(users);

    const queue = getKycQueue();
    queue.push({ id: newUser.id, name, email, status: "pending" });
    saveKycQueue(queue);

    alert("Registration successful. Your account is now in the KYC queue.");
    form.reset();
  });
}

function handleLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const users = getUsers();
    const user = users.find(item => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    if (user.role === "admin") {
      window.location.href = "admin.html";
      return;
    }

    window.location.href = "dashboard.html";
  });
}

function handleKyc() {
  const form = document.getElementById("kycForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    alert("KYC submitted successfully. This is a demo submission and not a real verification process.");
    form.reset();
  });
}

function handleChat() {
  const form = document.getElementById("chatForm");
  const box = document.getElementById("chatBox");
  if (!form || !box) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const input = document.getElementById("chatInput");
    const value = input.value.trim();
    if (!value) return;

    const message = document.createElement("div");
    message.className = "message outgoing";
    message.textContent = value;
    box.appendChild(message);

    const response = document.createElement("div");
    response.className = "message incoming";
    response.textContent = "Thanks for contacting ProfessionalMining support. We will review your request.";
    box.appendChild(response);

    input.value = "";
    box.scrollTop = box.scrollHeight;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDemoData();

  handleRegister();
  handleLogin();
  handleKyc();
  handleChat();

  renderAdminUsers();
  renderAdminKycQueue();
});
