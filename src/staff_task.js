// Retrieve data from localStorage
const username = localStorage.getItem('username');
const role = localStorage.getItem('role');
document.getElementById('username').textContent = username;

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
        const task = filterTaskByName(allTasks, assignment.task);
        if (task) {
            const timeSpent = filterTimeByTaskAndStaff(allTimeData, assignment.task, username);

            // Create task card element
            const taskCard = document.createElement('div');
            taskCard.classList.add('staff-card'); // Updated class name

            // Create header for task name
            const taskNameHeader = document.createElement('h2'); // Changed h3 to h2
            taskNameHeader.textContent = task.task;
            taskCard.appendChild(taskNameHeader);

            // Create div for task details
            const taskDetails = document.createElement('div');
            taskDetails.classList.add('staff-details');
            
            const description = document.createElement('p');
            description.innerHTML = `<span>Description:</span> ${task.description}`;
            taskDetails.appendChild(description);
            
            const assignedBy = document.createElement('p');
            assignedBy.innerHTML = `<span>Assigned by:</span> ${task.manager}`;
            taskDetails.appendChild(assignedBy);
            
            const estimatedTime = document.createElement('p');
            estimatedTime.innerHTML = `<span>Estimated Time:</span> ${task.est_time} minutes`;
            taskDetails.appendChild(estimatedTime);
            
            const timeSpentText = timeSpent ? `<span>Time Spent:</span> ${timeSpent.total_time} minutes` : '<span>Time Spent:</span> 0.00 minutes';
            const timeSpentElement = document.createElement('p');
            timeSpentElement.innerHTML = timeSpentText;
            taskDetails.appendChild(timeSpentElement);
            taskCard.appendChild(taskDetails);

            // Add the task card to the tasks list
            tasksList.appendChild(taskCard);

            //add tasks to dropdown
            const dropdownTask1=document.getElementById("taskdrop");
            var option = document.createElement("option");
            option.text = task.task;
            option.value = task.task;
            dropdownTask1.add(option);
            
        }
    }
}

//function to submit all manual time
manualtime.addEventListener('submit', async event=>{
    event.preventDefault();
    const task=document.getElementById("taskdrop").value;
    const time=document.getElementById("time").value;
    console.log(task);

    const staff = localStorage.getItem('username');
    const data=await fetchTimeSpent();
    const id_and_time=getIDTotalTimeFromTaskStaff(data,task,staff);
    
    //update time in db
    const total_time=id_and_time[1]+parseFloat(time);
    const toadd={
        task:task,
        staff:staff,
        total_time:total_time,
    }
    const endpoint = '/data-api/rest/Time/id';
    const response = await fetch(`${endpoint}/${id_and_time[0]}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toadd)
    });
    window.location.reload(); 
});
//function that takes a json of time table and task and staff and returns id that needs to be updated
function getIDTotalTimeFromTaskStaff(json,task,staff){
    for(const obj of json){
        if(obj.staff==staff && obj.task==task){
            return [obj.id,obj.total_time];
        }
    }
}

// Function to start the stopwatch (if needed)
function startStopwatch(stopwatchElement) {
    // Implement if needed
}

// Function to stop the stopwatch (if needed)
function stopStopwatch(stopwatchElement) {
    // Implement if needed
}

// Call renderTasks function when the page loads
renderTasks();

//export functions for testing

