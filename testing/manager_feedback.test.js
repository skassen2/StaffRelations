require('jest-fetch-mock').enableFetchMocks();
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;
describe('Describe function from manager_feedback.js', () => {
    localStorage.setItem('username', 'keren' ); 
    localStorage.setItem('role', 'Manager' );
    localStorage.setItem('name', 'Keren' );
    localStorage.setItem('surname', 'Chetty');
    document.body.innerHTML = 
        '<main>'+
        '<section class="grid-container">'+
        '<article id="allfeedback" class="grid-container">'+
        '</article>'+
        '</section>'+
        '<section class="container">'+
        '<form id="addComment">'+
        '<select id="tasksDrop" class="dropdown" required>'+
        '<option value="" disabled selected>Select task</option>'+
        '</select>'+
        '<br>'+
        '<button type="button" id="nextButton">Next</button>'+
        '</form>'+
        '</section>'+
        '<section class="container">'+
        '<form id="addComment2">'+
        '<select id="staffDrop" class="dropdown" required>'+
        '<option value="" disabled selected>Select Staff</option>'+
        '</select>'+
        '<input id="topic" type="text" placeholder="Topic" required>'+
        '<textarea id="comment" placeholder="Comment to send" rows="6" required></textarea>'+
        '<br>'+
        '<input id="rating" type="number" min="0" max="10" placeholder="(Otional) add anon rating">'+
          '<br></br>'+
        '<button type="submit" id="Send">Send</button>'+
        '</form>'+
        '</section>'+
        '<section class="container">'+
        '<form id="downloadExcel">'+
          '<select id="staffSelection" class="dropdown" required>'+
            '<option value="" disabled selected>Select staff to view</option>'+
          '</select>'+
          '<button id="genExcelFile">Download Staff Performance</button>'+
        '</form>'+
        '</section>'+
        '</main>';

    const feedbacks = [
      {task: 'test', sender: 'skassen2', receiver: 'jaedon', comment: 'aaaaaa', id: 2, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Task1', sender: 'prashant', receiver: 'keren', comment: 'b', id: 7, rating: 2, sender_role:'Staff', receiver_role:'Manager'}
    ];

    const assignments = [
      {assignment_id: 97, task: 'Test code', staff: 'prashant'}, 
      {assignment_id: 98, task: 'Test code', staff: 'skassen2'},
      {assignment_id: 99, task: 'Create diagrams', staff: 'skassen2'},
      {assignment_id: 100, task: 'Create diagrams', staff: 'jaedon'}, 
      {assignment_id: 101, task: 'Create diagrams', staff: 'prashant'}
    ];

    const users = [
      {username: 'angie', name: 'Angie', surname: 'Erusmus', password: 'pass', role: 'Manager'},
      {username: 'dummy', name: 'dummyname', surname: 'dummysurname', password: 'pass', role: 'HR'},
      {username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'}, 
      {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
      {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
      {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
      {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}
    ];

    const tasks = [
        {task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
        {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}
    ];
    
    fetch.mockResponseOnce(JSON.stringify({value: feedbacks})).mockResponseOnce(JSON.stringify({value: users})).mockResponseOnce(JSON.stringify({value: users}));
    const func = require('../src/manager_feedback.js');

    test('Test fetchFeedback() returns the correct data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        const feeds = await func.fetchFeedback();
        expect(feeds).toStrictEqual(feedbacks);
    });

    test('Test that fetchUsers() returns the correct data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: users}));
        const urs = await func.fetchUsers();
        expect(urs).toStrictEqual(users);
    });

    test('Test getUserFeedback() returns right data', () => {
        const staff = 'keren';
        const feeds =  func.getUserFeedback(staff, feedbacks);
        expect(feeds).toStrictEqual([{task: 'Task1', sender: 'prashant', receiver: 'keren', comment: 'b', id: 7, rating: 2, receiver_role: 'Manager', sender_role: 'Staff'}]);
    });

    /*test('Test getStaffRole() returns the right data', async () => {
        
    });*/

    test('Test addCommentToDatabase()', async () => {
        // Mock a response expected from server
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            task:'test',
            sender:'keren',
            receiver:'skassen2',
            comment:'please see me.',
            sender_role: 'Manager',
            receiver_role: 'Staff',
            rating: 2
        }
        const endpoint = '/data-api/rest/Feedback'; 
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });

        return func.addCommentToDatabase('test', 'keren', 'skassen2', 'please see me.', 'Manager', "Staff", 2).then(response => {
            expect(fetch).toHaveBeenCalledWith(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    /*test('Test eventListener for adding new comment', async () => {
        const Sub = document.getElementById('addComment2');
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            task:'test',
            sender:'keren',
            receiver:'skassen2',
            comment:'please see me.',
            rating: 2,
            sender: 'keren',
            sender_role: "Manager",
            receiver_role: 'Staff'
        }
        const endpoint = '/data-api/rest/Feedback'; 
        document.getElementById("staffDrop").value = 'skassen2';
        document.getElementById("topic").value = 'test';
        document.getElementById("comment").value = 'please see me.';
        document.getElementById("rating").value = '2';
        const sender = 'keren';
        const sender_role = "Manager";
        const receiver_role= 'Staff';

        const event = new Event('submit', { bubbles: true });
        Sub.dispatchEvent(event);
        expect(fetch).toHaveBeenCalledWith(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
       

    });*/
});

