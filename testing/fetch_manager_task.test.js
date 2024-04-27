require('jest-fetch-mock').enableFetchMocks();

beforeEach(() => {
    document.body.innerHTML =  '<main>'+
    '<section class="grid-container">'+
        '<article id="staffList" class="grid-container">'+
        '</article>'+
    '</section>'+
    '<section class="container">'+
        '<form id="taskform">'+
            '<input type="text" id="task" placeholder="Task" required>'+
            '<input type="number" id="est_time"  placeholder="Estimated time in minutes" required min="1">'+
            '<textarea id="description" placeholder="Description" rows="6" required></textarea>'+
            '<br>'+
           '<button id="addtask">Add task</button>'+
        '</form>'+
        '<form id="assignment">'+
            '<select id="taskdrop" class="dropdown" required>'+
                '<option value="" disabled selected>Select task</option>'+
            '</select><br>'+
            '<select id="staffdrop"  class="dropdown" required>'+
                '<option value="" disabled selected>Select a staff member</option>'+
            '</select>'+
            '<br>'+
            '<button id="adsk">Add assignment</button>'+
        '</form>'+
    '</section>'+
'</main>';
});

describe('Functions from manager_task.js', () => {
    let tasks = [{task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
    {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}];
    
    
    
    /*test('Test that render task does everything it needs to do', async () => {
        localStorage.setItem('username', 'keren' ); 
        fetch.mockResponseOnce(JSON.stringify(tasks));
        document.createElement = jest.fn().mockReturnValue({
            classList: {
                add: jest.fn()
            }
        });
        const func = require('../src/manager_task.js');
        //return func.
        expect(document.createElement).toHaveBeenCalledWith('section');
        expect(element.classList.add).toHaveBeenCalledWith('staff-card');

        // Clean up
        document.createElement.mockRestore();
    });*/
});