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

// 4. EXPORT the tools so login.html can actually use them
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
