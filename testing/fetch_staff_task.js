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

module.exports = {fetchAllTasks, fetchAssignments, fetchTimeSpent};