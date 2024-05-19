document.addEventListener("DOMContentLoaded", async () => {
    /*
    const sampleData = [
        { task: "Task", staff: "jaedon", total_time: 17.00, id: 76 },
        { task: "Task", staff: "prashant", total_time: 9.00, id: 77 },
        { task: "fix errors!!!", staff: "jaedon", total_time: 19.00, id: 78 },
        { task: "fix errors!!!", staff: "prashant", total_time: 0.00, id: 79 },
        { task: "fix errors!!!", staff: "skassen2", total_time: 26.00, id: 80 } 
    ]; */

    try {
        const tasks = await getTasksFromDatabase();
        const aggregatedData = aggregateTaskTimes(tasks);
        renderGraph(aggregatedData);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('An error occurred while fetching tasks. Please try again later.');
    }
});

// Function to fetch tasks from the database
async function getTasksFromDatabase() {
    const response = await fetch('/data-api/rest/Time');
    const data = await response.json();
    return data.value;
}

// Function to aggregate total times per task
function aggregateTaskTimes(data) {
    const taskMap = {};

    data.forEach(item => {
        // Exclude entries with an empty or null task
        if (item.task && item.task.trim() !== "") {
            if (taskMap[item.task]) {
                taskMap[item.task] += item.total_time;
            } else {
                taskMap[item.task] = item.total_time;
            }
        }
    });

    return Object.keys(taskMap).map(task => ({
        task: task,
        total_time: taskMap[task]
    }));
}

// Function to render the graph using Chart.js
function renderGraph(tasks) {
    const labels = tasks.map(task => task.task); // Extract task names
    const values = tasks.map(task => task.total_time); // Extract total times

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // You can change this to 'line', 'pie', etc.
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Time Spent on Tasks',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

