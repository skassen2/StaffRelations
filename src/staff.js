// Retrieve data from localStorage
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');
document.getElementById('username').textContent = username;
document.getElementById('role').textContent = role;

// Fetch assignments for the staff member
async function fetchAssignments() {
    const endpoint = `/data-api/rest/Assignment`;
    const response = await fetch(endpoint);
    const assignments = await response.json();
    return assignments.value;
}

// Fetch all tasks
async function fetchAllTasks() {
    const endpoint = `/data-api/rest/Tasks`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}

// Fetch time spent on each task
async function fetchTimeSpent() {
    const endpoint = `/data-api/rest/Time`;
    const response = await fetch(endpoint);
    const timeData = await response.json();
    return timeData.value;
}

// Filter tasks by task name
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

// Render tasks on the page
async function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const allAssignments = await fetchAssignments();
    const userAssignments = filterAssignments(allAssignments, username);
    const allTasks = await fetchAllTasks();
    const allTimeData = await fetchTimeSpent();

    // Clear previous tasks
    tasksList.innerHTML = '';

    // Render each task
    for (const assignment of userAssignments) {
        const li = document.createElement('li');
        const task = filterTaskByName(allTasks, assignment.task);
        if (task) {
            const timeSpent = filterTimeByTaskAndStaff(allTimeData, assignment.task, username);
            li.textContent = `${task.task}: ${task.description} (Assigned by: ${task.manager}, Estimated Time: ${task.est_time} hours, Time Spent: ${timeSpent ? timeSpent.total_time : '0.00'} hours)`;
            tasksList.appendChild(li);
        }
    }
}

// Call renderTasks function when the page loads
renderTasks();
