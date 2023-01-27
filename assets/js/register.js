"use strict";

var signUpBtn = document.querySelector('#createUser');
signUpBtn.addEventListener('click', customerSignUp);
function customerSignUp() {
  var customerName = document.querySelector('#customerName').value.toString();
  var customerPhone = document.querySelector('#customerPhone').value.toString();
  var customerEmail = document.querySelector('#customerEmail').value.toString();
  var userPassword = document.querySelector('#userPassword').value.toString();
  var userPasswordCfm = document.querySelector('#userPasswordCfm').value.toString();
  if (customerName !== '' && customerPhone !== '' && customerEmail !== '' && userPassword !== '' && userPasswordCfm !== '') {
    if (userPassword === userPasswordCfm) {
      axios.post("http://localhost:3000/api/v1/customers/register", {
        'data': {
          customerName: customerName,
          customerPhone: customerPhone,
          customerEmail: customerEmail,
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
