"use strict";

var YOUR_GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
var signInButton = document.getElementById('signIn_button');
var signOutButton = document.getElementById('signOut_button');
var showUser = document.querySelector('.showUser');
var isLogin = false;
var user = {
  'sub': null,
  'name': null,
  'email': null
};

// console.log(signInButton);
// console.log(signOutButton);

//將「使用 Google 登入」用戶端初始化
window.onload = function () {
  google.accounts.id.initialize({
    client_id: YOUR_GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(signInButton, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'signup_with',
    shape: 'pill',
    logo_alignment: 'left',
    locale: 'zh_TW',
    click_listener: onClickHandler
  } // customization attributes
  );

  isLoginCheck();
};
function onClickHandler() {
  console.log("Sign in with Google button clicked...");
}
function handleCredentialResponse(response) {
  // JSON.parse(window.atob(response.credential.split('.')[1])) is a custom method defined by you
  // to decode the credential response.

  var responsePayload = JSON.parse(window.atob(response.credential.split('.')[1]));
  console.log(responsePayload);
  isLogin = true;
  user['sub'] = responsePayload['sub'];
  user['name'] = responsePayload['name'];
  user['email'] = responsePayload['email'];
  localStorage.setItem('isLogin', isLogin);
  localStorage.setItem('user', JSON.stringify(user));
  renderUser(isLogin);
}
signOutButton.onclick = function () {
  isLogin = false;
  localStorage.setItem('isLogin', isLogin);
  localStorage.removeItem('user');
  renderUser(isLogin);
};
function isLoginCheck() {
  if (localStorage.getItem('isLogin') === null || localStorage.getItem('isLogin') === 'false') {
    console.log('Not Login!');
  } else {
    isLogin = true;
    renderUser(isLogin);
  }
}
function renderUser() {
  if (isLogin === true) {
    user = JSON.parse(localStorage.getItem('user'));
    var str = '';
    Object.entries(user).forEach(function (obj) {
      str += "<h3>".concat(obj[0], "\uFF1A").concat(obj[1], "</h3>");
    });
    showUser.innerHTML = str;
    signInButton.style.display = 'none';
    signOutButton.style.display = 'inline-block';
  } else {
    showUser.innerHTML = '';
    signInButton.style.display = 'inline-block';
    signOutButton.style.display = 'none';
  }
}
//# sourceMappingURL=gsi.js.map
