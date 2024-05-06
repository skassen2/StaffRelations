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

async function renderFeedback2(){
    const data=await fetchFeedback();
    const username = localStorage.getItem('username');
    const staffFeedback=getUserFeedback(username,data);

    //adds tiles
    const feedbackList=document.getElementById("allfeedback");
    feedbackList.innerHTML = '';
    staffFeedback.forEach((row, index) => {
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
renderFeedback2();

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

//loads select staff dropdown with staff and HR
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
loadAllStaffDropDown();//load staff names here

//Send staff their feedback, calls addCommentToDatabase
addComment2.addEventListener('submit',event=>{
    event.preventDefault();
    const receiver=document.getElementById("staffDrop").value;
    const topicOrtask=document.getElementById("topic").value;
    const comment=document.getElementById("comment").value;
    const sender = localStorage.getItem('username');
    addCommentToDatabase(topicOrtask,sender,receiver,comment);
    
})
//adds data to database

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
//code managers adding the UI elements to the form
//first select task, click next, ----note the UI is created first and a function is called to load items to the dropdown----
let click1=false;
let click2=false;
let click3=false;
document.getElementById('nextButton').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    if (click1 == false) { // If the button is clicked once
      const form = document.getElementById("addComment");
      const addButton = document.getElementById("nextButton");
      // Create dropdown to add to page
      const staffDropdown = document.createElement('select');
      staffDropdown.setAttribute("id", "staffDropdown");
      staffDropdown.setAttribute("class", "dropdown");
      staffDropdown.setAttribute("required", "true");
      // Set default option
      const option1 = document.createElement("option");
      option1.text = "Select Receiver";
      option1.value = ""
      option1.setAttribute("disabled", "true");
      option1.setAttribute("selected", "true");
      staffDropdown.appendChild(option1);
      // Blank out option
      const task = document.getElementById('tasksDrop');
      task.disabled = true;
      // Insert dropdown to page
      form.insertBefore(staffDropdown, addButton);
      click1 = true;
      const linebreak = document.createElement("br");
      form.insertBefore(linebreak, addButton);
      // Load the dropdown with data
      if (task.value == "General") {
        loadHRNamesForDropDown();
      } else {
        loadStaffForDropDown(task.value);
        loadHRNamesForDropDown();
      }
  
    } else if (click2 == false) { // Button clicked for the second time
      const staff = document.getElementById('staffDropdown');
      const addButton = document.getElementById("add");
      staff.disabled = true;
      // Create textarea to write comment
      const textbox = document.createElement("textarea");
      textbox.setAttribute("required", "true");
      textbox.setAttribute("placeholder", "Add comment");
      textbox.setAttribute("rows", "6");
      textbox.setAttribute("id", "comment");
      // Add textarea to page
      const form = document.getElementById("addComment");
      form.insertBefore(textbox, addButton);
      click2 = true;
      const linebreak = document.createElement("br");
      form.insertBefore(linebreak, addButton);
  
      // Changed button text
      const button = document.getElementById("nextButton");
      button.textContent = "Add comment";
    } else if (click3 == false) { // Add data to database
      // Fetch the data from the input fields
      const task = document.getElementById("tasksDrop").value;
      const staff = document.getElementById("staffDropdown").value;
      const comment = document.getElementById("comment").value;
      const sender = localStorage.getItem('username');
      addCommentToDatabase(task, sender, staff, comment);
    }
  });
  

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

module.exports = {loadHRNamesForDropDown, addCommentToDatabase, getStaffByTask, getUserFeedback, loadStaffForDropDown,renderFeedback2, fetchAssignment, fetchFeedback, fetchUsers, getHR};
