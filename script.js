const SHEET_API = "PASTE_APPS_SCRIPT_URL";
const RAZORPAY_KEY = "PASTE_RAZORPAY_KEY";

function nav(p){location.href=p}
function guard(){if(!localStorage.age)nav('age.html')}

function setAge(ok){
  if(!ok)location.href="https://google.com";
  localStorage.age=1; nav('login.html')
}

function openFree(title,url){
  log({type:'free',title});
  window.open(url)
}

function pay(plan,amount){
  const rzp=new Razorpay({
    key:RAZORPAY_KEY,
    amount:amount*100,
    currency:"INR",
    handler:r=>{
      log({type:'payment',plan,amount,id:r.razorpay_payment_id});
      nav('thankyou.html')
    }
  });
  rzp.open()
}

function log(d){
  fetch(SHEET_API,{method:'POST',body:JSON.stringify(d)})
}

function startTimer(){
  const end=Date.now()+15*60*1000;
  setInterval(()=>{
    const s=Math.max(0,Math.floor((end-Date.now())/1000));
    timer.innerText=`⏳ Offer ends in ${s}s`;
    hook.innerText=`🔥 ${1200+Math.floor(Math.random()*200)} users joined today`;
  },1000)
}
