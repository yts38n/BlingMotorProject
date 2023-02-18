let userInfoData = {};
let userInfoFormWrap = document.querySelector('.userInfo-form-wrap');
let resetForm = document.querySelector('#resetForm');
let updateInfo = document.querySelector('#updateInfo');

resetForm.addEventListener('click', () => {
    userInfoFormWrap.reset();
});

updateInfo.addEventListener('click', () => {
    let userName = document.querySelector('#userName').value.toString();
    let userPhone = document.querySelector('#userPhone').value.toString();
    let oldPassword = document.querySelector('#oldPassword').value.toString();
    let newPassword = document.querySelector('#newPassword').value.toString();
    let newPasswordCfm = document.querySelector('#newPasswordCfm').value.toString();
    let newUserInfo = {};


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
    let userToken = blingMotorUserStatus['userInfo']['userEmail'];
    axios.post(`http://localhost:3000/api/v1/customers/info`, {
            'data': {
                'token': userToken,
            }
        })
        .then(response => {
            userInfoData = response.data.data;
            renderuserInfoData(userInfoData);
        })
        .catch(error => {
            console.log(error);
        });
}

function editUserInfoData(newUserInfo) {
    let userToken = blingMotorUserStatus['userInfo']['userEmail'];
    axios.patch(`http://localhost:3000/api/v1/customers/info`, {
            'data': {
                'token': userToken,
                'newUserInfo': newUserInfo
            }
        })
        .then(response => {
            userInfoData = response.data.data;
            alert('資料更新成功')
            renderuserInfoData(userInfoData);
        })
        .catch(error => {
            console.log(error);
        });
}

function renderuserInfoData(data) {
    let arr = Object.keys(data);
    arr.forEach(el => {
        if (el !== 'userIdentity') {
            document.querySelector(`#${el}`).setAttribute('value', data[el]);
        }
    })
}

getUserInfoData();