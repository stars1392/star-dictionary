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