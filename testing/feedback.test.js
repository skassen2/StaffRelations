require('jest-fetch-mock').enableFetchMocks();
describe('Describe function from feedback.js', () => {
    localStorage.setItem('username', 'prashant' ); 
    localStorage.setItem('role', 'Staff' );
    localStorage.setItem('name', 'Prashant' );
    localStorage.setItem('surname', 'Kessa');
    document.body.innerHTML = '<main>'+
    '<section class="grid-container">'+
      '<article id="allfeedback" class="grid-container">'+
      '</article>'+
    '</section>'+
    '<section class="container">'+
      '<form id="addComment">'+
        '<select id="tasksDrop" class="dropdown" required>'+
          '<option value="" disabled selected>Select task</option>'+
        '</select>'+
        '<br><button id="add">Next</button>'+
      '</form>'+
    '</section>'+
  '</main>';
    const feedbacks = [
      {task: 'test', sender: 'skassen2', receiver: 'jaedon', comment: 'aaaaaa', id: 2},
      {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3},
      {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4},
      {task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5},
      {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6}
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

    fetch.mockResponseOnce(JSON.stringify({value: feedbacks})).mockResponseOnce(JSON.stringify({value: users})).mockResponseOnce(JSON.stringify({value: assignments}));
    const func = require('../src/feedback.js');
    
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

    test('Test that listOfHr() returns only a list of HR memebrs', async () => {
      fetch.mockResponseOnce(JSON.stringify({value: users}));
      const HR = await func.listOfHr();
      expect(HR).toStrictEqual(['dummy', 'taruna']);
    });

    test('Test getUserFeedback() returns right data', () => {
        const staff = 'prashant';
        const assigns =  func.getUserFeedback(staff, feedbacks);
        expect(assigns).toStrictEqual([{task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5}]);
    });

    test('Test getStaffByTask() returns right data', () => {
        const staff = 'prashant';
        const task = 'Create diagrams'; 
        const staffL =  func.getStaffByTask(assignments, staff, task);
        expect(staffL).toStrictEqual([{assignment_id: 99, task: 'Create diagrams', staff: 'skassen2'},
        {assignment_id: 100, task: 'Create diagrams', staff: 'jaedon'}]);
    });

    test('Test that getHR() returns only HR members', () =>{
        const HRm = func.getHR(users);
        expect(HRm).toStrictEqual([
          {username: 'dummy', name: 'dummyname', surname: 'dummysurname', password: 'pass', role: 'HR'}, 
          {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}]);
    });

    test('Test addCommentToDatabase()', async () => {
        // Mock a response expected from server
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            task: 'Task1',
            sender:'prashant',
            receiver:'skassen',
            comment:'comment'
        }
        const endpoint = '/data-api/rest/Feedback'; 
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });

        return func.addCommentToDatabase('Task1', 'prashant', 'skassen', 'comment').then(response => {
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

    test('Test that loadHRNamesDropDown() does what it needs to', async () => {
      fetch.mockResponseOnce(JSON.stringify({value: users}));
      func.loadHRNamesForDropDown();
    });
});

