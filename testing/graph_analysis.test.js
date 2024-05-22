require('jest-fetch-mock').enableFetchMocks();
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;

HTMLCanvasElement.prototype.getContext = () => {
    // Return a mock object with any methods/properties you need
    return {
      // Add any other methods/properties you need to mock here
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn().mockReturnValue({ data: [] }),
      putImageData: jest.fn(),
      createImageData: jest.fn().mockReturnValue([]),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 0 }),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    };
  };

  global.Chart = jest.fn().mockImplementation(() => {
    return {
      destroy: jest.fn(), // Mock the destroy method if needed
      update: jest.fn(), // Mock the update method if needed
      render: jest.fn(), // Mock the render method if needed
    };
  });

beforeEach(() =>{
    global.alert = jest.fn();
});

describe('Test functions from graph_analysis.js', () => {
    document.body.innerHTML = '<main>'+
    '<section class = "graph-container">'+
        '<h2>Task Timesheets</h2>'+
        '<section class="container1">'+
            '<select id="taskDrop" class="dropdown" required>'+
                '<option value="" disabled selected>Select Task</option>'+
            '</select>'+
            '<section class="chart-container">'+
               '<canvas id="myChart1"></canvas>'+
            '</section>'+
       '</section>'+
        '<h2>Staff Performance</h2>'+
        '<section class="container1">'+
            '<select id="staffDrop" class="dropdown" required>'+
                '<option value="" disabled selected>Select Staff</option>'+
            '</select>'+
            '<section class="chart-container">'+
                '<canvas id="myChart2"></canvas>'+
            '</section>'+
       '</section>'+
    '</section>'+
    '</main>';

    const times = [
        { task: "Task", staff: "jaedon", total_time: 17.00, id: 76 },
        { task: "Task", staff: "prashant", total_time: 9.00, id: 77 },
        { task: "fix errors!!!", staff: "jaedon", total_time: 19.00, id: 78 },
        { task: "fix errors!!!", staff: "prashant", total_time: 0.00, id: 79 },
        { task: "fix errors!!!", staff: "skassen2", total_time: 26.00, id: 80 } 
    ]; 

    const feedbacks = [
        { id: 5, task: "fix errors!!!", sender: "jaedon", receiver: "dummy", comment: "a", sender_role: null, receiver_role: "Staff", rating: -1 },
        { id: 6, task: "fix errors!!!", sender: "jaedon", receiver: "skassen2", comment: "good", sender_role: "Staff", receiver_role: "Staff", rating: 8 },
        { id: 7, task: "fix errors!!!", sender: "jaedon", receiver: "prashant", comment: "elloooo", sender_role: "Staff", receiver_role: "Staff", rating: 5 },
        { id: 8, task: "Poor Performace", sender: "taruna", receiver: "jaedon", comment: "ekse", sender_role: "Staff", receiver_role: "Staff", rating: -1 },
        { id: 9, task: "General", sender: "jaedon", receiver: "taruna", comment: "you ekse", sender_role: "Staff", receiver_role: "Staff", rating: -1 },
        { id: 10, task: "hows it", sender: "keren", receiver: "jaedon", comment: "elooo", sender_role: "Manager", receiver_role: "Staff", rating: 5 },
        { id: 11, task: "Very good very nice", sender: "keren", receiver: "skassen2", comment: "nice", sender_role: "Manager", receiver_role: "Staff", rating: 10 },
        { id: 12, task: "a", sender: "keren", receiver: "taruna", comment: "a", sender_role: "Manager", receiver_role: "HR", rating: 7 },
        { id: 13, task: "q", sender: "keren", receiver: "skassen2", comment: "nice", sender_role: "Manager", receiver_role: "Staff", rating: 9 },
        { id: 14, task: "fix errors!!!", sender: "skassen2", receiver: "prashant", comment: "a", sender_role: "Staff", receiver_role: "Staff", rating: 4 },
        { id: 15, task: "General", sender: "skassen2", receiver: "dummy", comment: "q", sender_role: "Staff", receiver_role: "Staff", rating: -1 },
        { id: 16, task: "fix errors!!!", sender: "skassen2", receiver: "jaedon", comment: "tttt", sender_role: "Staff", receiver_role: "Staff", rating: 5 },
        { id: 17, task: "fix errors!!!", sender: "jaedon", receiver: "prashant", comment: "7ihi", sender_role: "Staff", receiver_role: "Staff", rating: 5 },
        { id: 18, task: "Performace", sender: "keren", receiver: "jaedon", comment: "gggg", sender_role: "Manager", receiver_role: "Staff", rating: 6 },
        { id: 19, task: "fix errors!!!", sender: "prashant", receiver: "skassen2", comment: "yu y iu oigf oh", sender_role: "Staff", receiver_role: "Staff", rating: 10 },
        { id: 20, task: "fix errors!!!", sender: "prashant", receiver: "skassen2", comment: "yu oiu dty ik", sender_role: "Staff", receiver_role: "Staff", rating: 7 },
        { id: 21, task: "fix errors!!!", sender: "jaedon", receiver: "skassen2", comment: "ii ug o ftdrd", sender_role: "Staff", receiver_role: "Staff", rating: 10 },
        { id: 22, task: "a", sender: "keren", receiver: "jaedon", comment: "uu", sender_role: "Manager", receiver_role: "Staff", rating: 4 }
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

      let tasks = [
        {task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
        {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}
    ];
    const func = require('../src/graph_analysis.js');

    test('Test getTasksFromDatabase() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: tasks}));
        const tasksReturned = await func.getTasksFromDatabase();
        expect(tasksReturned).toStrictEqual(tasks);
    });

    test('Test getFeedbackFromDatabase() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        const feedsReturned = await func.getFeedbackFromDatabase();
        expect(feedsReturned).toStrictEqual(feedbacks);
    });

    test('Test aggregateTaskTimes() returns the right data',  () => {
        const Returned = func.aggregateTaskTimes(times);
        expect(Returned).toStrictEqual([{"staff": "jaedon", "total_time": 36}, {"staff": "prashant", "total_time": 9}, {"staff": "skassen2", "total_time": 26}] );
    });

    //this will change when prashant fixes errors
    test('Test aggregateFeedbackRatings() returns the right data',  () => {
        const Returned = func.aggregateFeedbackRatings(feedbacks);
        expect(Returned).toStrictEqual([
            { task: 'fix errors!!!', "average_rating": 6.75 },
            { task: 'hows it', average_rating: 5 },
            { task: 'Very good very nice', average_rating: 10 },
            { task: 'a', average_rating: 5.5 },
            { task: 'q', average_rating: 9 },
            { task: 'Performace', average_rating: 6 }
          ]);
    });
  
    test('Test "DOMContentLoaded" event listener', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: tasks})).mockResponseOnce(JSON.stringify({value: feedbacks}));
        const TaskDropSpy = jest.spyOn(func, 'populateTaskDropdown');
        const FeedDropSpy = jest.spyOn(func, 'populateFeedbackDropdown');
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
        await new Promise(process.nextTick);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('Test "DOMContentLoaded" event listener alerts when error occurs', async () => {
        fetch.resetMocks();
        fetch.mockRejectOnce(new Error('Failed to fetch')).mockResponseOnce(JSON.stringify({value: feedbacks}));
        const TaskDropSpy = jest.spyOn(func, 'populateTaskDropdown');
        const FeedDropSpy = jest.spyOn(func, 'populateFeedbackDropdown');
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
        await new Promise(process.nextTick);
        expect(global.alert).toHaveBeenCalledWith('An error occurred while fetching tasks. Please try again later.');
    });

    test('Test renderTaskGraph()', () => {
        func.renderTaskGraph(tasks);
        expect(document.getElementById('myChart1').getContext('2d')).toBeDefined();

    });


    test('Test renderFeedbackGraph()', () => {
        func.renderFeedbackGraph(feedbacks);
        expect(document.getElementById('myChart2').chart).toBeDefined();

    });
});



