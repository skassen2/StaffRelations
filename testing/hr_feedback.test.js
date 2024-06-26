require('jest-fetch-mock').enableFetchMocks();
//const ExcelJS = require('exceljs');

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');
// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;



describe('Describe function from hr_feedback.js', () => {
    localStorage.setItem('username', 'taruna' ); 
    localStorage.setItem('role', 'HR' );
    localStorage.setItem('name', 'Taruna' );
    localStorage.setItem('surname', 'Naidoo');
    document.body.innerHTML = 
        '<main>'+
        '<section class="grid-container">'+
        '<article id="allfeedback" class="grid-container">'+
        '</article>'+
        '</section>'+
        '<section class="container">'+
        '<form id="addComment">'+
        '<select id="staffDrop" class="dropdown" required>'+
        '<option value="" disabled selected>Select Staff</option>'+
        '</select>'+
        '<input id="topic" type="text" placeholder="Topic" required>'+
        '<textarea id="comment" placeholder="Comment to send" rows="6" required></textarea>'+
        '<br><button id="Send">Send</button>'+
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
        '<section class="container">'+
        '<form id="downloadExcelTime">'+
          '<select id="staffSelection1" class="dropdown" required>'+
            '<option value="" disabled selected>Select staff Member</option>'+
          '</select>'+
          '<button id="genExcelTime">Download Staff Timesheet</button>'+
        '</form>'+
      '</section>'+'</main>';

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
        {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30},
        {task_id: 15, /*manager: 'keren',*/ task: 'test1', description: 'ell', est_time: 300}
    ];
    
    fetch.mockResponseOnce(JSON.stringify({value: feedbacks})).mockResponseOnce(JSON.stringify({value: tasks})).mockResponseOnce(JSON.stringify({value: users})).mockResponseOnce(JSON.stringify({value: users})).mockResponseOnce(JSON.stringify({value: users}));
    const func = require('../src/hr_feedback.js');
    
    test('Test fetchFeedback() returns the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        const feeds = await func.fetchFeedback();
        expect(feeds).toStrictEqual(feedbacks);
    });

    test('Test fetchAssignment() returns the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: assignments}));
        const assigns = await func.fetchAssignment();
        expect(assigns).toStrictEqual(assignments);
    });

    test('Test that fetchUsers() returns the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: users}));
        const urs = await func.fetchUsers();
        expect(urs).toStrictEqual(users);
    });

    test('Test that fetchTasks() returns the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: tasks}));
        const ts = await func.fetchTasks();
        expect(ts).toStrictEqual(tasks);
    });
    
    

    test('Test getUserFeedback() returns right data', () => {
        const staff = 'skassen2';
        const feeds =  func.getUserFeedback(staff, feedbacks);
        expect(feeds).toStrictEqual([
            {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
            {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
            {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6, rating: 2, sender_role:'Staff', receiver_role:'Staff'}
        ]);
    });

   
    test('Test that getManagerWhoAssignedTask()  retruns the correct manager', () => {
        const manager = func.getManagerWhoAssignedTask('test', tasks);
        expect(manager).toBe('keren');
    });


    test('Test addCommentToDatabase()', async () => {
        // Mock a response expected from server
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            task:'test',
            sender:'taruna',
            receiver:'skassen2',
            comment:'please see me.'
        }
        const endpoint = '/data-api/rest/Feedback'; 
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });

        return func.addCommentToDatabase('test', 'taruna', 'skassen2', 'please see me.').then(response => {
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

    test('Test event listener to add comment to database', async () => {
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const butn = document.getElementById('addComment');
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        await await Promise.resolve();
        expect(fetch).toHaveBeenCalled(); //testing that addCommenToDatabase was called.
    });

    test('Test getExcelFeedback() returns the right filtered data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        document.getElementById("staffSelection").value = 'skassen2';
        const data = await func.getExcelFeedback();
        expect(data).toStrictEqual( {
            '0': {
              task: 'test',
              sender: 'jaedon',
              receiver: 'skassen2',
              comment: 'bbbaaa',
              rating: 2
            },
            '1': {
              task: 'Task1',
              sender: 'prashant',
              receiver: 'skassen2',
              comment: 'bbbccaa',
              rating: 2
            },
            '2': {
              task: 'Test code',
              sender: 'prashant',
              receiver: 'skassen2',
              comment: 'aaaaaa',
              rating: 2
            }
          });
    });

    /*test('Test excelDownload event listener to download sheets', async () => {
        Object.defineProperty(ExcelJS, 'Workbook', {
          addWorksheet: jest.fn()
        });
        
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        const btn = document.getElementById('downloadExcel')
        const event = new Event('submit', { bubbles: true });
        btn.dispatchEvent(event);
        await Promise.resolve();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(ExcelJS.Workbook).toHaveBeenCalled();
        

    });*/

    
});

