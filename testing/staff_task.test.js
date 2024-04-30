require('jest-fetch-mock').enableFetchMocks();

beforeEach(() =>{
    global.alert = jest.fn();
});
describe('Fetch Functions from staff_task.js', () => {
    localStorage.setItem('username', 'skassen2' ); 
    localStorage.setItem('role', 'Staff' );
    localStorage.setItem('name', 'Shaneel' );
    localStorage.setItem('surname', 'Kassen' );
    
    document.body.innerHTML = '<h2>Welcome, <span id="username"></span></h2>'+'<main>'+
    '<section class="grid-container" id="tasksList"> <!-- Updated class name -->'+
    '</section>'+
    '<section class="container">'+
        '<form id="manualtime">'+
            '<select id="taskdrop" class="dropdown" required>'+
                '<option value="" disabled selected>Select task</option>'+
            '</select><br>'+
            '<input type="number" id="time"  placeholder="Time spent on task in minutes" required min="1">'+
            '<br>'+
            '<button id="addManualTime">Add time</button>'+
        '</form>'+
    '</section>'+
'   </main>';

    let assignments = [{assignment_id: 92, task: 'test', staff: 'jaedon'},
    {assignment_id: 93, task: 'Task1', staff: 'jaedon'},
    {assignment_id: 94, task: 'test', staff: 'skassen2'}];
    
    let times = [{task: 'test', staff: 'jaedon', total_time: 24, id: 57},
        {task: 'Task1', staff: 'jaedon', total_time: 1, id: 58},
        {task: 'test', staff: 'skassen2', total_time: 0, id: 59}];

    let tasks = [{task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
    {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}];
    
    fetch.mockResponseOnce(JSON.stringify({ value: assignments})).mockResponseOnce(JSON.stringify({ value: tasks})).mockResponseOnce(JSON.stringify({ value: times}))
    const func = require('../src/staff_task.js');
    
    test('Test that fetchAssignments() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({ value: assignments}));
        const assigns = await func.fetchAssignments();
        expect(assigns).toStrictEqual(assignments);
    });
    
    test('Test that fetchAlltasks() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({ value: tasks}));
        const tasksL = await func.fetchAllTasks();
        expect(tasksL).toStrictEqual(tasks);
    });

    test('Test that fetchTimeSpent() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({ value: times}));
        const timesL = await func.fetchTimeSpent();
        expect(timesL).toStrictEqual(times);
    });

    /*test('Test logStopWatchTime() posts correct data to database ', () => {
        //set up elements needed for logStopWatch()
        const taskCard = document.createElement('article');
        taskCard.classList.add('staff-card');
        
        const taskNameHeader = document.createElement('h2'); 
        taskNameHeader.textContent = 'test';
        taskCard.appendChild(taskNameHeader);
        
        const stopwatch = document.createElement('section');
        stopwatch.classList.add('stopwatch');
        stopwatch.textContent = '01:00:00'; //making sure there is data to log
        taskCard.appendChild(stopwatch);
        document.body.appendChild(taskCard);
        stopwatch.parentElement.querySelector('h2').textContent = 'test';
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify({ value: times })).mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data =  {
            task: 'test',
            staff: 'skassen2',
            total_time: '60',
        };

        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });

        return func.logStopwatchTime(stopwatch).then(response =>{
            expect(fetch).toHaveBeenCalledWith('/data-api/rest/Time/id/59', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            expect(window.location.reload).toHaveBeenCalled();
        });
        
    });*/
    /*test('Test that renderTasks() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({ value: assignments})).mockResponseOnce(JSON.stringify({ value: tasks})).mockResponseOnce(JSON.stringify({ value: times}));
        
        document.createElement = jest.fn().mockReturnValue({
            classList: {
                add: jest.fn()
            }
        });
        const element = document.createElement('main');
        const appendChildSpy = jest.spyOn(element, 'appendChild');
        return func.renderTasks().then(data => {
            expect(document.createElement).toHaveBeenCalledWith('section');
            expect(element.classList.add).toHaveBeenCalledWith('staff-card');
            // Clean up
            document.createElement.mockRestore();
            appendChildSpy.mockRestore();
        });  
    });*/
});

