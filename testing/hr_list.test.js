require('jest-fetch-mock').enableFetchMocks();
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;


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

    const tasks = [
        {task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
        {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}
    ];

    const meals = [
        {meal_id: 1, meal_name: 'Grilled Salmon', description: 'Delicious grilled salmon served with vegetables and rice.', created_by: 'taruna', meal_image_url: 'https://www.theseasonedmom.com/wp-content/uploads/2021/09/grilled-salmon-9.jpg'},
        {meal_id: 2, meal_name: 'MealTest', description: 'Tester Meal', created_by: 'taruna', meal_image_url: 'https://promova.com/content/fast_food_names_d368a9810d.png'},
        {meal_id: 27, meal_name: 'Chicken Wrap', description: 'Grilled chicken, lettuce and spicy mayo in a toasted wrap', created_by: 'taruna', meal_image_url: 'https://www.eatingwell.com/thmb/k05OqmTGG6mpCHDOGA…do-wrap-3171-0a492188ea344e8aa5de503829c7399b.jpg'}
    ];
    const orders = [
        {order_id: 23, meal_id: 28, username: 'skassen2', order_date: '2024-05-06T12:11:22.020'},
        {order_id: 24, meal_id: 1, username: 'prashant', order_date: '2024-05-06T12:19:56.687'},
        {order_id: 25, meal_id: 28, username: 'prashant', order_date: '2024-05-06T12:19:58.473'}
    ];

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

    test('Test that fetchMealOrders() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({ value: orders}));
        const ords = await func.fetchMealOredrs();
        expect(ords).toStrictEqual(orders);
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

    /*test('Test that eventListener for delete users does what it needs to', async () => {
        //console.log(document.body.innerHTML);
        fetch.mockResponseOnce(JSON.stringify({value: users}));
        const createElementSpy = jest.spyOn(document, 'createElement');
        func.renderStaffList();
        const butn = document.getElementById("staffList");
        const event = new Event('click', { bubbles: true });
        butn.dispatchEvent(event);
        createElementSpy.mockRestore();
    });*/
    
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
