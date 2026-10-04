(() => {
  const PASSWORD = atob('c3RhcnMxMzky');
  const loginPage = document.getElementById('login'), app = document.getElementById('app');
  if (!loginPage || !app) return;
  const box = loginPage.querySelector('.login-box');
  const error = document.getElementById('error');
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const normalize=x=>({id:x.id,word:String(x.word||'').trim(),meanings:[...new Set((Array.isArray(x.meanings)?x.meanings:[x.meanings||'']).flatMap(m=>String(m).split(/[,،]/).map(v=>v.trim()).filter(Boolean)))],date:Number(x.date)||Date.now()});

  function datasetName(){
    if(window.activeDictionaryTable === 'grammar') return 'Grammar';
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

  const grammarData={
    Present:[
      ['Present Simple',
       'Form: I/You/We/They + base verb | He/She/It + verb-s/es',
       'Uses: habits and routines; repeated actions; facts and general truths; permanent or long-term situations; schedules and timetables. For he/she/it, add -s or -es (study → studies, watch → watches, go → goes). Use do/does for questions and do not/does not for negatives. Stative verbs such as know, like, believe and understand are usually used in the simple form.',
       'Keywords: always, usually, often, sometimes, rarely, never, every day/week/year, on Mondays. Positive: She studies English every day. Negative: She does not study English on Fridays. Question: Does she study English every day? Short answer: Yes, she does. / No, she does not.'],
      ['Present Continuous',
       'Form: am/is/are + verb-ing',
       'Uses: actions happening now; temporary situations around the present; changing or developing situations; repeated temporary actions, especially with always; fixed future arrangements. Spelling: make → making, run → running, lie → lying. Some stative verbs are normally not used in the continuous form.',
       'Keywords: now, right now, at the moment, currently, today, this week, these days. Positive: She is studying now. Negative: She is not studying now. Question: Is she studying now? Short answer: Yes, she is. / No, she is not.'],
      ['Present Perfect',
       'Form: have/has + past participle (V3)',
       'Uses: a past action with a present result; life experiences when the exact time is not important; actions in an unfinished time period; situations that started in the past and continue now. Do not normally use the present perfect with a finished past time such as yesterday, last year or in 2020.',
       'Keywords: already, just, yet, ever, never, recently, lately, so far, until now, since, for. Positive: I have finished my homework. Negative: I have not finished my homework. Question: Have you finished your homework? Short answer: Yes, I have. / No, I have not.'],
      ['Present Perfect Continuous',
       'Form: have/has + been + verb-ing',
       'Uses: an activity that started in the past and continues until now; or an activity that recently stopped but has a visible present result. It emphasizes duration or the activity itself. With state verbs, the present perfect simple is usually preferred.',
       'Keywords: since, for, all day, all morning, lately, recently, how long. Positive: They have been studying for two hours. Negative: They have not been studying for two hours. Question: Have they been studying for two hours? Short answer: Yes, they have. / No, they have not.']
    ],
    Past:[
      ['Past Simple',
       'Form: subject + past form (V2) | regular verbs: verb + -ed | irregular verbs have special forms',
       'Uses: completed actions at a definite time in the past; a sequence of finished events; past habits or situations. In questions use did + base verb, not V2. In negatives use did not + base verb.',
       'Keywords: yesterday, last night/week/year, ago, in 2020, when I was young. Positive: I visited Tehran last week. Negative: I did not visit Tehran last week. Question: Did you visit Tehran last week? Short answer: Yes, I did. / No, I did not.'],
      ['Past Continuous',
       'Form: was/were + verb-ing',
       'Uses: an action in progress at a specific past time; a longer background action interrupted by a shorter action; two actions happening at the same time; setting the background in a story. Use when for an interrupting event and while for an action in progress.',
       'Keywords: while, when, at 8 p.m., at that moment, all evening. Positive: I was studying at 8 p.m. Negative: I was not studying at 8 p.m. Question: Were you studying at 8 p.m.? Short answer: Yes, I was. / No, I was not.'],
      ['Past Perfect',
       'Form: had + past participle (V3)',
       'Uses: an action that happened before another past action or past time. It helps make the order of two past events clear. The earlier event uses past perfect; the later event can use past simple. Common connectors include before, after and by the time.',
       'Keywords: before, after, by the time, already, just, never, until then. Positive: She had left before I arrived. Negative: She had not left before I arrived. Question: Had she left before you arrived? Short answer: Yes, she had. / No, she had not.'],
      ['Past Perfect Continuous',
       'Form: had + been + verb-ing',
       'Uses: an activity that continued for a period before another past event or time. It emphasizes duration or the ongoing activity and often explains a past result or situation. Compare it with past perfect simple, which emphasizes completion.',
       'Keywords: for, since, all day, before, until, by the time. Positive: He had been working for three hours before lunch. Negative: He had not been working for three hours before lunch. Question: Had he been working for three hours before lunch? Short answer: Yes, he had. / No, he had not.']
    ],
    Future:[
      ['Future Simple',
       'Form: will + base verb',
       'Uses: predictions and opinions about the future; promises; offers; spontaneous decisions made while speaking; future facts. Use will not/won’t for negatives and will + subject for questions. For planned arrangements, English often uses other future forms such as present continuous.',
       'Keywords: tomorrow, next week/month, soon, later, I think, probably, maybe, I am sure. Positive: I will call you tomorrow. Negative: I will not call you tomorrow. Question: Will you call me tomorrow? Short answer: Yes, I will. / No, I will not.'],
      ['Future Continuous',
       'Form: will be + verb-ing',
       'Uses: an action that will be in progress at a particular future time; an expected activity as part of a normal plan; polite questions about someone’s plans. It focuses on an activity in progress rather than a completed result.',
       'Keywords: this time tomorrow, at 8 p.m. tomorrow, all day tomorrow, next week at this time. Positive: I will be studying at 8 p.m. Negative: I will not be studying at 8 p.m. Question: Will you be studying at 8 p.m.? Short answer: Yes, I will. / No, I will not.'],
      ['Future Perfect',
       'Form: will have + past participle (V3)',
       'Uses: an action that will be completed before a specific future time or another future event. The focus is on the result or completion by that future point. It is often used with by and by the time.',
       'Keywords: by, by then, by the time, before, by Friday, by next year. Positive: She will have finished by Friday. Negative: She will not have finished by Friday. Question: Will she have finished by Friday? Short answer: Yes, she will. / No, she will not.'],
      ['Future Perfect Continuous',
       'Form: will have been + verb-ing',
       'Uses: an activity that will continue for a period up to a particular future time. It emphasizes duration rather than completion. It is especially useful when answering “How long?” about a future point.',
       'Keywords: for, since, by the time, by next year, for two hours, for five years. Positive: By June, I will have been learning English for a year. Negative: By June, I will not have been learning English for a year. Question: Will you have been learning English for a year by June? Short answer: Yes, I will. / No, I will not.']
    ]
  };
  function showGrammar(){
    window.activeDictionaryTable='grammar';
    updateDatasetLabels();
    loginPage.style.display='none';app.style.display='none';
    const g=document.getElementById('grammarApp');if(!g)return;
    g.style.display='block';
    const content=document.getElementById('grammarContent');
    content.innerHTML=Object.entries(grammarData).map(([group,notes])=>'<section class="grammar-section"><h2>'+group+'</h2><div class="grammar-grid">'+notes.map(n=>'<article class="grammar-note"><h3>'+n[0]+'</h3><div class="formula">'+n[1]+'</div><p>'+n[2]+'</p><div class="example">'+n[3]+'</div></article>').join('')+'</div></section>').join('');
    window.scrollTo(0,0);
  }
  function hideGrammar(){
    const g=document.getElementById('grammarApp');if(g)g.style.display='none';
    loginPage.style.display='grid';
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
      overlay.innerHTML='<div class="login-box" style="width:min(520px,100%);margin:auto"><div class="logo">📚</div><h1>Switch Section</h1><p>Choose what you want to open.</p><div style="display:grid;gap:12px;margin-top:22px"><button type="button" id="switchBasic">📘 Basic Words</button><button type="button" id="switch504">📗 504 Words</button><button type="button" id="switchGrammar">📚 Grammar</button><button type="button" id="cancelSwitch" style="background:#475569">Cancel</button></div></div>';
      document.body.appendChild(overlay);
      overlay.querySelector('#switchBasic').onclick=()=>selectDataset('dictionary',true);
      overlay.querySelector('#switch504').onclick=()=>selectDataset('dictionary_504',true);
      overlay.querySelector('#switchGrammar').onclick=()=>{overlay.remove();window.activeDictionaryTable='grammar';selected=true;showAccess()};
      overlay.querySelector('#cancelSwitch').onclick=()=>overlay.remove();
      return;
    }
    const chooser=document.createElement('div');
    chooser.setAttribute('data-access-ui','1');
    chooser.innerHTML='<p data-access-ui="1" style="margin:18px 0 8px;font-weight:700;color:var(--text)">Choose your word list</p><div data-access-ui="1" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px"><button type="button" id="basicDataset">📘 Basic Words</button><button type="button" id="dataset504" style="background:linear-gradient(135deg,#d59b18,#e8b43c)">📗 504 Words</button><button type="button" id="grammarDataset" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">📚 Grammar</button></div>';
    box.insertBefore(chooser,error);
    document.getElementById('grammarBack')?.addEventListener('click',()=>{hideGrammar();showDatasetChooser()});
    chooser.querySelector('#basicDataset').onclick=()=>selectDataset('dictionary',false);
    chooser.querySelector('#dataset504').onclick=()=>selectDataset('dictionary_504',false);
    chooser.querySelector('#grammarDataset').onclick=()=>{window.activeDictionaryTable='grammar';selected=true;showAccess()};
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
    if(window.activeDictionaryTable==='grammar'){
      document.body.classList.add('guest-mode');
      showGrammar();
      return;
    }
    loginPage.style.display='none';app.style.display='block';document.body.classList.add('guest-mode');
    await cloudLoad();lockEditing();addSwitchButton();
    const s=document.getElementById('syncStatus');
    if(s){s.textContent='👤 Guest mode: viewing and searching only';s.className='sync-status sync-ok';s.style.display='block'}
  }
  async function enterPassword(){
    if(document.getElementById('accessPassword').value!==PASSWORD){error.textContent='Incorrect password';return}
    if(window.activeDictionaryTable==='grammar'){
      document.body.classList.remove('guest-mode');
      showGrammar();
      return;
    }
    loginPage.style.display='none';app.style.display='block';document.body.classList.remove('guest-mode');
    await cloudLoad();unlockEditing();addSwitchButton();document.getElementById('word')?.focus();
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

  document.getElementById('grammarBack')?.addEventListener('click',hideGrammar);
  document.getElementById('grammarBasic')?.addEventListener('click',()=>{hideGrammar();selectDataset('dictionary',false)});
  document.getElementById('grammar504')?.addEventListener('click',()=>{hideGrammar();selectDataset('dictionary_504',false)});

  // Always choose the dictionary first when the site opens.
  localStorage.removeItem('star_dictionary_guest_v1');
  localStorage.removeItem('sd_session');
  window.activeDictionaryTable='dictionary';
  updateDatasetLabels();
  showDatasetChooser();
})();