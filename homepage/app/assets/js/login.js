let signInBtn = document.querySelector('#manualSignIn');

signInBtn.addEventListener('click', customerLogin);

function customerLogin() {
    let customerEmail = document.querySelector('#customerEmail').value.toString();
    let userPassword = document.querySelector('#userPassword').value.toString();

    if (customerEmail !== '' && userPassword !== '') {
        axios.post(`https://bling-motor-mock-server.onrender.com/api/v1/customers/login`, {
                'data': {
                    'customerEmail': customerEmail,
                    'password': userPassword
                }
            })
            .then(response => {
                let userInfo = response.data.data.user;
                recordUserStatus(userInfo);
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        alert('請填寫 電子郵件 及 密碼 !')
    }
}