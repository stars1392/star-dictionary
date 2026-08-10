(() => {
  const sb = window.supabaseClient;
  if (!sb) return;
  let guestMode = false;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const normalizeWord = x => ({id:x.id,word:String(x.word||'').trim(),meanings:[...new Set((Array.isArray(x.meanings)?x.meanings:[x.meanings||'']).flatMap(m=>String(m).split(/[,،]/).map(v=>v.trim()).filter(Boolean)))],date:Number(x.date)||Date.now()});
  function status(msg,error=false){const e=document.getElementById('syncStatus');if(!e)return;e.textContent=msg;e.className='sync-status '+(error?'sync-error':'sync-ok');e.style.display='block';const c=document.getElementById('syncCount');if(c)c.textContent=error?'⚠️':'✓';}
  async function fetchCloud(){let last=null;for(let attempt=1;attempt<=3;attempt++){const {data,error}=await sb.from('dictionary').select('id,word,meanings,date').order('date',{ascending:true});if(!error)return(data||[]).map(normalizeWord).filter(x=>x.word);last=error;await wait(500*attempt);}throw last||new Error('Cloud read failed');}
  async function reliableLoad(){status('☁️ Loading words from Supabase...');try{let cloud=await fetchCloud();if(!cloud.length){await wait(700);cloud=await fetchCloud();}window.dictionary=cloud;localStorage.setItem('dictionary',JSON.stringify(cloud));window.localWords=cloud.slice();if(typeof window.showWords==='function')window.showWords(cloud);status('✓ Synced with Supabase — '+cloud.length+' words');return cloud;}catch(e){const cached=JSON.parse(localStorage.getItem('dictionary')||'[]');if(cached.length){window.dictionary=cached;if(typeof window.showWords==='function')window.showWords(cached);status('⚠️ Cloud unavailable — showing saved words',true);}else{window.dictionary=[];if(typeof window.showWords==='function')window.showWords([]);status('Cloud sync error: '+(e.message||e),true);}return window.dictionary;}}
  function setGuestUI(isGuest){guestMode=isGuest;document.body.classList.toggle('guest-mode',isGuest);const addCard=document.querySelector('.container > .card:first-child');if(addCard)addCard.style.display=isGuest?'none':'';let badge=document.getElementById('guestBadge');if(!badge){badge=document.createElement('span');badge.id='guestBadge';badge.style.cssText='display:inline-flex;align-items:center;padding:8px 12px;border-radius:999px;background:#fff3cd;color:#795600;font-size:12px;font-weight:700;margin-left:8px';const actions=document.querySelector('.header-actions');if(actions)actions.insertBefore(badge,actions.firstChild);}badge.textContent=isGuest?'👤 Guest — Read only':'🔐 Full access';badge.style.display='inline-flex';document.querySelectorAll('.word-actions').forEach(e=>e.style.display=isGuest?'none':'flex');}
  function showLogin(){
    guestMode=false;
    document.body.classList.remove('guest-mode');
    const app=document.getElementById('app'), login=document.getElementById('login');
    if(app) app.style.display='none';
    if(login) login.style.display='grid';
    const p=document.getElementById('password'), ap=document.getElementById('accessPassword'), err=document.getElementById('error');
    if(p) p.value='';
    if(ap) ap.value='';
    if(err) err.textContent='';
    const statusEl=document.getElementById('syncStatus');
    if(statusEl) statusEl.style.display='none';
    const badge=document.getElementById('guestBadge');
    if(badge) badge.style.display='none';
    if(typeof window.searchWord==='function'){const s=document.getElementById('search');if(s)s.value='';}
  }
  const loginBox=document.querySelector('.login-box');
  if(loginBox&&!document.getElementById('guestLoginBtn')){const btn=document.createElement('button');btn.id='guestLoginBtn';btn.textContent='👤 Continue as Guest';btn.style.background='linear-gradient(135deg,#64748b,#94a3b8)';btn.onclick=async()=>{document.getElementById('error').textContent='';document.getElementById('login').style.display='none';document.getElementById('app').style.display='block';setGuestUI(true);await reliableLoad();};loginBox.querySelector('button')?.after(btn);const hint=document.createElement('div');hint.style.cssText='margin-top:12px;color:var(--muted);font-size:12px;line-height:1.7';hint.textContent='🔐 Password: full access  •  👤 Guest: view and search only';loginBox.appendChild(hint);}
  window.login=async function(){const password=document.getElementById('password')?.value||'';if(password!=='stars1392'){document.getElementById('error').textContent='Incorrect password';return;}document.getElementById('error').textContent='';document.getElementById('login').style.display='none';document.getElementById('app').style.display='block';setGuestUI(false);await reliableLoad();document.getElementById('word')?.focus();};
  const originalAdd=window.addWord;window.addWord=async function(){if(guestMode)return toast('👤 Guest mode: adding words is disabled');return originalAdd.apply(this,arguments);};
  const originalEdit=window.editWord;window.editWord=async function(){if(guestMode)return toast('👤 Guest mode: editing is disabled');return originalEdit.apply(this,arguments);};
  const originalDelete=window.deleteWord;window.deleteWord=async function(){if(guestMode)return toast('👤 Guest mode: deleting is disabled');return originalDelete.apply(this,arguments);};
  const originalMove=window.moveWord;window.moveWord=async function(){if(guestMode)return toast('👤 Guest mode: reordering is disabled');return originalMove.apply(this,arguments);};
  window.logout=showLogin;
  const style=document.createElement('style');style.textContent='#guestBadge{direction:ltr}.guest-mode .add-btn,.guest-mode #word,.guest-mode #meaning{display:none!important}';document.head.appendChild(style);
})();
