"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var userToken = blingMotorUserStatus['userInfo']['userEmail'];
var userHistoryData = [];
var tbody = document.querySelector('tbody');
var editReservationElement = "\n<div class=\"container reservation\">\n    <div class=\"reservation-wrap\">\n        <div class=\"container calendar\" id=\"calendar\"></div>\n\n        <div class=\"pickerColorGuide\">\n            <div class=\"pickerColorGuide-item\">\n                <div class=\"colorBox colorBox-red\"></div>\n                <p>\u9810\u7D04\u5DF2\u6EFF</p>\n            </div>\n            <div class=\"pickerColorGuide-item\">\n                <div class=\"colorBox colorBox-gray\"></div>\n                <p>\u53EF\u9810\u7D04</p>\n            </div>\n            <div class=\"pickerColorGuide-item\">\n                <div class=\"colorBox colorBox-green\"></div>\n                <p>\u5DF2\u9078\u64C7</p>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"container newBooking-form\">\n        <form action=\"\" class=\"newBooking-form-wrap\">\n            <div class=\"form-group\">\n                <div class=\"newBooking-input\">\n                    <label for=\"selectedDate\">\u65E5\u671F</label>\n                    <input type=\"text\" id=\"selectedDate\" name=\"\u65E5\u671F\" readonly value=\"\" class=\"form-control-plaintext\">\n                </div>\n                <div class=\"alert-message\">\n                    <p id=\"selectedDate-message\" data-message=\"\u65E5\u671F\"></p>\n                </div>\n            </div>\n\n            <div class=\"form-group\">\n                <div class=\"newBooking-input\">\n                    <label for=\"selectedPlan\">\u5957\u88DD</label>\n                    <select class=\"form-select form-select-sm\" id=\"selectedPlan\">\n                        <option selected disabled>\u8ACB\u9078\u64C7\u5957\u88DD</option>\n                        <option value=\"\u57FA\u790E\u8B77\u7406\">\u57FA\u790E\u8B77\u7406</option>\n                        <option value=\"\u9032\u968E\u934D\u6676\">\u9032\u968E\u934D\u6676</option>\n                        <option value=\"\u9802\u7D1A\u934D\u819C\">\u9802\u7D1A\u934D\u819C</option>\n                    </select>\n                </div>\n                <div class=\"alert-message\">\n                    <p id=\"selectedPlan-message\" data-message=\"\u5957\u88DD\"></p>\n                </div>\n            </div>\n\n            <div class=\"form-group\">\n                <div class=\"newBooking-input\">\n                    <label for=\"customerMsg\" class=\"align-self-start\">\u5099\u8A3B</label>\n                    <textarea class=\"form-control form-control-sm\" id=\"customerMsg\" name=\"\u5099\u8A3B\" rows=\"3\" maxlength=\"100\" placeholder=\"\u8ACB\u63D0\u4F9B\u8ECA\u578B\"></textarea>\n                </div>\n                <div class=\"alert-message\">\n                    <p id=\"customerMsg-message\" data-message=\"\u5099\u8A3B\"></p>\n                </div>\n            </div>\n            \n            <div class=\"userHistoryEditBookingBtn-group\">\n                <input type=\"button\" class=\"btn btn-dark-200\" value=\"\u53D6\u6D88\u9810\u7D04\" id=\"cancelBooking\">\n                <input type=\"button\" class=\"btn btn-primary\" value=\"\u78BA\u8A8D\u4FEE\u6539\" id=\"confirmEdit\">\n            </div>\n        </form>\n    </div>\n</div>";
function getUserReservation() {
  axios.post("https://bling-motor-mock-server.onrender.com/api/v1/customers/history", {
    'data': {
      'token': userToken
    }
  }).then(function (response) {
    userHistoryData = response.data.data;
    renderUserHistory(userHistoryData);
  })["catch"](function (error) {
    console.log(error);
  });
}
function updateReservation() {
  var bookingId = document.querySelector('#userHistoryCalendar').previousSibling.dataset.bookingid;
  console.log(_typeof(bookingId));
  var selectedDate = new Date(document.querySelector('#selectedDate').value).setHours(0, 0, 0, 0).toString();
  var selectedPlan = document.querySelector('#selectedPlan').value;
  var customerMsg = document.querySelector('#customerMsg').value;
  var originalBookingInfo = userHistoryData.find(function (_ref) {
    var id = _ref.id;
    return id === parseInt(bookingId);
  });
  if (originalBookingInfo['date'] !== selectedDate || originalBookingInfo['plan'] !== selectedPlan || originalBookingInfo['userRemarks'] !== customerMsg) {
    axios.patch("https://bling-motor-mock-server.onrender.com/api/v1/customers/booking", {
      'data': {
        'token': userToken,
        'bookingId': bookingId,
        'newBookingInfo': {
          "date": selectedDate,
          "plan": selectedPlan,
          "userRemarks": customerMsg
        }
      }
    }).then(function (response) {
      alert(response.data.data.msg);
      window.location.reload();
    })["catch"](function (error) {
      console.log(error);
    });
  } else {
    alert('無修改');
  }
}
function deleteReservation() {
  var bookingId = document.querySelector('#userHistoryCalendar').previousSibling.dataset.bookingid;
  axios["delete"]("https://bling-motor-mock-server.onrender.com/api/v1/customers/booking", {
    data: {
      'token': userToken,
      'bookingId': bookingId
    }
  }).then(function (response) {
    alert(response.data.data.msg);
    window.location.reload();
  })["catch"](function (error) {
    console.log(error);
  });
}
function getSelectedBookingCalendar(selectedBooking) {
  var targetYear = new Date(parseInt(selectedBooking['date'])).getFullYear();
  var targetMonth = new Date(parseInt(selectedBooking['date'])).getMonth() + 1;
  axios.get("https://bling-motor-mock-server.onrender.com/api/v1/customers/calendar", {
    params: {
      'year': targetYear.toString(),
      'month': targetMonth.toString()
    }
  }).then(function (response) {
    calendarData = response.data.data;
    if (calendarData['available'] === true) {
      var calendar = new Calendar(calendarData);
      calanderEventListeners();
      renderEditReservation(selectedBooking);
      currentQueryYear = parseInt(calendarData['year']);
      currentQueryMonth = parseInt(calendarData['month']);
    } else {
      alert('該月份未開放預訂');
    }
  })["catch"](function (error) {
    console.log(error);
  });
}
function renderUserHistory(data) {
  var str = '';
  // 按日期 未來>過去 排序
  data.sort(function (a, b) {
    return b['date'] - a['date'];
  });
  data.forEach(function (el) {
    var date = new Date(parseInt(el['date']));
    var dateFormat = "".concat(date.getFullYear(), "/").concat(date.getMonth() + 1, "/").concat(date.getDate());
    var editable = el['status'] !== '已完成' && el['status'] !== '已取消' ? '<a href="#" class="editReservationBtn">修改</a>' : '<a>-</a>';
    str += "\n                <tr data-bookingId='".concat(el['id'], "'>\n                    <td>").concat(dateFormat, "</td>\n                    <td>").concat(el['plan'], "</td>\n                    <td class='text-start'>").concat(el['userRemarks'], "</td>\n                    <td>").concat(el['status'], "</td>\n                    <td>").concat(editable, "</td>\n                </tr>\n            ");
  });
  tbody.innerHTML = str;
}
function renderEditReservation(selectedBooking) {
  var calendarSelected = document.querySelector("[data-date=\"".concat(parseInt(selectedBooking['date']), "\"]"));
  calendarSelected.className += ' dateInners-selected';
  var selectedDate = document.querySelector('#selectedDate');
  var selectedPlan = document.querySelector('#selectedPlan');
  var customerMsg = document.querySelector('#customerMsg');
  var selectedBookingDate = new Date(parseInt(selectedBooking['date']));
  var dateFormat = "".concat(selectedBookingDate.getFullYear(), " / ").concat(selectedBookingDate.getMonth() + 1, " / ").concat(selectedBookingDate.getDate());
  selectedDate.value = dateFormat;
  selectedPlan.value = selectedBooking['plan'];
  customerMsg.value = selectedBooking['userRemarks'];
}
function createUserHistoryCalendar(targetElement) {
  var userHistoryCalendar = document.querySelector('#userHistoryCalendar');
  var opended = document.querySelector('.opended');

  //移除已打開的 '修改' 內容     
  if (userHistoryCalendar !== null) {
    removeUserHistoryCalendar(opended);
  }

  //產生新的 '修改' 內容
  var insertCalendar = document.createElement('tr');
  insertCalendar.setAttribute('id', 'userHistoryCalendar');
  var selectedBookingId = targetElement.parentElement.parentElement.getAttribute('data-bookingid');
  var selectedBooking = userHistoryData.find(function (_ref2) {
    var id = _ref2.id;
    return id.toString() === selectedBookingId;
  });
  tbody.insertBefore(insertCalendar, targetElement.parentElement.parentElement.nextSibling);
  insertCalendar.innerHTML = "<td colspan='5'>".concat(editReservationElement, "</td>");
  getSelectedBookingCalendar(selectedBooking);
  targetElement.innerText = '取消修改';
  targetElement.className += ' opended';
}
function removeUserHistoryCalendar(targetElement) {
  document.querySelector('#userHistoryCalendar').remove();
  targetElement.innerText = '修改';
  targetElement.classList.remove("opended");
}
tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('opended')) {
    removeUserHistoryCalendar(e.target);
  } else if (e.target.classList.contains('editReservationBtn')) {
    createUserHistoryCalendar(e.target);
  } else if (e.target.id === 'cancelBooking') {
    deleteReservation();
  } else if (e.target.id === 'confirmEdit') {
    updateReservation();
  }
});
getUserReservation();
//# sourceMappingURL=userHistory.js.map
