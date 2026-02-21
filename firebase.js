// firebase.js (FINAL, WORKING)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

/* ================= INIT ================= */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";

let confirmationResult;

/* ================= INIT RECAPTCHA ================= */
window.initRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha",
      {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        }
      }
    );
  }
};

/* ================= SEND OTP ================= */
window.sendOTP = async (phone) => {
  try {
    initRecaptcha();
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );
    return true;
  } catch (e) {
    alert(e.message);
    return false;
  }
};

/* ================= VERIFY OTP ================= */
window.verifyOTP = async (otp) => {
  try {
    const res = await confirmationResult.confirm(otp);
    return res.user;
  } catch {
    alert("Invalid OTP");
    return null;
  }
};
