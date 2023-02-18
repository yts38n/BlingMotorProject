let signUpBtn = document.querySelector('#createUser');

signUpBtn.addEventListener('click', customerSignUp);

function customerSignUp() {
    let userName = document.querySelector('#userName').value.toString();
    let userPhone = document.querySelector('#userPhone').value.toString();
    let userEmail = document.querySelector('#userEmail').value.toString();
    let userPassword = document.querySelector('#userPassword').value.toString();
    let userPasswordCfm = document.querySelector('#userPasswordCfm').value.toString();


    if (userName !== '' && userPhone !== '' && userEmail !== '' && userPassword !== '' && userPasswordCfm !== '') {
        if (userPassword === userPasswordCfm) {
            axios.post(`http://localhost:3000/api/v1/customers/register`, {
                    'data': {
                        userName,
                        userPhone,
                        userEmail,
                        userPassword
                    }
                })
                .then(response => {
                    let userInfo = response.data.data.user;
                    recordUserStatus(userInfo)
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            alert('密碼輸入不一致');
        }
    } else {
        alert('請填寫所有資料 !')
    }
}