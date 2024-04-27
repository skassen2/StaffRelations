(async () => {
    try {
        const feedbackList = document.getElementById('feedbackList');
const taskList = document.getElementById('taskList');
const staffList = document.getElementById('staffList');
const commentArea = document.getElementById('commentArea');
let comment = document.getElementById('comment');
const buttonArea = document.getElementById('buttonArea');

function filterFeedbacksByReceiver(filteredFeedbacks, staffName) {
    return filteredFeedbacks.filter(feedback => feedback.receiver === staffName);
} 

function filterFeedbacksByStaff(feedbacks, staffName) {
    return feedbacks.filter(feedback => Array.isArray(feedback.staff) && feedback.staff.includes(staffName));
}

async function fetchAssignments() {
    const endpoint = `/data-api/rest/Assignment`;
    const response = await fetch(endpoint);
    const assignments = await response.json();
    return assignments.value;
}
async function fetchFeedback1() {
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint);
    const assignments = await response.json();
    return assignments.value;
}

// Example usage:
const staffName = localStorage.getItem('username'); //chosen staff as user for testing  

let assignments = [

    {
        "task": "Task 1",
        "staff": "Jaedon"
    },
    {
        "task": "Task 1",
        "staff": "Shaneel"
    },
    {
        "task": "Task 1",
        "staff": "Taruna"
    },
    {
        "task": "Task 2",
        "staff": "Jaedon"
    },
    {
        "task": "Task 2",
        "staff": "Shaneel"
    },
    {
        "task": "Task 2",
        "staff": "Keren"
    },
    {
        "task": "Task 3",
        "staff": "Shaneel"
    },
    {
        "task": "Task 3",
        "staff": "Angie"
    },
    {
        "task": "Task 3",
        "staff": "Taruna"
    }
];

function groupByTask(assignments) {
    const taskGroups = {};

    assignments.forEach(assignment => {
        const { task, staff } = assignment;
        if (task in taskGroups) {
            taskGroups[task].push(staff);
        } else {
            taskGroups[task] = [staff];
        }
    });

    return Object.entries(taskGroups).map(([task, staff]) => ({ task, staff }));
}

let taskStaffArray = groupByTask(assignments); 

let allFeedbacks = [
    {
        "task": "Task 1",
        "sender": "Shaneel",
        "comment": "Do ABC",
        "receiver": "Jaedon",
        //"staff": ["Jaedon", "Shaneel", "Taruna"]
    },
    {
        "task": "Task 2",
        "sender": "Taruna",
        "comment": "Do DEF",
        "receiver": "Shaneel",
        //"staff": ["Jaedon", "Shaneel", "Keren"]
    },
    {
        "task": "Task 3",
        "sender": "Shaneel",
        "comment": "Do GHI",
        "receiver": "Taruna",
        //"staff": ["Shaneel", "Angie", "Taruna"]
    }
];//JSON array with all feedbacks, simulating database
assignments=await fetchAssignments();
console.log(assignments,"udgug"); 
allFeedbacks=await fetchFeedback1();
console.log(allFeedbacks,"dd");

function addStaffToFeedbacks(groupByTask, allFeedbacks) {
    // Create a map of tasks to associated staff members
    const taskStaffMap = {};
    groupByTask.forEach(taskObj => {
        taskStaffMap[taskObj.task] = taskObj.staff;
    });

    // Add associated staff members to each feedback object
    allFeedbacks.forEach(feedback => {
        const task = feedback.task;
        if (task in taskStaffMap) {
            feedback.staff = taskStaffMap[task];
        }
    });

    return allFeedbacks;
}

allFeedbacks = addStaffToFeedbacks(taskStaffArray, allFeedbacks);
console.log(allFeedbacks);
//Displaying of receiving feedback
console.log(allFeedbacks,staffName,"aa"); 
let filteredByReceiver = filterFeedbacksByReceiver(allFeedbacks, staffName); //feedbacks adressed to the user
let feedbacks = filterFeedbacksByStaff(allFeedbacks, staffName); //feedbacks where the user is part of the task
console.log(feedbacks);
console.log(filteredByReceiver);

renderFeedback(); // displays all the feedback to the user

function renderFeedback() {
    feedbackList.innerHTML = '';
    filteredByReceiver.forEach((feedback, index) => {
        const eachFeedback = document.createElement('block');
        eachFeedback.classList.add('feedback-card');
        eachFeedback.innerHTML = `
            <p><strong>Task:</strong> ${feedback.task}</p>
            <p><strong>Sender:</strong> ${feedback.sender}</p>
            <p><strong>Comment:</strong> ${feedback.comment}</p>
        `;
        feedbackList.appendChild(eachFeedback);
    });
}

//Displaying of sending feedback

function getAllTasks(feedbacks) {
    const tasks = feedbacks.map(feedback => feedback.task);
    // Remove duplicates by converting to a Set and then back to an array
    return [...new Set(tasks)];
}


const allTasks = getAllTasks(feedbacks); //array of all tasks amongst feedback where the user is part of the task
console.log(allTasks,"this");
rendertasks(); //displays tasks that can be selected to choose which task pertains to the feedback sent by the user 

function rendertasks() {

    allTasks.forEach((task, index) => {
        const eachTask = document.createElement('li');
        eachTask.classList.add('task-entry');
        eachTask.innerHTML = `
            <button class="btn-task" data-index="${index}">${task}</button>
        `;
        taskList.appendChild(eachTask);
    });

    const hasTask = taskList.children.length > 0;

    // Show or hide the <h3> element based on the presence of staff members
    const taskHeading = document.getElementById('taskHeading');
    taskHeading.style.display = hasTask ? 'block' : 'none';

}

function getAllStaff(feedbacks) {
    // Merge all staff arrays into a single array
    const allStaff = feedbacks.reduce((acc, feedback) => {
        return acc.concat(feedback.staff);
    }, []);

    // Remove duplicates by converting to a Set and then back to an array
    return [...new Set(allStaff)];
} //function to get array of all staff from array of feedback

let allStaff; //stores staff that will be displayed as options to choose after choosing a task

function renderStaff(index) {

    // Construct the heading text
    const headingText = `Staff (Task ${index})`;
    // Update the heading content
    document.getElementById('staffHeading').textContent = headingText;
    allStaff.forEach((staff, index) => {
        if(staff !== staffName)
        {
            const staffMember = document.createElement('li');
            staffMember.classList.add('staff-entry');
            staffMember.innerHTML = `
                <button class="btn-staff" data-index="${index}">${staff}</button>
            `;
            staffList.appendChild(staffMember);
        }
    });

    const hasStaff = staffList.children.length > 0;

    // Show or hide the <h3> element based on the presence of staff members
    const staffHeading = document.getElementById('staffHeading');
    staffHeading.style.display = hasStaff ? 'block' : 'none';

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // You can also use 'auto' for instant scrolling
    });
}

