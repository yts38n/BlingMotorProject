class Calendar {
    constructor(data) {
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

    render() {
        // 設定系統日期為當日的00:00:00
        this.state.current.setHours(0, 0, 0, 0);

        // 初始化 calendar
        let calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        /* --- 開始 --- 渲染 calendarMonthPickers (顯示當前月份+月份選擇元素)*/
        let calendarMonthPickers = document.createElement('div');
        calendarMonthPickers.className = 'calendarMonthPickers';
        let preMonth = document.createElement('span');
        preMonth.className = 'material-symbols-outlined preMonth';
        let nextMonth = document.createElement('span');
        nextMonth.className = 'material-symbols-outlined nextMonth';
        let currentMonth = document.createElement('h3');
        currentMonth.className = 'calendarMonth-Current';

        currentMonth.textContent = `${this.data["year"]} / ${this.data["month"]}`;
        preMonth.textContent = `arrow_back_ios`;
        nextMonth.textContent = `arrow_forward_ios`;

        calendarMonthPickers.appendChild(preMonth);
        calendarMonthPickers.appendChild(currentMonth);
        calendarMonthPickers.appendChild(nextMonth);
        /*  --- 結束 --- 渲染 calendarMonthPickers (顯示當前月份+月份選擇元素)*/

        /* --- 開始 --- 渲染 calendar-wrap 內容 */
        let calendarWrap = document.createElement('div');
        calendarWrap.className = 'container calendar-wrap';
        let dayWrapper = document.createElement('div');
        dayWrapper.className = 'row row-cols-7 dayWrapper';
        let dateWrapper = document.createElement('div');
        dateWrapper.className = 'row row-cols-7 dateWrapper';

        //取得 data 的當月1號
        let firstDate = new Date(this.dataYear, this.dataMonth);

        //先new一個當月1號的物件用作計算日期(loop+1)，避免Date指向同一個物件
        let dateForLoop = new Date(firstDate.getFullYear(), firstDate.getMonth())

        //設定日歷的第一個禮拜日是上個月的幾號
        dateForLoop.setDate(dateForLoop.getDate() - dateForLoop.getDay());

        //畫出禮拜幾
        for (let day of this.days) {
            this.renderDay(day, dayWrapper);
        }

        //畫出上個月
        while (dateForLoop < firstDate) {
            this.renderDate(dateForLoop, dateWrapper);
            dateForLoop.setDate(dateForLoop.getDate() + 1);
        }

        //畫出這個月 (目前date已是本月的1號)，如果date的月份是當月，就畫格子。date的月份變成下一個月，就停止畫。
        while (dateForLoop.getMonth() === firstDate.getMonth()) {
            this.renderDate(dateForLoop, dateWrapper)
            dateForLoop.setDate(dateForLoop.getDate() + 1);
        }

        //畫出下個月 (目前date 是下個月的1號)。只要還沒到禮拜六，就繼續畫。
        while (dateForLoop.getDay() !== 0) {
            this.renderDate(dateForLoop, dateWrapper)
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
        this.renderSelectDates()
    }

    renderDay(day, dayWrapper) {
        let cell = document.createElement('div');
        cell.className = 'dayInners';
        cell.innerText = day;
        dayWrapper.appendChild(cell);
    }

    renderDate(date, dateWrapper) {
        let currentDate = this.state.current;

        let cell = document.createElement('div');
        cell.className = 'dateInners';
        cell.dataset["date"] = date.getTime();
        cell.textContent = date.getDate()

        //今日以前的日期、非當月日期改成白色
        cell.className += (date >= currentDate) ? '' : ' notAvailable';
        cell.className += (date.getMonth() === this.dataMonth) ? '' : ' notAvailable';

        //可預約數量為0時，顯示紅色背景色
        if (this.dataDates[date.getTime()] !== undefined) {
            cell.className += (date >= currentDate && date.getMonth() === this.dataMonth && this.dataDates[date.getTime()]['available'] === true && this.dataDates[date.getTime()]['spaces'] === 0) ? ' dateFull' : '';
        }

        dateWrapper.appendChild(cell);
    }

    renderSelectDates() {
        document.querySelector('.dateWrapper').addEventListener('click', (e) => {
            if ((e.target.className.search(/dateFull/) === -1 && e.target.className.search(/notAvailable/) === -1)) {

                //移除已選項目的 border-color
                let dateInnersSelected = document.querySelector('.dateInners-selected');
                if (dateInnersSelected !== null) {
                    dateInnersSelected.classList.remove('dateInners-selected');
                }
                //新增現有項目的 border-color
                e.target.className += ' dateInners-selected'

                //顯示現有項目的日期
                let timestamp = '';
                if (e.target.dataset.date === undefined) {
                    timestamp = e.target.parentNode.dataset.date;
                } else {
                    timestamp = e.target.dataset.date;
                }
                showSelectedDate(timestamp);
            } else {
                return;
            };

            function showSelectedDate(timestamp) {
                let date = new Date(parseInt(timestamp));
                let formatDate = `${date.getFullYear()} / ${date.getMonth()+1} / ${date.getDate()}`
                document.querySelector('#selectedDate').value = formatDate;
            }
        });
    }

    preMonth() {
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

    nextMonth() {
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
}

let currentQueryYear = new Date().getFullYear();
let currentQueryMonth = new Date().getMonth() + 1;
let calendarData = {};
let blingMotorUserStatus = {
    'isLogin': false,
    'userInfo': {}
};
let signoutBtn = document.querySelector('#singoutControl');
signoutBtn.addEventListener('click', doSignout);

function getCalendar(newQueryYear, newQueryMonth) {
    axios.get(`http://localhost:3000/api/v1/customers/calendar`, {
            params: {
                'year': newQueryYear.toString(),
                'month': newQueryMonth.toString()
            }
        })
        .then(response => {
            calendarData = response.data.data;
            if (calendarData['available'] === true) {
                const calendar = new Calendar(calendarData);
                calanderEventListeners();
                currentQueryYear = parseInt(calendarData['year']);
                currentQueryMonth = parseInt(calendarData['month']);
            } else {
                alert('該月份未開放預訂');
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function calanderEventListeners() {
    document.querySelector('.preMonth').addEventListener('click', () => {
        let targetYear = 0;
        let targetMonth = 0;

        if (currentQueryMonth - 1 === 0) {
            targetYear = currentQueryYear - 1;
            targetMonth = 12;
        } else {
            targetYear = currentQueryYear;
            targetMonth = currentQueryMonth - 1;
        }
        getCalendar(targetYear, targetMonth)
    });

    document.querySelector('.nextMonth').addEventListener('click', () => {
        let targetYear = 0;
        let targetMonth = 0;

        if (currentQueryMonth + 1 === 13) {
            targetYear = currentQueryYear + 1;
            targetMonth = 1;
        } else {
            targetYear = currentQueryYear;
            targetMonth = currentQueryMonth + 1;
        }
        getCalendar(targetYear, targetMonth)
    });
}

function checkLogin() {
    if (blingMotorUserStatus['isLogin'] === false) {
        let blingMotorUserInfo = localStorage.getItem('blingMotorUserInfo');
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
        blingMotorUserStatus['userInfo'] = {}
    }
    window.location.replace('index.html');
}

function loginSingoutControl() {
    let loginControl = document.querySelector('#loginControl');
    let singoutControl = document.querySelector('#singoutControl');
    let myInfo = document.querySelector('#myInfo');
    let myHistory = document.querySelector('#myHistory');

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
    window.location.replace('index.html');
}

checkLogin();