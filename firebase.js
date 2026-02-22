// firebase.js — FINAL WORKING VERSION

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/* 🔐 YOUR REAL CONFIG (CONFIRMED OK) */
const firebaseConfig = {
  apiKey: "AIzaSyCLklB9xFWDWC3mvzNMPz9ADJ2P6eETyB4",
  authDomain: "premium-page.firebaseapp.com",
  projectId: "premium-page",
  storageBucket: "premium-page.firebasestorage.app",
  messagingSenderId: "35609923793",
  appId: "1:35609923793:web:71a66151d0ea3cc5ec35f0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";

let confirmationResult = null;

/* 🔴 VERY IMPORTANT: RENDER reCAPTCHA */
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
window.sendOTP = async (phoneNumber) => {
  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
    console.log("OTP sent");
    return true;
  } catch (e) {
    console.error(e);
    alert(e.message);
    return false;
  }
};

/* ✅ VERIFY OTP */
window.verifyOTP = async (otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (e) {
    alert("Invalid OTP");
    return null;
  }
};
