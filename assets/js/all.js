"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Calendar = /*#__PURE__*/function () {
  function Calendar(data) {
    _classCallCheck(this, Calendar);
    this.state = {
      current: new Date()
    };
    this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.data = data;
    this.dataYear = parseInt(data['year']);
    this.dataMonth = parseInt(data['month']) - 1; //Date 物件的 Month 起始值為0
    this.dataDates = data['dates'];
    this.render();
  }
  _createClass(Calendar, [{
    key: "render",
    value: function render() {
      // 設定系統日期為當日的00:00:00
      this.state.current.setHours(0, 0, 0, 0);

      // 初始化 calendar
      var calendar = document.getElementById('calendar');
      calendar.innerHTML = '';

      /* --- 開始 --- 渲染 calendarMonthPickers (顯示當前月份+月份選擇元素)*/
      var calendarMonthPickers = document.createElement('div');
      calendarMonthPickers.className = 'calendarMonthPickers';
      var preMonth = document.createElement('span');
      preMonth.className = 'material-symbols-outlined preMonth';
      var nextMonth = document.createElement('span');
      nextMonth.className = 'material-symbols-outlined nextMonth';
      var currentMonth = document.createElement('h3');
      currentMonth.className = 'calendarMonth-Current';
      currentMonth.textContent = "".concat(this.data["year"], " / ").concat(this.data["month"]);
      preMonth.textContent = "arrow_back_ios";
      nextMonth.textContent = "arrow_forward_ios";
      calendarMonthPickers.appendChild(preMonth);
      calendarMonthPickers.appendChild(currentMonth);
      calendarMonthPickers.appendChild(nextMonth);
      /*  --- 結束 --- 渲染 calendarMonthPickers (顯示當前月份+月份選擇元素)*/

      /* --- 開始 --- 渲染 calendar-wrap 內容 */
      var calendarWrap = document.createElement('div');
      calendarWrap.className = 'container calendar-wrap';
      var dayWrapper = document.createElement('div');
      dayWrapper.className = 'row row-cols-7 dayWrapper';
      var dateWrapper = document.createElement('div');
      dateWrapper.className = 'row row-cols-7 dateWrapper';

      //取得 data 的當月1號
      var firstDate = new Date(this.dataYear, this.dataMonth);

      //先new一個當月1號的物件用作計算日期(loop+1)，避免Date指向同一個物件
      var dateForLoop = new Date(firstDate.getFullYear(), firstDate.getMonth());

      //設定日歷的第一個禮拜日是上個月的幾號
      dateForLoop.setDate(dateForLoop.getDate() - dateForLoop.getDay());

      //畫出禮拜幾
      var _iterator = _createForOfIteratorHelper(this.days),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var day = _step.value;
          this.renderDay(day, dayWrapper);
        }

        //畫出上個月
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      while (dateForLoop < firstDate) {
        this.renderDate(dateForLoop, dateWrapper);
        dateForLoop.setDate(dateForLoop.getDate() + 1);
      }

      //畫出這個月 (目前date已是本月的1號)，如果date的月份是當月，就畫格子。date的月份變成下一個月，就停止畫。
      while (dateForLoop.getMonth() === firstDate.getMonth()) {
        this.renderDate(dateForLoop, dateWrapper);
        dateForLoop.setDate(dateForLoop.getDate() + 1);
      }

      //畫出下個月 (目前date 是下個月的1號)。只要還沒到禮拜六，就繼續畫。
      while (dateForLoop.getDay() !== 0) {
        this.renderDate(dateForLoop, dateWrapper);
        dateForLoop.setDate(dateForLoop.getDate() + 1);
      }

      //寫入 calendarWrap
      calendarWrap.appendChild(dayWrapper);
      calendarWrap.appendChild(dateWrapper);
      /* --- 結束 --- 渲染 calendar-wrap 內容 */

      //寫入 calendar
      calendar.appendChild(calendarMonthPickers);
      calendar.appendChild(calendarWrap);

      //監聽選取日期行為
      this.renderSelectDates();
    }
  }, {
    key: "renderDay",
    value: function renderDay(day, dayWrapper) {
      var cell = document.createElement('div');
      cell.className = 'dayInners';
      cell.innerText = day;
      dayWrapper.appendChild(cell);
    }
  }, {
    key: "renderDate",
    value: function renderDate(date, dateWrapper) {
      var currentDate = this.state.current;
      var cell = document.createElement('div');
      cell.className = 'dateInners';
      cell.dataset["date"] = date.getTime();
      cell.textContent = date.getDate();

      //今日以前的日期、非當月日期改成白色
      cell.className += date >= currentDate ? '' : ' notAvailable';
      cell.className += date.getMonth() === this.dataMonth ? '' : ' notAvailable';

      //可預約數量為0時，顯示紅色背景色
      if (this.dataDates[date.getTime()] !== undefined) {
        cell.className += date >= currentDate && date.getMonth() === this.dataMonth && this.dataDates[date.getTime()]['available'] === true && this.dataDates[date.getTime()]['spaces'] === 0 ? ' dateFull' : '';
      }
      dateWrapper.appendChild(cell);
    }
  }, {
    key: "renderSelectDates",
    value: function renderSelectDates() {
      document.querySelector('.dateWrapper').addEventListener('click', function (e) {
        if (e.target.className.search(/dateFull/) === -1 && e.target.className.search(/notAvailable/) === -1) {
          //移除已選項目的 border-color
          var dateInnersSelected = document.querySelector('.dateInners-selected');
          if (dateInnersSelected !== null) {
            dateInnersSelected.classList.remove('dateInners-selected');
          }
          //新增現有項目的 border-color
          e.target.className += ' dateInners-selected';

          //顯示現有項目的日期
          var timestamp = '';
          if (e.target.dataset.date === undefined) {
            timestamp = e.target.parentNode.dataset.date;
          } else {
            timestamp = e.target.dataset.date;
          }
          showSelectedDate(timestamp);
        } else {
          return;
        }
        ;
        function showSelectedDate(timestamp) {
          var date = new Date(parseInt(timestamp));
          var formatDate = "".concat(date.getFullYear(), " / ").concat(date.getMonth() + 1, " / ").concat(date.getDate());
          document.querySelector('#selectedDate').value = formatDate;
        }
      });
    }
  }, {
    key: "preMonth",
    value: function preMonth() {
      // let targetMonth = (this.state.current.getMonth() === 0) ? 12 : this.state.current.getMonth();
      // targetMonth += '';

      // if (this.data['month'].hasOwnProperty(targetMonth) === true) {
      //     this.state.current.setMonth(this.state.current.getMonth() - 1);
      //     this.render();
      // } else {
      //     alert('Previous month is not available.');
      //     return
      // }

      this.state.current.setMonth(this.state.current.getMonth() - 1);
      this.render();
    }
  }, {
    key: "nextMonth",
    value: function nextMonth() {
      // let targetMonth = (this.state.current.getMonth() + 2 >= 13) ? this.state.current.getMonth() + 2 - 12 : this.state.current.getMonth() + 2;
      // targetMonth += '';

      // if (this.data['month'].hasOwnProperty(targetMonth) === true) {
      //     this.state.current.setMonth(this.state.current.getMonth() + 1);
      //     this.render();
      // } else {
      //     alert('Next month is not available.');
      //     return
      // }

      this.state.current.setMonth(this.state.current.getMonth() + 1);
      this.render();
    }
  }]);
  return Calendar;
}();
var currentQueryYear = new Date().getFullYear();
var currentQueryMonth = new Date().getMonth() + 1;
var calendarData = {};
var blingMotorUserStatus = {
  'isLogin': false,
  'userInfo': {}
};
var signoutBtn = document.querySelector('#singoutControl');
signoutBtn.addEventListener('click', doSignout);
function getCalendar(newQueryYear, newQueryMonth) {
  axios.get("http://localhost:3000/api/v1/customers/calendar", {
    params: {
      'year': newQueryYear.toString(),
      'month': newQueryMonth.toString()
    }
  }).then(function (response) {
    calendarData = response.data.data;
    if (calendarData['available'] === true) {
      var calendar = new Calendar(calendarData);
      calanderEventListeners();
      currentQueryYear = parseInt(calendarData['year']);
      currentQueryMonth = parseInt(calendarData['month']);
    } else {
      alert('該月份未開放預訂');
    }
  })["catch"](function (error) {
    console.log(error);
  });
}
function calanderEventListeners() {
  document.querySelector('.preMonth').addEventListener('click', function () {
    var targetYear = 0;
    var targetMonth = 0;
    if (currentQueryMonth - 1 === 0) {
      targetYear = currentQueryYear - 1;
      targetMonth = 12;
    } else {
      targetYear = currentQueryYear;
      targetMonth = currentQueryMonth - 1;
    }
    getCalendar(targetYear, targetMonth);
  });
  document.querySelector('.nextMonth').addEventListener('click', function () {
    var targetYear = 0;
    var targetMonth = 0;
    if (currentQueryMonth + 1 === 13) {
      targetYear = currentQueryYear + 1;
      targetMonth = 1;
    } else {
      targetYear = currentQueryYear;
      targetMonth = currentQueryMonth + 1;
    }
    getCalendar(targetYear, targetMonth);
  });
}
function checkLogin() {
  if (blingMotorUserStatus['isLogin'] === false) {
    var blingMotorUserInfo = localStorage.getItem('blingMotorUserInfo');
    if (blingMotorUserInfo !== null) {
      blingMotorUserStatus['isLogin'] = true;
      blingMotorUserStatus['userInfo'] = JSON.parse(blingMotorUserInfo);
    }
  }
  loginSingoutControl();
}
function doSignout() {
  if (blingMotorUserStatus['isLogin'] === true) {
    localStorage.clear();
    blingMotorUserStatus['isLogin'] = false;
    blingMotorUserStatus['userInfo'] = {};
  }
  window.location.replace('../index.html');
}
function loginSingoutControl() {
  var loginControl = document.querySelector('#loginControl');
  var singoutControl = document.querySelector('#singoutControl');
  var myInfo = document.querySelector('#myInfo');
  var myHistory = document.querySelector('#myHistory');
  if (blingMotorUserStatus['isLogin'] === true) {
    loginControl.classList.add('d-none');
    singoutControl.classList.remove('d-none');
    myInfo.classList.remove('d-none');
    myHistory.classList.remove('d-none');
  } else {
    loginControl.classList.remove('d-none');
    singoutControl.classList.add('d-none');
    myInfo.classList.add('d-none');
    myHistory.classList.add('d-none');
  }
}
function recordUserStatus(userInfo) {
  blingMotorUserStatus['isLogin'] = true;
  blingMotorUserStatus['userInfo'] = userInfo;
  localStorage.setItem('blingMotorUserInfo', JSON.stringify(blingMotorUserStatus['userInfo']));
  window.location.replace('../index.html');
}
checkLogin();
//# sourceMappingURL=all.js.map