let taskChosen; //stores task chosen used when adding new feedback to allFeedbacks, simulating database
taskList.addEventListener('click', event => {
    if (event.target.classList.contains('btn-task')) {
        staffList.innerHTML = '';
        buttonArea.innerHTML = '';
        const index = event.target.dataset.index;
        allStaff = feedbacks[index].staff; //choses staff array from feedback object according to task chosen, so only appropriate staff is displayed
        console.log(allStaff);
        renderStaff(Number(index)+1); // displays staff according to task chosen as options to choose, determining the receiver of your feedback sent
        taskChosen = feedbacks[index].task;
        console.log(taskChosen);
    }
});

function renderButton() {
    const sendButton = document.createElement('block');
    sendButton.classList.add('button-container');
    sendButton.innerHTML = `
        <button class="btn-send">Send</button>
    `;
    buttonArea.appendChild(sendButton);

    // Show the textarea after the button is created
    document.getElementById('commentArea').style.display = 'block';

    // Scroll to the bottom of the page after the button is created
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // You can also use 'auto' for instant scrolling
    });
}


let staffChosen; //stores staff chosen who the comment is sent. Used to add new feedback object to allFeedbacks
staffList.addEventListener('click', event => {
    if (event.target.classList.contains('btn-staff')) {
        buttonArea.innerHTML = ''; 
        const index = event.target.dataset.index;
        renderButton(); //displays send button after choosing staff member that feedbac will be sent to
        staffChosen = allStaff[index];
        console.log(staffChosen);
    }
});

function addFeedback(feedbacks, task, sender, comment, receiver, staff) {
    const newFeedback = {
        task: task,
        sender: sender,
        comment: comment,
        receiver: receiver,
        staff: staff
    };
    feedbacks.push(newFeedback); //adds object to JSON array
    return feedbacks; //returns original JSON array with new added feedback object
}

buttonArea.addEventListener('click', event => {
    event.preventDefault();
    if (event.target.classList.contains('btn-send')) {
        if (comment.value.trim() === '') {
            comment.focus(); // Focus on the textarea
            return; // Exit the function
        }

        buttonArea.innerHTML = '';
        allFeedbacks = addFeedback(allFeedbacks, taskChosen, staffName, comment.value, staffChosen, allStaff); //updates original feedback object array simulating database with new added feedback from user
        console.log(allFeedbacks);
        comment.value = ""; //sets feedback box back to default display after sending feedback
        document.getElementById('commentArea').style.display = 'none';

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth' // You can also use 'auto' for instant scrolling
        });
    }
});
    } catch (error) {
        console.error("Error in main scope:", error);
        // Handle errors in the main scope if needed
    }
})();

