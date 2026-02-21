const CONFIG = {
  // PASTE YOUR GOOGLE SCRIPT WEB APP URL HERE
  SHEET_URL: "https://script.google.com/macros/s/AKfycbwNmbco6F10Qo0xhbileQdhryYbMbVa6k_xEI3M2xbHU9OZxlZ3E4XangCKGhbv-P62Eg/exec", 
  // PASTE YOUR RAZORPAY LIVE KEY HERE
  RAZORPAY_KEY: "rzp_live_XXXXXXXXXXXX" 
};

// State Management
const store = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};

// Google Sheets Logger
function logActivity(payload) {
  fetch(CONFIG.SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(err => console.error("Log failed", err));
}

// Flow Guard
function guardPage(requiredStage) {
  const age = store.get('age_verified');
  const user = store.get('user');

  if (!age && requiredStage !== 'age') window.location.href = 'age.html';
  if (age && !user && requiredStage !== 'login' && requiredStage !== 'age') window.location.href = 'login.html';
}

// Razorpay Integration
function startPayment(planName, amount) {
  const user = store.get('user');
  
  const options = {
    key: CONFIG.RAZORPAY_KEY,
    amount: amount * 100, // Amount in paise
    currency: "INR",
    name: "Premium VIP Access",
    description: planName + " Plan",
    theme: { color: "#bf953f" },
    prefill: { contact: user.phone },
    handler: function (response) {
      const paymentData = {
        plan: planName,
        amount: amount,
        payment_id: response.razorpay_payment_id,
        status: "success"
      };
      store.set('last_payment', paymentData);
      
      logActivity({
        type: "Payment",
        phone: user.phone,
        ...paymentData
      });
      
      window.location.href = "thankyou.html";
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
}
