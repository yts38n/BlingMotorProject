const data = [{
    'id': 1,
    'status': '預約成功',
    'date': '1676390400000',
    'plan': '頂級鍍膜',
    'email': 'testUser01@gmail.com',
    'userRemarks': 'YAMAHA R7'
}, {
    'id': 2,
    'status': '已完成',
    'date': '1671552000000',
    'plan': '基礎護理',
    'email': 'testUser01@gmail.com',
    'userRemarks': 'YAMAHA R3 2010'
}, {
    'id': 3,
    'status': '待取車',
    'date': '1672761600000',
    'plan': '基礎護理',
    'email': 'testUser02@gmail.com',
    'userRemarks': 'KTM Duke 390'
}, {
    'id': 4,
    'status': '已完成',
    'date': '1671292800000',
    'plan': '頂級鍍膜',
    'email': 'testUser02@gmail.com',
    'userRemarks': 'KAWASAKI Z400'
}, {
    'id': 5,
    'status': '預約成功',
    'date': '1674230400000',
    'plan': '頂級鍍膜',
    'email': 'testUser01@gmail.com',
    'userRemarks': 'YAHAMA MT15'
}];

const initDataNum = 5;
let nextId = initDataNum;

function getData(userToken) {
    let result = [];
    data.forEach((el) => {
        if (el['email'] === userToken) {
            result.push(el)
        }
    });
    return result;
}

function getAllData() {
    let result = [];
    data.forEach(el => {
        result.push(el)
    });
    return result;
}

function newBooking(reqData) {
    let user = reqData['token'];
    let newBookingInfo = reqData['newBookingInfo'];

    newBookingInfo['id'] = ++nextId;
    newBookingInfo['status'] = '預約成功';
    newBookingInfo['email'] = user;
    data.push(newBookingInfo);
    return newBookingInfo;
}

function updateBooking(reqData) {
    let user = reqData['token'];
    let newBookingInfo = reqData['newBookingInfo'];
    let result = {
        'originalBookingDate': '',
        'updatedBookingInfo': {},
        'status': false,
        'msg': ''
    };

    const index = data.findIndex(el => el['id'] === parseInt(reqData['bookingId']));

    if (index !== -1) {
        if (data[index]['email'] === user) {
            result['originalBookingDate'] = data[index]['date'];

            Object.entries(newBookingInfo).forEach(([key]) => {
                data[index][key] = newBookingInfo[key]
            });

            result['updatedBookingInfo'] = data[index];
            result['status'] = true;
            result['msg'] = '已更新預訂';
        } else {
            result['msg'] = '用戶錯誤';
        }
    } else {
        result['msg'] = '訂單ID錯誤';
    }

    return result;
}

function deleteBooking(reqData) {
    let user = reqData['token'];
    let bookingId = parseInt(reqData['bookingId']);

    let result = {
        'originalBookingDate': '',
        'status': false,
        'msg': ''
    };

    const index = data.findIndex(el => el['id'] === bookingId);

    if (index !== -1) {
        if (data[index]['email'] === user) {
            data[index]['status'] = '已取消'

            result['originalBookingDate'] = data[index]['date'];
            result['status'] = true;
            result['msg'] = '已取消預訂';
        } else {
            result['msg'] = '用戶錯誤';
        }
    } else {
        result['msg'] = '訂單ID錯誤';
    }

    return result;
}

function isDateChange(reqData) {
    const index = data.findIndex(el => el['id'] === parseInt(reqData['bookingId']));
    let result = undefined;

    if (index !== -1) {
        result = (data[index]['date'] !== reqData['newBookingInfo']['date']) ? true : false;
    }
    console.log(result);
    return result;
}

module.exports = {
    getData,
    getAllData,
    newBooking,
    updateBooking,
    deleteBooking,
    isDateChange,
    data
}