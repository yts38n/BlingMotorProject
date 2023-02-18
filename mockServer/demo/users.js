const data = [{
    "id": 1,
    "userName": "機妍管理者一號",
    "userPassword": "00000000",
    "userEmail": "service@blingblingbike.com",
    "userPhone": "(04)-22220000",
    "userIdentity":"管理者"
},{
    "id": 2,
    "userName": "測試用戶一號",
    "userPassword": "00000000",
    "userEmail": "testUser01@gmail.com",
    "userPhone": "0911222333",
    "userIdentity":"一般使用者"
}, {
    "id": 3,
    "userName": "測試用戶二號",
    "userPassword": "00000000",
    "userEmail": "testUser02@gmail.com",
    "userPhone": "0900111222",
    "userIdentity":"一般使用者"
}];
const initDataNum = 2;
let nextId = initDataNum;

function checkUser(userToken) {
    
    let item = data.find(({
        userEmail
    }) => {
        return userEmail === userToken;
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

function userLogin(user) {
    let item = data.find(({
        userEmail
    }) => {
        return userEmail === user['userEmail'];
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
        userEmail
    }) => {
        return userEmail === user['userEmail'];
    })

    let result = {
        'user': {},
        'status': false,
        'msg': ''
    };

    if (item === undefined) {
        user['id'] = ++nextId;
        user['userIdentity'] = '一般使用者';
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
    const index = data.findIndex(el => el['userEmail'] === reqData['token']);
    let newUserInfo = reqData['newUserInfo'];

    if (newUserInfo.hasOwnProperty('oldPassword') === true && newUserInfo.hasOwnProperty('newPassword') === true) {
        if (newUserInfo['oldPassword'] === data[index]['password']) {
            data[index]['userName'] = newUserInfo['userName'];
            data[index]['userPhone'] = newUserInfo['userPhone'];
            data[index]['password'] = newUserInfo['newPassword'];
            let result = generateUserData(data[index]);
            return result;
        } else {
            return -1;
        }
    } else {
        data[index]['userName'] = newUserInfo['userName'];
        data[index]['userPhone'] = newUserInfo['userPhone'];
        let result = generateUserData(data[index]);
        return result;
    }
}

module.exports = {
    checkUser,
    createUser,
    editUser,
    userLogin,
    data
}