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


async function renderFeedback(){
    const data=await fetchFeedback();
    const username = localStorage.getItem('username');
    const staffFeedback=getUserFeedback(username,data);

    const feedbackList=document.getElementById("allfeedback");
    feedbackList.innerHTML = '';
    staffFeedback.forEach(async (row, index) => {
        const task = document.createElement('block');
        task.classList.add('staff-card');

        const hr= await listOfHr();
        //modify sender so adds HR next to sender if it is hr
        let sender=row.sender;
        if(hr.includes(sender)){
            sender=sender+" (HR)";
        }
        task.innerHTML = `
            <p><b>Task:</b> ${row.task}</p>
            <p><b>Sender:</b> ${sender}</p>
            <p><b>Comment:</b> ${row.comment}</p>
        `;
        feedbackList.appendChild(task);
    });

}
renderFeedback();

async function renderTaskDropdown(){
    const data=await fetchAssignment();
    const username = localStorage.getItem('username');
    const taskDrop = document.getElementById('tasksDrop');
    data.forEach(obj=>{
        if(obj.staff==username){
            const option=document.createElement("option");
            option.text=obj.task;
            option.value=obj.task;
            taskDrop.add(option);  

        }
    })
    //adds General option
    const option=document.createElement("option");
    option.text="General(Contact HR)";
    option.value="General";
    taskDrop.add(option);
}
renderTaskDropdown();

//returns array of feedback just allocated to the user
function getUserFeedback(staff,json){
    data=[];
    for(const obj of json){
        if(obj.receiver==staff){
            data.push(obj);
        }
    }
    return data;
}
//returns arrary of just hr [taruna,dummy]
async function listOfHr(){
    const toreturn=[];
    const data=await fetchUsers();
    for(const obj of data){
        if(obj.role=="HR"){
            toreturn.push(obj.username);
        }
    }
    return toreturn;
}

//code managers adding the UI elements to the form
//first select task, click next, ----note the UI is created first and a function is called to load items to the dropdown----
let click1=false;
let click2=false;
let click3=false;
addComment.addEventListener('submit', event=>{
    event.preventDefault();

    if(click1==false){//if button is clicked once
        const form=document.getElementById("addComment");
        const addButton=document.getElementById("add");
        //create dropdown to add to page
        const staffDropdown=document.createElement('select'); 
        staffDropdown.setAttribute("id","staffDropdown");
        staffDropdown.setAttribute("class","dropdown");
        staffDropdown.setAttribute("required","true");
        //set default option
        const option1 = document.createElement("option");
        option1.text = "Select staff";
        option1.value=""
        option1.setAttribute("disabled","true");
        option1.setAttribute("selected","true");
        staffDropdown.appendChild(option1);
        //blank out option
        const task=document.getElementById('tasksDrop');
        task.disabled=true;
        //insert dropdown to page
        form.insertBefore(staffDropdown,addButton);
        click1=true; 
        const linebreak=document.createElement("br"); 
        form.insertBefore(linebreak,addButton);
        //loads the dropdwn with data
        if(task.value=="General"){
            loadHRNamesForDropDown();
        }
        else{
            loadStaffForDropDown(task.value);
            loadHRNamesForDropDown();
        }
        
    }
    else if(click2==false){//button clicked for the second time
        const staff=document.getElementById('staffDropdown');
        const addButton=document.getElementById("add");
        staff.disabled=true;
        //create textarea to write comment
        const textbox=document.createElement("textarea");
        textbox.setAttribute("required","true");
        textbox.setAttribute("placeholder","Add comment");
        textbox.setAttribute("rows","6");
        textbox.setAttribute("id","comment");
        //add textarea to page
        const form=document.getElementById("addComment");
        form.insertBefore(textbox,addButton);
        click2=true; 
        const linebreak=document.createElement("br"); 
        form.insertBefore(linebreak,addButton); 

        //changed button text
        const button=document.getElementById("add");
        button.textContent="Add comment"; 
    }
    else if(click3==false){//add data to database
        //fetch the data from the input fields
        const task=document.getElementById("tasksDrop").value;
        const staff=document.getElementById("staffDropdown").value;
        const comment=document.getElementById("comment").value;
        const sender = localStorage.getItem('username');
        addCommentToDatabase(task,sender,staff,comment);
    }

})

//add staff to the dropdown
async function loadStaffForDropDown(Task){
    let data=await fetchAssignment();
    const username = localStorage.getItem('username');
    const staffdrop = document.getElementById('staffDropdown');
    data=getStaffByTask(data,username,Task);//selects staff assigned to task parameter
    data.forEach(obj=>{
        const option=document.createElement("option");
        option.value=obj.staff;
        option.text=obj.staff;
        staffdrop.add(option)
    })
}
async function loadHRNamesForDropDown(){
    let data=await fetchUsers();
    data=getHR(data);
    const staffdrop = document.getElementById('staffDropdown');
    data.forEach(obj=>{
        const option=document.createElement("option");
        option.value=obj.username;
        option.text=obj.username+" (HR)";
        staffdrop.add(option)
    })
}
//takes assignment table, username and task and retruns staff doing the same task
function getStaffByTask(json,staff,task){
    const data=[];
    for(const obj of json){
        if(obj.task==task && obj.staff!=staff){
            data.push(obj);
        }
    }
    return data;
}
//takes json and returns just obj of hr
function getHR(json){
    const data=[];
    for(const obj of json){
        if(obj.role=="HR"){
            data.push(obj);
        }
    }
    return data;
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

module.exports = {addCommentToDatabase, getStaffByTask, getUserFeedback, loadStaffForDropDown, renderFeedback, renderTaskDropdown, fetchAssignment, fetchFeedback, fetchUsers, getHR, loadHRNamesForDropDown, listOfHr};