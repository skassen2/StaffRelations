const func = require('./non_fetch_manager_task.js');

//Tests functions: getTasks, taskNameValid, getStaff, getManagersTasks, existsAssignment
describe('Functions from manager_task.js', () => {
    let json = [
        {
            "task_id": 1,
            "manager": "keren",
            "task": "Test",
            "description": "This is a test",
            "est_time": 5
        },
        {
            "task_id": 2,
            "manager": "keren",
            "task": "Task",
            "description": "I dont know",
            "est_time": 545
        },
        {
            "task_id": 3,
            "manager": "random",
            "task": "finance statements",
            "description": "This is a test",
            "est_time": 88
        },
        {
            "task_id": 4,
            "manager": "keren",
            "task": "Task1",
            "description": "d",
            "est_time": 55
        },
        {
            "task_id": 5,
            "manager": "keren",
            "task": "Task2",
            "description": "tgg",
            "est_time": 4
        }];
   
    test('Test that getTasks return the right arr of tasks', () => {
    const manager = "keren";
    const list = func.getTasks(manager, json);
    expect(list).toStrictEqual([{
        "task_id": 1,
        "manager": "keren",
        "task": "Test",
        "description": "This is a test",
        "est_time": 5
    },
    {
        "task_id": 2,
        "manager": "keren",
        "task": "Task",
        "description": "I dont know",
        "est_time": 545
    },
    {
        "task_id": 4,
        "manager": "keren",
        "task": "Task1",
        "description": "d",
        "est_time": 55
    },
    {
        "task_id": 5,
        "manager": "keren",
        "task": "Task2",
        "description": "tgg",
        "est_time": 4
    }]);
    });
    
    test('Test that taskNameValid returns 0 if a task already exists', () =>{
        const taskName = 'Test';
        const validity = func.taskNameValid(json, taskName);
        expect(validity).toBe(0);
    });
    
    test('Test that taskNameValid returns 1 if a task does not exists', () =>{
        const taskName = 'Tes';
        const validity = func.taskNameValid(json, taskName);
        expect(validity).toBe(1);
    });

    test('Test that getStaff returns an arr of staff members', () =>{
        let staffList = [{username: 'jaedon', name: 'Jaedon', surname: 'Moodley', password: 'pass', role: 'Staff'},
        {username: 'keren', name: 'Keren', surname: 'Chetty', password: 'pass', role: 'Manager'},
        {username: 'prashant', name: 'Prashant', surname: 'Kessa', password: 'pass', role: 'Staff'},
        {username: 'skassen2', name: 'Shaneel', surname: 'Kassen', password: 'ekse', role: 'Staff'},
        {username: 'taruna', name: 'Taruna', surname: 'Naidoo', password: 'pass', role: 'HR'}];

        const sList = func.getStaff(staffList);
        expect(sList).toStrictEqual(['jaedon', 'prashant', 'skassen2']);
    });

    test('Test that getManagersTasks returns the correct list of tasks a manager has created', () =>{
        let Tlist = func.getManagersTasks(json, "keren");
        expect(Tlist).toStrictEqual(['Test', 'Task', 'Task1', 'Task2']);
        Tlist = func.getManagersTasks(json, "random");
        expect(Tlist).toStrictEqual(['finance statements']);
    });

    test('Test that existsAssignment returns 0 if an assignemnt of a staff member to a task already exists', () =>{
        let assigments = [{task: 'Test', staff: 'skassen2', total_time: 2, id: 26},
        {task: 'rgt', staff: 'prashant', total_time: 0, id: 27},
        {task: 'Task77', staff: 'jaedon', total_time: 27, id: 28},
        {task: 'Task77', staff: 'prashant', total_time: 0, id: 29},
        {task: 'Test', staff: 'jaedon', total_time: 4, id: 30},
        {task: 'Test2', staff: 'jaedon', total_time: 30, id: 31},
        {task: 'Task55', staff: 'jaedon', total_time: 61, id: 32},
        {task: 'Task77', staff: 'skassen2', total_time: 70, id: 33},
        {task: 'Test', staff: 'skassen2', total_time: 1, id: 34},
        {task: 'Test', staff: 'skassen2', total_time: 1, id: 35}];
        let assigned = func.existsAssignment(assigments, 'Test', 'skassen2');
        expect(assigned).toBe(0);
    });

    test('Test that existsAssignment returns 1 if an assignemnt of a staff member to a task does not exists', () =>{
        let assigments = [{task: 'Test', staff: 'skassen2', total_time: 2, id: 26},
        {task: 'rgt', staff: 'prashant', total_time: 0, id: 27},
        {task: 'Task77', staff: 'jaedon', total_time: 27, id: 28},
        {task: 'Task77', staff: 'prashant', total_time: 0, id: 29},
        {task: 'Test', staff: 'jaedon', total_time: 4, id: 30},
        {task: 'Test2', staff: 'jaedon', total_time: 30, id: 31},
        {task: 'Task55', staff: 'jaedon', total_time: 61, id: 32},
        {task: 'Task77', staff: 'skassen2', total_time: 70, id: 33},
        {task: 'Test', staff: 'skassen2', total_time: 1, id: 34},
        {task: 'Test', staff: 'skassen2', total_time: 1, id: 35}];
        let assigned = func.existsAssignment(assigments, 'Test', 'angie');
        expect(assigned).toBe(1);
    });
});