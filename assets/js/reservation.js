"use strict";

getCalendar(currentQueryYear, currentQueryMonth);
var newBookingBtn = document.querySelector('#newBookingBtn');
newBookingBtn.addEventListener('click', newBooking);
function newBooking() {
  if (blingMotorUserStatus['isLogin'] === true) {
    var selectedDate = new Date(document.querySelector('#selectedDate').value).setHours(0, 0, 0, 0).toString();
    var selectedPlan = document.querySelector('#selectedPlan').value.toString();
    var customerMsg = document.querySelector('#customerMsg').value.toString();
    if (selectedDate !== '' && selectedPlan !== '' & customerMsg !== '') {
      var userToken = blingMotorUserStatus['userInfo']['userEmail'];
      axios.post("https://bling-motor-mock-server.onrender.com/api/v1/customers/booking", {
        'data': {
          'token': userToken,
          'newBookingInfo': {
            "date": selectedDate,
            "plan": selectedPlan,
            "userRemarks": customerMsg
          }
        }
      }).then(function (response) {
        alert(response.data.data.status);
        window.location.replace('../index.html');
      })["catch"](function (error) {
        alert(error.response.data.data.msg);
      });
    } else {
      alert('請填寫所有欄位!');
    }
  } else {
    alert('請先登入!');
  }
}
//# sourceMappingURL=reservation.js.map
