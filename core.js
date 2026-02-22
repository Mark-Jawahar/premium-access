/* ======================================================
   core.js — CENTRAL LOGIC BRAIN (FINAL, CLEAN)
   Purpose: Routing, Session, Guards, Payments
====================================================== */

/* =======================
   SAFE STORAGE WRAPPER
======================= */
const store = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

/* =======================
   SESSION CONFIG
======================= */
const SESSION_HOURS = 24;
const SESSION_MS = SESSION_HOURS * 60 * 60 * 1000;

/* =======================
   SESSION HELPERS
======================= */
function isLoggedIn() {
  const email = store.get("user_email");
  const time = store.get("login_time");

  if (!email || !time) return false;

  if (Date.now() - time > SESSION_MS) {
    logout(false);
    return false;
  }
  return true;
}

function logout(redirect = true) {
  store.remove("user_email");
  store.remove("login_time");
  store.remove("access_level");
  store.remove("last_payment");

  if (redirect) {
    window.location.href = "login.html";
  }
}

/* =======================
   ROUTE GUARD (SAFE)
======================= */
function guardPage(page) {
  const ageOK = store.get("age_verified");
  const logged = isLoggedIn();
  const payment = store.get("last_payment");

  // Allow public pages
  if (page === "age" || page === "login") return;

  // Age verification required
  if (!ageOK) {
    window.location.href = "age.html";
    return;
  }

  // Login required
  if (!logged) {
    window.location.href = "login.html";
    return;
  }

  // Thank-you page protection
  if (page === "thankyou") {
    if (
      !payment ||
      !payment.time ||
      Date.now() - payment.time > SESSION_MS
    ) {
      window.location.href = "exclusive.html";
    }
  }
}

/* =======================
   AUTH SUCCESS HANDLER
======================= */
function onLoginSuccess(email) {
  if (!email) return;

  store.set("user_email", email);
  store.set("login_time", Date.now());
  store.set("access_level", "guest");

  window.location.href = "choice.html";
}

/* =======================
   PAYMENT HANDLER (RAZORPAY)
======================= */
function startPayment(plan, amount) {
  if (typeof Razorpay === "undefined") {
    alert("Payment system failed to load. Please refresh.");
    return;
  }

  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: amount * 100,
    currency: "INR",
    name: "Premium Access",
    description: plan,
    handler: function (response) {
      const receipt = {
        plan,
        amount,
        payment_id: response.razorpay_payment_id,
        time: Date.now()
      };

      store.set("last_payment", receipt);
      store.set("access_level", "premium");

      window.location.href = "thankyou.html";
    },
    theme: { color: "#bf953f" }
  };

  new Razorpay(options).open();
}

/* =======================
   EXPOSE SAFE GLOBALS
======================= */
window.store = store;
window.guardPage = guardPage;
window.startPayment = startPayment;
window.logout = logout;
window.onLoginSuccess = onLoginSuccess;
