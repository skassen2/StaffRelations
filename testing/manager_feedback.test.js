require('jest-fetch-mock').enableFetchMocks();
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
        '<button type="submit" id="Send">Send</button>'+
        '</form>'+
        '</section>'+
        '</main>';

    const feedbacks = [
      {task: 'test', sender: 'skassen2', receiver: 'jaedon', comment: 'aaaaaa', id: 2},
      {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3},
      {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4},
      {task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5},
      {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6},
      {task: 'Task1', sender: 'prashant', receiver: 'keren', comment: 'b', id: 7}
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
    
    fetch.mockResponseOnce(JSON.stringify({value: feedbacks})).mockResponseOnce(JSON.stringify({value: feedbacks})).mockResponseOnce(JSON.stringify({value: users})).mockResponseOnce(JSON.stringify({value: assignments})).mockResponseOnce(JSON.stringify({value: users}));
    const func = require('../src/manager_feedback.js');
    test('Test fetchFeedback() returns the correct data', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: feedbacks}));
        const feeds = await func.fetchFeedback();
        expect(feeds).toStrictEqual(feedbacks);
    });

    test('Test fetchAssignment() returns the correct data', async () => {
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
    
    test('Test that listOfHr() returns only a list of HR memebrs', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: users}));
        const HR = await func.listOfHr();
        expect(HR).toStrictEqual(['dummy', 'taruna']);
      });
  
      test('Test that getHr() returns only an arr of HR objects', async () => {
        const HR = func.getHR(users);
        expect(HR).toStrictEqual([{username: 'dummy', name: 'dummyname', surname: 'dummysurname', password: 'pass', role: 'HR'}, {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]);
      });
      
    test('Test getStaffByTask() returns right data', () => {
        const staff = 'prashant';
        const task = 'Create diagrams'; 
        const staffL =  func.getStaffByTask(assignments, staff, task);
        expect(staffL).toStrictEqual([{assignment_id: 99, task: 'Create diagrams', staff: 'skassen2'},
        {assignment_id: 100, task: 'Create diagrams', staff: 'jaedon'}]);
    });

    test('Test getUserFeedback() returns right data', () => {
        const staff = 'keren';
        const feeds =  func.getUserFeedback(staff, feedbacks);
        expect(feeds).toStrictEqual([{task: 'Task1', sender: 'prashant', receiver: 'keren', comment: 'b', id: 7}]);
    });

    test('Test addCommentToDatabase()', async () => {
        // Mock a response expected from server
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            task:'test',
            sender:'keren',
            receiver:'skassen2',
            comment:'please see me.'
        }
        const endpoint = '/data-api/rest/Feedback'; 
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });

        return func.addCommentToDatabase('test', 'keren', 'skassen2', 'please see me.').then(response => {
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
});

