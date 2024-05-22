//file receives 100% code coverage as renderTasks() lines are parsed when js file is required.
//note however renderTasks() is not explicitly tested as it functions purely for front end set-up 
//all functions called within it have been tested

//tests failing due to some test environment set up issues that cannot be fixed before submission time

require('jest-fetch-mock').enableFetchMocks();
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;
beforeEach(() =>{
    global.alert = jest.fn();
});

//Tests functions: getTasks, taskNameValid, getStaff, getManagersTasks, existsAssignment
describe('Functions from manager_task.js', () => {
    localStorage.setItem('username', 'keren' ); 
    localStorage.setItem('role', 'Manager' );
    localStorage.setItem('name', 'Keren' );
    localStorage.setItem('surname', 'Chetty');
    document.body.innerHTML = '<main>'+
    '<section class="grid-container">'+
        '<article id="staffList" class="grid-container">'+
        '</article>'+
    '</section>'+
    '<section class="container">'+
        '<form id="taskform">'+
            '<input type="text" id="task" placeholder="Task" required>'+
            '<input type="number" id="est_time"  placeholder="Estimated time in minutes" required min="1">'+
            '<textarea id="description" placeholder="Description" rows="6" required></textarea>'+
            '<br>'+
            '<button id="addtask">Add task</button>'+
        '</form>'+
        '<form id="assignment">'+
            '<select id="taskdrop" class="dropdown" required>'+
                '<option value="" disabled selected>Select task</option>'+
            '</select><br>'+
            '<select id="staffdrop"  class="dropdown" required>'+
                '<option value="" disabled selected>Select a staff member</option>'+
            '</select>'+
            '<br>'+
           '<button id="adsk">Add assignment</button>'+
        '</form>'+
    '</section>'+
    '<section class="container">'+
    '<form id="downloadExcel">'+
      '<select id="staffSelection" class="dropdown" required>'+
        '<option value="" disabled selected>Select staff Member</option>'+
      '</select>'+
      '<button id="genExcelFile">Download Staff Timesheet</button>'+
    '</form>'+
    '</section>'+
    '</main> ';
    
    let timeTasks = [
        {id: 1, task: 'fix errors!!!', staff: 'jaedon', time_logged: 1, log_date: '2024-05-18'},
        {id: 2, task: 'fix errors!!!', staff: 'jaedon', time_logged: 2, log_date: '2024-05-18'},
        {id: 3, task: 'fix errors!!!', staff: 'skassen2', time_logged: 20, log_date: '2024-05-18'},
        {id: 4, task: 'fix errors!!!', staff: 'skassen2', time_logged: 5, log_date: '2024-05-19'},
        {id: 5, task: 'Get the graph to work', staff: 'prashant', time_logged: 4, log_date: '2024-05-19'},
        {id: 6, task: 'Get the graph to work', staff: 'jaedon', time_logged: 3, log_date: '2024-05-19'}
    ];

    let assigments = [{task: 'Test', staff: 'skassen2', total_time: 2, id: 26},
        {task: 'rgt', staff: 'prashant', total_time: 0, id: 27},
        {task: 'Task77', staff: 'jaedon', total_time: 27, id: 28},
        {task: 'Task77', staff: 'prashant', total_time: 0, id: 29},
        {task: 'Test', staff: 'jaedon', total_time: 4, id: 30},
        {task: 'Test2', staff: 'jaedon', total_time: 30, id: 31},
        {task: 'Task55', staff: 'jaedon', total_time: 61, id: 32},
        {task: 'Task77', staff: 'skassen2', total_time: 70, id: 33},
        {task: 'Test', staff: 'skassen2', total_time: 1, id: 34},
        {task: 'Test', staff: 'skassen2', total_time: 1, id: 35}];
    
    let times = [{task: 'test', staff: 'jaedon', total_time: 24, id: 57},
        {task: 'Task1', staff: 'jaedon', total_time: 1, id: 58},
        {task: 'test', staff: 'skassen2', total_time: 0, id: 59}
        /*{task: 'test', staff: 'jaedon', total_time: 0, id: 60}*/];
   
    //check if jSON is correct
    let json = [
        {
            "task_id": 1,
            "manager": "keren",
            "task": "Test",
            "description": "This is a test",
            "est_time": 5
        },
        {
            "task_id": 2,
            "manager": "keren",
            "task": "Task",
            "description": "I dont know",
            "est_time": 545
        },
        {
            "task_id": 3,
            "manager": "random",
            "task": "finance statements",
            "description": "This is a test",
            "est_time": 88
        },
        {
            "task_id": 4,
            "manager": "keren",
            "task": "Task1",
            "description": "d",
            "est_time": 55
        },
        {
            "task_id": 5,
            "manager": "keren",
            "task": "Task2",
            "description": "tgg",
            "est_time": 4
        }];
    
    const users = [
        {username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}
    ];

    fetch.mockResponseOnce(JSON.stringify({value: json})).mockResponseOnce(JSON.stringify({value : users })).mockResponseOnce(JSON.stringify({value: times})).mockResponseOnce(JSON.stringify({value : users }));
    const func = require('../src/manager_task.js');
    
    //tests
    test('Test that getTasks return the right arr of tasks', () => {
    const manager = "keren";
    const list = func.getTasks(manager, json);
    expect(list).toStrictEqual([{
        "task_id": 1,
        "manager": "keren",
        "task": "Test",
        "description": "This is a test",
        "est_time": 5
    },
    {
        "task_id": 2,
        "manager": "keren",
        "task": "Task",
        "description": "I dont know",
        "est_time": 545
    },
    {
        "task_id": 4,
        "manager": "keren",
        "task": "Task1",
        "description": "d",
        "est_time": 55
    },
    {
        "task_id": 5,
        "manager": "keren",
        "task": "Task2",
        "description": "tgg",
        "est_time": 4
    }]);
    });
    
    test('Test that taskNameValid returns 0 if a task already exists', () =>{
        const taskName = 'Test';
        const validity = func.taskNameValid(json, taskName);
        expect(validity).toBe(0);
    });
    
    test('Test that taskNameValid returns 1 if a task does not exists', () =>{
        const taskName = 'Tes';
        const validity = func.taskNameValid(json, taskName);
        expect(validity).toBe(1);
    });

    test('Test that getStaff returns an arr of staff members', () =>{
        let staffList = [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}];

        const sList = func.getStaff(staffList);
        expect(sList).toStrictEqual(['jaedon', 'prashant', 'skassen2']);
    });

    test('Test that getManagersTasks returns the correct list of tasks a manager has created', () =>{
        let Tlist = func.getManagersTasks(json, "keren");
        expect(Tlist).toStrictEqual(['Test', 'Task', 'Task1', 'Task2']);
        Tlist = func.getManagersTasks(json, "random");
        expect(Tlist).toStrictEqual(['finance statements']);
    });

    test('Test that existsAssignment returns 0 if an assignemnt of a staff member to a task already exists', () =>{
        let assigned = func.existsAssignment(assigments, 'Test', 'skassen2');
        expect(assigned).toBe(0);
    });

    test('Test that existsAssignment returns 1 if an assignemnt of a staff member to a task does not exists', () =>{
        let assigned = func.existsAssignment(assigments, 'Test', 'angie');
        expect(assigned).toBe(1);
    });

    test('test that taskform.eventListener posts the right created task to the database', async () => {
        //set up values for event listener to use
        document.getElementById('task').value = 't1';
        document.getElementById('est_time').value = 300;
        document.getElementById('description').value = 'DESCPT';
        //mocks
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });
        fetch.resetMocks()
        const mockResponse = { status: 201, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify({value: json})).mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });
        const data={
            manager: 'keren',
            task: 't1',
            description: 'DESCPT',
            est_time: '300'
        }
        const endpoint = `/data-api/rest/Tasks/`;
        const butn = document.getElementById("taskform");
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(2, endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });   
    });

    test('test that taskform.eventListener alerts when a task already exists', async () => {
        //set up values for event listener to use
        document.getElementById('task').value = 'Test';
        document.getElementById('est_time').value = 5;
        document.getElementById('description').value = 'This is a test';
        const manager='keren';
        //mocks
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: json}));
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });

        const butn = document.getElementById("taskform");
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        await new Promise(process.nextTick); 
        expect(global.alert).toHaveBeenCalledWith("The task already exists");
        global.alert.mockClear()
        
    });

    test('Test that fetchDateTimeLog() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: timeTasks}));
        const logs = await func.fetchDateTimeLog();
        expect(logs).toStrictEqual(logs);
    });
    

    test('test that assignment.eventListener posts the right created task to the database', async () => {
        const taskdrop = document.getElementById('taskdrop');
        const taskOption = document.createElement('option');
        taskOption.value = 'T1';
        taskdrop.appendChild(taskOption);
        taskdrop.value = 'T1';

        const staffdrop = document.getElementById('staffdrop');
        const staffOption = document.createElement('option');
        staffOption.value = 'skassen2';
        staffdrop.appendChild(staffOption);
        staffdrop.value = 'skassen2';
        const data = {
            task: 'T1',
            staff: 'skassen2'
        };
        const data1 = {
            task: 'T1',
            staff: 'skassen2',
            total_time:0
        };
        fetch.resetMocks();
        const mockResponse = { status: 201, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify({value: assigments})).mockResponseOnce(JSON.stringify(mockResponse), { status: 201 }).mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });
        const btn = document.getElementById('assignment');
        console.log(document.getElementById("taskdrop").value);
        btn.dispatchEvent(new Event('submit', { bubbles: true }));
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch).toHaveBeenNthCalledWith(2, '/data-api/rest/Assignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }); 
        expect(fetch).toHaveBeenNthCalledWith(3, '/data-api/rest/Time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data1)
        }); 
    });

    test('test that assignment.eventListener alerts when a task already exists', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({ value: assigments }));
        const btn = document.getElementById('assignment');
        const Task = document.getElementById('taskdrop');
        Task.value = 'Test';
        const Staff = document.getElementById('staffdrop');
        Staff.value = 'skassen2';

        btn.dispatchEvent(new Event('submit', { bubbles: true }));
        await new Promise(process.nextTick); 
        expect(global.alert).toHaveBeenCalledWith('The assignment already exists');
        global.alert.mockClear();
    });
});



