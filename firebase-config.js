// firebase.js — FINAL FIXED VERSION

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLklB9xFWDWC3mvzNMPz9ADJ2P6eETyB4",
  authDomain: "premium-page.firebaseapp.com",
  projectId: "premium-page",
  storageBucket: "premium-page.firebasestorage.app",
  messagingSenderId: "35609923793",
  appId: "1:35609923793:web:0d9f0c7eb7688c8aec35f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";

let confirmationResult;

/* 🔐 INIT INVISIBLE RECAPTCHA */
window.initRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha",
      { size: "invisible" }
    );
  }
};

/* 📲 SEND OTP */
window.sendOTP = async (phoneNumber) => {
  try {
    initRecaptcha();
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
    alert("OTP sent ✅");
    return true;
  } catch (e) {
    alert(e.message);
    console.error(e);
    return false;
  }
};

/* ✅ VERIFY OTP */
window.verifyOTP = async (otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (e) {
    alert("Invalid OTP ❌");
    return null;
  }
};
