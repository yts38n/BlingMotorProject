"use strict";

var signUpBtn = document.querySelector('#createUser');
signUpBtn.addEventListener('click', customerSignUp);
function customerSignUp() {
  var userName = document.querySelector('#userName').value.toString();
  var userPhone = document.querySelector('#userPhone').value.toString();
  var userEmail = document.querySelector('#userEmail').value.toString();
  var userPassword = document.querySelector('#userPassword').value.toString();
  var userPasswordCfm = document.querySelector('#userPasswordCfm').value.toString();
  if (userName !== '' && userPhone !== '' && userEmail !== '' && userPassword !== '' && userPasswordCfm !== '') {
    if (userPassword === userPasswordCfm) {
      axios.post("https://bling-motor-mock-server.onrender.com/api/v1/customers/register", {
        'data': {
          userName: userName,
          userPhone: userPhone,
          userEmail: userEmail,
          userPassword: userPassword
        }
      }).then(function (response) {
        var userInfo = response.data.data.user;
        recordUserStatus(userInfo);
      })["catch"](function (error) {
        console.log(error);
      });
    } else {
      alert('密碼輸入不一致');
    }
  } else {
    alert('請填寫所有資料 !');
  }
}
//# sourceMappingURL=register.js.map
