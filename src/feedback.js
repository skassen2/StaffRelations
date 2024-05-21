// Fetch data functions
async function fetchFeedback() {
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}

async function fetchAssignment() {
    const endpoint = `/data-api/rest/Assignment`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}

async function fetchUsers() {
    const endpoint = `/data-api/rest/Users`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}

// Render feedback based on the filter
async function renderFeedback(filter) {
    const data = await fetchFeedback();
    const username = localStorage.getItem('username');
    const feedbackList = document.getElementById("allfeedback");
    feedbackList.innerHTML = '';

    const filteredFeedback = data.filter(row => {
        if (row.receiver !== username) return false;
        if (filter === 'all') return true;
        if (filter === 'staff') return row.sender_role === 'Staff';
        if (filter === 'manager') return row.sender_role === 'Manager';
        if (filter === 'hr') return row.sender_role === 'HR';
    });

    filteredFeedback.forEach(async (row) => {
        const task = document.createElement('article');
        task.classList.add('staff-card');
        const hr = await listOfHr();
        let sender = row.sender;
        if (hr.includes(sender)) {
            sender = sender + " (HR)";
        }
        task.innerHTML = `
            <p><b>Task:</b> ${row.task}</p>
            <p><b>Sender:</b> ${sender}</p>
            <p><b>Comment:</b> ${row.comment}</p>
        `;
        feedbackList.appendChild(task);
    });
}

// Event listener for tab buttons
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderFeedback(button.dataset.filter);
        });
    });
    renderFeedback('all'); // Default to showing all feedback
});

// Render task dropdown
async function renderTaskDropdown() {
    const data = await fetchAssignment();
    const username = localStorage.getItem('username');
    const taskDrop = document.getElementById('tasksDrop');
    data.forEach(obj => {
        if (obj.staff == username) {
            const option = document.createElement("option");
            option.text = obj.task;
            option.value = obj.task;
            taskDrop.add(option);
        }
    });
    // Add General option
    const option = document.createElement("option");
    option.text = "General(Contact HR)";
    option.value = "General";
    taskDrop.add(option);
}
renderTaskDropdown();

// Returns array of feedback allocated to the user
function getUserFeedback(staff, json) {
    return json.filter(obj => obj.receiver == staff);
}

// Returns array of HR usernames
async function listOfHr() {
    const toreturn = [];
    const data = await fetchUsers();
    for (const obj of data) {
        if (obj.role == "HR") {
            toreturn.push(obj.username);
        }
    }
    return toreturn;
}

// Event listener for adding comment form
let click1 = false;
let click2 = false;
let click3 = false;
let addRating = 0; // Checks if we are adding a rating, so we know to call a different method

