document.addEventListener("DOMContentLoaded", async () => {

    try {
        const tasks = await getTasksFromDatabase();
        const taskNames = [...new Set(tasks.map(item => item.task))];
        populateTaskDropdown(tasks, taskNames);

        const feedback = await getFeedbackFromDatabase();
        const staffNames = [...new Set(feedback.map(item => item.receiver))];
        populateFeedbackDropdown(feedback, staffNames);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('An error occurred while fetching tasks. Please try again later.');
    }
});



// Functions for the task graph

// Function to fetch tasks from the database
async function getTasksFromDatabase() {
    const response = await fetch('/data-api/rest/Time');
    const data = await response.json();
    return data.value;
}

// Function to populate the Task dropdown menu with task names
function populateTaskDropdown(tasks, names) {
    const dropdown = document.getElementById('taskDrop');
    dropdown.innerHTML = "<option value='' disabled selected>Select Task</option>";
    names.forEach(name => {
        dropdown.innerHTML += `<option value="${name}">${name}</option>`;
    });

    // Add event listener for dropdown change
    dropdown.addEventListener('change', () => {
        const selectedTask = dropdown.value;
        const filteredTask = tasks.filter(item => item.task === selectedTask);
        const aggregatedTask = aggregateTaskTimes(filteredTask);
        renderTaskGraph(aggregatedTask);
    });
}


// Function to aggregate total times per task for each staff member
function aggregateTaskTimes(data) {
    const staffMap = {};

    data.forEach(item => {
        if (item.staff && item.staff.trim() !== "") {
            if (staffMap[item.staff]) {
                staffMap[item.staff] += item.total_time;
            } else {
                staffMap[item.staff] = item.total_time;
            }
        }
    });

    return Object.keys(staffMap).map(staff => ({
        staff: staff,
        total_time: staffMap[staff]
    }));
}

// Function to render the graph using Chart.js
function renderTaskGraph(tasks) {
    const labels = tasks.map(task => task.staff); // Extract staff names
    const values = tasks.map(task => task.total_time); // Extract total times

    const ctx = document.getElementById('myChart1').getContext('2d');

    // Destroy previous chart instance if it exists
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Time Spent on Selected Task (minutes)',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time Spent (minutes)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Staff'
                    }
                }
            }
        }
    });
}




// Funtions for the feedback graph

// Function to fetch feedback from the database
async function getFeedbackFromDatabase() {
    const response = await fetch('/data-api/rest/Feedback');
    const data = await response.json();
    return data.value;
}

// Function to populate the Feedback dropdown menu with receiver names where role is Staff
function populateFeedbackDropdown(feedback, names) {
    const dropdown = document.getElementById('staffDrop');
    dropdown.innerHTML = "<option value='' disabled selected>Select Staff</option>";

    // Filter feedback to include only items where receiver_role is "Staff"
    const staffNames = feedback
        .filter(item => item.receiver_role === "Staff")
        .map(item => item.receiver);

    // Remove duplicates
    const uniqueStaffNames = [...new Set(staffNames)];

    uniqueStaffNames.forEach(name => {
        dropdown.innerHTML += `<option value="${name}">${name}</option>`;
    });

    // Add event listener for dropdown change
    dropdown.addEventListener('change', async () => {
        const selectedName = dropdown.value;
        const filteredFeedback = feedback.filter(item => item.receiver === selectedName);
        const aggregatedFeedback = aggregateFeedbackRatings(filteredFeedback);
        renderFeedbackGraph(aggregatedFeedback);
    });
}



// Function to aggregate feedback ratings per task
function aggregateFeedbackRatings(data) {
    const taskMap = {};

    data.forEach(item => {
        // Exclude entries with an empty or null task
        if (item.task && item.task.trim() !== "" && item.rating > 0) {
            if (taskMap[item.task]) {
                taskMap[item.task].push(item.rating);
            } else {
                taskMap[item.task] = [item.rating];
            }
        }
    });

    return Object.keys(taskMap).map(task => ({
        task: task,
        average_rating: taskMap[task].reduce((a, b) => a + b, 0) / taskMap[task].length
    }));
}

// Function to render Feedback graph based on selected staff member
function renderFeedbackGraph(feedback) {
    const labels = feedback.map(task => task.task); // Extract task names
    const values = feedback.map(task => task.average_rating); // Extract average ratings

    // Get the canvas element
    const canvas = document.getElementById('myChart2');

    // Check if there's already a chart associated with this canvas
    if (canvas.chart) {
        // If yes, destroy the existing chart
        canvas.chart.destroy();
    }

     // Create a new chart
     const ctx = canvas.getContext('2d');
     canvas.chart = new Chart(ctx, {
        type: 'bar', // You can change this to 'bar', 'pie', etc.
        data : {
            labels: labels,
            datasets: [{
                label: 'Average Feedback Ratings per Task',
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Feedback'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Task'
                    }
                }
            }
        }
    });

}



