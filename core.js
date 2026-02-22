/* =====================================================
   CORE.JS — CENTRAL BRAIN (AUTH • ACCESS • STATE)
   Premium / iOS-style / Zero framework
===================================================== */

/* -------------------------
   SIMPLE STORAGE WRAPPER
------------------------- */
const store = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  }
};

/* -------------------------
   PAGE ACCESS GUARD
------------------------- */
function guardPage(page) {
  const ageVerified = store.get("age_verified");
  const loggedIn = store.get("logged_in");
  const paid = store.get("paid_user");

  // AGE GATE
  if (!ageVerified && page !== "age") {
    window.location.href = "age.html";
    return;
  }

  // LOGIN REQUIRED
  if (
    ageVerified &&
    !loggedIn &&
    !["age", "login"].includes(page)
  ) {
    window.location.href = "login.html";
    return;
  }

  // PAYMENT REQUIRED
  if (page === "exclusive" && !paid) {
    window.location.href = "choice.html";
    return;
  }

  // THANK YOU PAGE ONLY AFTER PAYMENT
  if (page === "thankyou" && !paid) {
    window.location.href = "choice.html";
    return;
  }
}

/* -------------------------
   LOGIN STATE
------------------------- */
function setLoggedIn(userData = {}) {
  store.set("logged_in", true);
  store.set("user", userData);
}

/* -------------------------
   PAYMENT STATE
------------------------- */
function setPaid(paymentData) {
  store.set("paid_user", true);
  store.set("last_payment", paymentData);
}

/* -------------------------
   LOGOUT (OPTIONAL)
------------------------- */
function logout() {
  store.clear();
  window.location.href = "age.html";
}

/* -------------------------
   RAZORPAY STARTER
------------------------- */
function startPayment(plan, amount) {
  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: amount * 100,
    currency: "INR",
    name: "Premium Access",
    description: plan,
    handler: function (response) {
      setPaid({
        plan,
        amount,
        payment_id: response.razorpay_payment_id
      });
      window.location.href = "thankyou.html";
    },
    theme: {
      color: "#bf953f"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
