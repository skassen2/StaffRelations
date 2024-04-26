require('jest-fetch-mock').enableFetchMocks();

beforeEach(() => {
    fetch.mockResponse(JSON.stringify({
        value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
    }));
    document.body.innerHTML = '<main>'+
    '<section class="grid-container">'+
        '<article id="staffList" class="grid-container">'+
        '</article>'+
    '</section>'+
    '<section class="container">'+
        '<form id="staffForm">'+
            '<input type="text" id="name" placeholder="Name" required>'+
            '<input type="text" id="surname" placeholder="Surname" required>'+
            '<input type="text" id="username" placeholder="Username" required>'+
            '<input type="text" id="password" placeholder="Password" required>'+
            '<br>'+
            '<button>Add Staff Member</button>'+
        '</form>'+
    '</section>'+
'</main>';
});

describe('Functions from manager_list', () => {
    
    test('Test getStaff() returns the right data', async () => {
        const manager = require('../src/manager_list.js');
        const sList = await manager.getStaff();
        expect(sList).toStrictEqual([{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'}]);
    });

    //note can test same as hr_list for renderStaffList
});
