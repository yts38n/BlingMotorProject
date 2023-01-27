"use strict";

var userInfoData = {};
var userInfoFormWrap = document.querySelector('.userInfo-form-wrap');
var resetForm = document.querySelector('#resetForm');
var updateInfo = document.querySelector('#updateInfo');
resetForm.addEventListener('click', function () {
  userInfoFormWrap.reset();
});
updateInfo.addEventListener('click', function () {
  var customerName = document.querySelector('#customerName').value.toString();
  var customerPhone = document.querySelector('#customerPhone').value.toString();
  var oldPassword = document.querySelector('#oldPassword').value.toString();
  var newPassword = document.querySelector('#newPassword').value.toString();
  var newPasswordCfm = document.querySelector('#newPasswordCfm').value.toString();
  var newUserInfo = {};
  if (newPassword === '' && newPasswordCfm === '') {
    newUserInfo['customerName'] = customerName;
    newUserInfo['customerPhone'] = customerPhone;
  } else if (newPassword !== '' && oldPassword === '') {
    alert('如需變更密碼須輸入原密碼');
  } else if (newPassword !== newPasswordCfm) {
    alert('新密碼輸入不一致');
  } else {
    newUserInfo['customerName'] = customerName;
    newUserInfo['customerPhone'] = customerPhone;
    newUserInfo['oldPassword'] = oldPassword;
    newUserInfo['newPassword'] = newPassword;
  }
  editUserInfoData(newUserInfo);
});
function getUserInfoData() {
  var userToken = blingMotorUserStatus['userInfo']['customerEmail'];
  axios.post("https://bling-motor-mock-server.onrender.com/api/v1/customers/info", {
    'data': {
      'token': userToken
    }
  }).then(function (response) {
    userInfoData = response.data.data;
    renderuserInfoData(userInfoData);
  })["catch"](function (error) {
    console.log(error);
  });
}
function editUserInfoData(newUserInfo) {
  var userToken = blingMotorUserStatus['userInfo']['customerEmail'];
  axios.patch("https://bling-motor-mock-server.onrender.com/api/v1/customers/info", {
    'data': {
      'token': userToken,
      'newUserInfo': newUserInfo
    }
  }).then(function (response) {
    userInfoData = response.data.data;
    alert('資料更新成功');
    renderuserInfoData(userInfoData);
  })["catch"](function (error) {
    console.log(error);
  });
}
function renderuserInfoData(data) {
  var arr = Object.keys(data);
  arr.forEach(function (el) {
    document.querySelector("#".concat(el)).setAttribute('value', data[el]);
  });
}
getUserInfoData();
//# sourceMappingURL=userInfo.js.map
