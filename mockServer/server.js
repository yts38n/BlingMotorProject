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
    const notAllowedCharacters = /[^A-Za-z]/;

    //檢查API路徑進入點是否正確
    if (reqUrl.startsWith('/api/v1/admin/') === true) {
        let [, route] = reqUrl.split('/api/v1/admin/');
        console.log(route);
        //檢查是否存在其他符號       
        if (route.search(notAllowedCharacters) !== -1) {
            console.log('Route contain not allowed characters');
            invalidApi(res);
        } else if (route === 'login') {
            let user = {};
            let result = {};

            if (req.body.hasOwnProperty('data') !== false) {
                user = req.body.data;

                result = db.data.users.userLogin(user);
                if (result['status'] === true) {
                    successAction(res, result);
                } else {
                    failAction(res, result);
                }

            } else {
                dataNotValid(res);
            }
        } else {
            let accessApprove = false;
            let userToken = null;

            //檢查'GET'以外的方法是否帶有data
            console.log('============= Admin =============');
            console.log('req.method : ' + req.method);

            if (req.method !== 'GET') {
                if (req.method !== 'DELETE') {
                    console.log('req.body.data : ' + req.body.data);
                    if (req.body.hasOwnProperty('data') !== false) {
                        userToken = (req.body.data.hasOwnProperty('token') === true) ? req.body.data['token'] : null;
                        accessApprove = db.data.users.checkAdmin(userToken);
                    } else {
                        dataNotValid(res);
                    }
                } else {
                    console.log('req.body.token : ' + req.body.token);
                    if (req.body.hasOwnProperty('token') !== false) {
                        accessApprove = db.data.users.checkAdmin(req.body['token']);
                    } else {
                        dataNotValid(res);
                    }
                }
            }

            if (accessApprove === true) {
                switch (route) {
                    case 'allBookings':
                        switch (req.method) {
                            case 'POST':
                                //Because the result required modification, use deep copy method (JSON convertion) to avoid pollution to the original booking data
                                let result = JSON.parse(JSON.stringify(db.data.bookings.getAllData()));

                                result.forEach(el => {
                                    let userInfo = {};
                                    userInfo = db.data.users.checkUser(el['email']);
                                    el['userInfo'] = userInfo;
                                    delete el['email'];
                                });

                                res.status(200).jsonp({
                                    status: 200,
                                    msg: '已取得所有預訂記錄!!',
                                    data: result
                                });
                                break;

                            case 'PATCH':
                                if (req.body.data.hasOwnProperty('newBookingInfo') === true && req.body.data.hasOwnProperty('bookingId') === true) {
                                    let isDateChange = db.data.bookings.isDateChange(req.body.data);

                                    if (isDateChange === true) {
                                        let checkAvailable = db.data.calendar.availableLock(req.body.data['newBookingInfo']['date']);

                                        if (checkAvailable !== false) {
                                            let result = db.data.bookings.updateBookingByAdmin(req.body.data);
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
                                        let result = db.data.bookings.updateBookingByAdmin(req.body.data);
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

                            default:
                                invalidMethod(res);
                                break;
                        }
                        break;

                    case 'calendar':
                        switch (req.method) {
                            case 'POST':
                                let result = db.data.calendar.getCalendar(req.body.data['calendar']);
                                if (result.hasOwnProperty('msg') !== true) {
                                    successAction(res, result);
                                } else {
                                    failAction(res, result)
                                }
                                break;
                            
                            case 'PATCH':
                                console.log(req.body.data);
                                if (req.body.data.hasOwnProperty('newCalendar') === true) {
                                    let result = db.data.calendar.updateAvailable(req.body.data['newCalendar']);
                                    if (result.hasOwnProperty('msg') !== true) {
                                        successAction(res, result);
                                    } else {
                                        failAction(res, result)
                                    }
                                }else {
                                    dataNotValid(res);
                                }
                                break;

                            default:
                                invalidMethod(res);
                                break;
                        }
                        break;

                    case 'info':
                        switch (req.method) {
                            case 'POST':
                                let result = db.data.users.checkUser(userToken);
                                successAction(res, result);
                                break;

                            case 'PATCH':
                                console.log(req.body.data);
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
                        break;

                    default:
                        invalidApi(res);
                        break;
                }
            } else {
                tokenNotValid(res);
            }

        }

    } else if (reqUrl.startsWith('/api/v1/customers/') === true) {
        let [, route] = reqUrl.split('/api/v1/customers/');

        //檢查是否存在其他符號       
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
                        result = db.data.users.userLogin(user);
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
                        checkUserToken = db.data.users.checkUser(userToken); //undefined if the token is incorrect
                    } else {
                        dataNotValid(res);
                    }
                } else {
                    if (req.body.hasOwnProperty('token') !== false) {
                        userToken = req.body['token'];
                        checkUserToken = db.data.users.checkUser(userToken); //undefined if the token is incorrect
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
                    switch (req.method) {
                        case 'GET':
                            let result = db.data.calendar.getCalendar(query);
                            if (result.hasOwnProperty('msg') !== true) {
                                successAction(res, result);
                            } else {
                                result['msg'] = '該月份未開放預訂';
                                successAction(res, result);
                            }
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
    } else {
        invalidApi(res);
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