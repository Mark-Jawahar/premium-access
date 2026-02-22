/* ======================================================
   core.js — CENTRAL LOGIC BRAIN (FIXED)
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
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
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

/* =======================
   SESSION CONFIG
======================= */
const SESSION_HOURS = 24;
const SESSION_MS = SESSION_HOURS * 60 * 60 * 1000;
const PAYMENT_VALID_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/* =======================
   AUTH HELPERS
======================= */
function isLoggedIn() {
  const email = store.get("user_email");
  const time = store.get("login_time");

  if (!email || !time) return false;

  if (Date.now() - time > SESSION_MS) {
    logout(true);
    return false;
  }
  return true;
}

function logout(expired = false) {
  store.remove("user_email");
  store.remove("login_time");
  store.remove("access_level");
  store.remove("last_payment");

  const ageOK = store.get("age_verified");
  window.location.href = ageOK ? "login.html" : "age.html";
}

/* =======================
   PAYMENT VALIDATION
======================= */
function hasValidPayment() {
  const payment = store.get("last_payment");
  if (!payment || !payment.time) return false;

  if (Date.now() - payment.time > PAYMENT_VALID_MS) {
    store.remove("last_payment");
    store.set("access_level", "guest");
    return false;
  }
  return true;
}

/* =======================
   ROUTE GUARD
======================= */
function guardPage(page) {
  const ageOK = store.get("age_verified");
  const logged = isLoggedIn();

  // AGE GATE (allow age + login pages)
  if (!ageOK && !["age", "login"].includes(page)) {
    window.location.href = "age.html";
    return;
  }

  // LOGIN REQUIRED
  if (["choice", "free", "exclusive", "thankyou"].includes(page)) {
    if (!logged) {
      window.location.href = "login.html";
      return;
    }
  }

  // THANK YOU PAGE
  if (page === "thankyou" && !hasValidPayment()) {
    window.location.href = "exclusive.html";
    return;
  }
}

/* =======================
   LOGIN SUCCESS
======================= */
function onLoginSuccess(email) {
  store.set("user_email", email);
  store.set("login_time", Date.now());
  store.set("access_level", "guest");
  window.location.href = "choice.html";
}

/* =======================
   PAYMENT (RAZORPAY)
======================= */
function startPayment(plan, amount) {
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

  const rzp = new Razorpay(options);
  rzp.open();
}

/* =======================
   GLOBAL EXPORTS
======================= */
window.store = store;
window.guardPage = guardPage;
window.startPayment = startPayment;
window.logout = logout;
window.onLoginSuccess = onLoginSuccess;
