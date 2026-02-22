/* ======================================================
   CORE.JS — CENTRAL BRAIN
   Auth • Access • State • Payments
   Premium / iOS-style / No framework
===================================================== */

/* -------------------------
   SAFE STORAGE WRAPPER
------------------------- */
const store = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const val = localStorage.getItem(key);
    try {
      return val ? JSON.parse(val) : null;
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

/* -------------------------
   AUTH HELPERS
------------------------- */
function isLoggedIn() {
  return !!store.get("user_email");
}

function isPaid() {
  return !!store.get("paid_user");
}

/* -------------------------
   PAGE ACCESS GUARD
------------------------- */
function guardPage(page) {
  const ageVerified = store.get("age_verified");
  const loggedIn = isLoggedIn();
  const paid = isPaid();

  /* AGE GATE — ABSOLUTE */
  if (!ageVerified && page !== "age") {
    window.location.href = "age.html";
    return;
  }

  /* LOGIN REQUIRED */
  const loginRequiredPages = [
    "choice",
    "free",
    "exclusive",
    "thankyou"
  ];

  if (loginRequiredPages.includes(page) && !loggedIn) {
    window.location.href = "login.html";
    return;
  }

  /* PAID-ONLY PAGE */
  if (page === "thankyou" && !paid) {
    window.location.href = "exclusive.html";
    return;
  }
}

/* -------------------------
   LOGIN STATE
------------------------- */
function setLoggedIn(email) {
  store.set("user_email", email);
}

/* -------------------------
   PAYMENT STATE
------------------------- */
function setPaid(paymentData) {
  store.set("paid_user", true);
  store.set("last_payment", {
    ...paymentData,
    time: Date.now()
  });
}

/* -------------------------
   LOGOUT
------------------------- */
function logout() {
  store.clear();
  window.location.href = "age.html";
}

/* -------------------------
   RAZORPAY PAYMENT
------------------------- */
function startPayment(plan, amount) {
  if (typeof Razorpay === "undefined") {
    alert("Payment system not loaded");
    return;
  }

  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: amount * 100,
    currency: "INR",
    name: "Premium Access",
    description: plan,
    handler: function (response) {
      if (!response.razorpay_payment_id) {
        alert("Payment verification failed");
        return;
      }

      setPaid({
        plan,
        amount,
        payment_id: response.razorpay_payment_id
      });

      window.location.href = "thankyou.html";
    },
    modal: {
      ondismiss: function () {
        console.log("Payment popup closed");
      }
    },
    theme: {
      color: "#bf953f"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

/* -------------------------
   DEBUG (OPTIONAL)
------------------------- */
window.store = store;
window.logout = logout;
