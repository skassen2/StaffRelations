
require('jest-fetch-mock').enableFetchMocks();
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;

describe('Describe function from feedback.js', () => {
    localStorage.setItem('username', 'prashant' ); 
    localStorage.setItem('role', 'Staff' );
    localStorage.setItem('name', 'Prashant' );
    localStorage.setItem('surname', 'Kessa');
    document.body.innerHTML = '<main>'+
    '<section class="grid-container">'+
      '<nav class="tabs">'+
      '<button class="tab-button" data-filter="all">All</button>'+
      '<button class="tab-button" data-filter="staff">Staff</button>'+
      '<button class="tab-button" data-filter="manager">Manager</button>'+
      '<button class="tab-button" data-filter="hr">HR</button>'+
      '</nav>'+
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
      {task: 'test', sender: 'skassen2', receiver: 'jaedon', comment: 'aaaaaa', id: 2, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'test', sender: 'jaedon', receiver: 'skassen2', comment: 'bbbaaa', id: 3, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Task1', sender: 'prashant', receiver: 'skassen2', comment: 'bbbccaa', id: 4, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Test code', sender: 'prashant', receiver: 'skassen2', comment: 'aaaaaa', id: 6, rating: 2, sender_role:'Staff', receiver_role:'Staff'},
      {task: 'Task1', sender: 'prashant', receiver: 'keren', comment: 'b', id: 7, rating: 2, sender_role:'Staff', receiver_role:'Manager'}
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

    fetch.mockResponseOnce(JSON.stringify({value: assignments}));
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
        expect(assigns).toStrictEqual([{task: 'Test code', sender: 'skassen2', receiver: 'prashant', comment: 'test if this works', id: 5, rating: 2, sender_role:'Staff', receiver_role:'Staff'}]);
    });


    test('Test addCommentToDatabase()', async () => {
        // Mock a response expected from server
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            task: 'Task1',
            sender:'prashant',
            receiver:'skassen',
            comment:'comment',
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

    test('Test addRatingCommentToDatabase()', async () => {
      // Mock a response expected from server
      fetch.mockClear();
      const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
      const data={
          task: 'Task1',
          sender:'prashant',
          receiver:'skassen',
          comment:'comment',
          sender_role: 'Staff',
          receiver_role: 'Staff',
          rating: 2
      }
      const endpoint = '/data-api/rest/Feedback'; 
      Object.defineProperty(window, 'location', {
          value: {
            reload: jest.fn(),
          },
      });

      return func.addRatingCommentToDatabase('Task1', 'prashant', 'skassen', 'comment', 'Staff', 'Staff', 2).then(response => {
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

    test('Test checkIfStaff(), is person is a staff member return 1', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: users}));
        const staffCheck = await func.checkIfStaff('skassen2');
        expect(staffCheck).toBe(1);
    });
    
    test('Test checkIfStaff(), is person is not a staff member return 0', async () => {
      fetch.mockResponseOnce(JSON.stringify({value: users}));
      const staffCheck = await func.checkIfStaff('keren');
      expect(staffCheck).toBe(0);
    });

    test('Test DOMContentLoaded event Listener', async () => {
      fetch.resetMocks();
      fetch.mockResponseOnce(JSON.stringify({value: feedbacks})).mockResponseOnce(JSON.stringify({value: users}));
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      await new Promise(process.nextTick);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    /*test('Test addComment event listener qorks for first click', async () => {
      fetch.resetMocks();
      const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
      fetch.mockResponseOnce(JSON.stringify({value: feedbacks})).mockResponseOnce(JSON.stringify({value: users}));
      const form=document.getElementById("addComment");
      form.dispatchEvent(new Event('submit', { bubbles: true }));
      await new Promise(process.nextTick);
      expect(fetch).toHaveBeenCalledTimes(2);
    });*/
});

