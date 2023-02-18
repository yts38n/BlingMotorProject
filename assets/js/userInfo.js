"use strict";

var userInfoData = {};
var userInfoFormWrap = document.querySelector('.userInfo-form-wrap');
var resetForm = document.querySelector('#resetForm');
var updateInfo = document.querySelector('#updateInfo');
resetForm.addEventListener('click', function () {
  userInfoFormWrap.reset();
});
updateInfo.addEventListener('click', function () {
  var userName = document.querySelector('#userName').value.toString();
  var userPhone = document.querySelector('#userPhone').value.toString();
  var oldPassword = document.querySelector('#oldPassword').value.toString();
  var newPassword = document.querySelector('#newPassword').value.toString();
  var newPasswordCfm = document.querySelector('#newPasswordCfm').value.toString();
  var newUserInfo = {};
  if (newPassword === '' && newPasswordCfm === '') {
    newUserInfo['userName'] = userName;
    newUserInfo['userPhone'] = userPhone;
  } else if (newPassword !== '' && oldPassword === '') {
    alert('如需變更密碼須輸入原密碼');
  } else if (newPassword !== newPasswordCfm) {
    alert('新密碼輸入不一致');
  } else {
    newUserInfo['userName'] = userName;
    newUserInfo['userPhone'] = userPhone;
    newUserInfo['oldPassword'] = oldPassword;
    newUserInfo['newPassword'] = newPassword;
  }
  editUserInfoData(newUserInfo);
});
function getUserInfoData() {
  var userToken = blingMotorUserStatus['userInfo']['userEmail'];
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
  var userToken = blingMotorUserStatus['userInfo']['userEmail'];
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
    if (el !== 'userIdentity') {
      document.querySelector("#".concat(el)).setAttribute('value', data[el]);
    }
  });
}
getUserInfoData();
//# sourceMappingURL=userInfo.js.map
