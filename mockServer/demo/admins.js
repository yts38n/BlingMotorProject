const data = [{
    "id": 1,
    "username": "機妍 機車美容",
    "userPassword": "00000000",
    "email": "service@blingblingbike.com",
    "phone": "(04)-22220000"
}];

function searchData(userToken) {
    let result = data.find(({
        email
    }) => {
        return email === userToken;
    })
    return result;
}

function getData(isSearchResult) {
    const index = data.findIndex(el => el === isSearchResult);
    return data[index];
}

module.exports = {
    searchData,
    getData,
    data
}