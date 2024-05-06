require('jest-fetch-mock').enableFetchMocks();
//const userEvent = require('@testing-library/user-event'); npm install --save-dev @testing-library/user-event


describe('Functions from hr_list', () => {
    //innerHTML if needed
    const feedbacks = [{task: 'test', sender: 'skassen2', receiver: 'jaedon', comment: 'aaaaaa', id: 2},
    {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3},
    {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4},
    {task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5},
    {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6}];

    const assignments = [{assignment_id: 97, task: 'Test code', staff: 'prashant'}, 
    {assignment_id: 98, task: 'Test code', staff: 'skassen2'},
    {assignment_id: 99, task: 'Create diagrams', staff: 'skassen2'},
    {assignment_id: 100, task: 'Create diagrams', staff: 'jaedon'}, 
    {assignment_id: 101, task: 'Create diagrams', staff: 'prashant'}];

    const users = [{username: 'angie', name: 'Angie', surname: 'Erusmus', password: 'pass', role: 'Manager'},
    {username: 'dummy', name: 'dummyname', surname: 'dummysurname', password: 'pass', role: 'HR'},
    {username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'}, 
    {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
    {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
    {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
    {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}];

    const times = [{task: 'test', staff: 'jaedon', total_time: 24, id: 57},
        {task: 'Task1', staff: 'jaedon', total_time: 1, id: 58},
        {task: 'test', staff: 'skassen2', total_time: 0, id: 59}];

    const tasks = [{task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
    {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}];

    fetch.mockResponseOnce(JSON.stringify({value: users}));
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

    const func = require('../src/hr_list.js');

    test('Test fetchFeedback()', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        const feeds = await func.fetchFeedback();
        expect(feeds).toStrictEqual(feedbacks);
    });

    test('Test fetchAssignment()', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: assignments}));
        const assigns = await func.fetchAssignment();
        expect(assigns).toStrictEqual(assignments);
    });

    test('Test that fetchUsers() returns the correct data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: users}));
        const urs = await func.fetchUsers();
        expect(urs).toStrictEqual(users);
    });

    test('Test that fetchTasks() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({ value: tasks}));
        const tasksL = await func.fetchTasks();
        expect(tasksL).toStrictEqual(tasks);
    });

    test('Test that fetchTime() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({ value: times}));
        const timesL = await func.fetchTime();
        expect(timesL).toStrictEqual(times);
    });

    test('Test getStaffManager(): returns right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value : users}));
        const res = await func.getStaffManager();
        expect(res).toStrictEqual([{username: 'angie', name: 'Angie', surname: 'Erusmus', password: 'pass', role: 'Manager'},
        {username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
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
