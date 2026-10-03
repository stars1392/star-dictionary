(() => {
  const PASSWORD = atob('c3RhcnMxMzky');
  const loginPage = document.getElementById('login'), app = document.getElementById('app');
  if (!loginPage || !app) return;
  const box = loginPage.querySelector('.login-box');
  const error = document.getElementById('error');
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const normalize=x=>({id:x.id,word:String(x.word||'').trim(),meanings:[...new Set((Array.isArray(x.meanings)?x.meanings:[x.meanings||'']).flatMap(m=>String(m).split(/[,،]/).map(v=>v.trim()).filter(Boolean)))],date:Number(x.date)||Date.now()});

  function datasetName(){
    return window.activeDictionaryTable === 'dictionary_504' ? '504 Words' : 'Basic Words';
  }
  function datasetStorageKey(){
    return window.activeDictionaryTable === 'dictionary_504' ? 'dictionary_504' : 'dictionary';
  }
  function updateDatasetLabels(){
    const name=datasetName();
    const brand=document.querySelector('.brand-text h1');
    if(brand) brand.textContent='Star Dictionary • '+name;
    const hero=document.querySelector('.hero-card h2');
    if(hero) hero.textContent='📖 '+name+' Dictionary';
  }

  let mode='password';
  let selected=false;

  function clearBox(){
    box.querySelectorAll('[data-access-ui]').forEach(e=>e.remove());
  }

  function showDatasetChooser({inside=false}={}){
    clearBox();
    if(inside){
      loginPage.style.display='none';
      app.style.display='block';
      let old=document.getElementById('dictionarySwitcher');
      if(old)old.remove();
      const overlay=document.createElement('div');
      overlay.id='dictionarySwitcher';
      overlay.setAttribute('data-access-ui','1');
      overlay.style.cssText='position:fixed;inset:0;z-index:300;background:#0008;display:grid;place-items:center;padding:20px;backdrop-filter:blur(8px)';
      overlay.innerHTML='<div class="login-box" style="width:min(520px,100%);margin:auto"><div class="logo">📚</div><h1>Switch Dictionary</h1><p>Choose which word list you want to use.</p><div style="display:grid;gap:12px;margin-top:22px"><button type="button" id="switchBasic">📘 Basic Words</button><button type="button" id="switch504" style="background:linear-gradient(135deg,#d59b18,#e8b43c)">📗 504 Words</button><button type="button" id="cancelSwitch" style="background:#475569">Cancel</button></div></div>';
      document.body.appendChild(overlay);
      overlay.querySelector('#switchBasic').onclick=()=>selectDataset('dictionary',true);
      overlay.querySelector('#switch504').onclick=()=>selectDataset('dictionary_504',true);
      overlay.querySelector('#cancelSwitch').onclick=()=>overlay.remove();
      return;
    }
    const chooser=document.createElement('div');
    chooser.setAttribute('data-access-ui','1');
    chooser.innerHTML='<p data-access-ui="1" style="margin:18px 0 8px;font-weight:700;color:var(--text)">Choose your word list</p><div data-access-ui="1" style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button type="button" id="basicDataset">📘 Basic Words</button><button type="button" id="dataset504" style="background:linear-gradient(135deg,#d59b18,#e8b43c)">📗 504 Words</button></div>';
    box.insertBefore(chooser,error);
    chooser.querySelector('#basicDataset').onclick=()=>selectDataset('dictionary',false);
    chooser.querySelector('#dataset504').onclick=()=>selectDataset('dictionary_504',false);
    error.textContent='';
    selected=false;
  }

  function showAccess(){
    clearBox();
    const title=document.createElement('p');
    title.setAttribute('data-access-ui','1');
    title.style.cssText='margin:18px 0 8px;font-weight:700;color:var(--text)';
    title.textContent='Selected: '+datasetName();
    box.insertBefore(title,error);

    const modeWrap=document.createElement('div');
    modeWrap.setAttribute('data-access-ui','1');
    modeWrap.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0 10px';
    modeWrap.innerHTML='<button type="button" id="passwordMode">🔐 Login with Password</button><button type="button" id="guestBtn" style="background:linear-gradient(135deg,#475569,#64748b)">👤 Guest Login</button>';
    box.insertBefore(modeWrap,error);

    const passArea=document.createElement('div');
    passArea.setAttribute('data-access-ui','1');
    passArea.innerHTML='<input id="accessPassword" type="password" placeholder="Password" autocomplete="current-password"><button id="accessEnter" type="button" style="width:100%;margin-top:8px">Enter Dictionary</button>';
    box.insertBefore(passArea,error);

    const guestNotice=document.createElement('p');
    guestNotice.setAttribute('data-access-ui','1');
    guestNotice.textContent='Guest mode allows viewing and searching words only.';
    guestNotice.style.cssText='font-size:12px;background:var(--soft);padding:10px;border-radius:12px;display:none';
    box.insertBefore(guestNotice,error);

    function setMode(m){
      mode=m;
      passArea.style.display=m==='password'?'block':'none';
      guestNotice.style.display=m==='guest'?'block':'none';
      error.textContent='';
      document.getElementById('passwordMode').style.opacity=m==='password'?'1':'.55';
      document.getElementById('guestBtn').style.opacity=m==='guest'?'1':'.55';
    }

    document.getElementById('passwordMode').onclick=()=>{setMode('password');document.getElementById('accessPassword').focus()};
    document.getElementById('guestBtn').onclick=enterGuest;
    document.getElementById('accessEnter').onclick=enterPassword;
    document.getElementById('accessPassword').addEventListener('keydown',e=>{if(e.key==='Enter')enterPassword()});
    setMode('password');
  }

  async function cloudLoad(){
    const status=document.getElementById('syncStatus');
    const setStatus=(msg,bad=false)=>{
      if(!status)return;
      status.textContent=msg;
      status.className='sync-status '+(bad?'sync-error':'sync-ok');
      status.style.display='block';
      const c=document.getElementById('syncCount');if(c)c.textContent=bad?'⚠️':'✓';
    };
    setStatus('☁️ Loading '+datasetName()+' from Supabase...');
    let lastError=null;
    for(let attempt=1;attempt<=3;attempt++){
      try{
        const result=await supabaseClient.from(window.activeDictionaryTable).select('id,word,meanings,date').order('date',{ascending:true});
        if(!result.error){
          const words=(result.data||[]).map(normalize).filter(x=>x.word);
          dictionary=words;localWords=words.slice();
          localStorage.setItem(datasetStorageKey(),JSON.stringify(words));
          showWords();
          setStatus('✓ Synced — '+words.length+' words');
          return true;
        }
        lastError=result.error;
      }catch(e){lastError=e}
      await wait(700*attempt);
    }
    const cached=JSON.parse(localStorage.getItem(datasetStorageKey())||'[]');
    dictionary=cached.map(normalize);localWords=dictionary.slice();showWords();
    setStatus('⚠️ Supabase connection error: '+(lastError?.message||'unknown error'),true);
    return false;
  }

  function lockEditing(){
    document.querySelectorAll('#word,#meaning,.add-btn,#sort').forEach(e=>{e.disabled=true;e.setAttribute('readonly','readonly');e.setAttribute('tabindex','-1')});
    document.querySelectorAll('#list .word-actions').forEach(e=>e.style.display='none');
  }
  function unlockEditing(){
    document.querySelectorAll('#word,#meaning,.add-btn,#sort').forEach(e=>{e.disabled=false;e.removeAttribute('readonly');e.removeAttribute('tabindex')});
    document.querySelectorAll('#list .word-actions').forEach(e=>e.style.display='flex');
  }

  async function enterGuest(){
    loginPage.style.display='none';app.style.display='block';document.body.classList.add('guest-mode');
    await cloudLoad();lockEditing();
    const s=document.getElementById('syncStatus');
    if(s){s.textContent='👤 Guest mode: viewing and searching only';s.className='sync-status sync-ok';s.style.display='block'}
  }
  async function enterPassword(){
    if(document.getElementById('accessPassword').value!==PASSWORD){error.textContent='Incorrect password';return}
    loginPage.style.display='none';app.style.display='block';document.body.classList.remove('guest-mode');
    await cloudLoad();unlockEditing();document.getElementById('word')?.focus();
  }

  function addSwitchButton(){
    const header=document.querySelector('.header-actions');
    if(!header||document.getElementById('switchDictionaryBtn'))return;
    const b=document.createElement('button');
    b.id='switchDictionaryBtn';b.className='icon-btn';b.textContent='📚';b.title='Switch Dictionary';
    b.onclick=()=>showDatasetChooser({inside:true});
    header.insertBefore(b,header.firstChild);
  }

  async function selectDataset(table,inside){
    const wasGuest=document.body.classList.contains('guest-mode');
    window.activeDictionaryTable=table;
    localStorage.setItem('star_active_dictionary',table);
    selected=true;
    document.body.classList.remove('guest-mode');
    updateDatasetLabels();
    if(inside){
      const overlay=document.getElementById('dictionarySwitcher');if(overlay)overlay.remove();
      dictionary=[];localWords=JSON.parse(localStorage.getItem(datasetStorageKey())||'[]');
      await cloudLoad();
      if(wasGuest){
        document.body.classList.add('guest-mode');
        lockEditing();
      }else{
        unlockEditing();
      }
      return;
    }
    showAccess();
  }

  window.enterGuest=enterGuest;
  window.login=()=>{if(!selected){showDatasetChooser();return}showAccess();document.getElementById('accessPassword')?.focus()};
  window.logout=()=>location.reload();

  window.showDictionaryChooser=()=>showDatasetChooser({inside:true});

  const style=document.createElement('style');
  style.textContent='.guest-mode .word-actions{display:none!important}.guest-mode #sort{display:none!important}.guest-mode #word,.guest-mode #meaning{pointer-events:none!important;user-select:none!important}#dictionarySwitcher .login-box{animation:rise .25s ease}';
  document.head.appendChild(style);

  // Always choose the dictionary first when the site opens.
  localStorage.removeItem('star_dictionary_guest_v1');
  localStorage.removeItem('sd_session');
  window.activeDictionaryTable='dictionary';
  updateDatasetLabels();
  showDatasetChooser();
})();