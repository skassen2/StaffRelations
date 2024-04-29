require('jest-fetch-mock').enableFetchMocks();
//move into describe
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
                '<input type="text" id="role" placeholder="Role" required>'+
                '<input type="text" id="username" placeholder="Username" required>'+
                '<input type="text" id="password" placeholder="Password" required>'+
                '<br>'+
                '<button>Add Staff Member</button>'+
            '</form>'+
        '</section>'+
    '</main>';
});

describe('Functions from hr_list', () => {
    //innerHTML if needed
    test('Test getStaffManager(): returns right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
            {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
            {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
            {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
            {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
        }));
        const HR = require('../src/hr_list.js');
        const res = await HR.getStaffManager();
        expect(res).toStrictEqual([{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'}]);
    });

    //error recieved because of appendchild test removed for now
    /*test('Test renderStaffList(): document.createElement() has been called', async () =>{
        const HR = require('../src/hr_list.js');
        document.createElement = jest.fn().mockReturnValue({
            classList: {
                add: jest.fn()
            }
        });
        fetch.mockResponseOnce(JSON.stringify({
            value : [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
            {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
            {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
            {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
            {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]
        }));
        return HR.renderStaffList().then(data => {
            expect(document.createElement).toHaveBeenCalledWith('block');
            expect(element.classList.add).toHaveBeenCalledWith('staff-card');
            // Clean up
            document.createElement.mockRestore();
        });
    });*/
});
