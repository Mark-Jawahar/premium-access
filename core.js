/* ======================================================
   CORE.JS — APP BRAIN (EMAIL OTP VERSION)
   ====================================================== */

/* ---------- SAFE STORAGE WRAPPER ---------- */
const store = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const v = localStorage.getItem(key);
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};

/* ---------- AUTH HELPERS ---------- */
function isLoggedIn() {
  return !!store.get("user_email");
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

/* ---------- PAGE GUARDS ---------- */
function guardPage(page) {
  const ageVerified = store.get("age_verified");
  const loggedIn = isLoggedIn();
  const hasPaid = store.get("paid_user");

  // Age gate
  if (!ageVerified && page !== "age") {
    window.location.href = "age.html";
    return;
  }

  // Pages that require login
  const loginRequiredPages = ["choice", "free", "exclusive", "thankyou"];
  if (loginRequiredPages.includes(page) && !loggedIn) {
    window.location.href = "login.html";
    return;
  }

  // Paid-only page
  if (page === "thankyou" && !hasPaid) {
    window.location.href = "exclusive.html";
    return;
  }
}

/* ---------- LOGOUT ---------- */
function logout() {
  store.clear();
  window.location.href = "index.html";
}

/* ---------- PAYMENT HELPERS ---------- */
function markPaid(plan, amount, paymentId) {
  store.set("paid_user", true);
  store.set("last_payment", {
    plan,
    amount,
    payment_id: paymentId,
    time: Date.now()
  });
}

/* ---------- DEBUG (OPTIONAL) ---------- */
window.store = store;
