//lines uncovered are left uncovered because code is the same for both Manager and Staff in testing event listener for deletion.
//each loop is tested at least once under different situations (i.e. a staff or manager) hence the uncovered nature.

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

    //note update this when add is being implemented backend wise.
    test('Test that staffForm event listener does what it needs to', () => {
        const butn = document.getElementById("staffForm"); 
        const createElementSpy = jest.spyOn(document, 'createElement');
        const resetSpy = jest.spyOn(butn, 'reset');
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        expect(resetSpy).toHaveBeenCalled();
        expect(createElementSpy).toHaveBeenCalledWith('block');
    });


    /*time [ 57, 58, 59 ]
      Assignment []
      tasks [ 16, 17 ]
      feedback [ 2, 3, 4 ]
      [] food orders*/
    test('Test that eventListener for delete deletes Manager', async () => {
       
        func.usernameAndRole = [
            [ 'angie', 'Manager' ],
            [ 'jaedon', 'Staff' ],
            [ 'keren', 'Manager' ],
            [ 'prashant', 'Staff' ],
            [ 'skassen2', 'Staff' ],
            [ 'angie', 'Manager' ],
            [ 'jaedon', 'Staff' ],
            [ 'keren', 'Manager' ],
            [ 'prashant', 'Staff' ],
            [ 'skassen2', 'Staff' ]
          ];

        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: tasks}))
        .mockResponseOnce(JSON.stringify({value: times}))
        .mockResponseOnce(JSON.stringify({value: assignments}))
        .mockResponseOnce(JSON.stringify({value: tasks}))
        .mockResponseOnce(JSON.stringify({value: feedbacks}))
        .mockResponseOnce(JSON.stringify({value: orders}))
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 });
        
        const butn = document.getElementById("staffList");
        butn.dataset.index = 2; 
        const event = new Event('click', { bubbles: true });
        butn.dispatchEvent(event);
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(15);
        expect(fetch).toHaveBeenNthCalledWith(7, '/data-api/rest/Time/id/57', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(8, '/data-api/rest/Time/id/58', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(9, '/data-api/rest/Time/id/59', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(10, '/data-api/rest/Tasks/task_id/16', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(11, '/data-api/rest/Tasks/task_id/17', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(12, '/data-api/rest/Feedback/id/2', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(13, '/data-api/rest/Feedback/id/3', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(14, '/data-api/rest/Feedback/id/4', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(15, '/data-api/rest/Users/username/keren', {method: "DELETE"});
        expect(window.location.reload).toHaveBeenCalled();
        
        
    });
    /*time [ 59 ]
      Assignment [ 98, 99 ]
      tasks []
      feedback [ 2, 3, 4, 5, 6 ]
      [ 23 ] food orders*/
    test('Test that eventListener for delete deletes Staff', async () => {
        
        func.usernameAndRole = [
            [ 'angie', 'Manager' ],
            [ 'jaedon', 'Staff' ],
            [ 'keren', 'Manager' ],
            [ 'prashant', 'Staff' ],
            [ 'skassen2', 'Staff' ],
            [ 'angie', 'Manager' ],
            [ 'jaedon', 'Staff' ],
            [ 'keren', 'Manager' ],
            [ 'prashant', 'Staff' ],
            [ 'skassen2', 'Staff' ]
          ];

        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: times}))
        .mockResponseOnce(JSON.stringify({value: assignments}))
        .mockResponseOnce(JSON.stringify({value: tasks}))
        .mockResponseOnce(JSON.stringify({value: feedbacks}))
        .mockResponseOnce(JSON.stringify({value: orders}))
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 });
        
        const butn = document.getElementById("staffList");
        butn.dataset.index = 4; 
        const event = new Event('click', { bubbles: true });
        butn.dispatchEvent(event);
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(15);
        expect(fetch).toHaveBeenNthCalledWith(6, '/data-api/rest/Time/id/59', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(7, '/data-api/rest/Assignment/assignment_id/98', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(8, '/data-api/rest/Assignment/assignment_id/99', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(9, '/data-api/rest/Feedback/id/2', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(10, '/data-api/rest/Feedback/id/3', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(11, '/data-api/rest/Feedback/id/4', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(12, '/data-api/rest/Feedback/id/5', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(13, '/data-api/rest/Feedback/id/6', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(14, '/data-api/rest/Users/username/skassen2', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(15, '/data-api/rest/Meal_orders/order_id/23', {method: "DELETE"});
        expect(window.location.reload).toHaveBeenCalled();
        
        
        
    });
    
    
});
