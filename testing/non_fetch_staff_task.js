//Non-fetch funcions from staff_task
function filterTaskByName(tasks, taskName) {
    return tasks.find(task => task.task === taskName);
}

// Filter time data by task name and staff
function filterTimeByTaskAndStaff(timeData, taskName, staff) {
    return timeData.find(time => time.task === taskName && time.staff === staff);
}

// Filter assignments applicable to the user
function filterAssignments(assignments, username) {
    return assignments.filter(assignment => assignment.staff === username);
}

function getIDTotalTimeFromTaskStaff(json,task,staff){
    for(const obj of json){
        if(obj.staff==staff && obj.task==task){
            return [obj.id,obj.total_time];
        }
    }
}

module.exports = {filterAssignments, filterTaskByName, filterTimeByTaskAndStaff, getIDTotalTimeFromTaskStaff};