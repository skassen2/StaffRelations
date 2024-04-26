const func = require('./non_fetch_staff_task.js');

//Tests fucntions: filterTaskByName, filterTimeByTaskAndStaff, filterAssignments, getIDTotalTimeFromTaskStaff
describe('Functions from staff_task.js', () => {
    let assingments = [{assignment_id: 92, task: 'test', staff: 'jaedon'},
    {assignment_id: 93, task: 'Task1', staff: 'jaedon'},
    {assignment_id: 94, task: 'test', staff: 'skassen2'}];
    
    let times = [{task: 'test', staff: 'jaedon', total_time: 24, id: 57},
        {task: 'Task1', staff: 'jaedon', total_time: 1, id: 58},
        {task: 'test', staff: 'skassen2', total_time: 0, id: 59}
        /*{task: 'test', staff: 'jaedon', total_time: 0, id: 60}*/];

    let tasks = [{task_id: 16, manager: 'keren', task: 'test', description: 'ello', est_time: 400},
    {task_id: 17, manager: 'keren', task: 'Task1', description: 'wanna cry', est_time: 30}];
    
    //TEST FILTERBYNAME
    test('Test that filterTaskByName returns the right task name given a list of tasks', () => {
        const Tname = 'test';
        const name = func.filterTaskByName(assingments, Tname);
        expect(name).toStrictEqual({assignment_id: 92, task: 'test', staff: 'jaedon'});
        const T1name = 'Task1';
        const name1 = func.filterTaskByName(assingments, T1name);
        expect(name1).toStrictEqual({assignment_id: 93, task: 'Task1', staff: 'jaedon'});
    });
    
    //TEST FILTERBYTASKANDSTAFF
    test('Test that filterTimeByTaskAndStaff returns the right time data for a task', () => {
        const Tname = 'test';
        const task = func.filterTimeByTaskAndStaff(times, Tname, 'jaedon');
        expect(task).toStrictEqual({task: 'test', staff: 'jaedon', total_time: 24, id: 57});
    });

    //TEST FILTERASSIGNMENTS
    test ('Test that filterAssignments returns the right list of assignments for a given staff member', () => {
        const SuserName = 'jaedon';
        const listAsigns = func.filterAssignments(assingments, SuserName);
        expect(listAsigns).toStrictEqual([{assignment_id: 92, task: 'test', staff: 'jaedon'}, {assignment_id: 93, task: 'Task1', staff: 'jaedon'}]);
    });

    //TEST GETIDTOTALTIMEFROMTASKSTAFF
    test('Test that getIDTotalTimeFromTaskStaff returns the right task id and total time given a task and staff member ', () => {
        const Staff = 'jaedon';
        const total = func.getIDTotalTimeFromTaskStaff(times, 'test', Staff);
        expect(total).toStrictEqual([57, 24]);
    });
});
