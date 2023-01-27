const data = [{
    "id": 1,
    "year": "2023",
    "months": {
        "1": {
            "available": true,
            "dates": {
                "1672502400000": {
                    "available": false,
                    "spaces": 1
                },
                "1672588800000": {
                    "available": false,
                    "spaces": 2
                },
                "1672675200000": {
                    "available": false,
                    "spaces": 1
                },
                "1672761600000": {
                    "available": false,
                    "spaces": 2
                },
                "1672848000000": {
                    "available": false,
                    "spaces": 0
                },
                "1672934400000": {
                    "available": true,
                    "spaces": 0
                },
                "1673020800000": {
                    "available": true,
                    "spaces": 1
                },
                "1673107200000": {
                    "available": true,
                    "spaces": 2
                },
                "1673193600000": {
                    "available": true,
                    "spaces": 1
                },
                "1673280000000": {
                    "available": true,
                    "spaces": 2
                },
                "1673366400000": {
                    "available": true,
                    "spaces": 1
                },
                "1673452800000": {
                    "available": true,
                    "spaces": 0
                },
                "1673539200000": {
                    "available": true,
                    "spaces": 1
                },
                "1673625600000": {
                    "available": true,
                    "spaces": 2
                },
                "1673712000000": {
                    "available": true,
                    "spaces": 1
                },
                "1673798400000": {
                    "available": true,
                    "spaces": 2
                },
                "1673884800000": {
                    "available": true,
                    "spaces": 2
                },
                "1673971200000": {
                    "available": true,
                    "spaces": 1
                },
                "1674057600000": {
                    "available": true,
                    "spaces": 1
                },
                "1674144000000": {
                    "available": true,
                    "spaces": 2
                },
                "1674230400000": {
                    "available": true,
                    "spaces": 0
                },
                "1674316800000": {
                    "available": true,
                    "spaces": 0
                },
                "1674403200000": {
                    "available": true,
                    "spaces": 0
                },
                "1674489600000": {
                    "available": true,
                    "spaces": 2
                },
                "1674576000000": {
                    "available": true,
                    "spaces": 2
                },
                "1674662400000": {
                    "available": true,
                    "spaces": 1
                },
                "1674748800000": {
                    "available": true,
                    "spaces": 1
                },
                "1674835200000": {
                    "available": true,
                    "spaces": 0
                },
                "1674921600000": {
                    "available": true,
                    "spaces": 1
                },
                "1675008000000": {
                    "available": true,
                    "spaces": 2
                },
                "1675094400000": {
                    "available": true,
                    "spaces": 0
                },
            }
        },
        "2": {
            "available": true,
            "dates": {
                "1675180800000": {
                    "available": true,
                    "spaces": 2
                },
                "1675267200000": {
                    "available": true,
                    "spaces": 1
                },
                "1675353600000": {
                    "available": true,
                    "spaces": 0
                },
                "1675440000000": {
                    "available": true,
                    "spaces": 2
                },
                "1675526400000": {
                    "available": true,
                    "spaces": 1
                },
                "1675612800000": {
                    "available": true,
                    "spaces": 2
                },
                "1675699200000": {
                    "available": true,
                    "spaces": 2
                },
                "1675785600000": {
                    "available": true,
                    "spaces": 0
                },
                "1675872000000": {
                    "available": true,
                    "spaces": 1
                },
                "1675958400000": {
                    "available": true,
                    "spaces": 1
                },
                "1676044800000": {
                    "available": true,
                    "spaces": 2
                },
                "1676131200000": {
                    "available": true,
                    "spaces": 1
                },
                "1676217600000": {
                    "available": true,
                    "spaces": 0
                },
                "1676304000000": {
                    "available": true,
                    "spaces": 2
                },
                "1676390400000": {
                    "available": true,
                    "spaces": 2
                },
                "1676476800000": {
                    "available": true,
                    "spaces": 0
                },
                "1676563200000": {
                    "available": true,
                    "spaces": 1
                },
                "1676649600000": {
                    "available": true,
                    "spaces": 2
                },
                "1676736000000": {
                    "available": true,
                    "spaces": 0
                },
                "1676822400000": {
                    "available": true,
                    "spaces": 1
                },
                "1676908800000": {
                    "available": true,
                    "spaces": 2
                },
                "1676995200000": {
                    "available": true,
                    "spaces": 2
                },
                "1677081600000": {
                    "available": true,
                    "spaces": 2
                },
                "1677168000000": {
                    "available": true,
                    "spaces": 0
                },
                "1677254400000": {
                    "available": true,
                    "spaces": 1
                },
                "1677340800000": {
                    "available": true,
                    "spaces": 2
                },
                "1677427200000": {
                    "available": true,
                    "spaces": 0
                },
                "1677513600000": {
                    "available": true,
                    "spaces": 2
                }
            }
        }
    }
}];

function getMonth(query) {
    let queryYear = query['year'];
    let queryMonth = query['month'];
    let result = {};

    //確認"年份"是否在資料庫
    let item = data.find(({
        year
    }) => {
        return year === queryYear;
    })

    if (item !== undefined) {

        //確認"月份"是否在資料庫，且 "available" 須為 true, 才可以回傳資料       
        if (item['months'].hasOwnProperty(queryMonth) === true) {
            if (item['months'][queryMonth]["available"] === true) {
                result = item['months'][queryMonth];
                result["month"] = queryMonth;
                result["year"] = queryYear;
            } else {
                result["available"] = false;
                result["year"] = queryYear;
                result["month"] = queryMonth;
            }
        } else {
            result["available"] = false;
            result["month"] = queryYear;
            result["month"] = queryMonth;
        }
    } else {
        result["available"] = false;
        result["month"] = queryYear;
        result["month"] = queryMonth;
    }
    return result;
}

function availableLock(date) {
    let bookingYear = new Date(parseInt(date)).getFullYear().toString();
    let bookingMonth = (new Date(parseInt(date)).getMonth() + 1).toString();
    let bookingDate = date;

    let item = data.find(({
        year
    }) => {
        return year = bookingYear
    })

    let isSuccess = false;

    if (item['months'].hasOwnProperty(bookingMonth) === true) {
        if (item['months'][bookingMonth]['available'] === true && item['months'][bookingMonth]['dates'].hasOwnProperty(bookingDate) === true) {
            if (item['months'][bookingMonth]['dates'][bookingDate]['available'] === true && item['months'][bookingMonth]['dates'][bookingDate]['spaces'] > 0) {
                item['months'][bookingMonth]['dates'][bookingDate]['spaces'] -= 1;
                isSuccess = true;
            }
        }
    }

    return isSuccess;
}

function availableRelease(date) {
    console.log("release available");
    let bookingYear = new Date(parseInt(date)).getFullYear().toString();
    let bookingMonth = (new Date(parseInt(date)).getMonth() + 1).toString();
    let bookingDate = date;

    let item = data.find(({
        year
    }) => {
        return year = bookingYear
    })

    let isSuccess = false;

    item['months'][bookingMonth]['dates'][bookingDate]['spaces'] += 1;
    isSuccess = true;

    return isSuccess
}

module.exports = {
    getMonth,
    availableLock,
    availableRelease,
    data
};