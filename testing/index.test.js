//code may need to change is 3rd party user verifivation is completed.

require('jest-fetch-mock').enableMocks();
const login = require('../src/index.js');

beforeEach(() => {
    //reseting fetch mocks before each new fetch
    fetch.resetMocks();
    //setting up innerHTML before each test so that DOM can be tested.
    //note: try test this with only needed HTML elements 
    document.body.innerHTML = '<section class="container">'+
    '<form class="form" id="login">'+
        '<h1 class="form__title">Login</h1>'+
        '<div class="form__message form__message--error"></div>'+
        '<section class="form__input-group">'+
            '<input type="text" class="form__input" autofocus placeholder="Username" required id="username" autocomplete="username">'+
            '<div class="form__input-error-message"></div>'+
        '</section>'+
        '<section class="form__input-group">'+
            '<input type="password" class="form__input" autofocus placeholder="Password" required id="password" autocomplete="current-password">'+
            '<div class="form__input-error-message"></div>'+
        '</section>'+
        '<button class="form__button" type="button" id="loginbutton" onclick="login()">Continue</button>'+
        '<strong><p class="form__alert" id="alert"></p></strong>'+
    '</form>'+
    '</section>';
});

test ('Test VALID login using checkLogin()', async () => {
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
    const user = "skassen2";
    const pass = "ekse";
    const loginCred = await login.checkLogin(user, pass);
    expect(loginCred).toBe(1);


});

test ('Test INVALID login, wrong password using checkLogin()', async () => {
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
    const user = "skassen2";
    const pass = "ek";
    const loginCred = await login.checkLogin(user, pass);
    expect(loginCred).toBe(0);


});

test ('Test INVALID login, wrong username using checkLogin()', async () => {
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
    const user = "skassen";
    const pass = "ekse";
    const loginCred = await login.checkLogin(user, pass);
    expect(loginCred).toBe(-1);


});

test ('Test whether getUserInfo() returns the correct data', async () =>{
    fetch.mockResponseOnce(JSON.stringify({ value : [{ 
            "username": "skassen2", 
            "name": "Shaneel",
            "surname": "Kassen",
            "password": "ekse",
            "role": "Staff",
            "email": "2539340@students.wits.ac.za"
        }]
        }));
    const user = "skassen2";
    const userInfo = await login.getUserInfo(user);
    expect(userInfo).toEqual({
    "username": "skassen2",
    "name": "Shaneel",
    "surname": "Kassen",
    "password": "ekse",
    "role": "Staff",
    "email": "2539340@students.wits.ac.za"
    });

});

//test null?
//test right url fetched?

test('Test Login() where no user input is given, expect to be alerted to fill in user details', async () =>{

    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = '';
    input2Value.value = '';
    login.login();
    const alert=document.getElementById('alert');
    expect(alert.textContent).toBe('Please fill in both input fields.');

});

test('Test Login() where only username is given, expect to be alerted to fill in user details', async () =>{

    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen';
    input2Value.value = '';
    login.login();
    const alert=document.getElementById('alert');
    expect(alert.textContent).toBe('Please fill in both input fields.');

});

test('Test Login() where only password is given, expect to be alerted to fill in user details', async () =>{

    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = '';
    input2Value.value = 'ekse';
    login.login();
    const alert=document.getElementById('alert');
    expect(alert.textContent).toBe('Please fill in both input fields.');

});

test('Test Login() where incorrect username is given, expect to be alerted that username is invalid', async () =>{
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen';
    input2Value.value = 'ekse';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('Invalid username');
    });
    
});

test('Test Login() where incorrect password is given, expect to be alerted that password is incorrect', async () =>{
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen2';
    input2Value.value = 'ek';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('Incorrect password');
    });
    
});

test('Test Login() where VALID login is given for staff, expect to be alerted that you are logging in', async () =>{
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    })).mockResponseOnce(JSON.stringify({ value : [{ 
        "username": "skassen2", 
        "name": "Shaneel",
        "surname": "Kassen",
        "password": "ekse",
        "role": "Staff",
        "email": "2539340@students.wits.ac.za"
    }]}));
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen2';
    input2Value.value = 'ekse';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('loging in...'); 
        
    });
    
});

test('Test Login() where VALID login is given for manager, expect to be alerted that you are logging in', async () =>{
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Manager'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    })).mockResponseOnce(JSON.stringify({ value : [{ 
        "username": "skassen2", 
        "name": "Shaneel",
        "surname": "Kassen",
        "password": "ekse",
        "role": "Manager",
        "email": "2539340@students.wits.ac.za"
    }]}));
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen2';
    input2Value.value = 'ekse';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('loging in...'); 
        
    });
    
});

test('Test Login() where VALID login is given for HR, expect to be alerted that you are logging in', async () =>{
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'HR'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    })).mockResponseOnce(JSON.stringify({ value : [{ 
        "username": "skassen2", 
        "name": "Shaneel",
        "surname": "Kassen",
        "password": "ekse",
        "role": "HR",
        "email": "2539340@students.wits.ac.za"
    }]}));
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen2';
    input2Value.value = 'ekse';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('loging in...'); 
        
    });
    
});


