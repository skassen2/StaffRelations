//file purely for coverage testing, to be deleted once testing begins in sprint 2

const list = [{
    "username" : "skassen2",
    "password" : "ekse"
}]

function checkLogin(username, password){
    const uN = list[0].username;
    const pW = list[0].password;
    if (username == uN && password == pW){
        return 1;
    }
    else {
        return 0;
    }
}

module.exports = checkLogin;