let userToken = blingMotorUserStatus['userInfo']['customerEmail'];
let userHistoryData = [];
let tbody = document.querySelector('tbody');
let editReservationElement = `
<div class="container reservation">
    <div class="reservation-wrap">
        <div class="container calendar" id="calendar"></div>

        <div class="pickerColorGuide">
            <div class="pickerColorGuide-item">
                <div class="colorBox colorBox-red"></div>
                <p>預約已滿</p>
            </div>
            <div class="pickerColorGuide-item">
                <div class="colorBox colorBox-gray"></div>
                <p>可預約</p>
            </div>
            <div class="pickerColorGuide-item">
                <div class="colorBox colorBox-green"></div>
                <p>已選擇</p>
            </div>
        </div>
    </div>

    <div class="container newBooking-form">
        <form action="" class="newBooking-form-wrap">
            <div class="form-group">
                <div class="newBooking-input">
                    <label for="selectedDate">日期</label>
                    <input type="text" id="selectedDate" name="日期" readonly value="" class="form-control-plaintext">
                </div>
                <div class="alert-message">
                    <p id="selectedDate-message" data-message="日期"></p>
                </div>
            </div>

            <div class="form-group">
                <div class="newBooking-input">
                    <label for="selectedPlan">套裝</label>
                    <select class="form-select form-select-sm" id="selectedPlan">
                        <option selected disabled>請選擇套裝</option>
                        <option value="基礎護理">基礎護理</option>
                        <option value="進階鍍晶">進階鍍晶</option>
                        <option value="頂級鍍膜">頂級鍍膜</option>
                    </select>
                </div>
                <div class="alert-message">
                    <p id="selectedPlan-message" data-message="套裝"></p>
                </div>
            </div>

            <div class="form-group">
                <div class="newBooking-input">
                    <label for="customerMsg" class="align-self-start">備註</label>
                    <textarea class="form-control form-control-sm" id="customerMsg" name="備註" rows="3" maxlength="100" placeholder="請提供車型"></textarea>
                </div>
                <div class="alert-message">
                    <p id="customerMsg-message" data-message="備註"></p>
                </div>
            </div>
            
            <div class="userHistoryEditBookingBtn-group">
                <input type="button" class="btn btn-dark-200" value="取消預約" id="cancelBooking">
                <input type="button" class="btn btn-primary" value="確認修改" id="confirmEdit">
            </div>
        </form>
    </div>
</div>`;

function getUserReservation() {
    axios.post(`https://bling-motor-mock-server.onrender.com/api/v1/customers/history`, {
            'data': {
                'token': userToken,
            }
        })
        .then(response => {
            userHistoryData = response.data.data;
            renderUserHistory(userHistoryData);
        })
        .catch(error => {
            console.log(error);
        });
}

