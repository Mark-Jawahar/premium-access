import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.sendOtp = () => {
  window.recaptcha = new RecaptchaVerifier(auth,"recaptcha",{size:"invisible"});
  const phone="+91"+phone.value;
  signInWithPhoneNumber(auth,phone,recaptcha).then(c=>{
    window.confirmation=c;
    otp.style.display=verifyBtn.style.display="block"
  })
}

window.verifyOtp=()=>{
  confirmation.confirm(otp.value).then(()=>{
    localStorage.user=phone.value;
    nav('choice.html')
  })
}