addComment.addEventListener('submit', async event => {
    event.preventDefault();

    if (click1 == false) { // First click
        const form = document.getElementById("addComment");
        const addButton = document.getElementById("add");
        // Create dropdown to add to page
        const staffDropdown = document.createElement('select'); 
        staffDropdown.setAttribute("id", "staffDropdown");
        staffDropdown.setAttribute("class", "dropdown");
        staffDropdown.setAttribute("required", "true");
        // Set default option
        const option1 = document.createElement("option");
        option1.text = "Select staff";
        option1.value = "";
        option1.setAttribute("disabled", "true");
        option1.setAttribute("selected", "true");
        staffDropdown.appendChild(option1);
        // Disable task dropdown
        const task = document.getElementById('tasksDrop');
        task.disabled = true;
        // Insert staff dropdown to form
        form.insertBefore(staffDropdown, addButton);
        click1 = true; 
        const linebreak = document.createElement("br"); 
        form.insertBefore(linebreak, addButton);
        // Load dropdown with data
        if (task.value == "General") {
            loadHRNamesForDropDown();
        } else {
            loadStaffForDropDown(task.value);
            loadHRNamesForDropDown();
        }
    } else if (click2 == false) { // Second click
        const staff = document.getElementById('staffDropdown');
        const addButton = document.getElementById("add");
        staff.disabled = true;
        // Create textarea to write comment
        const textbox = document.createElement("textarea");
        textbox.setAttribute("required", "true");
        textbox.setAttribute("placeholder", "Add comment");
        textbox.setAttribute("rows", "6");
        textbox.setAttribute("id", "comment");
        // Add textarea to form
        const form = document.getElementById("addComment");
        form.insertBefore(textbox, addButton);
        click2 = true; 
        const linebreak = document.createElement("br"); 
        form.insertBefore(linebreak, addButton); 

        // Change button text
        const button = document.getElementById("add");
        button.textContent = "Add comment"; 
        // Check if person selected is a staff member, then add input field to enter rating
        const isStaff = await checkIfStaff(staff.value);
        if (isStaff == 1) { 
            addRating = 1; // Adding a rating
            const input = document.createElement("input");
            input.setAttribute("placeholder", "(Optional) anon rating");
            input.setAttribute("type", "number");
            input.setAttribute("min", "0");
            input.setAttribute("max", "10");
            input.setAttribute("id", "rating");
            form.insertBefore(input, addButton);
            form.insertBefore(linebreak, input);
            form.insertBefore(input, linebreak);
        }
    } else if (click3 == false) { // Add data to database
        // Fetch data from input fields
        if (addRating) {
            const task = document.getElementById("tasksDrop").value;
            const staff = document.getElementById("staffDropdown").value;
            const comment = document.getElementById("comment").value;
            const sender = localStorage.getItem('username');
            const rating = document.getElementById("rating").value;
            const sender_role = "Staff";
            const receiver_role = "Staff"; 
            addRatingCommentToDatabase(task, sender, staff, comment, sender_role, receiver_role, parseInt(rating));
        } else {
            const task = document.getElementById("tasksDrop").value;
            const staff = document.getElementById("staffDropdown").value;
            const comment = document.getElementById("comment").value;
            const sender = localStorage.getItem('username');
            addCommentToDatabase(task, sender, staff, comment);
        }
    }
});

// Add staff to the dropdown
async function loadStaffForDropDown(task) {
    const data = await fetchAssignment();
    const username = localStorage.getItem('username');
    const staffdrop = document.getElementById('staffDropdown');
    const staffData = data.filter(obj => obj.task == task && obj.staff != username);
    staffData.forEach(obj => {
        const option = document.createElement("option");
        option.value = obj.staff;
        option.text = obj.staff;
        staffdrop.add(option);
    });
}

// Load HR names for dropdown
async function loadHRNamesForDropDown() {
    const data = await fetchUsers();
    const hrData = data.filter(obj => obj.role == "HR");
    const staffdrop = document.getElementById('staffDropdown');
    hrData.forEach(obj => {
        const option = document.createElement("option");
        option.value = obj.username;
        option.text = obj.username + " (HR)";
        staffdrop.add(option);
    });
}

// Check if selected person is a staff member
async function checkIfStaff(person) {
    const data = await fetchUsers();
    for (const obj of data) { 
        if (obj.username == person && obj.role == "Staff") {
            return 1;
        }
    }
    return 0;
}

//function adds data to database
async function addCommentToDatabase(task,sender,receiver,comment){
    const data={
        task:task,
        sender:sender,
        receiver:receiver,
        comment:comment
    }
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
    });

    window.location.reload();
}
async function addRatingCommentToDatabase(task,sender,receiver,comment,sender_role,receiver_role,rating){
    const data={
        task:task,
        sender:sender,
        receiver:receiver,
        comment:comment,
        sender_role:sender_role,
        receiver_role:receiver_role,
        rating:rating
    }
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
    });

    window.location.reload();
}


module.exports = {addCommentToDatabase, getUserFeedback, loadStaffForDropDown, renderFeedback, renderTaskDropdown, fetchAssignment, fetchFeedback, fetchUsers, loadHRNamesForDropDown, listOfHr, addRatingCommentToDatabase, checkIfStaff};