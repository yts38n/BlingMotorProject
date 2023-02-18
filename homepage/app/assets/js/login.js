let signInBtn = document.querySelector('#manualSignIn');

signInBtn.addEventListener('click', customerLogin);

function customerLogin() {
    let userEmail = document.querySelector('#userEmail').value.toString();
    let userPassword = document.querySelector('#userPassword').value.toString();

    if (userEmail !== '' && userPassword !== '') {
        axios.post(`http://localhost:3000/api/v1/customers/login`, {
                'data': {
                    'userEmail': userEmail,
                    'password': userPassword,
                }
            })
            .then(response => {
                let userInfo = response.data.data.user;
                recordUserStatus(userInfo);
            })
            .catch(error => {
                console.log(error);
                alert('帳號錯誤! 請重新輸入!')
            });
    } else {
        alert('請填寫 電子郵件 及 密碼 !')
    }
}