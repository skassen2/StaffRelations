//fetch data
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
async function fetchTasks() {
    const endpoint = `/data-api/rest/Tasks`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}

async function renderFeedback(){
    const data=await fetchFeedback();
    const username = localStorage.getItem('username');
    const staffFeedback=getUserFeedback(username,data);
    const data1=await fetchTasks();

    //adds tiles
    const feedbackList=document.getElementById("allfeedback");
    feedbackList.innerHTML = '';
    staffFeedback.forEach((row, index) => {
        let manager=getManagerWhoAssignedTask(row.task,data1);
        if(manager==undefined){
            manager="N/A";
        }
        const task = document.createElement('block');
        task.classList.add('staff-card');
        task.innerHTML = `
            <p><b>Task:</b> ${row.task}</p>
            <p><b>Manager:</b> ${manager}</p>
            <p><b>Sender:</b> ${row.sender}</p>
            <p><b>Comment:</b> ${row.comment}</p>
        `;
        feedbackList.appendChild(task);
    });

}
renderFeedback();
//fetch which manager assigned task, returns just 1 word
function getManagerWhoAssignedTask(task,json){
    const toreturn=[];
    for(const obj of json){
        if(obj.task==task){
            toreturn.push(obj.manager);
        }
    }
    return toreturn[0];
}
//returns array of feedback just allocated to the user, returns arr of obj
function getUserFeedback(staff,json){
    data=[];
    for(const obj of json){
        if(obj.receiver==staff){
            data.push(obj);
        }
    }
    return data;
}

//loads select staff dropdown with staff
async function loadAllStaffDropDown(){
    const data=await fetchUsers();
    const dropdown=document.getElementById("staffDrop");
    data.forEach(obj =>{
        if(obj.role=="Staff"){
            const option=document.createElement("option");
            option.value=obj.username;
            option.text=obj.username;
            dropdown.add(option);
        }
    })
}
loadAllStaffDropDown();//load staff names here


//Send staff their feedback, calls addCommentToDatabase
addComment.addEventListener('submit',event=>{
    event.preventDefault();

    const receiver=document.getElementById("staffDrop").value;
    const topicOrtask=document.getElementById("topic").value;
    const comment=document.getElementById("comment").value;
    const sender = localStorage.getItem('username');
    addCommentToDatabase(topicOrtask,sender,receiver,comment);
    
})
//adds data to database
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