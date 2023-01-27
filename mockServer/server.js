const jsonServer = require('json-server');
const url = require('url');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = 3000;
const db = require('./demo/db.js')
const router = jsonServer.router(db);

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res) => {
    let reqUrl = url.parse(req.url).pathname;

    //檢查API路徑進入點是否正確
    if (reqUrl.startsWith('/api/v1/customers/') === false) {
        invalidApi(res);
    } else {
        let [, route] = reqUrl.split('/api/v1/customers/');

        //檢查是否存在其他符號
        const notAllowedCharacters = /[^a-z]/;
        if (route.search(notAllowedCharacters) !== -1) {
            invalidApi(res);
        } else if (route === 'login' || route === 'register') {
            let user = {};
            let result = {};

            //檢查是否帶有data
            if (req.body.hasOwnProperty('data') !== false) {
                user = req.body.data;

                switch (route) {
                    case 'login':
                        result = db.data.users.checkUser(user);
                        if (result['status'] === true) {
                            successAction(res, result);
                        } else {
                            failAction(res, result);
                        }
                        break;

                    case 'register':
                        result = db.data.users.createUser(user);
                        if (result['status'] === true) {
                            successAction(res, result);
                        } else {
                            failAction(res, result);
                        }
                        break;

                    default:
                        invalidApi(res);
                        break;
                }
            } else {
                dataNotValid(res);
            }


        } else {
            let userToken = null;
            let checkUserToken = undefined;

            //檢查'GET'以外的方法是否帶有data
            if (req.method !== 'GET') {
                if (req.method !== 'DELETE') {
                    if (req.body.hasOwnProperty('data') !== false) {
                        userToken = (req.body.data.hasOwnProperty('token') === true) ? req.body.data['token'] : null;
                        checkUserToken = db.data.users.getData(userToken); //undefined if the token is incorrect
                    } else {
                        dataNotValid(res);
                    }
                } else {
                    if (req.body.hasOwnProperty('token') !== false) {
                        userToken = req.body['token'];
                        checkUserToken = db.data.users.getData(userToken); //undefined if the token is incorrect
                    } else {
                        dataNotValid(res);
                    }
                }
            }

            switch (route) {
                case 'history':
                    if (checkUserToken !== undefined) {
                        switch (req.method) {
                            case 'POST':
                                let result = db.data.bookings.getData(userToken);
                                res.status(200).jsonp({
                                    status: 200,
                                    msg: '已取得用戶預訂記錄!!',
                                    data: result
                                });
                                break;

                            default:
                                invalidMethod(res);
                                break;
                        }
                    } else {
                        tokenNotValid(res);
                    }
                    break;

                case 'info':
                    if (checkUserToken !== undefined) {
                        switch (req.method) {
                            case 'POST':
                                let result = checkUserToken;
                                successAction(res, result);
                                break;

                            case 'PATCH':
                                if (req.body.data.hasOwnProperty('newUserInfo') === true) {
                                    let result = db.data.users.editUser(req.body.data);
                                    if (result !== -1) {
                                        successAction(res, result);
                                    } else {
                                        dataNotValid(res);
                                    }
                                } else {
                                    dataNotValid(res);
                                }
                                break;

                            default:
                                invalidMethod(res);
                                break;
                        }
                    } else {
                        tokenNotValid(res);
                    }
                    break;

                case 'calendar':
                    let query = req.query;
                    console.log(query);
                    switch (req.method) {
                        case 'GET':
                            let result = db.data.calendar.getMonth(query);
                            successAction(res, result);
                            break;

                        default:
                            invalidMethod(res);
                            break;
                    }
                    break;

                case 'booking':
                    if (checkUserToken !== undefined) {
                        switch (req.method) {
                            case 'POST':
                                if (req.body.data.hasOwnProperty('newBookingInfo') === true) {
                                    let checkAvailable = db.data.calendar.availableLock(req.body.data['newBookingInfo']['date']);
                                    if (checkAvailable !== false) {
                                        let result = db.data.bookings.newBooking(req.body.data);
                                        successAction(res, result);
                                    } else {
                                        let result = {
                                            'msg': '當日預訂已滿'
                                        }
                                        failAction(res, result);
                                    }
                                } else {
                                    dataNotValid(res);
                                }
                                break;

                            case 'PATCH':
                                if (req.body.data.hasOwnProperty('newBookingInfo') === true && req.body.data.hasOwnProperty('bookingId') === true) {
                                    let isDateChange = db.data.bookings.isDateChange(req.body.data);

                                    if (isDateChange === true) {
                                        let checkAvailable = db.data.calendar.availableLock(req.body.data['newBookingInfo']['date']);

                                        if (checkAvailable !== false) {
                                            let result = db.data.bookings.updateBooking(req.body.data);
                                            if (result['status'] === true) {
                                                db.data.calendar.availableRelease(result['originalBookingDate']);
                                                delete result['originalBookingDate'];
                                                successAction(res, result);
                                            } else {
                                                failAction(res, result);
                                            }
                                        } else {
                                            let result = {
                                                'msg': '當日預訂已滿'
                                            }
                                            failAction(res, result);
                                        }
                                    } else if (isDateChange === false) {
                                        let result = db.data.bookings.updateBooking(req.body.data);
                                        if (result['status'] === true) {
                                            delete result['originalBookingDate'];
                                            successAction(res, result);
                                        } else {
                                            failAction(res, result);
                                        }
                                    } else {
                                        dataNotValid(res);
                                    }
                                } else {
                                    dataNotValid(res);
                                }
                                break;

                            case 'DELETE':
                                if (req.body.hasOwnProperty('bookingId') === true) {
                                    let result = db.data.bookings.deleteBooking(req.body);
                                    if (result['status'] === true) {
                                        db.data.calendar.availableRelease(result['originalBookingDate']);
                                        delete result['originalBookingDate'];
                                        successAction(res, result);
                                    }
                                } else {
                                    dataNotValid(res);
                                }
                                break;

                            default:
                                invalidMethod(res);
                                break;
                        }
                    } else {
                        dataNotValid(res);
                    }
                    break;

                default:
                    invalidApi(res);
                    break;
            }
        }
    }
});

server.use('/api/v1', router);
server.listen(port, () => {
    console.log('===== Json Server is running !! =====');
});

function invalidApi(res) {
    res.status(400).jsonp({
        status: 400,
        msg: "Not a valid API",
        data: []
    });
}

function invalidMethod(res) {
    res.status(400).jsonp({
        status: 400,
        msg: "Not a valid method",
        data: []
    });
}

function tokenNotValid(res) {
    res.status(400).jsonp({
        status: 400,
        msg: "Require a valid token.",
        data: []
    });
}

function dataNotValid(res) {
    res.status(400).jsonp({
        status: 400,
        msg: "Not a valid data.",
        data: []
    });
}

function successAction(res, result) {
    res.status(200).jsonp({
        status: 200,
        msg: '成功',
        data: result
    });
}

function failAction(res, result) {
    res.status(400).jsonp({
        status: 400,
        msg: "Not a valid data.",
        data: result
    });
}