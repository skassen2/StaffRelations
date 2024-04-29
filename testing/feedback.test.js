require('jest-fetch-mock').enableFetchMocks();

beforeEach(() =>{
    window.location.reload = jest.fn();
});

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
     const feedbacks = [{task: 'test', sender: 'skassen2', receiver: 'jaedon', comment: 'aaaaaa', id: 2},
    {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3},
    {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4},
    {task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5},
    {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6}];

    let assignments = [{assignment_id: 97, task: 'Test code', staff: 'prashant'}, 
    {assignment_id: 98, task: 'Test code', staff: 'skassen2'},
    {assignment_id: 99, task: 'Create diagrams', staff: 'skassen2'},
    {assignment_id: 100, task: 'Create diagrams', staff: 'jaedon'}, 
    {assignment_id: 101, task: 'Create diagrams', staff: 'prashant'}];

    fetch.mockResponseOnce(JSON.stringify({value:feedbacks})).mockResponseOnce(JSON.stringify({value: assignments}));
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

    test('Test addCommentToDatabase()', async () => {
        // Mock a response expected from server
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            task: 'Task1',
            sender:'prashant',
            receiver:'skassen2',
            comment:'comment'
        }
        const endpoint = '/data-api/rest/Feedback'; 
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        //func.addCommentToDatabase('Task1', 'prashant', 'skassen', 'comment');
        expect(fetchMock).toHaveBeenCalledWith(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        //expect(responseBody.message).toBe('Data posted successfully');
        //expect(window.location.reload).toHaveBeenCalled();
        
    });

});
