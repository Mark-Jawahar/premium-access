// firebase.js — CLEAN & WORKING (WEB OTP)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/* 🔐 FIREBASE CONFIG (YOUR PROJECT) */
const firebaseConfig = {
  apiKey: "AIzaSyCLklB9xFWDWC3mvzNMPz9ADJ2P6eETyB4",
  authDomain: "premium-page.firebaseapp.com",
  projectId: "premium-page",
  storageBucket: "premium-page.firebasestorage.app",
  messagingSenderId: "35609923793",
  appId: "1:35609923793:web:71a66151d0ea3cc5ec35f0"
};

/* 🔹 INIT FIREBASE */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";

/* 🔹 GLOBAL CONFIRMATION */
let confirmationResult = null;

/* 🔐 CREATE & RENDER reCAPTCHA (ONCE) */
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "normal",
    callback: () => {
      console.log("reCAPTCHA solved");
    }
  }
);

window.recaptchaVerifier.render();

/* 📲 SEND OTP */
window.sendOTP = async function (phoneNumber) {
  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
    console.log("OTP sent");
    return true;
  } catch (error) {
    console.error(error);
    alert(error.message);
    return false;
  }
};

/* ✅ VERIFY OTP */
window.verifyOTP = async function (otp) {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    alert("Invalid OTP");
    return null;
  }
};
