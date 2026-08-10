(() => {
  const PASSWORD = 'stars1392';
  const loginPage = document.getElementById('login');
  const app = document.getElementById('app');
  if (!loginPage || !app) return;

  const box = loginPage.querySelector('.login-box');
  const oldInput = document.getElementById('password');
  const oldButton = oldInput?.nextElementSibling;
  const error = document.getElementById('error');

  const modeWrap = document.createElement('div');
  modeWrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:22px 0 10px';
  modeWrap.innerHTML = '<button type="button" id="passwordMode">🔐 ورود با رمز</button><button type="button" id="guestMode" style="background:linear-gradient(135deg,#475569,#64748b)">👤 ورود مهمان</button>';
  oldInput?.remove(); oldButton?.remove();
  box.insertBefore(modeWrap, error);

  const passArea = document.createElement('div');
  passArea.innerHTML = '<input id="accessPassword" type="password" placeholder="رمز ورود" autocomplete="current-password"><button id="accessEnter" type="button" style="width:100%;margin-top:8px">ورود به دیکشنری</button>';
  passArea.style.display = 'none';
  box.insertBefore(passArea, error);

  const guestNotice = document.createElement('p');
  guestNotice.textContent = 'حالت مهمان فقط امکان مشاهده و جستجوی کلمات را دارد.';
  guestNotice.style.cssText = 'font-size:12px;background:var(--soft);padding:10px;border-radius:12px;display:none';
  box.insertBefore(guestNotice, error);

  let mode = 'password';
  const setMode = m => {
    mode = m;
    passArea.style.display = m === 'password' ? 'block' : 'none';
    guestNotice.style.display = m === 'guest' ? 'block' : 'none';
    error.textContent = '';
    document.getElementById('passwordMode').style.opacity = m === 'password' ? '1' : '.55';
    document.getElementById('guestMode').style.opacity = m === 'guest' ? '1' : '.55';
  };

  function enterGuest() {
    sessionStorage.setItem('star_access_mode','guest');
    loginPage.style.display='none'; app.style.display='block';
    document.body.classList.add('guest-mode');
    lockEditing();
    if (typeof render === 'function') render();
  }

  function enterPassword() {
    const v = document.getElementById('accessPassword').value;
    if (v !== PASSWORD) { error.textContent='رمز ورود اشتباه است.'; return; }
    sessionStorage.setItem('star_access_mode','owner');
    loginPage.style.display='none'; app.style.display='block';
    document.body.classList.remove('guest-mode');
    unlockEditing();
    if (typeof render === 'function') render();
  }

  function lockEditing(){
    document.querySelectorAll('#word,#meaning,.add-btn,#sort').forEach(e=>e.disabled=true);
    document.querySelectorAll('#list button').forEach(e=>e.disabled=true);
    const search=document.getElementById('search'); if(search) search.disabled=false;
    const status=document.getElementById('syncStatus');
    if(status){status.textContent='👤 حالت مهمان: فقط مشاهده و جستجو';status.className='sync-status sync-ok';status.style.display='block';}
  }
  function unlockEditing(){
    document.querySelectorAll('#word,#meaning,.add-btn,#sort').forEach(e=>e.disabled=false);
    document.querySelectorAll('#list button').forEach(e=>e.disabled=false);
  }

  document.getElementById('passwordMode').onclick=()=>setMode('password');
  document.getElementById('guestMode').onclick=()=>{setMode('guest');enterGuest();};
  document.getElementById('accessEnter').onclick=enterPassword;
  document.getElementById('accessPassword').addEventListener('keydown',e=>{if(e.key==='Enter')enterPassword();});

  // Override the old password login so the legacy login button cannot bypass the new access screen.
  window.login = () => { setMode('password'); passArea.style.display='block'; document.getElementById('accessPassword').focus(); };

  // If a guest refreshes the page, keep guest mode until they quit.
  if(sessionStorage.getItem('star_access_mode') === 'guest') enterGuest();
})();
