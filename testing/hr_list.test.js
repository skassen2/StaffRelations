/*require('jest-fetch-mock').enableMocks();

beforeEach(() => {
    //reseting fetch mocks before each new fetch
    fetch.resetMocks();
    jest.resetAllMocks();
    //setting up innerHTML before each test so that DOM can be tested.
    document.body.innerHTML = '<main>'+
    '<section class="grid-container">'+
        '<article id="staffList" class="grid-container">'+
        '</article>'+
    '</section>'+
    '<section class="container">'+
        '<form id="staffForm">'+
            '<input type="text" id="name" placeholder="Name" required>'+
            '<input type="text" id="surname" placeholder="Surname" required>'+
            '<input type="text" id="role" placeholder="Role" required>'+
            '<input type="text" id="username" placeholder="Username" required>'+
            '<input type="text" id="password" placeholder="Password" required>'+
            '<br>'+
            '<button>Add Staff Member</button>'+
        '</form>'+
    '</section>'+
    '</main>'
});
//const staffList = document.getElementById('staffList');
test ('Test that getStaffManager() returns the right data', async () => {
     const HR = require('../src/hr_list.js');
     //mock fetch response
    fetch.mockResponseOnce(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
   
    const list = await HR.getStaffManager();
    expect(list).toEqual([{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
    {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
    {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
    {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'}]);

});*/
