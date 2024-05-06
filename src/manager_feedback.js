// Fetch data
async function fetchFeedback() {
    const endpoint = `/data-api/rest/Feedback`;
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

async function renderFeedback2(){
    const data=await fetchFeedback();
    const username = localStorage.getItem('username');
    const staffFeedback=getUserFeedback(username,data);

    const feedbackList=document.getElementById("allfeedback");
    feedbackList.innerHTML = '';
    staffFeedback.forEach((row, index) => {
        const task = document.createElement('block');
        task.classList.add('staff-card');
        task.innerHTML = `
            <p><b>Task:</b> ${row.task}</p>
            <p><b>Sender:</b> ${row.sender}</p>
            <p><b>Comment:</b> ${row.comment}</p>
        `;
        feedbackList.appendChild(task);
    });
}
renderFeedback2();

// Get user feedback function
function getUserFeedback(staff,json){
    data=[];
    for(const obj of json){
        if(obj.receiver==staff){
            data.push(obj);
        }
    }
    return data;
}

// Load all staff dropdown function
async function loadAllStaffDropDown(){
    const data=await fetchUsers();
    const dropdown=document.getElementById("staffDrop");
    
    // Add HR options
    const hrData = data.filter(obj => obj.role === "HR");
    hrData.forEach(hr => {
        const optionHR = document.createElement("option");
        optionHR.value = hr.username;
        optionHR.text = hr.username + " (HR)";
        dropdown.add(optionHR);
    });

    // Add staff options
    const staffData = data.filter(obj => obj.role === "Staff");
    staffData.forEach(staff => {
        const optionStaff = document.createElement("option");
        optionStaff.value = staff.username;
        optionStaff.text = staff.username;
        dropdown.add(optionStaff);
    });
}
loadAllStaffDropDown();

// Send staff their feedback, calls addCommentToDatabase
addComment2.addEventListener('submit',event=>{
    event.preventDefault();

    const receiver=document.getElementById("staffDrop").value;
    const topicOrtask=document.getElementById("topic").value;
    const comment=document.getElementById("comment").value;
    const sender = localStorage.getItem('username');
    addCommentToDatabase(topicOrtask,sender,receiver,comment);
})

// Send staff their feedback, calls addCommentToDatabase
// addComment.addEventListener('submit',event=>{
//     event.preventDefault();

//     const receiver=document.getElementById("staffDrop").value;
//     const topicOrtask=document.getElementById("topic").value;
//     const comment=document.getElementById("comment").value;
//     const sender = localStorage.getItem('username');
//     addCommentToDatabase(topicOrtask,sender,receiver,comment);
// })

// Add comment to database function
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

module.exports = {addCommentToDatabase, getUserFeedback, loadAllStaffDropDown, renderFeedback2, fetchFeedback, fetchUsers};
