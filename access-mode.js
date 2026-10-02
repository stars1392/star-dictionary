(() => {
  const PASSWORD = atob('c3RhcnMxMzky');
  const loginPage = document.getElementById('login'), app = document.getElementById('app');
  if (!loginPage || !app) return;
  const box = loginPage.querySelector('.login-box');
  const oldInput = document.getElementById('password');
  const oldButton = oldInput?.nextElementSibling;
  const error = document.getElementById('error');

  const modeWrap = document.createElement('div');
  modeWrap.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:22px 0 10px';
  modeWrap.innerHTML='<button type="button" id="passwordMode">🔐 Login with Password</button><button type="button" id="guestBtn" style="background:linear-gradient(135deg,#475569,#64748b)">👤 Guest Login</button>';
  oldInput?.remove(); oldButton?.remove(); box.insertBefore(modeWrap,error);

  const passArea=document.createElement('div');
  passArea.innerHTML='<input id="accessPassword" type="password" placeholder="Password" autocomplete="current-password"><button id="accessEnter" type="button" style="width:100%;margin-top:8px">Enter Dictionary</button>';
  box.insertBefore(passArea,error);

  const guestNotice=document.createElement('p');
  guestNotice.textContent='Guest mode allows viewing and searching words only.';
  guestNotice.style.cssText='font-size:12px;background:var(--soft);padding:10px;border-radius:12px;display:none';
  box.insertBefore(guestNotice,error);

  let mode='password';
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const normalize=x=>({id:x.id,word:String(x.word||'').trim(),meanings:[...new Set((Array.isArray(x.meanings)?x.meanings:[x.meanings||'']).flatMap(m=>String(m).split(/[,،]/).map(v=>v.trim()).filter(Boolean)))],date:Number(x.date)||Date.now()});

  function setMode(m){
    mode=m;
    passArea.style.display=m==='password'?'block':'none';
    guestNotice.style.display=m==='guest'?'block':'none';
    error.textContent='';
    document.getElementById('passwordMode').style.opacity=m==='password'?'1':'.55';
    document.getElementById('guestBtn').style.opacity=m==='guest'?'1':'.55';
  }

  async function cloudLoad(){
    const status=document.getElementById('syncStatus');
    const setStatus=(msg,bad=false)=>{
      if(!status)return;
      status.textContent=msg;
      status.className='sync-status '+(bad?'sync-error':'sync-ok');
      status.style.display='block';
      const c=document.getElementById('syncCount'); if(c)c.textContent=bad?'⚠️':'✓';
    };
    setStatus('☁️ Loading words from Supabase...');
    let lastError=null;
    for(let attempt=1;attempt<=3;attempt++){
      try{
        const result=await supabaseClient.from('dictionary').select('id,word,meanings,date').order('date',{ascending:true});
        if(!result.error){
          const words=(result.data||[]).map(normalize).filter(x=>x.word);
          dictionary=words; localWords=words.slice();
          localStorage.setItem('dictionary',JSON.stringify(words));
          showWords();
          setStatus('✓ Synced with Supabase — '+words.length+' words');
          return true;
        }
        lastError=result.error;
      }catch(e){lastError=e;}
      await wait(700*attempt);
    }
    const cached=JSON.parse(localStorage.getItem('dictionary')||'[]');
    dictionary=cached.map(normalize); localWords=dictionary.slice(); showWords();
    setStatus('⚠️ Supabase connection error: '+(lastError?.message||'unknown error'),true);
    return false;
  }

  function lockEditing(){
    document.querySelectorAll('#word,#meaning,.add-btn,#sort').forEach(e=>{
      e.disabled=true;
      e.setAttribute('readonly','readonly');
      e.setAttribute('tabindex','-1');
    });
    document.querySelectorAll('#list .word-actions').forEach(e=>e.style.display='none');
  }

  function unlockEditing(){
    document.querySelectorAll('#word,#meaning,.add-btn,#sort').forEach(e=>{
      e.disabled=false;
      e.removeAttribute('readonly');
      e.removeAttribute('tabindex');
    });
    document.querySelectorAll('#list .word-actions').forEach(e=>e.style.display='flex');
  }

  async function enterGuest(){
    loginPage.style.display='none';
    app.style.display='block';
    document.body.classList.add('guest-mode');
    setMode('guest');
    await cloudLoad();
    lockEditing();
    const s=document.getElementById('syncStatus');
    if(s){s.textContent='👤 Guest mode: viewing and searching only';s.className='sync-status sync-ok';s.style.display='block';}
  }

  async function enterPassword(){
    if(document.getElementById('accessPassword').value!==PASSWORD){
      error.textContent='Incorrect password';
      return;
    }
    loginPage.style.display='none';
    app.style.display='block';
    document.body.classList.remove('guest-mode');
    await cloudLoad();
    unlockEditing();
    document.getElementById('word')?.focus();
  }

  document.getElementById('passwordMode').onclick=()=>{
    setMode('password');
    document.getElementById('accessPassword').focus();
  };
  document.getElementById('guestBtn').onclick=enterGuest;
  document.getElementById('accessEnter').onclick=enterPassword;
  document.getElementById('accessPassword').addEventListener('keydown',e=>{if(e.key==='Enter')enterPassword();});

  window.enterGuest=enterGuest;
  window.login=()=>{setMode('password');document.getElementById('accessPassword').focus();};
  window.logout=()=>location.reload();

  const style=document.createElement('style');
  style.textContent='.guest-mode .word-actions{display:none!important}.guest-mode #sort{display:none!important}.guest-mode #word,.guest-mode #meaning{pointer-events:none!important;user-select:none!important}';
  document.head.appendChild(style);

  setMode('password');
})();