// 1. Import Firebase from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLklB9xFWDWC3mvzNMPz9ADJ2P6eETyB4",
  authDomain: "premium-page.firebaseapp.com",
  projectId: "premium-page",
  storageBucket: "premium-page.firebasestorage.app",
  messagingSenderId: "35609923793",
  appId: "1:35609923793:web:1d133a99d3a904cbec35f0"
};

// 3. Initialize Firebase (Done only once)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4. Initialize reCAPTCHA
window.initRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved - you can log this or leave it empty
        console.log("reCAPTCHA verified");
      }
    });
  }
};

// 5. Send OTP Function
window.sendOTP = async (phone) => {
  try {
    window.initRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    
    // Send the SMS
    const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
    
    // Store this result globally so you can access it when the user types in the code
    window.confirmationResult = confirmationResult;
    console.log("OTP sent successfully!");
    
    return confirmationResult;
    
  } catch (error) {
    console.error("Error sending OTP: ", error);
    
    // It's a best practice to clear the reCAPTCHA if the SMS fails to send, 
    // otherwise the user gets stuck if they try to click "Send" again.
    if (window.recaptchaVerifier) {
       window.recaptchaVerifier.clear();
       window.recaptchaVerifier = null; 
    }
  }
};
