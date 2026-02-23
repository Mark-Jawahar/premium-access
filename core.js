/* ======================================================
   core.js — FINAL iOS LUXURY ENGINE
====================================================== */

/* ---------- STORAGE ---------- */
const store = {
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  get(k) {
    const r = localStorage.getItem(k);
    if (!r) return null;
    try { return JSON.parse(r); } catch { return null; }
  },
  remove(k) { localStorage.removeItem(k); }
};

/* ---------- SESSION ---------- */
const SESSION_MS = 24 * 60 * 60 * 1000;

function isLoggedIn() {
  const t = store.get("login_time");
  if (!t) return false;
  if (Date.now() - t > SESSION_MS) {
    logout(false);
    return false;
  }
  return true;
}

function logout(redirect = true) {
  ["user_email","login_time","access_level","last_payment"]
    .forEach(store.remove);
  if (redirect) location.href = "login.html";
}

/* ---------- ROUTE GUARD ---------- */
function guardPage(page) {
  if (page === "age" || page === "login") return;
  if (!store.get("age_verified")) location.href = "age.html";
  else if (!isLoggedIn()) location.href = "login.html";
}

/* ---------- LOGIN ---------- */
function onLoginSuccess(identity) {
  store.set("user_email", identity);
  store.set("login_time", Date.now());
  store.set("access_level", "guest");
  smoothNav("choice.html");
}

/* ---------- PAYMENT ---------- */
function startPayment(plan, amount) {
  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: amount * 100,
    currency: "INR",
    name: "Premium Access",
    description: plan,
    handler(res) {
      store.set("last_payment", {
        plan, amount,
        payment_id: res.razorpay_payment_id,
        time: Date.now()
      });
      store.set("access_level", "premium");
      smoothNav("thankyou.html");
    },
    theme: { color: "#c9a24d" }
  };
  new Razorpay(options).open();
}

/* ---------- SMOOTH NAV ---------- */
function smoothNav(url) {
  document.body.classList.add("page-out");
  setTimeout(() => location.href = url, 300);
}

/* ---------- HAPTIC MICRO-UX ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button,.item-card").forEach(el => {
    el.addEventListener("touchstart", () => {
      el.style.transform = "scale(.96)";
    });
    el.addEventListener("touchend", () => {
      el.style.transform = "";
    });
  });
});

/* ---------- EXPORT ---------- */
window.guardPage = guardPage;
window.startPayment = startPayment;
window.logout = logout;
window.onLoginSuccess = onLoginSuccess;
