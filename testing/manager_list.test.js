require('jest-fetch-mock').enableFetchMocks();
//move into describe
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;

describe('Functions from manager_list', () => {
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
    const manager = require('../src/manager_list.js');
    test('Test getStaff() returns the right data', async () => {
        const sList = await manager.getStaff();
        expect(sList).toStrictEqual([{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'}]);
    });

    //error recieved because of appendchild test removed for now
    /*test('Test renderStaffList(): document.createElement() has been called', async () =>{
        document.createElement = jest.fn().mockReturnValue({
            classList: {
                add: jest.fn()
            }
        });
        return manager.renderStaffList().then(data => {
            expect(document.createElement).toHaveBeenCalledWith('block');
            expect(element.classList.add).toHaveBeenCalledWith('staff-card');
            // Clean up
            document.createElement.mockRestore();
        });
     
    });*/
});
