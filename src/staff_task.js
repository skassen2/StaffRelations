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

            // Create stopwatch element
            const stopwatch = document.createElement('div');
            stopwatch.classList.add('stopwatch');
            stopwatch.textContent = '00:00:00'; // Initial stopwatch time
            taskCard.appendChild(stopwatch);

            // Start button for stopwatch
            const startButton = document.createElement('button');
            startButton.textContent = 'Start';
            startButton.addEventListener('click', () => startStopwatch(stopwatch));
            taskCard.appendChild(startButton);

            // Stop button for stopwatch
            const stopButton = document.createElement('button');
            stopButton.textContent = 'Stop';
            stopButton.addEventListener('click', () => stopStopwatch(stopwatch));
            taskCard.appendChild(stopButton);

            // Button to log time recorded on stopwatch rounded up to the minute
            const logTimeButton = document.createElement('button');
            logTimeButton.textContent = 'Log Time';
            logTimeButton.addEventListener('click', () => logStopwatchTime(stopwatch));
            taskCard.appendChild(logTimeButton);

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

// Function to start the stopwatch
function startStopwatch(stopwatchElement) {
    let seconds = 0;
    const interval = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsDisplay = seconds % 60;
        stopwatchElement.textContent = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secondsDisplay < 10 ? '0' : ''}${secondsDisplay}`;
    }, 1000);

    // Store interval ID to stop it later
    stopwatchElement.dataset.intervalId = interval;
}

// Function to stop the stopwatch
function stopStopwatch(stopwatchElement) {
    const intervalId = stopwatchElement.dataset.intervalId;
    clearInterval(intervalId);
}

// Function to log time recorded on stopwatch rounded up to the minute
async function logStopwatchTime(stopwatchElement) {
    const time = stopwatchElement.textContent;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + Math.ceil(seconds / 60);

    const taskName = stopwatchElement.parentElement.querySelector('h2').textContent;
    const staff = localStorage.getItem('username');
    
    const data = await fetchTimeSpent();
    const [taskId, currentTotalTime] = getIDTotalTimeFromTaskStaff(data, taskName, staff);

    // Calculate new total time
    const newTotalTime = currentTotalTime + totalMinutes;

    // Update time in database
    const newData = {
        task: taskName,
        staff: staff,
        total_time: newTotalTime,
    };

    const endpoint = '/data-api/rest/Time/id';
    const response = await fetch(`${endpoint}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
    });

    window.location.reload();
}


// Call renderTasks function when the page loads
renderTasks();

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