function updateReservation() {
    let bookingId = document.querySelector('#userHistoryCalendar').previousSibling.dataset.bookingid;
    console.log(typeof bookingId);
    let selectedDate = new Date(document.querySelector('#selectedDate').value).setHours(0, 0, 0, 0).toString();
    let selectedPlan = document.querySelector('#selectedPlan').value;
    let customerMsg = document.querySelector('#customerMsg').value;

    let originalBookingInfo = userHistoryData.find(({
        id
    }) => id === parseInt(bookingId));

    if (originalBookingInfo['date'] !== selectedDate || originalBookingInfo['plan'] !== selectedPlan || originalBookingInfo['userRemarks'] !== customerMsg) {
        axios.patch(`https://bling-motor-mock-server.onrender.com/api/v1/customers/booking`, {
                'data': {
                    'token': userToken,
                    'bookingId': bookingId,
                    'newBookingInfo': {
                        "date": selectedDate,
                        "plan": selectedPlan,
                        "userRemarks": customerMsg
                    }
                }
            })
            .then(response => {
                console.log(response);
                alert(response.data.data.msg);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        alert('無修改');
    }


}

function deleteReservation() {
    let bookingId = document.querySelector('#userHistoryCalendar').previousSibling.dataset.bookingid;

    axios.delete(`https://bling-motor-mock-server.onrender.com/api/v1/customers/booking`, {
            data: {
                'token': userToken,
                'bookingId': bookingId
            }
        })
        .then(response => {
            alert(response.data.data.msg);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}

function getSelectedBookingCalendar(selectedBooking) {
    let targetYear = new Date(parseInt(selectedBooking['date'])).getFullYear();
    let targetMonth = new Date(parseInt(selectedBooking['date'])).getMonth() + 1;

    axios.get(`https://bling-motor-mock-server.onrender.com/api/v1/customers/calendar`, {
            params: {
                'year': targetYear.toString(),
                'month': targetMonth.toString()
            }
        })
        .then(response => {
            calendarData = response.data.data;
            if (calendarData['available'] === true) {
                const calendar = new Calendar(calendarData);
                calanderEventListeners();
                renderEditReservation(selectedBooking);
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

function renderUserHistory(data) {
    let str = '';
    // 按日期 未來>過去 排序
    data.sort((a, b) => b['date'] - a['date']);

    data.forEach(el => {
        let date = new Date(parseInt(el['date']));
        let dateFormat = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
        let editable = (el['status'] !== '已完成' && el['status'] !== '已取消') ? '<a href="#" class="editReservationBtn">修改</a>' : '<a>-</a>';
        str += `
                <tr data-bookingId='${el['id']}'>
                    <td>${dateFormat}</td>
                    <td>${el['plan']}</td>
                    <td class='text-start'>${el['userRemarks']}</td>
                    <td>${el['status']}</td>
                    <td>${editable}</td>
                </tr>
            `;
    });
    tbody.innerHTML = str;
}

function renderEditReservation(selectedBooking) {
    let calendarSelected = document.querySelector(`[data-date="${parseInt(selectedBooking['date'])}"]`);
    calendarSelected.className += ' dateInners-selected';

    let selectedDate = document.querySelector('#selectedDate');
    let selectedPlan = document.querySelector('#selectedPlan');
    let customerMsg = document.querySelector('#customerMsg');

    let selectedBookingDate = new Date(parseInt(selectedBooking['date']));
    let dateFormat = `${selectedBookingDate.getFullYear()} / ${selectedBookingDate.getMonth() + 1} / ${selectedBookingDate.getDate()}`

    selectedDate.value = dateFormat;
    selectedPlan.value = selectedBooking['plan'];
    customerMsg.value = selectedBooking['userRemarks'];
}

function createUserHistoryCalendar(targetElement) {
    let userHistoryCalendar = document.querySelector('#userHistoryCalendar');
    let opended = document.querySelector('.opended');

    //移除已打開的 '修改' 內容     
    if (userHistoryCalendar !== null) {
        removeUserHistoryCalendar(opended)
    }

    //產生新的 '修改' 內容
    let insertCalendar = document.createElement('tr')
    insertCalendar.setAttribute('id', 'userHistoryCalendar')
    let selectedBookingId = targetElement.parentElement.parentElement.getAttribute('data-bookingid');
    let selectedBooking = userHistoryData.find(({
        id
    }) => {
        return id.toString() === selectedBookingId;
    });

    tbody.insertBefore(insertCalendar, targetElement.parentElement.parentElement.nextSibling);
    insertCalendar.innerHTML = `<td colspan='5'>${editReservationElement}</td>`;

    getSelectedBookingCalendar(selectedBooking);

    targetElement.innerText = '取消修改';
    targetElement.className += ' opended';
}

function removeUserHistoryCalendar(targetElement) {
    document.querySelector('#userHistoryCalendar').remove();
    targetElement.innerText = '修改';
    targetElement.classList.remove("opended");
}

function monitorEditAction() {
    let dateWrapper = document.querySelector('.dateWrapper');
    let bookingFromWrap = document.querySelector('.newBooking-form-wrap');
    let confirmEdit = document.querySelector('#confirmEdit');

    dateWrapper.addEventListener('click', () => {
        confirmEdit.addEventListener('click', () => {
            updateReservation();
        })
    })

    bookingFromWrap.addEventListener('change', () => {
        confirmEdit.addEventListener('click', () => {
            updateReservation();
        })
    })
}

tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('opended')) {
        removeUserHistoryCalendar(e.target)
    } else if (e.target.classList.contains('editReservationBtn')) {
        createUserHistoryCalendar(e.target);
    } else if (e.target.id === 'cancelBooking') {
        deleteReservation();
    } else if (e.target.id === 'confirmEdit') {
        updateReservation();
    }
})

getUserReservation();