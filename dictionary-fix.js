(() => {
  const polish = document.createElement('style');
  polish.textContent = `
    body{font-family:'Vazirmatn',Tahoma,Arial,sans-serif!important}
    .profile-group img:nth-child(2){display:none!important}
    .login-box{padding:42px 38px!important;border-radius:34px!important;box-shadow:0 28px 80px #164e4a22!important}
    .login-box .logo{font-size:72px!important}
    .login-box h1{font-family:'Vazirmatn',Tahoma,sans-serif!important;font-size:31px!important;font-weight:800!important;letter-spacing:-.5px}
    .login-box>p{font-family:'Vazirmatn',Tahoma,sans-serif!important;line-height:1.9}
    .login-box #password,.login-box #accessPassword{height:52px!important;border-radius:16px!important;font-family:Arial,sans-serif!important}
    .login-box button{height:52px!important;border-radius:16px!important;font-size:14px!important}
    .login-box>div:first-of-type{margin-top:20px!important}
    @media(max-width:600px){.login-box{padding:32px 22px!important;border-radius:28px!important}}
  `;
  document.head.appendChild(polish);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const normalize=x=>({id:x.id,word:String(x.word||'').trim(),meanings:[...new Set((Array.isArray(x.meanings)?x.meanings:[x.meanings||'']).flatMap(m=>String(m).split(/[,،]/).map(v=>v.trim()).filter(Boolean)))],date:Number(x.date)||Date.now()});
  async function load(){
    try{
      const r=await supabaseClient.from('dictionary').select('id,word,meanings,date').order('date',{ascending:true});
      if(!r.error){const words=(r.data||[]).map(normalize).filter(x=>x.word);window.dictionary=words;window.localWords=words.slice();localStorage.setItem('dictionary',JSON.stringify(words));if(typeof window.showWords==='function')window.showWords(words);}
    }catch(e){}
  }
  const oldLogin=window.login;
  window.login=async function(){
    const mode=document.getElementById('passwordMode');
    const guest=document.getElementById('guestMode');
    if(mode){mode.style.display='none';mode.setAttribute('aria-hidden','true');}
    if(guest){guest.style.display='none';guest.setAttribute('aria-hidden','true');}
    const wrap=mode?.parentElement;
    if(wrap)wrap.style.display='none';
    const notice=document.querySelector('.login-box p[style*="font-size"]');
    if(notice)notice.style.display='none';
    if(oldLogin) await oldLogin();
  };
  setTimeout(()=>{
    const mode=document.getElementById('passwordMode'),guest=document.getElementById('guestMode');
    if(mode&&guest){mode.style.display='none';guest.style.display='none';if(mode.parentElement)mode.parentElement.style.display='none';}
    const ap=document.getElementById('accessPassword'), ae=document.getElementById('accessEnter');
    if(ap){ap.placeholder='Enter password';ap.style.direction='ltr';ap.style.textAlign='left';}
    if(ae)ae.textContent='Enter Dictionary';
  },50);
})();
