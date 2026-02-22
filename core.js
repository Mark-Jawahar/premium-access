/* =========================================================
   CORE.JS — PREMIUM ACCESS ENGINE (CLEAN & SECURE)
   Author: You + ChatGPT
========================================================= */

/* =========================
   SAFE STORAGE WRAPPER
========================= */
const store = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const val = localStorage.getItem(key);
    try { return JSON.parse(val); } catch { return null; }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

/* =========================
   ROUTE GUARD
========================= */
function guardPage(page) {

  const ageOK = store.get("age_verified");
  const loggedIn = store.get("user_email");
  const paid = store.get("payment_success");

  if (!ageOK && page !== "age") {
    window.location.replace("age.html");
    return;
  }

  if (!loggedIn && ["choice","free","exclusive","thankyou"].includes(page)) {
    window.location.replace("login.html");
    return;
  }

  if (!paid && ["thankyou"].includes(page)) {
    window.location.replace("exclusive.html");
    return;
  }
}

/* =========================
   EMAIL OTP SYSTEM (CLIENT)
========================= */
const OTP_API = "YOUR_GOOGLE_SCRIPT_URL"; // replace once

async function sendEmailOTP(email) {
  if (!email || !email.includes("@")) {
    alert("Enter a valid email address");
    return;
  }

  await fetch(OTP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "send", email })
  });

  store.set("pending_email", email);
}

async function verifyEmailOTP(otp) {
  const email = store.get("pending_email");
  if (!email || !otp) return false;

  const res = await fetch(OTP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "verify",
      email,
      otp
    })
  });

  const data = await res.json();

  if (data.success) {
    store.set("user_email", email);
    store.remove("pending_email");
    return true;
  }

  return false;
}

/* =========================
   PAYMENT (RAZORPAY)
========================= */
function startPayment(plan, amount) {

  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: amount * 100,
    currency: "INR",
    name: "Premium Access",
    description: plan + " Plan",
    handler: function (response) {

      store.set("payment_success", true);
      store.set("last_payment", {
        plan,
        amount,
        payment_id: response.razorpay_payment_id
      });

      window.location.href = "thankyou.html";
    },
    theme: { color: "#bf953f" }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

/* =========================
   LOGOUT (OPTIONAL)
========================= */
function logout() {
  store.remove("user_email");
  store.remove("payment_success");
  window.location.href = "login.html";
}
