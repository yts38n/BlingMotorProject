const data = [{
    "id": 1,
    "customerName": "測試用戶一號",
    "userPassword": "00000000",
    "customerEmail": "testUser01@gmail.com",
    "customerPhone": "0911222333"
}, {
    "id": 2,
    "customerName": "測試用戶二號",
    "userPassword": "00000000",
    "customerEmail": "testUser02@gmail.com",
    "customerPhone": "0900111222"
}];
const initDataNum = 2;
let nextId = initDataNum;

function getData(userToken) {
    let item = data.find(({
        customerEmail
    }) => {
        return customerEmail === userToken;
    })
    let result = generateUserData(item);
    return result;
}

function generateUserData(data) {
    let item = {};
    let arr = Object.keys(data);
    arr.forEach(el => {
        if (el !== 'userPassword' && el !== 'id') {
            item[el] = data[el];
        }
    })
    return item;
}

function checkUser(user) {
    let item = data.find(({
        customerEmail
    }) => {
        return customerEmail === user['customerEmail'];
    })

    let result = {
        'user': {},
        'status': false,
        'msg': ''
    };

    if (item !== undefined) {
        if (item['userPassword'] === user['password']) {
            result['user'] = generateUserData(item);
            result['status'] = true;
            result['msg'] = 'Success';
        } else {
            result['user'] = {};
            result['msg'] = 'Password incorrect';
        }
    } else {
        result['user'] = {};
        result['msg'] = 'User does not exist.';
    }
    console.log(result);
    return result;
}

function createUser(user) {
    let item = data.find(({
        customerEmail
    }) => {
        return customerEmail === user['customerEmail'];
    })

    let result = {
        'user': {},
        'status': false,
        'msg': ''
    };

    if (item === undefined) {
        user['id'] = ++nextId;
        data.push(user);
        result['user'] = generateUserData(data[data.length - 1]);
        result['status'] = true;
        result['msg'] = 'Success';
    } else {
        result['user'] = {};
        result['msg'] = 'Email already registed.';
    }

    return result;
}

function editUser(reqData) {
    const index = data.findIndex(el => el['customerEmail'] === reqData['token']);
    let newUserInfo = reqData['newUserInfo'];

    if (newUserInfo.hasOwnProperty('oldPassword') === true && newUserInfo.hasOwnProperty('newPassword') === true) {
        if (newUserInfo['oldPassword'] === data[index]['password']) {
            data[index]['customerName'] = newUserInfo['customerName'];
            data[index]['customerPhone'] = newUserInfo['customerPhone'];
            data[index]['password'] = newUserInfo['newPassword'];
            let result = generateUserData(data[index]);
            return result;
        } else {
            return -1;
        }
    } else {
        data[index]['customerName'] = newUserInfo['customerName'];
        data[index]['customerPhone'] = newUserInfo['customerPhone'];
        let result = generateUserData(data[index]);
        return result;
    }
}

module.exports = {
    getData,
    createUser,
    editUser,
    checkUser,
    data
}