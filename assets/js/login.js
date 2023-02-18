"use strict";

var signInBtn = document.querySelector('#manualSignIn');
signInBtn.addEventListener('click', customerLogin);
function customerLogin() {
  var userEmail = document.querySelector('#userEmail').value.toString();
  var userPassword = document.querySelector('#userPassword').value.toString();
  if (userEmail !== '' && userPassword !== '') {
    axios.post("https://bling-motor-mock-server.onrender.com/api/v1/customers/login", {
      'data': {
        'userEmail': userEmail,
        'password': userPassword
      }
    }).then(function (response) {
      var userInfo = response.data.data.user;
      recordUserStatus(userInfo);
    })["catch"](function (error) {
      console.log(error);
      alert('帳號錯誤! 請重新輸入!');
    });
  } else {
    alert('請填寫 電子郵件 及 密碼 !');
  }
}
//# sourceMappingURL=login.js.map
