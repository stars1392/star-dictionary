(() => {
  const GUEST_KEY='star_dictionary_guest_v1';
  const THEME_KEY='star_dictionary_theme';
  const FAV_KEY='star_dictionary_favorites_v1';
  const getFav=()=>JSON.parse(localStorage.getItem(FAV_KEY)||'[]');
  const setFav=a=>localStorage.setItem(FAV_KEY,JSON.stringify(a));
  const $=id=>document.getElementById(id);
  const style=document.createElement('style');
  style.textContent=`
    .sdplus{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.sdplus button{flex:1;min-width:120px}
    .guest-banner{margin:10px 0;padding:10px 13px;border-radius:13px;background:#fff4d6;color:#765300;font-size:12px;text-align:center}.dark .guest-banner,body.dark .guest-banner{background:#3a3019;color:#f7d879}
    .favorite-btn{background:transparent!important;color:#d59b18!important;box-shadow:none!important;padding:5px 8px!important;font-size:18px!important}.favorite-btn.active{filter:drop-shadow(0 2px 4px #d59b1855)}
    .word-of-day{background:linear-gradient(135deg,#fff8dc,#fff);border:1px solid #e8c45a;padding:14px 16px;border-radius:18px;margin:10px 0;display:none}.dark .word-of-day,body.dark .word-of-day{background:linear-gradient(135deg,#332c18,#1b292b)}
    .backup-input{display:none}.login-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.login-modes button{margin-top:0!important}.secondary-mode{background:linear-gradient(135deg,#475569,#64748b)!important}
    .sd-modal{position:fixed;inset:0;z-index:500;display:none;place-items:center;padding:18px;background:#0009}.sd-modal.open{display:grid}.sd-modal-box{width:min(520px,100%);max-height:90vh;overflow:auto;background:var(--card);color:var(--text);border-radius:24px;padding:22px;box-shadow:0 25px 90px #0008}.sd-modal-box h2{margin-top:0}.sd-modal-box button{margin:4px}.shortcut{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);color:var(--muted)}kbd{padding:2px 7px;border:1px solid var(--border);border-radius:6px;background:var(--soft);color:var(--text)}
  `;document.head.appendChild(style);

  function makeModal(){
    if($('sdPlusModal'))return;
    const m=document.createElement('div');m.id='sdPlusModal';m.className='sd-modal';m.innerHTML=`<div class="sd-modal-box" dir="rtl"><h2>⚙️ امکانات بیشتر</h2><div class="shortcut"><span>جستجوی سریع</span><kbd>Ctrl + K</kbd></div><div class="shortcut"><span>پاک کردن جستجو</span><kbd>Esc</kbd></div><div class="shortcut"><span>ذخیره/اجرای فرم</span><kbd>Enter</kbd></div><hr><button id="sdExport">📤 خروجی پشتیبان</button><button id="sdImportBtn">📥 بازیابی پشتیبان</button><input id="sdImport" class="backup-input" type="file" accept="application/json"><button id="sdHelp">❓ راهنما</button><button id="sdClose">بستن</button><p id="sdPlusMsg" style="color:var(--muted);font-size:12px"></p></div>`;document.body.appendChild(m);
    $('sdClose').onclick=()=>m.classList.remove('open');$('sdImportBtn').onclick=()=>$('sdImport').click();$('sdHelp').onclick=()=>alert('⭐ برای علاقه‌مندی‌ها روی ستاره هر کلمه بزن.\n🔎 Ctrl+K جستجو را باز می‌کند.\n📤 از اطلاعاتت نسخه پشتیبان بگیر.\n📥 نسخه پشتیبان را در هر دستگاه بازیابی کن.');
    $('sdExport').onclick=()=>{const data={version:1,exportedAt:new Date().toISOString(),dictionary:window.dictionary||JSON.parse(localStorage.getItem('dictionary')||'[]'),favorites:getFav()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='star-dictionary-backup.json';a.click();URL.revokeObjectURL(a.href);$('sdPlusMsg').textContent='✅ نسخه پشتیبان ساخته شد.'};
    $('sdImport').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.dictionary))throw Error();localStorage.setItem('dictionary',JSON.stringify(d.dictionary));if(Array.isArray(d.favorites))setFav(d.favorites);$('sdPlusMsg').textContent='✅ بازیابی شد؛ صفحه در حال تازه‌سازی است...';setTimeout(()=>location.reload(),500)}catch{ $('sdPlusMsg').textContent='❌ فایل پشتیبان معتبر نیست.' }};
  }

  function addLoginModes(){
    const box=document.querySelector('.login-box');if(!box||$('guestBtn'))return;
    const enter=box.querySelector('button');if(!enter)return;
    const wrap=document.createElement('div');wrap.className='login-modes';
    const guest=document.createElement('button');guest.id='guestBtn';guest.className='secondary-mode';guest.textContent='👤 ورود به عنوان مهمان';guest.onclick=guestLogin;
    enter.parentNode.insertBefore(wrap,enter);wrap.appendChild(enter);wrap.appendChild(guest);enter.textContent='🔐 ورود با رمز';
    const note=document.createElement('p');note.id='loginNote';note.style.cssText='font-size:12px;color:var(--muted)';note.textContent='مهمان فقط می‌تواند کلمات را ببیند و جستجو کند.';box.appendChild(note);
  }
  function setGuestUI(on){
    const add=document.querySelector('.container > .card:first-child'); if(add)add.style.display=on?'none':'';
    document.querySelectorAll('.word-actions button').forEach(b=>b.disabled=on);
    let h=$('guestBanner');if(on&&!h){h=document.createElement('div');h.id='guestBanner';h.className='guest-banner';h.textContent='👤 حالت مهمان: فقط مشاهده و جستجو مجاز است.';const app=$('app');app?.prepend(h)}else if(!on&&h)h.remove();
  }
  function guestLogin(){localStorage.setItem(GUEST_KEY,'1');localStorage.setItem('sd_session','guest');if(typeof window.login==='function'){const old=window.login;try{old('__guest__')}catch{}};showAppGuest();}
  function showAppGuest(){const l=$('login'),a=$('app');if(l)l.style.display='none';if(a)a.style.display='block';setGuestUI(true);if(typeof window.loadWords==='function')window.loadWords();else if(typeof window.fetchWords==='function')window.fetchWords();if(typeof window.render==='function')window.render();}
  function patchLogout(){
    const original=window.logout;
    window.logout=function(){localStorage.removeItem(GUEST_KEY);localStorage.removeItem('sd_session');localStorage.removeItem('dictionary_guest');setGuestUI(false);if(typeof original==='function'){try{original()}catch{}}const l=$('login'),a=$('app');if(l)l.style.display='grid';if(a)a.style.display='none';const p=$('password');if(p){p.value='';setTimeout(()=>p.focus(),80)}window.scrollTo(0,0)};
  }
  function theme(){const dark=localStorage.getItem(THEME_KEY)==='dark';document.body.classList.toggle('dark',dark);const b=$('themeBtn');if(b){b.textContent=dark?'☀️':'🌙';b.title=dark?'Light mode':'Dark mode'}}
  function patchTheme(){window.toggleTheme=function(){const dark=!document.body.classList.contains('dark');localStorage.setItem(THEME_KEY,dark?'dark':'light');theme()};theme()}

  function addTools(){
    const header=document.querySelector('.header-actions');if(!header||$('sdMoreBtn'))return;const b=document.createElement('button');b.id='sdMoreBtn';b.className='icon-btn';b.textContent='⚙️';b.title='More tools';b.onclick=()=>{$('sdPlusModal').classList.add('open')};header.insertBefore(b,header.firstChild);
    const card=document.querySelector('.container > .card:first-child');if(card&&!$('sdPlusActions')){const d=document.createElement('div');d.id='sdPlusActions';d.className='sdplus';d.innerHTML='<button id="sdBackup">📤 پشتیبان</button><button id="sdFavorites">⭐ علاقه‌مندی‌ها</button>';card.appendChild(d);$('sdBackup').onclick=()=>$('sdExport').click();$('sdFavorites').onclick=()=>{const s=$('search');if(s){s.value='★';if(typeof window.searchWord==='function')window.searchWord()}}}
    const list=$('list');if(list&&!$('sdWordOfDay')){const w=document.createElement('div');w.id='sdWordOfDay';w.className='word-of-day';list.parentNode.insertBefore(w,list)}
  }
  function decorateWords(){
    const list=$('list');if(!list)return;const fav=getFav();list.querySelectorAll('.word').forEach((el,i)=>{if(el.querySelector('.favorite-btn'))return;const title=el.querySelector('h3');if(!title)return;const word=title.textContent.trim();const actions=el.querySelector('.word-actions');if(!actions)return;const b=document.createElement('button');b.className='favorite-btn '+(fav.includes(word)?'active':'');b.title='Favorite';b.textContent=fav.includes(word)?'★':'☆';b.onclick=e=>{e.stopPropagation();let a=getFav();a=a.includes(word)?a.filter(x=>x!==word):[...a,word];setFav(a);b.classList.toggle('active',a.includes(word));b.textContent=a.includes(word)?'★':'☆';toast(a.includes(word)?'⭐ به علاقه‌مندی‌ها اضافه شد':'از علاقه‌مندی‌ها حذف شد')};actions.prepend(b)})
  }
  function wordOfDay(){const list=$('list');if(!list||!window.dictionary?.length)return;const d=new Date();const idx=(d.getFullYear()*372+d.getMonth()*31+d.getDate())%window.dictionary.length;const x=window.dictionary[idx];const box=$('sdWordOfDay');if(box){box.style.display='block';box.innerHTML=`<b>🌟 کلمه امروز</b> — <span dir="ltr">${String(x.word).replace(/</g,'&lt;')}</span> <span class="muted">${x.meanings?.join('، ')||''}</span>`}}
  function observe(){const list=$('list');if(!list)return;new MutationObserver(()=>{decorateWords();wordOfDay()}).observe(list,{childList:true,subtree:true});decorateWords();wordOfDay()}
  function shortcuts(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key.toLowerCase()==='k'){e.preventDefault();const s=$('search');if(s){s.focus();s.select()}}if(e.key==='Escape'&&document.activeElement===$('search')){if(typeof window.clearSearch==='function')window.clearSearch();else $('search').value='';}})}
  function boot(){makeModal();addLoginModes();patchLogout();patchTheme();addTools();shortcuts();observe();if(localStorage.getItem(GUEST_KEY)==='1')showAppGuest();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
