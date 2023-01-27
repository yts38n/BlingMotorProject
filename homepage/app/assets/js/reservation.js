getCalendar(currentQueryYear, currentQueryMonth);

let newBookingBtn = document.querySelector('#newBookingBtn');
newBookingBtn.addEventListener('click', newBooking);

function newBooking() {
    if (blingMotorUserStatus['isLogin'] === true) {
        let selectedDate = new Date(document.querySelector('#selectedDate').value).setHours(0, 0, 0, 0).toString();
        let selectedPlan = document.querySelector('#selectedPlan').value.toString();
        let customerMsg = document.querySelector('#customerMsg').value.toString();

        if (selectedDate !== '' && selectedPlan !== '' & customerMsg !== '') {
            let userToken = blingMotorUserStatus['userInfo']['customerEmail'];

            axios.post(`http://localhost:3000/api/v1/customers/booking`, {
                'data': {
                    'token': userToken,
                    'newBookingInfo': {
                        "date": selectedDate,
                        "plan": selectedPlan,
                        "userRemarks": customerMsg
                    }
                }
            })
            .then(response => {
                alert(response.data.data.status);
                window.location.replace('../index.html');
            })
            .catch(error => {
                alert(error.response.data.data.msg);
            });
        } else {
            alert('請填寫所有欄位!')
        }
        
    } else {
        alert('請先登入!')
    }

}