describe('Functions from staff_task.js', () => {
    localStorage.setItem('username', 'skassen2' ); 
    localStorage.setItem('role', 'Staff' );
    localStorage.setItem('name', 'Shaneel' );
    localStorage.setItem('surname', 'Kassen' );
    
    let assignments = [{assignment_id: 92, task: 'test', staff: 'jaedon'},
    {assignment_id: 93, task: 'Task1', staff: 'jaedon'},
    {assignment_id: 94, task: 'test', staff: 'skassen2'}];
    
    let times = [{task: 'test', staff: 'jaedon', total_time: 24, id: 57},
        {task: 'Task1', staff: 'jaedon', total_time: 1, id: 58},
        {task: 'test', staff: 'skassen2', total_time: 0, id: 59}
        /*{task: 'test', staff: 'jaedon', total_time: 0, id: 60}*/];

    let tasks = [{task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
    {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}];
    
    document.body.innerHTML = '<main>'+
    '<section class="grid-container" id="tasksList"> <!-- Updated class name -->'+
    '</section>'+
    '<section class="container">'+
        '<form id="manualtime">'+
            '<select id="taskdrop" class="dropdown" required>'+
                '<option value="" disabled selected>Select task</option>'+
            '</select><br>'+
            '<input type="number" id="time"  placeholder="Time spent on task in minutes" required min="1">'+
            '<br>'+
            '<button id="addManualTime">Add time</button>'+
        '</form>'+
    '</section>'+
    '</main>';

    fetch.mockResponseOnce(JSON.stringify({ value: assignments})).mockResponseOnce(JSON.stringify({ value: tasks})).mockResponseOnce(JSON.stringify({ value: times}))
    const func = require('../src/staff_task.js');

    //TEST FILTERBYNAME
    test('Test that filterTaskByName returns the right task name given a list of tasks', () => {
        const Tname = 'test';
        const name = func.filterTaskByName(assignments, Tname);
        expect(name).toStrictEqual({assignment_id: 92, task: 'test', staff: 'jaedon'});
        const T1name = 'Task1';
        const name1 = func.filterTaskByName(assignments, T1name);
        expect(name1).toStrictEqual({assignment_id: 93, task: 'Task1', staff: 'jaedon'});
    });
    
    //TEST FILTERBYTASKANDSTAFF
    test('Test that filterTimeByTaskAndStaff returns the right time data for a task', () => {
        const Tname = 'test';
        const task = func.filterTimeByTaskAndStaff(times, Tname, 'jaedon');
        expect(task).toStrictEqual({task: 'test', staff: 'jaedon', total_time: 24, id: 57});
    });

    //TEST FILTERASSIGNMENTS
    test ('Test that filterAssignments returns the right list of assignments for a given staff member', () => {
        const SuserName = 'jaedon';
        const listAsigns = func.filterAssignments(assignments, SuserName);
        expect(listAsigns).toStrictEqual([{assignment_id: 92, task: 'test', staff: 'jaedon'}, {assignment_id: 93, task: 'Task1', staff: 'jaedon'}]);
    });

    //TEST GETIDTOTALTIMEFROMTASKSTAFF
    test('Test that getIDTotalTimeFromTaskStaff returns the right task id and total time given a task and staff member ', () => {
        const Staff = 'jaedon';
        const total = func.getIDTotalTimeFromTaskStaff(times, 'test', Staff);
        expect(total).toStrictEqual([57, 24]);
    });

    test('Test startStopWatch() alerts when it should', () => {
        
        const taskCard = document.createElement('article');
        taskCard.classList.add('staff-card');
        const stopwatch = document.createElement('section');
        stopwatch.classList.add('stopwatch');
        stopwatch.textContent = '00:00:00'; // Initial stopwatch time
        stopwatch.dataset.intervalId = null;
        taskCard.appendChild(stopwatch);
        func.startStopwatch(stopwatch);
        expect(global.alert).toHaveBeenCalledWith("Only one stopwatch can run at a time.");
        global.alert.mockClear();
    });

    test('Test startStopWatch() interval is started', () => {
        
        const taskCard = document.createElement('article');
        taskCard.classList.add('staff-card');
        const stopwatch = document.createElement('section');
        stopwatch.classList.add('stopwatch');
        stopwatch.textContent = '00:00:00'; // Initial stopwatch time
        taskCard.appendChild(stopwatch);
        func.startStopwatch(stopwatch);
        expect(stopwatch.dataset.intervalId).toBeDefined();
    });

    test('Test stopStopWatch() alerts when it should', () => {
        const taskCard = document.createElement('article');
        taskCard.classList.add('staff-card');
        const stopwatch = document.createElement('section');
        stopwatch.classList.add('stopwatch');
        stopwatch.textContent = '00:00:00'; // Initial stopwatch time
        taskCard.appendChild(stopwatch);
        func.stopStopwatch(stopwatch);
        expect(global.alert).toHaveBeenCalledWith("Timer must be started before being stopped.");
    });

    test('Test stopStopWatch() interval is deleted', () => {
        const taskCard = document.createElement('article');
        taskCard.classList.add('staff-card');
        const stopwatch = document.createElement('section');
        stopwatch.classList.add('stopwatch');
        stopwatch.textContent = '00:00:00'; // Initial stopwatch time
        stopwatch.dataset.intervalId = '20';
        taskCard.appendChild(stopwatch);
        func.stopStopwatch(stopwatch);
        expect(stopwatch.dataset.intervalId).toBeUndefined();
    });

    test('Test logStopWatchTime() returns the right alert when interval has iD ', () => {
        const taskCard = document.createElement('article');
        taskCard.classList.add('staff-card');
        const stopwatch = document.createElement('section');
        stopwatch.classList.add('stopwatch');
        stopwatch.textContent = '00:00:00'; // Initial stopwatch time
        stopwatch.dataset.intervalId = '20';
        taskCard.appendChild(stopwatch);
        func.logStopwatchTime(stopwatch);
        expect(global.alert).toHaveBeenCalledWith("Timer must be stopped before being logged.");
    });

    test('Test logStopWatchTime() returns the right alert when there is no time to log ', () => {
        const taskCard = document.createElement('article');
        taskCard.classList.add('staff-card');
        const stopwatch = document.createElement('section');
        stopwatch.classList.add('stopwatch');
        stopwatch.textContent = '00:00:00'; // Initial stopwatch time
        taskCard.appendChild(stopwatch);
        func.logStopwatchTime(stopwatch);
        expect(global.alert).toHaveBeenCalledWith("Nothing to log.");
    });

    
});
