let signUpBtn = document.querySelector('#createUser');

signUpBtn.addEventListener('click', customerSignUp);

function customerSignUp() {
    let customerName = document.querySelector('#customerName').value.toString();
    let customerPhone = document.querySelector('#customerPhone').value.toString();
    let customerEmail = document.querySelector('#customerEmail').value.toString();
    let userPassword = document.querySelector('#userPassword').value.toString();
    let userPasswordCfm = document.querySelector('#userPasswordCfm').value.toString();


    if (customerName !== '' && customerPhone !== '' && customerEmail !== '' && userPassword !== '' && userPasswordCfm !== '') {
        if (userPassword === userPasswordCfm) {
            axios.post(`https://bling-motor-mock-server.onrender.com/api/v1/customers/register`, {
                    'data': {
                        customerName,
                        customerPhone,
                        customerEmail,
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