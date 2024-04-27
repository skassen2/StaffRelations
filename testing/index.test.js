//code may need to change is 3rd party user verifivation is completed.

require('jest-fetch-mock').enableMocks();
const login = require('../src/index.js');

beforeEach(() => {
    //reseting fetch mocks before each new fetch
    //fetch.resetMocks();
    //setting up innerHTML before each test so that DOM can be tested.
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
    //mock fetch response
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
    expect(loginCred).toBe(1); //correct user login recieves code 1


});

test ('Test INVALID login, wrong password using checkLogin()', async () => {
    //mock fetch response
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
    expect(loginCred).toBe(0); //incorrect password recieves code 0


});

test ('Test INVALID login, wrong username using checkLogin()', async () => {
    //mock fetch response
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
    expect(loginCred).toBe(-1);  //incorrect username recieves code -1


});

test ('Test INVALID login, wrong username and password using checkLogin()', async () => {
    //mock fetch response
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
    const user = "skassen";
    const pass = "ek";
    const loginCred = await login.checkLogin(user, pass);
    expect(loginCred).toBe(-1); //incorrect username recieves code -1



});


test ('Test whether getUserInfo() returns the correct data', async () =>{
    //mock fetch response
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
    //expect correct details to be returned for a user
    expect(userInfo).toEqual({
    "username": "skassen2",
    "name": "Shaneel",
    "surname": "Kassen",
    "password": "ekse",
    "role": "Staff",
    "email": "2539340@students.wits.ac.za"
    }); 

});

test('Test Login() where no user input is given, expect to be alerted to fill in user details', async () =>{

    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = '';
    input2Value.value = '';
    login.login();
    const alert=document.getElementById('alert');
    expect(alert.textContent).toBe('Please fill in both input fields.'); //alert should have this text

});

test('Test Login() where only username is given, expect to be alerted to fill in user details', async () =>{

    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen';
    input2Value.value = '';
    login.login();
    const alert=document.getElementById('alert');
    expect(alert.textContent).toBe('Please fill in both input fields.'); //alert should have this text

});

test('Test Login() where only password is given, expect to be alerted to fill in user details', async () =>{

    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = '';
    input2Value.value = 'ekse';
    login.login();
    const alert=document.getElementById('alert');
    expect(alert.textContent).toBe('Please fill in both input fields.'); //alert should have this text

});

test('Test Login() where incorrect username is given, expect to be alerted that username is invalid', async () =>{
    //mock fetch response
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
        expect(alert.textContent).toBe('Invalid username'); //alert should have this text
    });
    
});

test('Test Login() where incorrect password is given, expect to be alerted that password is incorrect', async () =>{
    //mock fetch response
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
        expect(alert.textContent).toBe('Incorrect password'); //alert should have this text
    });
    
});

test('Test Login() where VALID login is given for staff, expect to be alerted that you are logging in', async () =>{
    //mock fetch response
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

    const CALLBACK_URL = 'https://jolly-ocean-04e2df210.5.azurestaticapps.net/staff_dash.html';
    Object.defineProperty(window, 'location', {
        value: {
          href: 'https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/oauth2/v2.0/authorize?client_id=b644e6ee-1475-4a22-b480-321b16113323&response_type=code&redirect_uri=${encodeURIComponent(CALLBACK_URL)}&response_mode=query&scope=openid profile email' 
        }
      });
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen2';
    input2Value.value = 'ekse';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('loging in...'); //alert should have this text
        expect(window.location.href).toBe('https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/oauth2/v2.0/authorize?client_id=b644e6ee-1475-4a22-b480-321b16113323&response_type=code&redirect_uri=https%3A%2F%2Fjolly-ocean-04e2df210.5.azurestaticapps.net%2Fstaff_dash.html&response_mode=query&scope=openid profile email');
    });
    
});

test('Test Login() where VALID login is given for manager, expect to be alerted that you are logging in', async () =>{
    //mock fetch response
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

    const CALLBACK_URL1 = 'https://jolly-ocean-04e2df210.5.azurestaticapps.net/manager_dash.html';
    Object.defineProperty(window, 'location', {
        value: {
          href: 'https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/oauth2/v2.0/authorize?client_id=b644e6ee-1475-4a22-b480-321b16113323&response_type=code&redirect_uri=${encodeURIComponent(CALLBACK_URL1)}&response_mode=query&scope=openid profile email' 
        }
      });
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen2';
    input2Value.value = 'ekse';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('loging in...'); //alert should have this text
        expect(window.location.href).toBe('https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/oauth2/v2.0/authorize?client_id=b644e6ee-1475-4a22-b480-321b16113323&response_type=code&redirect_uri=https%3A%2F%2Fjolly-ocean-04e2df210.5.azurestaticapps.net%2Fmanager_dash.html&response_mode=query&scope=openid profile email');
    });
    
});

test('Test Login() where VALID login is given for HR, expect to be alerted that you are logging in', async () =>{
    //mock fetch response
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

    
    Object.defineProperty(window, 'location', {
        value: {
          href: 'https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/oauth2/v2.0/authorize?client_id=b644e6ee-1475-4a22-b480-321b16113323&response_type=code&redirect_uri=${encodeURIComponent(CALLBACK_URL2)}&response_mode=query&scope=openid profile email' 
        }
      });
    const input1Value = document.getElementById('username');
    const input2Value = document.getElementById('password');
    input1Value.value = 'skassen2';
    input2Value.value = 'ekse';
    return login.login().then(data => {
        const alert=document.getElementById('alert');
        expect(alert.textContent).toBe('loging in...'); //alert should have this text
        expect(window.location.href).toBe('https://login.microsoftonline.com/4b1b908c-5582-4377-ba07-a36d65e34934/oauth2/v2.0/authorize?client_id=b644e6ee-1475-4a22-b480-321b16113323&response_type=code&redirect_uri=https%3A%2F%2Fjolly-ocean-04e2df210.5.azurestaticapps.net%2Fhr_dash.html&response_mode=query&scope=openid profile email');
    });
    
});

