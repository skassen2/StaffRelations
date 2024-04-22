
const login = require('../src/index.js');


test ('Test VALID login', async () => {
    const user = "skassen2";
    const pass = "ekse";
    const ans = await login.checkLogin(user, pass);
    expect(ans).toBe(1);


});

test ('Test INVALID login, wrong password', async () => {
    const user = "skassen2";
    const pass = "ek";
    const ans = await login.checkLogin(user, pass);
    expect(ans).toBe(1);


});

test ('Test INVALID login, wrong username', async () => {
    const user = "skassen";
    const pass = "ekse";
    const ans = await login.checkLogin(user, pass);
    expect(ans).toBe(1);


});

//test null?


