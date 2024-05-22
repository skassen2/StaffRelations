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

beforeEach(() =>{
    global.alert = jest.fn();
});

describe('Functions from hr_list', () => {
    const feedbacks = [
        {task: 'test', sender: 'skassen2', receiver: 'jaedon', comment: 'aaaaaa', id: 2, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
        {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
        {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
        {task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
        {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
        {task: 'Task1', sender: 'prashant', receiver: 'keren', comment: 'b', id: 7, rating: 2, sender_role:'Staff', receiver_role:'Manager'}
      ];

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

    const cars = [
        {car_id: 1, car_name: 'Audi A5', number_plate: 'JDM234GP', username: 'jaedon'},
        {car_id: 2, car_name: 'Lexus IS250', number_plate: 'ANG777GP', username: 'angie'},
        {car_id: 3, car_name: 'Ford Ranger', number_plate: 'XYZ123GP', username: 'dummy'},
        {car_id: 4, car_name: 'BMW 320i', number_plate: 'KRC257GP', username: 'keren'},
        {car_id: 5, car_name: 'Volkswagon Golf', number_plate: 'PRK911GP', username: 'prashant'},
        {car_id: 6, car_name: 'Mercedes-Benz CLA200', number_plate: 'SKA699GP', username: 'skassen2'},
        {car_id: 7, car_name: 'Jeep Wrangler', number_plate: 'TAR125GP', username: 'taruna'}
    ];

    const carsBooked = [    
        {car_id: 4, slot: 'Wednesday'},
        {car_id: 5, slot: 'Friday'},
        {car_id: 6, slot: 'Friday'}
    ];

    const timesLog = [
        {id:1, task: 'fix errors!!!', staff: 'jaedon', time_logged: 1, log_date: '2024-05-18'},
        {id:2, task: 'fix errors!!!', staff: 'jaedon', time_logged: 2, log_date: '2024-05-18'},
        {id:3, task: 'fix errors!!!', staff: 'skassen2', time_logged: 20, log_date: '2024-05-18'}
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
        '<section class="container">'+
            '<form id="addCarForm">'+
                '<h2>Add Car</h2>'+
                '<select id="staffMember" class="dropdown" required>'+
                    '<option value="" disabled selected>Staff Member</option>'+
                '</select>'+
                '<input type="text" id="car" placeholder="Car Name" required>'+
                '<input type="text" id="numberplate" placeholder="Number Plate" required>'+
                '<br>'+
                '<button>Add car</button>'+
            '</form>'+
        '</section>'+
        '</main>';
    fetch.mockResponseOnce(JSON.stringify({value : users})).mockResponseOnce(JSON.stringify({value : users})).mockResponseOnce(JSON.stringify({value : cars}));
    const func = require('../src/hr_list.js');

    test('Test fetchFeedback()', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        const feeds = await func.fetchFeedback();
        expect(feeds).toStrictEqual(feedbacks);
    });

    test('Test fetchAssignment()', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: assignments}));
        const assigns = await func.fetchAssignment();
        expect(assigns).toStrictEqual(assignments);
    });

    test('Test that fetchUsers() returns the correct data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: users}));
        const urs = await func.fetchUsers();
        expect(urs).toStrictEqual(users);
    });

    test('Test that fetchTasks() returns the right data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({ value: tasks}));
        const tasksL = await func.fetchTasks();
        expect(tasksL).toStrictEqual(tasks);
    });

    test('Test that fetchTime() returns the right data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({ value: times}));
        const timesL = await func.fetchTime();
        expect(timesL).toStrictEqual(times);
    });

    test('Test that fetchMealOrders() returns the right data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({ value: orders}));
        const ords = await func.fetchMealOredrs();
        expect(ords).toStrictEqual(orders);
    });
    
    test('Test that fetchDateTimeLog() returns the right data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({ value: timesLog}));
        const timesL = await func.fetchDateTimeLog();
        expect(timesL).toStrictEqual(timesLog);
    });

    test('Test that fetchStaffCars() returns the right data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({ value: cars}));
        const carsL = await func.fetchStaffCars();
        expect(carsL).toStrictEqual(cars);
    });

    test('Test getStaffManager(): returns right data', async () => {
        fetch.resetMocks();
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
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value : users}));
        document.getElementById('name').value = 'Shaneel';
        document.getElementById('surname').value = 'Kassen';
        document.getElementById('role').value = 'Staff';
        document.getElementById('username').value = 'shaneel';
        document.getElementById('password').value = 'pass';
        const data = {
            username:'shaneel',
            name: 'Shaneel',
            surname: 'Kassen',
            password: 'pass',
            role: 'Staff'
        };
        const butn = document.getElementById("staffForm"); 
        const createElementSpy = jest.spyOn(document, 'createElement');
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        
        expect(fetch).toHaveBeenCalledWith('/data-api/rest/Users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    });


    /*time [ 57, 58, 59 ]
      Assignment []
      tasks [ 16, 17 ]
      feedback [ 2, 3, 4, 7 ]
      [] food orders
      [4] cars
      [] date times*/
      
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
        .mockResponseOnce(JSON.stringify({value: cars}))
        .mockResponseOnce(JSON.stringify({value: timesLog}))
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
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
        butn.dataset.index = 2; 
        const event = new Event('click', { bubbles: true });
        butn.dispatchEvent(event);
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(20);
        expect(fetch).toHaveBeenNthCalledWith(9, '/data-api/rest/Time/id/57', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(10, '/data-api/rest/Time/id/58', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(11, '/data-api/rest/Time/id/59', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(12, '/data-api/rest/Tasks/task_id/16', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(13, '/data-api/rest/Tasks/task_id/17', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(14, '/data-api/rest/Feedback/id/2', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(15, '/data-api/rest/Feedback/id/3', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(16, '/data-api/rest/Feedback/id/4', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(17, '/data-api/rest/Feedback/id/7', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(18, '/data-api/rest/Users/username/keren', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(19, '/data-api/rest/Staff_cars/car_id/4', {method: "DELETE"});
        expect(window.location.reload).toHaveBeenCalled();
        
        
    });
    /*time [ 59 ]
      Assignment [ 98, 99 ]
      tasks []
      feedback [ 2, 3, 4, 5, 6 ]
      [ 23 ] food orders
      [6] car
      [3] date times*/
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
        .mockResponseOnce(JSON.stringify({value: cars}))
        .mockResponseOnce(JSON.stringify({value: timesLog}))
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
        .mockResponseOnce(JSON.stringify({ message: 'Data deleted successfully' }), { status: 200 })
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
        expect(fetch).toHaveBeenCalledTimes(20);
        expect(fetch).toHaveBeenNthCalledWith(8, '/data-api/rest/Time/id/59', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(9, '/data-api/rest/Assignment/assignment_id/98', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(10, '/data-api/rest/Assignment/assignment_id/99', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(11, '/data-api/rest/Feedback/id/2', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(12, '/data-api/rest/Feedback/id/3', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(13, '/data-api/rest/Feedback/id/4', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(14, '/data-api/rest/Feedback/id/5', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(15, '/data-api/rest/Feedback/id/6', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(16, '/data-api/rest/Users/username/skassen2', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(17, '/data-api/rest/Meal_orders/order_id/23', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(18, '/data-api/rest/Staff_cars/car_id/6', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(19, '/data-api/rest/Car_wash/car_id/6', {method: "DELETE"});
        expect(fetch).toHaveBeenNthCalledWith(20, '/data-api/rest/DateTimeLog/id/3', {method: "DELETE"});
        expect(window.location.reload).toHaveBeenCalled();     
    });
    
    test('Test that addCarForm event listener posts the right data', async () => {
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify({value: cars})).mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        document.getElementById('staffMember').value = '';
        document.getElementById('car').value = 'Toyota Etios';
        document.getElementById('numberplate').value = 'ANG888GP';
        const data={
            car_id: 8,
            car_name: 'Toyota Etios',
            number_plate: 'ANG888GP',
            username:''
        }
        const btn = document.getElementById('addCarForm');
        const event = new Event('submit', { bubbles: true });
        btn.dispatchEvent(event);
        await new Promise(process.nextTick);
        expect(fetch).toHaveBeenNthCalledWith(2, '/data-api/rest/Staff_cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    });
});
