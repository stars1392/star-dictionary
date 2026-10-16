(() => {
  const polish = document.createElement('style');
  polish.textContent = `
    html,body,body *{font-family:'Vazirmatn',Tahoma,Arial,sans-serif!important}
    .profile-group img:nth-child(2){display:none!important}
    .login-box{padding:42px 38px!important;border-radius:34px!important;box-shadow:0 28px 80px #164e4a22!important}
    .login-box .logo{font-size:72px!important}
    .login-box h1{font-family:'Vazirmatn',Tahoma,sans-serif!important;font-size:31px!important;font-weight:800!important;letter-spacing:-.5px}
    .login-box>p{font-family:'Vazirmatn',Tahoma,sans-serif!important;line-height:1.9}
    .login-box input,.login-box select,.login-box button,.login-box #accessPassword{font-family:'Vazirmatn',Tahoma,Arial,sans-serif!important;height:52px!important;border-radius:16px!important;font-family:Arial,sans-serif!important}
    .login-box button{height:52px!important;border-radius:16px!important;font-size:14px!important}
    /* Keep Password and Guest compact while giving them a polished, consistent style. */
    .login-box .access-mode-card{height:40px!important;min-height:40px!important;padding:7px 10px!important;border-radius:12px!important;font-size:13px!important;gap:7px!important;border:1px solid #9bcdbb!important;background:linear-gradient(135deg,#ffffff,#eaf8f0)!important;color:#14534d!important;box-shadow:0 2px 7px #0f766e12!important}
    .login-box .access-mode-card:hover{transform:translateY(-1px)!important;box-shadow:0 4px 10px #0f766e1c!important}
    .login-box .access-mode-card.selected{border-color:#0f766e!important;background:linear-gradient(135deg,#dff7ed,#c9f0df)!important;box-shadow:inset 0 0 0 1px #0f766e20!important}
    .login-box .access-mode-card .access-symbol{font-size:16px!important}
    .login-box .access-mode-card b{font-size:13px!important}
    /* Soft, high-contrast icon buttons so Settings and Backup are easy to see. */
    .header-actions .icon-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:42px!important;height:42px!important;min-width:42px!important;padding:0!important;border:1px solid #9bcdbb!important;border-radius:13px!important;background:linear-gradient(145deg,#ffffff,#e5f6ed)!important;color:#0f766e!important;box-shadow:0 3px 9px #0f766e16!important}
    .header-actions .icon-btn:hover{background:linear-gradient(145deg,#e5f6ed,#d1f0e0)!important;border-color:#0f766e!important;box-shadow:0 5px 12px #0f766e24!important}
    .header-actions .icon-btn .star-emoji-image{width:22px!important;height:22px!important;filter:none!important;opacity:1!important}
    body.dark .header-actions .icon-btn{background:linear-gradient(145deg,#1d3a3d,#19302f)!important;border-color:#4b8f80!important;color:#e5fff5!important}
    body.dark .login-box .access-mode-card{background:linear-gradient(135deg,#1d3a3d,#19302f)!important;color:#e5fff5!important;border-color:#4b8f80!important}
    body.dark .login-box .access-mode-card b{color:#e5fff5!important}
    .login-box>div:first-of-type{margin-top:20px!important}
    .guest-mode .container{display:block!important;max-width:920px!important;margin:0 auto!important}
    .guest-mode .container>.card:first-child{display:none!important}
    .guest-mode .container>.card:last-child{width:100%!important;margin:0 auto!important}
    .guest-mode #list{width:100%!important}
    .guest-mode .word{width:100%!important}
    @media(max-width:600px){
      .login-box{padding:32px 22px!important;border-radius:28px!important}
      .guest-mode .container{max-width:100%!important}
    }
  `;
  document.head.appendChild(polish);
})();